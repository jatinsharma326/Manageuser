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

		<div v-if="showErrorMessage" class="content-error-message">
			{{ errorMessage }}
		</div>

		<template v-if="employeesList.length">
			<template v-for="(country, countryIndex) in countriesWithEmployee">
				<div :key="country + '__' + countryIndex + '__tilte'" class="country-title">
					{{ country }}
				</div>
				<div :key="country + '__' + countryIndex" class="card-wrapper">
					<template v-for="user in employeesList">
						<div v-if="country == user.country" class="card-element" :key="user._id">
							<InformationCard :expandCard="true">
								<template v-slot:mainContent>
									{{ user.name }}
								</template>
								<template v-slot:mainContentSubtitle>
									{{ user.designation }}
								</template>
								<template v-slot:moreInfo>
									{{ user.country }}
								</template>
								<template v-slot:actionButtons>
									<template v-if="isAdminOrManagement">
										<v-btn @click="deleteEmployee(user)" color="error" text>
											Delete
										</v-btn>
										<v-btn @click="openInputForm(true, user)" color="secondary" text>
											Edit
										</v-btn>
									</template>
								</template>
								<template v-slot:expandCardContent>
									<v-list>
										<v-list-item
											v-for="(number, index) in user.phone_numbers"
											:key="user._id + '+' + index"
										>
											<v-list-item-icon>
												<v-icon v-if="index == 0" color="secondary">
													mdi-phone
												</v-icon>
											</v-list-item-icon>

											<v-list-item-content>
												<v-list-item-title>{{ number }}</v-list-item-title>
											</v-list-item-content>
										</v-list-item>

										<v-divider inset></v-divider>

										<v-list-item
											v-for="(email, index) in user.email_ids"
											:key="user._id + '+' + index + 'Email'"
										>
											<v-list-item-icon>
												<v-icon v-if="index == 0" color="secondary">
													mdi-email
												</v-icon>
											</v-list-item-icon>

											<v-list-item-content>
												<v-list-item-title>{{ email }}</v-list-item-title>
											</v-list-item-content>
										</v-list-item>
									</v-list>
								</template>
							</InformationCard>
						</div>
					</template>
				</div>
			</template>
		</template>

		<UserForm
			@formOutput="formOutput"
			@closeForm="closeForm"
			:name="name"
			:inputConfig="inputConfig"
			:toggleForm="toggleForm"
			:formData="rowToEdit"
			:isEditMode="isEditMode"
		></UserForm>

		<div v-if="isAdminOrManagement" class="floating-button">
			<v-btn @click="openInputForm()" color="primary" dark fab>
				<v-icon>mdi-plus</v-icon>
			</v-btn>
		</div>
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import inputFormMixin from "../../mixins/inputFormMixin";
	import searchMixin from "../../mixins/searchMixin";
	import { required, email, minLength, numeric, alpha } from "vuelidate/lib/validators";
	import { mapActions, mapGetters, mapMutations } from "vuex";

	export default {
		name: "PartnerEmployee",
		mixins: [defaultCRUDMixin, inputFormMixin, searchMixin],
		created() {
			this.getEmployees();
			if (this.partnerInfo.countries) {
				this.setSearchConfig(this.partnerInfo.countries);
				this.setInputConfig(this.partnerInfo.countries);
			}
		},
		data: () => ({
			employeesList: [],
			countriesWithEmployee: [],
			search_text: "",
			placeholder: "Search Employees",
			name: "Representing Partner Employees",
			inputConfig: [
				{
					name: "Employee Name*",
					type: "String",
					key: "name",
					width: "half",
					validations: {
						required,
						minLength: minLength(1),
					},
				},
				{
					name: "Designation*",
					type: "String",
					key: "designation",
					width: "full",
					validations: {
						required,
						minLength: minLength(1),
					},
				},
				{
					name: "Country*",
					type: "Dropdown",
					key: "country",
					width: "half",
					multi: false,
					listVariable: "countries",
					isListInStore: false,
					// listItems: countries,
					validations: {
						required,
					},
				},
				{
					name: "Contact Info*",
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
					name: "Email*",
					type: "MultiInput",
					key: "email_ids",
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
			],
		}),
		methods: {
			...mapActions("PartnerManagement", [
				"getPartnerEmployeesList",
				"addPartnerEmployees",
				"editPartnerEmployees",
				"deletePartnerEmployees",
			]),
			getEmployees() {
				this.openLoaderDialog();
				this.filter.representing_partner_id = this.partnerInfo._id;
				this.getPartnerEmployeesList({
					filter: this.filter,
					representing_partner_id: this.partnerInfo._id,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.employeesList = this.checkForErrorMessage(data, "company");
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;
					if (this.employeesList) {
						let temp = this.employeesList.map((e) => e.country);
						this.countriesWithEmployee = Array.from(new Set(temp));
					}
					this.employeesList = data.list;
				});
			},
			queryString(data) {
				this.filter["search_text"] = data;
				this.getEmployees();
			},
			advanceSearch(filterObject) {
				// make changes here to the filterObject
				this.filter = { ...filterObject };
				this.pageNo = 1;
				this.getEmployees();
			},
			setSearchConfig(countries = []) {
				/*
				 * Name of Employee - Text field - string or number - can this be empty
				 * Designation of Employee - Text field - string or number - can this be empty
				 * Countries - Dropdown multi Autocomplete - need some default filter provision. - can be empty in this case but not in specific cases
				 */
				this.selectedSearchConfig = [
					{
						name: "Employee Name",
						key: "name",
						type: "text",
						inputType: "textfield",
						defaultValue: "",
					},
					{
						name: "Designation",
						key: "designation",
						type: "text",
						inputType: "textfield",
						defaultValue: "",
					},
					{
						name: "Country",
						key: "country",
						multi: false,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: countries,
					},
				];
			},
			setInputConfig(countries = []) {
				this.inputConfig = [
					{
						name: "Employee Name*",
						type: "String",
						key: "name",
						width: "half",
						validations: {
							required,
							minLength: minLength(1),
						},
					},
					{
						name: "Designation*",
						type: "String",
						key: "designation",
						width: "half",
						validations: {
							required,
							minLength: minLength(1),
						},
					},
					{
						name: "Country*",
						type: "Dropdown",
						key: "country",
						width: "full",
						multi: false,
						isListInStore: false,
						listItems: countries,
						validations: {
							required,
						},
					},
					{
						name: "Contact Info*",
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
						name: "Email*",
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
			},
			formOutput(data) {
				var formData = JSON.parse(JSON.stringify(data));
				// var tempArray = [];
				// var tempObj = {};
				formData.phone_numbers = data.phone_numbers.map((data) => data.input);
				formData.email_ids = data.email_ids.map((data) => data.input);
				console.log("Before API call FormData Object", formData);

				this.openLoaderDialog();
				if (!this.isEditMode) {
					formData.representing_partner_id = this.partnerInfo._id;
					this.addPartnerEmployees(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Added Employee Info" });
							console.log("Add Partner Employee success");
							this.getEmployees();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
							console.log("Add Partner Employee failed");
						}
					});
				} else {
					this.editPartnerEmployees(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Edited Employee Info" });
							console.log("Edit Partner Employee success");
							this.getEmployees();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
							console.log("Edit Partner Employee failed");
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

			// Implement the delete API
			deleteEmployee(user) {
				console.log(user);
				if (window.confirm("Do you really want to Delete the Partner Employee?")) {
					this.openLoaderDialog();
					this.deletePartnerEmployees({
						_id: user._id,
					}).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Deleted Employee" });
							this.getEmployees();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				}
			},
		},
		watch: {
			partnerInfo: {
				deep: true,
				handler(nv, ov) {
					console.log("Handler");
					this.filter = {};
					this.employeesList = [];
					this.getEmployees();
					if (nv.countries) {
						this.setSearchConfig(nv.countries);
						this.setInputConfig(this.partnerInfo.countries);
					}
				},
			},
		},
		props: {
			partnerInfo: { required: true, type: Object },
		},
	};
</script>
<style lang="scss" scoped>
	.partnerEmployeesWrapper {
		// background-color: white;
		height: 100%;

		.country-title {
			margin-left: 10px;
			margin-top: 14px;
			font-size: 20px;
			font-weight: 600;
			color: $tertiary;
		}
		.employee-search-bar {
			padding-top: 14px;
			width: 100%;
		}
	}
</style>
