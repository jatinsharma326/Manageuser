<template>
	<div class="companyEmployeeWrapper">
		<!-- <v-row class="companyemployee-search-bar" justify="center" align="center">
			<v-col cols="12" sm="8" md="6"> -->
		<div class="companyemployee-search-bar">
			<Search
				@queryString="queryString"
				@filterObject="advanceSearch"
				@clearFilter="advanceSearch"
				:placeholder="placeholder"
				:isAdvanceSearch="true"
				:filterConfig="selectedSearchConfig"
			></Search>
		</div>
		<!-- </v-col>
		</v-row> -->

		<div class="card-wrapper">
			<div v-for="employee in employeeList" :key="employee._id" class="card-element">
				<InformationCard :expandCard="true" :isCardDisabled="!employee.record.active">
					<template v-slot:topLeft>
						<!-- {{ employee.business_types }} -->
						{{ employee.business_types.join(", ") }}
					</template>
					<template v-slot:topRight>
						{{ employee.company_address_data.zone }}
					</template>
					<template v-slot:mainContent>
						{{ employee.name }}
					</template>
					<template v-slot:mainContentSubtitle>
						{{ employee.designation }} - {{ employee.company_address_data.branch_name }}
					</template>
					<template v-slot:actionButtons>
						<template>
							<v-btn @click="openChangelogsModal(employee)" icon color="secondary" text
								><v-icon>mdi-information-outline</v-icon></v-btn
							>
							<!-- v-if="userType == ADMIN || userType == MANAGEMENT" -->
							<v-btn @click="disableEmployee(employee)" color="error" text>
								{{ employee.record.active ? "Disable" : "Enable" }}
							</v-btn>
							<v-btn
								v-if="employee.record.active"
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
								v-for="(contact, index) in employee.phone_numbers"
								:key="employee._id + '+' + index"
							>
								<v-list-item-icon>
									<v-icon color="secondary">
										mdi-phone
									</v-icon>
								</v-list-item-icon>

								<v-list-item-content>
									<v-list-item-title>{{ contact }}</v-list-item-title>
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
										>{{ employee.company_address_data.address }}
										{{ employee.company_address_data.state }}
										{{ employee.company_address_data.city }}
										{{ employee.company_address_data.pincode }}</v-list-item-title
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
				v-if="isPaginationRequired"
				v-model="pageNo"
				:length="Math.ceil(fetchCount / pageSize)"
			></v-pagination>
		</div>

		<ChangeLogModal
			@closeModal="toggleChangelogModal = false"
			:toggleChangelogModal="toggleChangelogModal"
			:selectedInfo="selectedCardInfo"
		></ChangeLogModal>

		<UserForm
			@formOutput="formOutput"
			@closeForm="closeForm"
			:name="name"
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
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import helperMixin from "../../mixins/helperMixins";
	import inputFormMixin from "../../mixins/inputFormMixin";
	import searchMixin from "../../mixins/searchMixin";
	import { required, email, minLength, numeric, alpha } from "vuelidate/lib/validators";
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import helpers from "../../components/helpers";
	import ChangeLogModal from "../../components/ChangeLog";

	export default {
		name: "CompanyEmployee",
		mixins: [defaultCRUDMixin, inputFormMixin, searchMixin, helperMixin],
		components: { ChangeLogModal },
		async created() {
			this.getCompanyEmployees();
			await this.getAddresses();
			this.setInputConfig(this.addressList);
			await this.getStates();
			this.setSearchConfig(this.statesList);
		},
		data: () => ({
			name: "Travel Agent Employee",
			placeholder: "Search Travel Agent Employees",
			dataCalled: false,
			toggleChangelogModal: false,
			selectedCardInfo: {},
			employeeList: [
				// {
				// 	_id: "5f9030204c38c0313714",
				// 	name: "Sachin Tendulkar",
				// 	designation: "SS",
				// 	business_types: ["FIT", "MICE"],
				// 	branch_name: "Mazgaon",
				// 	zone: "EAST",
				// 	address: "Dadar Mumbai",
				// 	city: "Mumbai",
				// 	state: "Maharashtra",
				// 	pincode: "400008",
				// 	phone_numbers: ["98291898212", "7693321300"],
				// 	email_ids: ["eassa@tese.com", "fasda@fcsa.in"],
				// 	dob: "2020-09-30T18:30:00.000Z",
				// 	record: {
				// 		created_on: "2020-10-21T10:52:50.445Z",
				// 		updated_on: "2020-10-21T10:52:50.445Z",
				// 		active: true,
				// 	},
				// },
			],
			addressList: [],
			statesList: [],
			inputConfig: [],
		}),
		computed: {},
		methods: {
			...mapActions("ManageAgents", [
				"getStatesList",
				"getAddressList",
				"getCompanyEmployeeList",
				"addCompanyEmployee",
				"editCompanyEmployee",
			]),
			getCompanyEmployees() {
				this.openLoaderDialog();
				this.filter.company_id = this.companyInfo._id;
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
			getAddresses() {
				return this.getAddressList({
					filter: {},
				}).then((data) => {
					this.addressList = data.list;
				});
			},
			getStates() {
				return this.getStatesList({
					filter: {},
				}).then((data) => {
					this.statesList = data.list;
				});
			},
			openChangelogsModal(info) {
				this.selectedCardInfo = { ...info };
				this.toggleChangelogModal = true;
			},
			setInputConfig(addressList = []) {
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
						type: "DropdownWithMoreInfo",
						subtitleContent: (item) => {
							return item.address + " " + item.state + " " + item.city + " " + item.pincode;
						},
						titleContent: (item) => {
							return item.branch_name;
						},
						key: "company_address_id",
						width: "half",
						multi: false,
						isListInStore: false,
						listItems: addressList,
						itemText: "branch_name",
						itemValue: "_id",
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
				];
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
				// formData.company_address_id = formData.branch_name;
				var formData = JSON.parse(JSON.stringify(data));

				formData.company_id = this.companyInfo._id;
				formData.dob = helpers.getISODate(formData.dob);
				formData.company_id = this.companyInfo._id;
				formData.phone_numbers = data.phone_numbers.map((data) => data.input);
				formData.email_ids = data.email_ids.map((data) => data.input);

				console.log("Test Console Before API call FormData Object", formData);

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
						status: data.record.active ? "disabled" : "enabled",
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
			setSearchConfig(statesList = []) {
				this.selectedSearchConfig = [
					{
						name: "Employee Name",
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
						name: "Zone",
						key: "zones",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: true,
						listVariable: "zone",
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
				];
			},
			updatedPageNo(page) {
				this.getCompanyEmployees();
			},
		},
		watch: {
			companyInfo: {
				deep: true,
				handler(nv, ov) {
					this.filter = {};
					this.employeeList = [];
					this.pageNo = 1;
					console.log("Company Info changed");
					this.getCompanyEmployees();
					// if (nv.countries) {
					// 	this.setSearchConfig(nv.countries);
					// 	this.setInputConfig(this.partnerInfo.countries);
					// }
				},
			},
		},
		props: {
			companyInfo: { required: true, type: Object },
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
		display: flex;
		justify-content: center;
	}
</style>

<style lang="scss">
	.companyEmployeeWrapper .v-list-item__title,
	.v-list-item__subtitle {
		white-space: normal;
	}
</style>
