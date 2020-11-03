<template>
	<div class="callsListWrapper">
		<!-- <v-row class="px-6 leaves-search-bar" justify="center" align="center">
			<v-col cols="12" sm="8" md="6">
				<Search
					@queryString="queryString"
					@filterObject="advanceSearch"
					:placeholder="placeholder"
					:isAdvanceSearch="true"
					:filterConfig="selectedSearchConfig"
				></Search>
			</v-col>
		</v-row> -->

		<div class="leaves-table">
			<v-data-table hide-default-footer :headers="headers" :items="callsList" item-key="_id">
				<!-- <template v-slot:[`item.serial_number`]="{ item }">{{ item.serial_number }}</template> -->
				<!-- <template v-slot:[`item.doa`]="{ item }">
					{{ getFormattedDate(item.doa, "MMMM Do YYYY dddd") }}
				</template> -->
				<template v-slot:[`item.actions`]="{ item }">
					<template v-if="type == 'sales_call'">
						<v-menu bottom left>
							<template v-slot:activator="{ on, attrs }">
								<v-btn icon v-bind="attrs" v-on="on">
									<v-icon>mdi-dots-vertical</v-icon>
								</v-btn>
							</template>
							<v-list>
								<v-list-item @click="openInputForm(true, item)">EDIT</v-list-item>
								<v-list-item>DELETE</v-list-item>
							</v-list>
						</v-menu>
					</template>
				</template>
			</v-data-table>
		</div>

		<div class="text-center">
			<v-pagination
				@input="updatedPageNo"
				v-model="pageNo"
				:length="Math.ceil(fetchCount / pageSize)"
			></v-pagination>
		</div>

		<template v-if="type == 'sales_call'">
			<UserForm
				@formOutput="formOutput"
				@closeForm="closeForm"
				:name="name"
				:type="type"
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
		</template>
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
		name: "SalesCallManager",
		mixins: [defaultCRUDMixin, helperMixin, searchMixin],
		// async created() {
		// 	this.getData();
		// 	await this.getUsers();
		// 	this.setSearchConfig(this.userList);
		// },
		data: () => ({
			callsList: [],
			headers: [
				{ text: "Sr. No.", align: "start", value: "serial_number", width: 100 },
				{
					text: "Name",
					value: "name",
					width: 150,
				},
				{ text: "Date of Visit", value: "doa", width: 200 },
				{ text: "Company Name", value: "date_from", width: 150 },
				{ text: "Branch Name", value: "date_to", width: 150 },
				{ text: "City", value: "no_of_days", width: 150 },
				{ text: "State", value: "pending_leaves", width: 150 },
				{ text: "Address", value: "status", width: 150 },
				// { text: "Purpose", value: "data-table-expand" },
				{ text: "", value: "actions" },
			],
			// userList: [],
			// serialNumber: 0,
		}),
		methods: {
			// ...mapActions("LeaveManager", ["getAllLeaves", "updateStatus"]),
			// ...mapActions("UserManagement", ["getUserList"]),
			// async getUsers() {
			// 	try {
			// 		let salesAgents = await this.getUserList({
			// 			filter: {
			// 				type: "sales_agent",
			// 			},
			// 		});
			// 		let remoteSalesAgents = await this.getUserList({
			// 			filter: {
			// 				type: "remote_sales_agent",
			// 			},
			// 		});
			// 		let userList = [];
			// 		userList.push(...salesAgents.list);
			// 		userList.push(...remoteSalesAgents.list);
			// 		this.userList = userList.map((e) => e.usr_data.name);
			// 	} catch (e) {
			// 		console.log(e);
			// 	}
			// },
			// isDateBefore(date) {
			// 	if (moment().isBefore(date)) {
			// 		return true;
			// 	} else {
			// 		return false;
			// 	}
			// },
			// getData() {
			// 	this.openLoaderDialog();
			// 	// this.filter.representing_partner_id = this.partnerInfo._id;
			// 	this.getAllLeaves({
			// 		filter: this.filter,
			// 		pageSize: this.pageSize,
			// 		pageNo: this.pageNo,
			// 	}).then((data) => {
			// 		this.closeLoaderDialog();
			// 		this.callsList = data.list;
			// 		this.totalCount = data.totalCount;
			// 		this.fetchCount = data.fetchCount;
			// 		this.callsList = this.callsList.map((d, index) => ({ ...d, serial_number: index + 1 }));
			// 	});
			// },
			// queryString(data) {
			// 	this.filter["search_text"] = data;
			// 	this.getData();
			// },
			// advanceSearch(filterObject) {
			// 	// make changes here to the filterObject
			// 	var filterData = JSON.parse(JSON.stringify(filterObject));
			// 	if (filterData.doa) {
			// 		filterData.doa = helpers.getISODate(filterData.doa);
			// 	}
			// 	if (filterData.date_from) {
			// 		filterData.date_from = helpers.getISODate(filterData.date_from);
			// 	}
			// 	if (filterData.date_to) {
			// 		filterData.date_to = helpers.getISODate(filterData.date_to);
			// 	}
			// 	console.log("Test Console Advance Search Output", filterData);
			// 	this.filter = { ...filterData };
			// 	this.pageNo = 1;
			// 	this.getData();
			// },
			// setSearchConfig(teamMember = []) {
			// 	this.selectedSearchConfig = [
			// 		{
			// 			name: "Name of Applicant",
			// 			key: "names",
			// 			multi: true,
			// 			inputType: "dropdown",
			// 			defaultValue: [],
			// 			isListInStore: false,
			// 			listItems: teamMember,
			// 		},
			// 		{
			// 			name: "Date of Application",
			// 			key: "doa",
			// 			inputType: "datePicker",
			// 			defaultValue: null,
			// 		},
			// 		{
			// 			name: "Date From",
			// 			key: "date_from",
			// 			inputType: "datePicker",
			// 			defaultValue: null,
			// 		},
			// 		{
			// 			name: "Date To",
			// 			key: "date_to",
			// 			inputType: "datePicker",
			// 			defaultValue: null,
			// 		},
			// 		{
			// 			name: "Leave Status",
			// 			key: "statuses",
			// 			multi: true,
			// 			inputType: "dropdown",
			// 			defaultValue: [],
			// 			isListInStore: false,
			// 			listItems: ["PENDING", "ACCEPTED", "REJECTED"],
			// 		},
			// 	];
			// },
			// updatedPageNo(page) {
			// 	this.getData();
			// },
		},
		watch: {},
		props: {
			name: { required: true, type: String },
			type: { required: true, type: String },
			placeholder: { required: true, type: String },
			inputConfig: { required: false, type: Array },
		},
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
