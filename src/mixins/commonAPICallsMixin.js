import { mapActions } from "vuex";

const commonAPICallsMixin = {
	components: {},
	data: () => ({
		companyList: [],
		countriesList: [],
		modifiedCompanyList: [],
		userList: [],
	}),
	computed: {},
	methods: {
		...mapActions("ManageAgents", ["getCompaniesList"]),
		...mapActions("UserManagement", ["getUserList"]),
		...mapActions("ManageTargets", ["getActiveCountries"]),
		async getUsers() {
			try {
				let promiseArray = [];
				promiseArray.push(
					this.getUserList({
						filter: {
							type: "sales_agent",
						},
					})
				);
				promiseArray.push(
					this.getUserList({
						filter: {
							type: "remote_sales_agent",
						},
					})
				);
				let users = await Promise.all(promiseArray);
				let userList = [];
				userList.push(...users[0].list);
				userList.push(...users[1].list);
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
				this.countriesList = data.list;
			});
		},
	},
};

export default commonAPICallsMixin;