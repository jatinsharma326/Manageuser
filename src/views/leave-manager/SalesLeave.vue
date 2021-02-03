<template>
	<div class="salesLeavesManagerWrapper">
		<div class="leaves-title-section">
			<div class="leaves-title">Recent Leave Application</div>
			<div class="pending-leave">Leaves Pending : {{ pendingLeaves }}</div>
		</div>
		<div v-if="totalCount === 0" class="content-error-message">
			Please add a leave.
		</div>
		<div v-else class="leaves-table">
			<v-data-table
				hide-default-footer
				:headers="headers"
				:expanded.sync="expanded"
				show-expand
				:items="leavesList"
				item-key="_id"
			>
				<!-- <template v-slot:[`item.serial_number`]="{ item }">{{}}</template> -->
				<template v-slot:[`item.doa`]="{ item }">
					{{ getFormattedDate(item.doa, "MMMM Do YYYY dddd") }}
				</template>
				<template v-slot:[`item.date_from`]="{ item }">
					{{ getFormattedDate(item.date_from, "MMMM Do YYYY dddd") }}
				</template>
				<template v-slot:[`item.date_to`]="{ item }">
					{{ getFormattedDate(item.date_to, "MMMM Do YYYY dddd") }}
				</template>
				<template v-slot:expanded-item="{ headers, item }">
					<td class="expandable-section table-expanded-background " :colspan="headers.length">
						<div class="expandable-section-title">Purpose Of Leave</div>
						<div class="expandable-section-content">{{ item.purpose_of_leave }}</div>
					</td>
				</template>
				<template v-slot:[`item.actions`]="{ item }">
					<template v-if="item.status == 'PENDING' && isDateBefore(item.date_from)">
						<v-menu bottom left>
							<template v-slot:activator="{ on, attrs }">
								<v-btn icon v-bind="attrs" v-on="on">
									<v-icon>mdi-dots-vertical</v-icon>
								</v-btn>
							</template>

							<v-list>
								<v-list-item @click="openInputForm(true, item)">Edit</v-list-item>
								<v-list-item @click="deleteLeaveEntry(item)">Delete</v-list-item>
							</v-list>
						</v-menu>
					</template>
				</template>
			</v-data-table>
		</div>

		<UserForm
			@formOutput="formOutput"
			@closeForm="closeForm"
			:name="name"
			:inputConfig="inputConfig"
			:toggleForm="toggleForm"
			:formData="rowToEdit"
			:isEditMode="isEditMode"
		></UserForm>

		<div class="floating-button">
			<v-btn @click="openInputForm()" color="primary" dark fab>
				<v-icon>mdi-plus</v-icon>
			</v-btn>
		</div>

		<div v-if="isPaginationRequired" class="paginationWrapper text-center">
			<v-pagination
				@input="updatedPageNo"
				v-model="pageNo"
				:length="Math.ceil(fetchCount / pageSize)"
				:total-visible="paginationTotalVisible"
				class="pagination-component"
			></v-pagination>
			<div class="page-size-dropdown">
				<v-autocomplete v-model="pageSize" :items="pageSizeList" auto-select-first solo dense></v-autocomplete>
			</div>
		</div>
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import helperMixin from "../../mixins/helperMixins";
	import inputFormMixin from "../../mixins/inputFormMixin";
	import searchMixin from "../../mixins/searchMixin";
	import { required, email, minLength, numeric, alpha } from "vuelidate/lib/validators";
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import helpers from "../../components/helpers";
	import moment from "moment-timezone";

	export default {
		name: "SalesLeaveManager",
		mixins: [defaultCRUDMixin, inputFormMixin, helperMixin, searchMixin],
		created() {
			this.fetchPendingLeaves();
			this.getData();
		},
		components: {},
		data: () => ({
			expanded: [],
			name: "Leave",
			leavesList: [],
			pendingLeaves: 0,
			inputConfig: [
				{
					name: "From*",
					type: "Date",
					key: "date_from",
					width: "half",
					validations: {
						required,
					},
				},
				{
					name: "To*",
					type: "Date",
					key: "date_to",
					width: "half",
					validations: {
						required,
					},
				},
				{
					name: "No of Days*",
					type: "String",
					key: "no_of_days",
					width: "full",
					validations: {
						required,
						minLength: minLength(1),
					},
				},
				{
					name: "Purpose of Leave*",
					type: "TextArea",
					key: "purpose_of_leave",
					width: "full",
					validations: {
						required,
						minLength: minLength(1),
					},
				},
			],
			headers: [
				{ text: "Sr. No.", value: "serial_number", width: 100 },
				{ text: "Date of Application", align: "start", value: "doa", width: 200 },
				{ text: "Date From", value: "date_from", width: 200 },
				{ text: "Date To", value: "date_to", width: 200 },
				{ text: "No of Days", value: "no_of_days", width: 150 },
				{ text: "Status", value: "status", width: 150 },
				// { text: "Purpose", value: "data-table-expand" },
				{ text: "", value: "actions" },
			],
		}),
		methods: {
			...mapActions("LeaveManager", [
				"getSalesLeaves",
				"getPendingLeaves",
				"updateStatus",
				"addLeave",
				"deleteLeave",
				"editLeave",
			]),
			getData() {
				this.openLoaderDialog();
				this.getSalesLeaves({
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.leavesList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;
					if (this.leavesList.length) {
						this.leavesList = this.leavesList.map((d, index) => ({
							...d,
							serial_number: (this.pageNo - 1) * this.pageSize + (index + 1),
						}));
					}
				});
			},
			fetchPendingLeaves() {
				this.getPendingLeaves().then((data) => {
					this.pendingLeaves = data.pendingLeaves;
				});
			},
			isDateBefore(date) {
				if (moment().isBefore(date)) {
					return true;
				} else {
					return false;
				}
			},
			formOutput(data) {
				var formData = JSON.parse(JSON.stringify(data));
				formData.date_from = helpers.getISODate(formData.date_from);
				formData.date_to = helpers.getISODate(formData.date_to);
				formData.no_of_days = Number(formData.no_of_days);

				this.openLoaderDialog();
				if (!this.isEditMode) {
					this.addLeave(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Added a Leave Entry" });
							this.fetchPendingLeaves();
							this.getData();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				} else {
					this.editLeave(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully edited the Leave entry" });
							this.fetchPendingLeaves();
							this.getData();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				}
			},
			getEditRowObject(data) {
				return {
					...data,
					_id: data._id,
					updated_on: data.record.updated_on,
				};
			},
			deleteLeaveEntry(leave) {
				if (window.confirm("Do you really want to Delete the Leave Entry?")) {
					this.openLoaderDialog();
					this.deleteLeave({
						_id: leave._id,
					}).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Deleted Leave" });
							this.fetchPendingLeaves();
							this.getData();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				}
			},
		},
		watch: {},
		props: {},
	};
</script>
<style lang="scss" scoped>
	.leaves-title-section {
		display: flex;
		justify-content: space-between;

		margin: 20px;
		.leaves-title {
			font-size: 20px;
			font-weight: 600;
		}
	}
	.leaves-table {
		margin: 10px;
		padding: 10px;
		border: 1px solid $primary;
		border-radius: 5px;
	}
	.expandable-section {
		padding: 1em !important;
		.expandable-section-title {
			font-size: 16px;
			font-weight: 600;
		}
		// .expandable-section-content {
		// }
	}
</style>
