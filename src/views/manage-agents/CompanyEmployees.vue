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

		<div v-if="showErrorMessage" class="content-error-message">
			{{ errorMessage }}
		</div>

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
							<v-btn @click="disableEmployee(employee)" color="error" text>
								{{ employee.record.active ? "Disable" : "Enable" }}
							</v-btn>
							<v-btn @click="openInputForm(true, employee)" color="secondary" text>
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
									<v-list-item-title
										>DOB:
										{{
											employee.dob ? getFormattedDate(employee.dob) : "--/--/----"
										}}</v-list-item-title
									>
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</template>
				</InformationCard>
			</div>
		</div>

		<div v-if="isPaginationRequired" class="paginationWrapper text-center">
			<v-pagination
				@input="updatedPageNo"
				v-model="pageNo"
				:length="Math.ceil(fetchCount / pageSize)"
				:total-visible="paginationTotalVisible"
				class="pagination-component"
			></v-pagination>
			<div class="page-size-dropdown">
				<v-autocomplete v-model="pageSize" :items="pageSizeList" auto-select-first solo dense></v-autocomplete>
			</div>
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
			this.getData();
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
			activeState: true,
			employeeList: [],
			addressList: [],
			statesList: [],
			inputConfig: [],
		}),
		computed: {
			...mapGetters("ManageAgents", ["storeAddressList"]),
		},
		methods: {
			...mapActions("ManageAgents", [
				"getStatesList",
				"getAddressList",
				"checkEmployeeDetail",
				"getCompanyEmployeeList",
				"addCompanyEmployee",
				"editCompanyEmployee",
			]),
			...mapMutations("ManageAgents", ["setEmployeeList"]),
			getData(callMutation = false) {
				this.openLoaderDialog();
				this.filter.company_id = this.companyInfo._id;
				this.filter.active = this.activeState;
				this.getCompanyEmployeeList({
					filter: this.filter,
					company_id: this.companyInfo._id,
					active: this.activeState,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.employeeList = this.checkForErrorMessage(data, "employee");
					// this.employeeList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;
					if (callMutation) {
						this.setEmployeeList(this.employeeList);
					}
				});
			},
			getAddresses() {
				return this.getAddressList({
					filter: {
						company_id: this.companyInfo._id,
						active: true,
					},
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
						name: "Contact Numbers",
						type: "MultiInput",
						key: "phone_numbers",
						width: "half",
					},
					{
						name: "DOB",
						type: "Date",
						key: "dob",
						width: "oneThird",
					},
				];
			},

			advanceSearch(filterObject) {
				this.filter = { ...filterObject };
				if (this.filter.active) {
					this.activeState = false;
				} else {
					this.activeState = true;
				}
				this.pageNo = 1;
				this.getData();
			},
			async formOutput(data) {
				// formData.company_address_id = formData.branch_name;
				var formData = JSON.parse(JSON.stringify(data));
				formData.company_id = this.companyInfo._id;
				if (!formData.designation) formData.designation = "";
				if (formData.dob) formData.dob = helpers.getISODate(formData.dob);
				formData.company_id = this.companyInfo._id;
				formData.phone_numbers = data.phone_numbers.map((data) => data.input).filter((e) => e != "");
				formData.email_ids = data.email_ids.map((data) => data.input).filter((e) => e != "");

				this.openLoaderDialog();
				if (this.isEditMode) {
					this.editCompanyEmployee(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Edited Travel Agent Employee" });
							this.getData(true);
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				} else {
					// In the case of adding a travel agent employee
					if (formData.phone_numbers.length || formData.email_ids.length) {
						this.checkEmployeeDetail({
							company_id: formData.company_id,
							phone_numbers: formData.phone_numbers,
							email_ids: formData.email_ids,
						}).then((data) => {
							if (data.ok && data.data) {
								if (
									window.confirm(
										`Possible Duplicate Employee "${data.data.name}" (${data.data.designation}) already exists. Are you sure you want to continue.`
									)
								) {
									this.addCompanyEmployeeWrapper(formData);
								} else {
									this.closeLoaderDialog();
								}
							} else {
								this.addCompanyEmployeeWrapper(formData);
							}
						});
					} else {
						this.addCompanyEmployeeWrapper(formData);
					}
				}

				// this.openLoaderDialog();
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
							this.getData();
						} else {
							this.openSnackbar({ text: data.message });
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
					{
						name: "Show Disabled Users",
						key: "active",
						inputType: "switch",
						defaultValue: false,
					},
				];
			},

			addCompanyEmployeeWrapper(formData) {
				this.addCompanyEmployee(formData).then((data) => {
					this.closeLoaderDialog();
					if (data.ok) {
						this.openSnackbar({ text: "Sucessfully Added Travel Agent Employee" });
						this.getData(true);
						this.closeForm();
					} else {
						this.openSnackbar({ text: data.message });
					}
				});
			},
		},
		watch: {
			companyInfo: {
				deep: true,
				async handler(nv, ov) {
					this.filter = {};
					this.employeeList = [];
					this.pageNo = 1;
					this.getData();
					await this.getAddresses();
					this.setInputConfig(this.addressList);
					await this.getStates();
					this.setSearchConfig(this.statesList);
					// if (nv.countries) {
					// 	this.setSearchConfig(nv.countries);
					// 	this.setInputConfig(this.partnerInfo.countries);
					// }
				},
			},
			storeAddressList: {
				deep: true,
				handler(nv, ov) {
					this.setInputConfig(nv);
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
