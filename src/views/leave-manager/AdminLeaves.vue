<template>
	<div class="adminLeaveManagerWrapper">
		<v-row class="px-6 leaves-search-bar" justify="center" align="center">
			<v-col cols="12" sm="8" md="6">
				<Search
					@queryString="queryString"
					@filterObject="advanceSearch"
					:placeholder="placeholder"
					:isAdvanceSearch="true"
					:filterConfig="selectedSearchConfig"
				></Search>
			</v-col>
		</v-row>
		<div v-if="totalCount === 0" class="content-error-message">
			No leaves Entry yet.
		</div>
		<div class="leaves-table">
			<v-data-table
				hide-default-footer
				:headers="headers"
				:expanded.sync="expanded"
				show-expand
				:items="leavesList"
				item-key="_id"
			>
				<template v-slot:[`item.serial_number`]="{ item }">{{ item.serial_number }}</template>
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
					<template v-if="item.status != 'REJECTED' && isDateBefore(item.date_from)">
						<v-menu bottom left>
							<template v-slot:activator="{ on, attrs }">
								<v-btn icon v-bind="attrs" v-on="on">
									<v-icon>mdi-dots-vertical</v-icon>
								</v-btn>
							</template>

							<v-list>
								<v-list-item v-if="item.status != 'ACCEPTED'" @click="acceptAction(item)"
									>Accept</v-list-item
								>
								<v-list-item @click="rejectAction(item)">Reject</v-list-item>
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
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import helperMixin from "../../mixins/helperMixins";
	import searchMixin from "../../mixins/searchMixin";
	import helpers from "../../components/helpers";
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import moment from "moment-timezone";

	export default {
		name: "AdminLeaveManager",
		mixins: [defaultCRUDMixin, helperMixin, searchMixin],
		async created() {
			this.getData();
			await this.getUsers();
			this.setSearchConfig(this.userList);
		},
		data: () => ({
			expanded: [],
			leavesList: [],
			headers: [
				{ text: "Sr. No.", align: "start", value: "serial_number", width: 100 },
				{
					text: "Applicant",
					value: "name",
					width: 150,
				},
				{ text: "Date of Application", value: "doa", width: 200 },
				{ text: "Date From", value: "date_from", width: 150 },
				{ text: "Date To", value: "date_to", width: 150 },
				{ text: "No of Days", value: "no_of_days", width: 150 },
				{ text: "Pending Leaves", value: "pending_leaves", width: 150 },
				{ text: "Status", value: "status", width: 150 },
				// { text: "Purpose", value: "data-table-expand" },
				{ text: "", value: "actions" },
			],
			search_text: "",
			placeholder: "Search Leaves",
			userList: [],
			serialNumber: 0,
		}),
		methods: {
			...mapActions("LeaveManager", ["getAllLeaves", "updateStatus"]),
			...mapActions("UserManagement", ["getUserList"]),
			async getUsers() {
				try {
					let salesAgents = await this.getUserList({
						filter: {
							type: "sales_agent",
						},
					});
					let remoteSalesAgents = await this.getUserList({
						filter: {
							type: "remote_sales_agent",
						},
					});
					let userList = [];
					userList.push(...salesAgents.list);
					userList.push(...remoteSalesAgents.list);
					this.userList = userList.map((e) => e.usr_data.name);
				} catch (e) {
					console.log(e);
				}
			},
			isDateBefore(date) {
				if (moment().isBefore(date)) {
					return true;
				} else {
					return false;
				}
			},
			getData() {
				this.openLoaderDialog();
				// this.filter.representing_partner_id = this.partnerInfo._id;
				this.getAllLeaves({
					filter: this.filter,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.leavesList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;
					this.leavesList = this.leavesList.map((d, index) => ({ ...d, serial_number: index + 1 }));
				});
			},
			acceptAction(leave) {
				this.openLoaderDialog();
				this.updateStatus({
					_id: leave._id,
					status: "ACCEPTED",
					no_of_days: leave.no_of_days,
					updated_on: leave.record.updated_on,
					pending_leaves: leave.pending_leaves,
				}).then((data) => {
					this.closeLoaderDialog();
					if (data.ok) {
						this.openSnackbar({ text: "Sucessfully Updated Leave Status" });
						this.getData();
					} else {
						this.openSnackbar({ text: data.message });
					}
				});
			},
			rejectAction(leave) {
				this.openLoaderDialog();
				this.updateStatus({
					_id: leave._id,
					status: "REJECTED",
					no_of_days: leave.no_of_days,
					updated_on: leave.record.updated_on,
					pending_leaves: leave.pending_leaves,
				}).then((data) => {
					this.closeLoaderDialog();
					if (data.ok) {
						this.openSnackbar({ text: "Sucessfully Updated Leave Status" });
						this.getData();
					} else {
						this.openSnackbar({ text: data.message });
					}
				});
			},

			advanceSearch(filterObject) {
				// make changes here to the filterObject
				var filterData = JSON.parse(JSON.stringify(filterObject));

				// if (filterData.name.length <= 1) {
				// 	filterData.name = filterData.name.toString();
				// 	delete filterData.names;
				// } else {
				// 	filterData.names = filterData.name;
				// 	delete filterData.name;
				// }
				if (filterData.doa) {
					filterData.doa = helpers.getISODate(filterData.doa);
				}
				if (filterData.date_from) {
					filterData.date_from = helpers.getISODate(filterData.date_from);
				}
				if (filterData.date_to) {
					filterData.date_to = helpers.getISODate(filterData.date_to);
				}

				this.filter = { ...filterData };
				this.pageNo = 1;
				this.getData();
			},
			setSearchConfig(teamMember = []) {
				this.selectedSearchConfig = [
					{
						name: "Name of Applicant",
						key: "names",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: teamMember,
					},
					{
						name: "Date of Application",
						key: "doa",
						inputType: "datePicker",
						defaultValue: null,
					},
					{
						name: "Date From",
						key: "date_from",
						inputType: "datePicker",
						defaultValue: null,
					},
					{
						name: "Date To",
						key: "date_to",
						inputType: "datePicker",
						defaultValue: null,
					},
					{
						name: "Leave Status",
						key: "statuses",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: ["PENDING", "ACCEPTED", "REJECTED"],
					},
				];
			},
		},
		watch: {},
		props: {},
	};
</script>
<style lang="scss" scoped>
	.leaves-search-bar {
		margin-top: 20px;
		margin-bottom: 20px;
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
