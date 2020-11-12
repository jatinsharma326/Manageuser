<template>
	<div class="manageDSRWrapper">
		<v-tabs grow v-model="tab">
			<v-tab v-for="(ele, index) in tabConfig" :key="ele.id + '__' + index">{{ ele.name }}</v-tab>
		</v-tabs>
		<v-tabs-items class="tabItemWrapper" v-model="tab">
			<v-tab-item v-for="(ele, index) in tabConfig" :key="ele.id + '__' + index">
				<reportsList v-bind="{ ...ele.props }"></reportsList>
			</v-tab-item>
		</v-tabs-items>
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import { required, email, minLength, numeric, alpha } from "vuelidate/lib/validators";
	import { mapActions, mapGetters } from "vuex";
	import reportsList from "./reportsList";
	import moment from "moment-timezone";
	import helper from "../../components/helpers";
	export default {
		name: "ManageDSR",
		mixins: [defaultCRUDMixin],
		components: { reportsList },
		async created() {
			this.openLoaderDialog();
			await this.getCompanies();
			await this.getUsers();
			await this.getCountryList();
			if (this.isSalesTeamMember) {
				await this.getSalesCallList();
			}
			this.closeLoaderDialog();
			this.setConfig(
				this.companyList,
				this.userList,
				this.storeStatesList,
				this.modifiedCompanyList,
				this.countriesList,
				this.callsList
			);
		},
		data: () => ({
			tab: "",
			callsList: [],
			companyList: [],
			countriesList: [],
			modifiedCompanyList: [],
			userList: [],
			tabConfig: [],
			filter: {},
		}),
		computed: {
			...mapGetters(["userData"]),
			...mapGetters("ManageAgents", ["storeStatesList"]),
		},
		methods: {
			...mapActions("ManageAgents", ["getCompaniesList", "getAddressList", "getCompanyEmployeeList"]),
			...mapActions("UserManagement", ["getUserList"]),
			...mapActions("SalesCall", ["getSalesCall"]),
			...mapActions("ManageTargets", ["getActiveCountries"]),

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
			getCompanies() {
				return this.getCompaniesList({
					filter: {},
				}).then((data) => {
					this.companyList = data.list;
					this.modifiedCompanyList = data.list.map((e) => e.name);
				});
			},
			getCountryList() {
				return this.getActiveCountries().then((data) => {
					console.log("4", data.list);
					this.countriesList = data.list;
				});
			},
			getSalesCallList() {
				this.filter.mortal_id = this.userData.id;
				this.filter.date_from = moment()
					.tz("Asia/Kolkata")
					.subtract(1, "month")
					.startOf("month")
					.toISOString();
				this.filter.date_to = moment()
					.tz("Asia/Kolkata")
					.add(2, "month")
					.endOf("month")
					.toISOString();

				return this.getSalesCall({
					filter: this.filter,
				}).then((data) => {
					this.callsList = data.list;
				});
			},
			setConfig(
				companyList = [],
				userList = [],
				statesList = [],
				modifiedCompanyList = [],
				activeCountriesList = [],
				callsList = []
			) {
				this.tabConfig = [
					{
						name: "My DSR",
						id: "myDSR",
						props: {
							name: "My DSR",
							type: "my_dsr",
							placeholder: "Search my DSR",
							inputConfig: [
								{
									name: "Sales Call Index*",
									type: "DropdownWithMoreInfo",
									isCustom: true,
									subtitleContent: (item) => {
										return (
											helper.getFormattedDate(item.date_of_call, "DD-MM-YYYY") +
											"-" +
											item.company_data.name
										);
									},
									titleContent: (item) => {
										return item.sr_no;
									},
									// apiCall: (company_id) => {
									// 	// return function getAddresses() {
									// 	return this.getAddressList({
									// 		filter: {
									// 			company_id: company_id,
									// 		},
									// 	}).then((data) => {
									// 		return {
									// 			data,
									// 		};
									// 	});
									// 	// };
									// },
									key: "sales_call_id",
									width: "full",
									multi: false,
									isListInStore: false,
									listItems: callsList,
									itemText: "sr_no",
									itemValue: "_id",
									validations: {
										required,
									},
								},
								{
									name: "Travel Agent Employee*",
									type: "AsyncDropdownWithMoreInfo",
									triggerKey: "sales_call_id",
									subtitleContent: (item) => {
										return item.designation + " - " + item.company_address_data.branch_name;
									},
									titleContent: (item) => {
										return item.name;
									},
									apiCall: (call_id) => {
										let call = this.callsList.find((e) => e._id == call_id);
										return this.getCompanyEmployeeList({
											filter: {
												company_id: call.company_id,
												active: true,
											},
										}).then((data) => {
											return data.list;
										});
									},
									key: "travel_agent_id",
									width: "full",
									itemText: "name",
									itemValue: "_id",
									validations: {
										required,
									},
								},
								{
									name: "Product*",
									type: "Dropdown",
									key: "countries",
									width: "full",
									multi: true,
									isListInStore: false,
									listItems: activeCountriesList,
									validations: {
										required,
									},
								},
								{
									name: "Follow up Date",
									type: "Date",
									key: "follow_up_on_date",
									width: "half",
								},
								{
									name: "Status",
									type: "Dropdown",
									key: "status",
									width: "half",
									multi: false,
									isListInStore: false,
									listItems: ["ON GOING", "CLOSED"],
								},
								{
									name: "Meeting Remark*",
									type: "TextArea",
									key: "meeting_remark",
									width: "full",
									validations: {
										required,
										minLength: minLength(2),
									},
								},
							],
							searchConfig: [
								{
									name: "Company",
									key: "company_names",
									multi: true,
									inputType: "dropdown",
									defaultValue: [],
									isListInStore: false,
									listItems: modifiedCompanyList,
								},
								{
									name: "Branch Name",
									key: "branch_name",
									type: "text",
									inputType: "textfield",
									defaultValue: "",
								},
								{
									name: "State",
									key: "states",
									multi: true,
									inputType: "dropdown",
									defaultValue: [],
									isListInStore: false,
									listItems: statesList,
								},
							],
						},
					},
					{
						name: "All DSR",
						id: "allDSR",
						component: "Users",
						props: {
							name: "All DSR",
							type: "all_dsr",
							placeholder: "Search all DSR",
							searchConfig: [
								{
									name: "Created By",
									key: "names",
									multi: true,
									inputType: "dropdown",
									defaultValue: [],
									isListInStore: false,
									listItems: userList,
								},
								{
									name: "Company",
									key: "company_names",
									multi: true,
									inputType: "dropdown",
									defaultValue: [],
									isListInStore: false,
									listItems: modifiedCompanyList,
								},
								{
									name: "Branch Name",
									key: "branch_name",
									type: "text",
									inputType: "textfield",
									defaultValue: "",
								},
								{
									name: "State",
									key: "states",
									multi: true,
									inputType: "dropdown",
									defaultValue: [],
									isListInStore: false,
									listItems: statesList,
								},
							],
						},
					},
				];
				if (this.isAdminOrManagement) {
					this.tabConfig.shift();
				}
			},
		},
	};
</script>
<style lang="scss">
	.manageDSRWrapper {
		height: 100%;
		.tabItemWrapper {
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
	}
</style>
