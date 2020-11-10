<template>
	<div class="manageSalesCallWrapper">
		<v-tabs grow v-model="tab">
			<v-tab v-for="(ele, index) in tabConfig" :key="ele.id + '__' + index">{{ ele.name }}</v-tab>
		</v-tabs>
		<v-tabs-items class="tabItemWrapper" v-model="tab">
			<v-tab-item v-for="(ele, index) in tabConfig" :key="ele.id + '__' + index">
				<callsList v-bind="{ ...ele.props }"></callsList>
			</v-tab-item>
		</v-tabs-items>
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import { required, email, minLength, numeric, alpha } from "vuelidate/lib/validators";
	import { mapActions, mapGetters } from "vuex";
	import callsList from "./callsList";
	import moment from "moment-timezone";
	export default {
		name: "ManageSalesCall",
		mixins: [defaultCRUDMixin],
		components: { callsList },
		async created() {
			await this.getCompanies();
			await this.getUsers();
			await this.getStates();
			// console.log("All Lists", this.companyList, this.userList, this.statesList);
			this.setConfig(this.companyList, this.userList, this.statesList, this.modifiedCompanyList);
			// if (this.isSalesTeamMember) {
			// }
		},
		data: () => ({
			tab: "",
			companyList: [],
			modifiedCompanyList: [],
			userList: [],
			statesList: [],
			tabConfig: [],
		}),
		computed: {
			...mapGetters([]),
		},
		methods: {
			...mapActions("ManageAgents", ["getCompaniesList", "getAddressList", "getStatesList"]),
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
			getCompanies() {
				return this.getCompaniesList({
					filter: {},
				}).then((data) => {
					this.companyList = data.list;
					this.modifiedCompanyList = data.list.map((e) => ({
						text: e.name,
						value: e._id,
					}));
				});
			},
			getStates() {
				return this.getStatesList({
					filter: {},
				}).then((data) => {
					this.statesList = data.list;
				});
			},
			setConfig(companyList = [], userList = [], statesList = [], modifiedCompanyList = []) {
				this.tabConfig = [
					{
						name: "Sales Call",
						id: "salesCall",
						component: "Users",
						props: {
							name: "Sales Call",
							type: "sales_call",
							placeholder: "Search Sales Call",
							inputConfig: [
								{
									name: "Date of Visit*",
									type: "Date",
									key: "date_of_call",
									min: () => {
										return moment()
											.tz("Asia/Kolkata")
											.subtract(1, "month")
											.startOf("month")
											.format("YYYY-MM-DD");
									},
									max: () => {
										return moment()
											.tz("Asia/Kolkata")
											.add(2, "month")
											.endOf("month")
											.format("YYYY-MM-DD");
									},
									width: "half",
									validations: {
										required,
									},
								},
								// {
								// 	name: "Company Name*",
								// 	type: "Dropdown",
								// 	key: "company_id",
								// 	width: "half",
								// 	multi: false,
								// 	isListInStore: false,
								// 	listItems: companyList,
								// 	validations: {
								// 		required,
								// 	},
								// },
								{
									name: "Company Name*",
									type: "DropdownWithMoreInfo",
									isCustom: true,
									subtitleContent: (item) => {
										return item.business_types.join(", ");
									},
									titleContent: (item) => {
										return item.name;
									},
									apiCall: (company_id) => {
										// return function getAddresses() {
										return this.getAddressList({
											filter: {
												company_id: company_id,
											},
										}).then((data) => {
											return {
												data,
											};
										});
										// };
									},
									key: "company_id",
									width: "half",
									multi: false,
									isListInStore: false,
									listItems: companyList,
									itemText: "name",
									itemValue: "_id",
									validations: {
										required,
									},
								},
								{
									name: "Branch Name*",
									type: "AsyncDropdownWithMoreInfo",
									triggerKey: "company_id",
									subtitleContent: (item) => {
										return item.address + " " + item.state + " " + item.city + " " + item.pincode;
									},
									titleContent: (item) => {
										return item.branch_name;
									},
									apiCall: (company_id) => {
										return this.getAddressList({
											filter: {
												company_id: company_id,
											},
										}).then((data) => {
											return data.list;
										});
									},
									key: "company_address_id",
									width: "half",
									itemText: "branch_name",
									itemValue: "_id",
									validations: {
										required,
									},
								},
							],
							selectedSearchConfig: [
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
									key: "companies",
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
						name: "All Sales Call",
						id: "allSalesCall",
						component: "Users",
						props: {
							name: "All Sales Call",
							type: "all_sales_call",
							placeholder: "Search All Sales Call",
							selectedSearchConfig: [
								{
									name: "Company",
									key: "companies",
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
					// Discuss this with Taher and See whats the best solution || Can also use filter
					this.tabConfig.shift();
				}
			},
		},
	};
</script>
<style lang="scss">
	.manageSalesCallWrapper {
		height: 100%;
		.tabItemWrapper {
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
	}
</style>
