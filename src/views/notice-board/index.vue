<template>
	<div class="noticeBoardWrapper">
		<div class="SearchbarWrapper">
			<div class="searchbar">
				<Search @queryString="queryString" :placeholder="placeholder" :isAdvanceSearch="false"></Search>
			</div>
			<div class="datepicker">
				<v-dialog
					ref="dialog"
					v-model="dateDialog"
					:return-value.sync="datePickerDate"
					persistent
					width="290px"
				>
					<template v-slot:activator="{ on, attrs }">
						<v-text-field
							v-model="dateRangeText"
							label="Date Range"
							readonly
							outlined
							@click="dataSelector"
							v-bind="attrs"
							v-on="on"
						></v-text-field>
					</template>
					<v-date-picker range v-model="datePickerDate" scrollable>
						<v-spacer></v-spacer>
						<v-btn text color="primary" @click="resetDatePicker">
							Reset
						</v-btn>
						<v-btn text color="primary" @click="cancelDatePicker">
							Cancel
						</v-btn>
						<v-btn text color="primary" @click="submitDatePicker">
							OK
						</v-btn>
					</v-date-picker>
				</v-dialog>
			</div>
		</div>
		<div v-if="totalCount === 0" class="content-error-message">
			Please add an Entry
		</div>
		<div v-else class="info-table">
			<v-data-table
				:items-per-page="pageSize"
				hide-default-footer
				:headers="headers"
				item-key="_id"
				:items="dataList"
			>
				<template v-slot:[`item.date_of_creation`]="{ item }">
					{{ item.date_of_creation ? getFormattedDate(item.date_of_creation, "dddd, MMMM Do YYYY") : "-" }}
				</template>
				<template v-slot:[`item.actions`]="{ item }">
					<template>
						<v-menu bottom left>
							<template v-slot:activator="{ on, attrs }">
								<v-btn icon v-bind="attrs" v-on="on">
									<v-icon>mdi-dots-vertical</v-icon>
								</v-btn>
							</template>
							<v-list>
								<v-list-item @click="openInputForm(true, item)">EDIT</v-list-item>
								<v-list-item @click="deleteEntry(item)">DELETE</v-list-item>
							</v-list>
						</v-menu>
					</template>
				</template>
			</v-data-table>
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

		<UserForm
			@formOutput="formOutput"
			@closeForm="closeForm"
			:name="name"
			:inputConfig="inputConfig"
			:keysToWatch="keysToWatch"
			:toggleForm="toggleForm"
			:formData="rowToEdit"
			:isEditMode="isEditMode"
		></UserForm>

		<div class="floating-button">
			<v-btn @click="openInputForm()" color="primary" dark fab>
				<v-icon>mdi-plus</v-icon>
			</v-btn>
		</div>
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import helperMixin from "../../mixins/helperMixins";
	import inputFormMixin from "../../mixins/inputFormMixin";
	import searchMixin from "../../mixins/searchMixin";
	import datePickerMixin from "../../mixins/datePickerMixin";
	import commonAPICallsMixin from "../../mixins/commonAPICallsMixin";

	import { required, email, minLength, numeric, alpha } from "vuelidate/lib/validators";
	import helpers from "../../components/helpers";
	import moment from "moment-timezone";
	import { mapActions, mapGetters, mapMutations } from "vuex";

	export default {
		name: "NoticeBoard",
		mixins: [defaultCRUDMixin, inputFormMixin, helperMixin, searchMixin, datePickerMixin],
		async created() {
			this.setDateRange();
			this.getData();
			this.setConfig();
		},
		data: () => ({
			name: "Notice Board Entry",
			placeholder: "Search Notice Board Entry",
			inputConfig: [],
			dataList: [],
			headers: [
				{ text: "Sr. No.", align: "start", value: "serial_number", width: 100 },
				{ text: "Date of Creation", value: "date_of_creation", width: 150 },
				{ text: "Bulletin Content", value: "notice_board_bulletin", width: 150 },
				{ text: "", value: "actions", width: 150 },
			],
			keysToWatch: [],
		}),
		computed: {
			...mapGetters(["userData"]),
			dateRangeText() {
				return this.datePickerDate.join(" ~ ");
			},
		},
		methods: {
			...mapActions("NoticeBoard", ["getNoticeBoard", "addNoticeBoard", "editNoticeBoard", "deleteNoticeBoard"]),
			setDateRange() {
				let tempArray = [];
				let startDate = moment()
					.tz("Asia/Kolkata")
					.startOf("month")
					.format("YYYY-MM-DD");
				let endDate = moment()
					.tz("Asia/Kolkata")
					.endOf("month")
					.format("YYYY-MM-DD");
				tempArray.push(startDate);
				tempArray.push(endDate);
				this.datePickerDate = tempArray;
			},
			getData() {
				this.openLoaderDialog();
				this.filter.date_from = moment(this.datePickerDate[0])
					.tz("Asia/Kolkata")
					.startOf()
					.toISOString();
				if (this.datePickerDate[1]) {
					this.filter.date_to = moment(this.datePickerDate[1])
						.tz("Asia/Kolkata")
						.endOf()
						.toISOString();
				} else {
					this.filter.date_to = this.filter.date_from;
				}

				this.getNoticeBoard({
					filter: this.filter,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.dataList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;

					if (this.dataList.length) {
						this.dataList = this.dataList.map((d, index) => ({
							...d,
							serial_number: (this.pageNo - 1) * this.pageSize + (index + 1),
						}));
					}
				});
			},
			setConfig() {
				this.inputConfig = [
					{
						name: "Content*",
						type: "TextArea",
						key: "notice_board_bulletin",
						width: "full",
						validations: {
							required,
							minLength: minLength(2),
						},
					},
				];
			},
			async formOutput(data) {
				var formData = JSON.parse(JSON.stringify(data));

				this.openLoaderDialog();
				if (!this.isEditMode) {
					this.addNoticeBoard(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Added Notice Board Entry" });
							this.closeForm();
							this.getData();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				} else {
					this.editNoticeBoard(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Edited Notice Board Entry" });
							this.closeForm();
							this.getData();
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
			deleteEntry(data) {
				if (window.confirm("Do you really want to Delete the Notice Board Entry?")) {
					this.openLoaderDialog();
					this.deleteNoticeBoard({
						_id: data._id,
					}).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Deleted the Notice Board Entry" });
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
<style lang="scss">
	.manageVirtualReachWrapper {
		height: 100%;
		.tabItemWrapper {
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
	}
	.datepicker {
		.v-input__slot {
			margin-bottom: 0;
		}
		.v-text-field__details {
			display: none;
		}
	}
</style>
<style lang="scss" scoped>
	.SearchbarWrapper {
		.searchWrapper {
			flex-shrink: 0;
		}
	}
	.noticeBoardWrapper {
		.info-table {
			margin: 10px;
			padding: 10px;
			border: 1px solid $primary;
			border-radius: 5px;
		}
		// .expandable-section {
		// 	padding: 1em !important;
		// 	.expandable-section-title {
		// 		font-size: 16px;
		// 		font-weight: 600;
		// 	}
		// 	.expandable-section-content {
		// 		white-space: pre-wrap;
		// 	}
		// }
	}
</style>
