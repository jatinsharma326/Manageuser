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
	import { required, email, minLength, numeric, alpha } from "vuelidate/lib/validators";
	import { mapActions, mapGetters } from "vuex";
	import callsList from "./callsList";
	export default {
		name: "ManageSalesCall",
		components: { callsList },
		async created() {
			await this.getCompanies();
			this.setConfig(this.companyList);
		},
		data: () => ({
			tab: "",
			companyList: [],
			tabConfig: [],
		}),
		computed: {
			...mapGetters([]),
		},
		methods: {
			...mapActions("ManageAgents", ["getCompaniesList", "getAddressList"]),
			getCompanies() {
				return this.getCompaniesList({
					filter: {},
				}).then((data) => {
					this.companyList = data.list;
				});
			},
			setConfig(companyList = []) {
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
						},
					},
				];
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
