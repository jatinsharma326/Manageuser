<template>
	<div class="leavesManagerWrapper">
		<v-row class="px-6 employee-search-bar" justify="center" align="center">
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
		<div class="leaves-table">
			<v-data-table :headers="headers" :expanded.sync="expanded" show-expand :items="leavesList" item-key="_id">
				<template v-slot:[`item.serial_number`]="{ item }">{{}}</template>
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
					<div class="expandable-section-title">Purpose Of Leave</div>
					<div class="expandable-section-content">Here is where the purpose of leave will go</div>
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
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import helpers from "../../components/helpers";
	import { required, email, minLength, numeric, alpha } from "vuelidate/lib/validators";
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import moment from "moment-timezone";

	export default {
		name: "LeaveManager",
		mixins: [defaultCRUDMixin],
		async created() {
			this.getData();
			await this.getUsers();
			this.setSearchConfig(this.userList);
			/* if (this.partnerInfo.countries) {
				this.setInputConfig(this.partnerInfo.countries);
			} */
		},
		data: () => ({
			expanded: [],
			leavesList: [],
			countriesWithEmployee: [],
			headers: [
				{ text: "Sr. No.", value: "serial_number" },
				{
					text: "Applicant",
					align: "start",
					value: "name",
				},
				{ text: "Date of Application", value: "doa" },
				{ text: "Date From", value: "date_from" },
				{ text: "Date To", value: "date_to" },
				{ text: "No of Days", value: "no_of_days" },
				{ text: "Pending Leaves", value: "pending_leaves" },
				{ text: "Status", value: "status" },
				{ text: "Purpose", value: "data-table-expand" },
				{ text: "", value: "actions" },
			],
			search_text: "",
			placeholder: "Search Leaves",
			userList: [],
			serialNumber: 0,
		}),
		methods: {
			...mapActions("LeaveManager", [
				"getAllLeaves",
				"updateStatus",
				/* "addPartnerEmployees",
				"deletePartnerEmployees", */
			]),
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
					console.log("salesAgents", salesAgents);
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
					/* for (let listItem of this.leavesList) {
					} */
				});
			},
			acceptAction(leave) {
				this.openLoaderDialog();
				this.updateStatus({
					_id: leave._id,
					status: "ACCEPTED",
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
			queryString(data) {
				this.filter["search_text"] = data;
				this.getData();
			},
			advanceSearch(filterObject) {
				// make changes here to the filterObject
				var filterData = JSON.parse(JSON.stringify(filterObject));
				if (filterData.doa) {
					filterData.doa = helpers.getISODate(filterData.doa);
				}
				if (filterData.date_from) {
					filterData.date_from = helpers.getISODate(filterData.date_from);
				}
				if (filterData.date_to) {
					filterData.date_to = helpers.getISODate(filterData.date_to);
				}
				console.log(filterObject);
				this.filter = { ...filterData };
				this.pageNo = 1;
				this.getData();
			},
			setSearchConfig(teamMember = []) {
				this.selectedSearchConfig = [
					{
						name: "Name of Applicant",
						key: "name",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: teamMember,
					},
					{
						name: "Date of Applicantion",
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
						key: "status",
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
<style lang="scss" scoped></style>
