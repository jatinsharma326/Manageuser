<template>
	<div class="partnerEmployeesWrapper">
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
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import { required, email, minLength, numeric, alpha } from "vuelidate/lib/validators";
	import { mapActions, mapGetters, mapMutations } from "vuex";

	export default {
		name: "LeaveManager",
		mixins: [defaultCRUDMixin],
		created() {
			this.getData();
			/* if (this.partnerInfo.countries) {
				this.setSearchConfig(this.partnerInfo.countries);
				this.setInputConfig(this.partnerInfo.countries);
			} */
		},
		data: () => ({
			leavesList: [],
			countriesWithEmployee: [],
			search_text: "",
			placeholder: "Search Leaves",
		}),
		methods: {
			...mapActions("LeaveManager", [
				"getAllLeaves",
				/* "addPartnerEmployees",
				"editPartnerEmployees",
				"deletePartnerEmployees", */
			]),
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
					console.log(this.leavesList);
				});
			},
			queryString(data) {
				this.filter["search_text"] = data;
				this.getData();
			},
			advanceSearch(filterObject) {
				// make changes here to the filterObject
				this.filter = { ...filterObject };
				this.pageNo = 1;
				this.getData();
			},
			// setSearchConfig(countries = []) {
			// 	/*
			// 	 * Name of Employee - Text field - string or number - can this be empty
			// 	 * Designation of Employee - Text field - string or number - can this be empty
			// 	 * Countries - Dropdown multi Autocomplete - need some default filter provision. - can be empty in this case but not in specific cases
			// 	 */
			// 	this.selectedSearchConfig = [
			// 		{
			// 			name: "Employee Name",
			// 			key: "name",
			// 			type: "text",
			// 			inputType: "textfield",
			// 			defaultValue: "",
			// 		},
			// 		{
			// 			name: "Designation",
			// 			key: "designation",
			// 			type: "text",
			// 			inputType: "textfield",
			// 			defaultValue: "",
			// 		},
			// 		{
			// 			name: "Country",
			// 			key: "country",
			// 			multi: false,
			// 			inputType: "dropdown",
			// 			defaultValue: [],
			// 			isListInStore: false,
			// 			listItems: countries,
			// 		},
			// 	];
			// },
			/* setInputConfig(countries = []) {
				this.inputConfig = [
					{
						name: "Employee Name",
						type: "String",
						key: "name",
						width: "half",
						validations: {
							required,
							minLength: minLength(1),
						},
					},
					{
						name: "Designation",
						type: "String",
						key: "designation",
						width: "full",
						validations: {
							required,
							minLength: minLength(1),
						},
					},
					{
						name: "Country",
						type: "Dropdown",
						key: "country",
						width: "half",
						multi: false,
						isListInStore: false,
						listItems: countries,
						validations: {
							required,
						},
					},
					{
						name: "Contact Info",
						type: "MultiInput",
						key: "phone_numbers",
						width: "half",
						validations: {
							required,
							minLength: minLength(1),
							$each: {
								input: {
									required,
								},
							},
						},
					},
					{
						name: "Email",
						type: "MultiInput",
						key: "email_ids",
						width: "half",
						validations: {
							required,
							minLength: minLength(1),
							$each: {
								input: {
									email,
									required,
								},
							},
						},
					},
				];
			}, */
			// formOutput(data) {
			// 	var formData = JSON.parse(JSON.stringify(data));
			// 	// var tempArray = [];
			// 	// var tempObj = {};
			// 	formData.phone_numbers = data.phone_numbers.map((data) => data.input);
			// 	formData.email_ids = data.email_ids.map((data) => data.input);
			// 	console.log("Before API call FormData Object", formData);

			// 	this.openLoaderDialog();
			// 	if (!this.isEditMode) {
			// 		formData.representing_partner_id = this.partnerInfo._id;
			// 		this.addPartnerEmployees(formData).then((data) => {
			// 			this.closeLoaderDialog();
			// 			if (data.ok) {
			// 				this.openSnackbar({ text: "Sucessfully Added Employee Info" });
			// 				console.log("Add Partner Employee success");
			// 				this.getData();
			// 				this.closeForm();
			// 			} else {
			// 				this.openSnackbar({ text: data.message });
			// 				console.log("Add Partner Employee failed");
			// 			}
			// 		});
			// 	} else {
			// 		this.editPartnerEmployees(formData).then((data) => {
			// 			this.closeLoaderDialog();
			// 			if (data.ok) {
			// 				this.openSnackbar({ text: "Sucessfully Edited Employee Info" });
			// 				console.log("Edit Partner Employee success");
			// 				this.getData();
			// 				this.closeForm();
			// 			} else {
			// 				this.openSnackbar({ text: data.message });
			// 				console.log("Edit Partner Employee failed");
			// 			}
			// 		});
			// 	}
			// },
			// getEditRowObject(data) {
			// 	return {
			// 		...data,
			// 		_id: data._id,
			// 		updated_on: data.record.updated_on,
			// 	};
			// },
			// // Implement the delete API
			// deleteEmployee(user) {
			// 	console.log(user);
			// 	if (window.confirm("Do you really want to Delete the Partner Employee?")) {
			// 		this.openLoaderDialog();
			// 		this.deletePartnerEmployees({
			// 			_id: user._id,
			// 		}).then((data) => {
			// 			this.closeLoaderDialog();
			// 			if (data.ok) {
			// 				this.openSnackbar({ text: "Sucessfully Deleted Employee" });
			// 				this.getData();
			// 			} else {
			// 				this.openSnackbar({ text: data.message });
			// 			}
			// 		});
			// 	}
			// },
		},
		watch: {},
		props: {},
	};
</script>
<style lang="scss" scoped></style>
