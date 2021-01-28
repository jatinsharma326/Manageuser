<template>
	<div class="famTripWrapper">
		<!-- <v-row class="famtrip-search-bar" justify="center" align="center">
			<v-col cols="12" sm="8" md="6"> -->
		<div class="famtrip-search-bar">
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
			<div v-for="trip in tripList" :key="trip._id" class="card-element">
				<InformationCard :expandCard="true">
					<template v-slot:topLeft>
						{{ getFormattedDate(trip.date_of_travel) }}
					</template>
					<template v-slot:topRight> {{ trip.no_of_days }} Days</template>
					<template v-slot:mainContent>
						{{ trip.country }}
					</template>
					<template v-slot:mainContentSubtitle>
						{{ trip.partner_name }}
					</template>
					<template v-slot:moreInfo>
						{{ trip.urls }}
					</template>
					<template v-slot:mainContentRight>
						<div class="big-grade">
							{{ trip.current_grade }}
						</div>
					</template>
					<template v-slot:actionButtons>
						<template>
							<v-btn @click="deleteEntry(trip)" color="error" text>
								Delete
							</v-btn>
							<v-btn @click="openInputForm(true, trip)" color="secondary" text>
								Edit
							</v-btn>
						</template>
					</template>
					<template v-slot:expandCardContent>
						<v-list>
							<v-list-item v-for="(employee, index) in trip.employee_names" :key="trip._id + '+' + index">
								<v-list-item-content>
									<v-list-item-title>{{ employee }}</v-list-item-title>
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

	export default {
		name: "FamTrip",
		mixins: [defaultCRUDMixin, inputFormMixin, searchMixin, helperMixin],
		components: {},
		async created() {
			this.getData();
			await this.getEmployees();
			await this.getCountryList();
			this.setInputConfig(this.employeeList, this.countriesList);
			// this.setSearchConfig();
		},
		data: () => ({
			name: "Fam Trip Log",
			placeholder: "Search Fam Trip",
			employeeList: [],
			countriesList: [],
			inputConfig: [],
			tripList: [
				// {
				// 	_id: "5f9030204c38c0313714",
				// 	dot: "2020-09-30T18:30:00.000Z",
				// 	no_of_days: "Sachin Tendulkar",
				// 	country: "SS",
				// 	passengers: ["Ali Pocketwala", "Rohan Dhamapurkar"],
				// 	representing_partner: "Allied T Pro",
				// 	admin_grade: "C",
				// 	record: {
				// 		created_on: "2020-10-21T10:52:50.445Z",
				// 		updated_on: "2020-10-21T10:52:50.445Z",
				// 		active: true,
				// 	},
				// },
			],
		}),
		computed: {
			...mapGetters("ManageAgents", ["storeEmployeesList"]),
		},
		methods: {
			...mapActions("ManageAgents", [
				"getFamTripList",
				"getCompanyEmployeeList",
				"addFamTrip",
				"editFamTrip",
				"deleteFamTrip",
			]),
			...mapActions("ManageTargets", ["getActiveCountries"]),
			getData() {
				this.openLoaderDialog();
				this.filter.company_id = this.companyInfo._id;
				this.getFamTripList({
					filter: this.filter,
					company_id: this.companyInfo._id,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.tripList = this.checkForErrorMessage(data, "trip");
					// this.tripList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;
				});
			},
			getEmployees() {
				return this.getCompanyEmployeeList({
					filter: {
						company_id: this.companyInfo._id,
						active: true,
					},
					active: true,
				}).then((data) => {
					this.employeeList = data.list;
				});
			},
			getCountryList() {
				return this.getActiveCountries().then((data) => {
					this.countriesList = data.list;
				});
			},
			setInputConfig(employeeList = [], countries = []) {
				this.inputConfig = [
					{
						name: "Country",
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
						name: "Travel Agents*",
						type: "DropdownWithMoreInfo",
						subtitleContent: (item) => {
							return item.designation + " - " + item.company_address_data.branch_name;
						},
						titleContent: (item) => {
							return item.name;
						},
						key: "travel_agent_ids",
						width: "full",
						multi: true,
						isListInStore: false,
						listItems: employeeList,
						itemText: "name",
						itemValue: "_id",
						validations: {
							required,
						},
					},
					{
						name: "Number of Days*",
						type: "String",
						key: "no_of_days",
						width: "half",
						validations: {
							required,
							minLength: minLength(1),
						},
					},
					{
						name: "Current Grade*",
						type: "String",
						key: "current_grade",
						width: "half",
						validations: {
							required,
							minLength: minLength(1),
						},
					},
					{
						name: "Date of Travel*",
						type: "Date",
						key: "date_of_travel",
						width: "half",
						validations: {
							required,
						},
					},
					{
						name: "URLs",
						type: "TextArea",
						key: "urls",
						width: "full",
					},
				];
				this.selectedSearchConfig = [
					{
						name: "Countries",
						key: "countries",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: countries,
					},
					{
						name: "Employee",
						key: "employee_names",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: employeeList,
						itemText: "name",
						itemValue: "name",
					},
					{
						name: "Date of Travel",
						key: "date_of_travel",
						inputType: "datePicker",
						defaultValue: null,
					},
				];
			},

			advanceSearch(filterObject) {
				this.filter = { ...filterObject };
				this.pageNo = 1;
				this.getData();
			},
			async formOutput(data) {
				var formData = JSON.parse(JSON.stringify(data));

				formData.company_id = this.companyInfo._id;
				formData.date_of_travel = helpers.getISODate(formData.date_of_travel);
				if (!formData.current_grade || formData.current_grade === null) {
					formData.current_grade = "-";
				}
				formData.no_of_days = Number(formData.no_of_days);

				this.openLoaderDialog();
				if (!this.isEditMode) {
					this.addFamTrip(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Added Fam Trip" });
							this.getData();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				} else {
					this.editFamTrip(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Edited Fam Trip" });
							this.getData();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
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
							(data.record.active ? "Disable the Fam Trip?" : "Enable the Fam Trip?")
					)
				) {
					this.openLoaderDialog();
					this.editFamTrip({
						_id: data._id,
						active: !data.record.active,
						updated_on: data.record.updated_on,
						status: data.record.active ? "disabled" : "enabled",
					}).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Updated Fam Trip Status" });
							this.getData();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				}
			},
			// setSearchConfig() {
			// 	this.selectedSearchConfig = [
			// 		{
			// 			name: "Partner Name",
			// 			key: "name",
			// 			type: "text",
			// 			inputType: "textfield",
			// 			defaultValue: "",
			// 		},
			// 		{
			// 			name: "Business Type",
			// 			key: "business_types",
			// 			multi: true,
			// 			inputType: "dropdown",
			// 			defaultValue: [],
			// 			isListInStore: true,
			// 			listVariable: "businessType",
			// 		},
			// 		{
			// 			name: "Countries",
			// 			key: "countries",
			// 			multi: true,
			// 			inputType: "dropdown",
			// 			defaultValue: [],
			// 			isListInStore: true,
			// 			listVariable: "countries",
			// 		},
			// 	];
			// },

			deleteEntry(entry) {
				if (window.confirm("Do you really want to Delete the Fam Trip Entry?")) {
					this.openLoaderDialog();
					this.deleteFamTrip({
						_id: entry._id,
					}).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Deleted the Entry" });
							this.getData();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				}
			},
		},
		watch: {
			companyInfo: {
				deep: true,
				async handler(nv, ov) {
					this.filter = {};
					this.tripList = [];
					this.pageNo = 1;
					this.getData();
					await this.getEmployees();
					await this.getCountryList();
					this.setInputConfig(this.employeeList, this.countriesList);
				},
			},
			storeEmployeesList: {
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
	.FamTripWrapper {
		padding: 20px 5px;
		height: 100%;
		// display: flex;
		// flex-direction: column;
	}
	.famtrip-search-bar {
		margin-top: 12px;
		display: flex;
		justify-content: center;
	}
</style>
