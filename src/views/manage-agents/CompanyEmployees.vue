<template>
	<div class="companyEmployeeWrapper">
		<v-row class="px-6 companyemployee-search-bar" justify="center" align="center">
			<v-col cols="12" sm="8" md="6">
				<Search
					@queryString="queryString"
					@filterObject="advanceSearch"
					@clearFilter="advanceSearch"
					:placeholder="placeholder"
					:isAdvanceSearch="true"
					:filterConfig="selectedSearchConfig"
				></Search>
			</v-col>
		</v-row>

		<div class="card-wrapper">
			<div v-for="employee in employeeList" :key="employee._id" class="card-element">
				<InformationCard :expandCard="true" :isCardDisabled="!employee.record.active">
					<template v-slot:topLeft>
						{{ employee.business_types.join(", ") }}
					</template>
					<template v-slot:topRight>
						{{ employee.zone }}
					</template>
					<template v-slot:mainContent>
						{{ employee.name }}
					</template>
					<template v-slot:mainContentSubtitle>
						{{ employee.designation }} - {{ employee.branch_name }}
					</template>
					<template v-slot:actionButtons>
						<template>
							<v-btn
								v-if="userType == ADMIN || userType == MANAGEMENT"
								@click="disableEmployee(employee)"
								color="error"
								text
							>
								{{ employee.record.active ? "Disable" : "Enable" }}
							</v-btn>
							<v-btn
								v-if="(userType == ADMIN || userType == MANAGEMENT) && employee.record.active"
								@click="openInputForm(true, employee)"
								color="secondary"
								text
							>
								Edit
							</v-btn>
						</template>
					</template>
					<template v-slot:expandCardContent>
						<v-list>
							<v-list-item
								v-for="(contact, index) in employee.emergency_contacts"
								:key="employee._id + '+' + index"
								two-line
							>
								<v-list-item-icon>
									<v-icon color="secondary">
										mdi-phone
									</v-icon>
								</v-list-item-icon>

								<v-list-item-content>
									<v-list-item-title>{{ contact.contacts.join(", ") }}</v-list-item-title>
									<v-list-item-subtitle>{{ contact.country }}</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>

							<v-list-item
								v-for="(email, index) in employee.email_ids"
								:key="employee._id + '+' + index + 'Email'"
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
							<v-list-item>
								<v-list-item-icon>
									<v-icon color="secondary">
										mdi-map-marker
									</v-icon>
								</v-list-item-icon>

								<v-list-item-content>
									<v-list-item-title
										>{{ employee.address }} {{ employee.state }} {{ employee.city }}
										{{ employee.pincode }}</v-list-item-title
									>
								</v-list-item-content>
							</v-list-item>
							<v-list-item>
								<v-list-item-content>
									<v-list-item-title>DOB: {{ getFormattedDate(employee.dob) }}</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</template>
				</InformationCard>
			</div>
		</div>

		<div class="text-center">
			<v-pagination
				@input="updatedPageNo"
				v-model="pageNo"
				:length="Math.ceil(fetchCount / pageSize)"
			></v-pagination>
		</div>

		<!-- :keysToWatch="keysToWatch" -->
		<UserForm
			@formOutput="formOutput"
			@closeForm="closeForm"
			:name="name"
			:inputConfig="inputConfig"
			:toggleForm="toggleForm"
			:formData="rowToEdit"
			:isEditMode="isEditMode"
		></UserForm>

		<div v-if="userType == ADMIN || userType == MANAGEMENT" class="floating-button">
			<v-btn @click="openInputForm()" color="primary" dark fab>
				<v-icon>mdi-plus</v-icon>
			</v-btn>
		</div>
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import { required, email, minLength, numeric, alpha } from "vuelidate/lib/validators";
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import helpers from "../../components/helpers";

	export default {
		name: "CompanyEmployee",
		mixins: [defaultCRUDMixin],
		components: {},
		created() {
			// this.getCompanyEmployees();
			// this.setSearchConfig();
		},
		data: () => ({
			employeeList: [
				{
					_id: "5f9030204c38c0313714",
					name: "Sachin Tendulkar",
					designation: "SS",
					business_types: ["FIT", "MICE"],
					branch_name: "Mazgaon",
					zone: "EAST",
					address: "Dadar Mumbai",
					city: "Mumbai",
					state: "Maharashtra",
					pincode: "400008",
					phone_numbers: ["98291898212", "7693321300"],
					email_ids: ["eassa@tese.com", "fasda@fcsa.in"],
					dob: "2020-09-30T18:30:00.000Z",
					record: {
						created_on: "2020-10-21T10:52:50.445Z",
						updated_on: "2020-10-21T10:52:50.445Z",
						active: true,
					},
				},
			],
			search_text: "",
			name: "Travel Agent Employee",
			// keysToWatch: ["countries"],
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
					name: "Designation",
					type: "String",
					key: "designation",
					width: "half",
				},
				{
					name: "Business Type*",
					type: "Dropdown",
					key: "business_types",
					width: "half",
					multi: true,
					isListInStore: true,
					listVariable: "businessType",
					validations: {
						required,
					},
				},
				{
					name: "Branch Name*",
					type: "Dropdown",
					key: "branch_name",
					width: "half",
					multi: true,
					isListInStore: true,
					listVariable: "businessType",
					validations: {
						required,
					},
				},
				{
					name: "Email",
					type: "MultiInput",
					key: "email_ids",
					width: "full",
					validations: {
						$each: {
							input: {
								email,
							},
						},
					},
				},
				{
					name: "Contact Numbers*",
					type: "MultiInput",
					key: "phone_numbers",
					width: "half",
					validations: {
						required,
						minLength: minLength(1),
						$each: {
							input: {
								required,
								minLength: minLength(8),
							},
						},
					},
				},
				{
					name: "DOB*",
					type: "Date",
					key: "dob",
					width: "oneThird",
					validations: {
						required,
					},
				},
			],
			placeholder: "Search Travel Agent Employees",
		}),
		computed: {},
		methods: {
			...mapActions("ManageAgents", ["getCompanyEmployeeList", "addCompanyEmployee", "editCompanyEmployee"]),
			getCompanyEmployees() {
				this.openLoaderDialog();
				this.getCompanyEmployeeList({
					filter: this.filter,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.employeeList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;
				});
			},
			queryString(data) {
				this.filter["search_text"] = data;
				this.getCompanyEmployees();
			},
			advanceSearch(filterObject) {
				this.filter = { ...filterObject };
				this.pageNo = 1;
				this.getCompanyEmployees();
			},
			async formOutput(data) {
				var tempFile = data.logo;
				var formData = JSON.parse(JSON.stringify(data));
				// formData.email_ids = formData.email_ids.map((data) => data.input).filter((e) => e != "");
				// formData.logo = tempFile;
				// var tempArray = [];
				// var tempObj = {};

				// // loop over the emergency contacts objects to convert it into theh backend format
				// for (let contact of formData.emergency_contacts) {
				// 	tempObj = {};
				// 	for (let num of contact.input) {
				// 		if (num.input != "") {
				// 			tempObj["country"] = contact.groupKey;
				// 			if (!tempObj["contacts"]) tempObj["contacts"] = [];
				// 			tempObj["contacts"].push(num.input);
				// 		}
				// 	}
				// 	if (Object.keys(tempObj).length) {
				// 		tempArray.push(tempObj);
				// 	}
				// }
				// formData.emergency_contacts = tempArray;

				// // remove logo key if it's empty
				// if (formData.logo) {
				// 	formData.logo = await helpers.toBase64(formData.logo);
				// } else {
				// 	delete formData.logo;
				// }

				console.log("Before API call FormData Object", formData);

				this.openLoaderDialog();
				if (!this.isEditMode) {
					this.addCompanyEmployee(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Added Travel Agent Employee" });
							this.getCompanyEmployees();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
							this.getCompanyEmployees();
						}
					});
				} else {
					this.editCompanyEmployee(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Edited Travel Agent Employee" });
							this.getCompanyEmployees();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
							this.getCompanyEmployees();
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
			disableEmployee(data) {
				if (
					window.confirm(
						"Do you really want to " +
							(data.record.active
								? "Disable the Travel Agent Employee?"
								: "Enable the Travel Agent Employee?")
					)
				) {
					this.openLoaderDialog();
					this.editCompanyEmployee({
						_id: data._id,
						active: !data.record.active,
						updated_on: data.record.updated_on,
						disable: true,
					}).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Updated Travel Agent Employee Status" });
							this.getCompanyEmployees();
						} else {
							this.openSnackbar({ text: data.message });
							this.getCompanyEmployees();
						}
					});
				}
			},
			setSearchConfig() {
				this.selectedSearchConfig = [
					{
						name: "Partner Name",
						key: "name",
						type: "text",
						inputType: "textfield",
						defaultValue: "",
					},
					{
						name: "Business Type",
						key: "business_types",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: true,
						listVariable: "businessType",
					},
					{
						name: "Countries",
						key: "countries",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: true,
						listVariable: "countries",
					},
				];
			},
			updatedPageNo(page) {
				this.getCompanyEmployees();
			},
		},
	};
</script>

<style lang="scss" scopped>
	.companyEmployeeWrapper {
		padding: 20px 5px;
		height: 100%;
		// display: flex;
		// flex-direction: column;
	}
	.card-image img {
		max-width: 100%;
	}
	.companyemployee-search-bar {
		margin-top: 12px;
	}
</style>

<style lang="scss">
	.companyEmployeeWrapper .v-list-item__title,
	.v-list-item__subtitle {
		white-space: normal;
	}
</style>
