<template>
	<div class="reportListWrapper daily-sales-report">
		<div class="SearchbarWrapper">
			<div class="searchbar">
				<Search
					@queryString="queryString"
					@filterObject="advanceSearch"
					@clearFilter="advanceSearch"
					:placeholder="placeholder"
					:isAdvanceSearch="true"
					:filterConfig="searchConfig"
				></Search>
			</div>
			<div class="datepicker">
				<v-dialog
					ref="dialog"
					v-model="dateDialog"
					:return-value.sync="datePickerDate"
					persistent
					width="290px"
				>
					<template v-slot:activator="{ on, attrs }">
						<v-text-field
							v-model="dateRangeText"
							label="Date Range"
							readonly
							outlined
							@click="dataSelector"
							v-bind="attrs"
							v-on="on"
						></v-text-field>
					</template>
					<v-date-picker range v-model="datePickerDate" scrollable>
						<v-spacer></v-spacer>
						<v-btn text color="primary" @click="resetDatePicker">
							Reset
						</v-btn>
						<v-btn text color="primary" @click="cancelDatePicker">
							Cancel
						</v-btn>
						<v-btn text color="primary" @click="submitDatePicker">
							OK
						</v-btn>
					</v-date-picker>
				</v-dialog>
			</div>
		</div>
		<div v-if="totalCount === 0" class="content-error-message">
			Please add a Followup Entry
		</div>
		<div v-else class="info-table">
			<v-data-table
				:items-per-page="pageSize"
				hide-default-footer
				:headers="headers"
				:expanded.sync="expanded"
				show-expand
				item-key="_id"
				:items="followUpList"
				:fixed-header="true"
			>
				<template v-slot:[`item.date_of_enquiry`]="{ item }">
					{{ item.date_of_enquiry ? getFormattedDate(item.date_of_enquiry, "MMMM Do YYYY dddd") : "-" }}
				</template>
				<template v-slot:[`item.company_data.defaulter`]="{ item }">
					<template v-if="item && item.company_data && item.company_data.defaulter">
						<v-chip small color="error">Yes</v-chip>
					</template>
					<template v-else>
						-
					</template>
				</template>
				<template v-slot:[`item.contact_number`]="{ item }">
					{{ item.contact_number ? item.contact_number : "-" }}
				</template>
				<template v-slot:[`item.date_of_travel`]="{ item }">
					{{ item.date_of_travel ? getFormattedDate(item.date_of_travel, "MMMM Do YYYY dddd") : "-" }}
				</template>
				<template v-slot:[`item.reminder_date`]="{ item }">
					{{ item.reminder_date ? getFormattedDate(item.reminder_date, "MMMM Do YYYY dddd") : "-" }}
				</template>
				<template v-slot:[`item.status`]="{ item, header }">
					<template v-if="header.text == 'FS Indicator'">
						<v-chip v-if="item.status == 'POTENTIAL'" x-small color="#FFA500" class="white--text">{{
							item.status
						}}</v-chip>
						<v-chip v-else-if="item.status == 'BOOKING ON HOLD'" x-small color="#32CD32">{{
							item.status
						}}</v-chip>
						<v-chip v-else-if="item.status == 'CONFIRMED'" x-small color="#008000" class="white--text">{{
							item.status
						}}</v-chip>
						<v-chip v-else-if="item.status == 'FILE LOST'" x-small color="#800000" class="white--text">{{
							item.status
						}}</v-chip>
						<v-chip v-else-if="item.status == 'DORMANT'" x-small color="#800080" class="white--text">{{
							item.status
						}}</v-chip>
						<v-chip v-else-if="item.status == 'CANCELLED'" x-small color="#4B0082" class="white--text">{{
							item.status
						}}</v-chip>
						<v-chip v-else x-small color="#C0C0C0">{{ item.status }}</v-chip>
					</template>
					<template v-else>
						{{ item.status }}
					</template>
				</template>
				<template v-slot:[`item.payment_status`]="{ item }">
					{{ item.payment_status ? item.payment_status : "-" }}
				</template>
				<template v-slot:[`item.invoice_no`]="{ item }">
					{{ item.invoice_no ? item.invoice_no : "-" }}
				</template>
				<template v-slot:[`item.payment_type`]="{ item }">
					{{ item.payment_type ? item.payment_type : "-" }}
				</template>
				<template v-slot:[`item.currency_type`]="{ item }">
					{{ item.currency_type ? item.currency_type : "-" }}
				</template>
				<template v-slot:[`item.amount_pending`]="{ item }">
					{{ item.amount_pending ? item.amount_pending : "-" }}
				</template>
				<template v-slot:[`item.amount_received`]="{ item }">
					{{ item.amount_received ? item.amount_received : "-" }}
				</template>
				<template v-slot:[`item.record.updated_on`]="{ item }">
					{{ item.record.updated_on ? getFormattedDate(item.record.updated_on, "MMMM Do YYYY dddd") : "-" }}
				</template>
				<template v-slot:expanded-item="{ headers, item }">
					<td class="expandable-section table-expanded-background " :colspan="headers.length">
						<div class="expandable-section-title">Remark</div>
						<div v-if="item.remark" class="expandable-section-content" v-html="item.remark"></div>
						<div v-else class="expandable-section-content">No Remarks yet for this followup</div>
					</td>
				</template>
				<template v-slot:[`item.actions`]="{ item }">
					<template v-if="isSalesTeamMember">
						<v-menu bottom left>
							<template v-slot:activator="{ on, attrs }">
								<v-btn icon v-bind="attrs" v-on="on">
									<v-icon>mdi-dots-vertical</v-icon>
								</v-btn>
							</template>
							<v-list>
								<v-list-item @click="openInputForm(true, item)">EDIT</v-list-item>
								<v-list-item v-if="isOnlySalesAgent" @click="deleteEntry(item)">DELETE</v-list-item>
							</v-list>
						</v-menu>
					</template>
				</template>
			</v-data-table>
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
		<template v-if="isSalesTeamMember">
			<UserForm
				@formOutput="formOutput"
				@closeForm="closeForm"
				:name="name"
				:inputConfig="inputConfig"
				:keysToWatch="keysToWatch"
				:toggleForm="toggleForm"
				:formData="rowToEdit"
				:isEditMode="isEditMode"
			></UserForm>
			<div class="floating-button">
				<v-speed-dial v-model="fab" direction="top" :open-on-hover="hover" transition="scale-transition">
					<template v-slot:activator>
						<v-btn v-model="fab" color="primary" dark fab>
							<v-icon v-if="fab">
								mdi-arrow-down-drop-circle
							</v-icon>
							<v-icon v-else>
								mdi-arrow-up-drop-circle
							</v-icon>
						</v-btn>
					</template>
					<v-tooltip left>
						<template v-slot:activator="{ on, attrs }">
							<v-btn @click="openInputForm()" color="secondary" dark small fab v-bind="attrs" v-on="on">
								<v-icon>mdi-plus</v-icon>
							</v-btn>
						</template>
						<span>Add Follow Up Entry</span>
					</v-tooltip>
					<v-tooltip v-if="!checkDownloadButtonStatus" left>
						<template v-slot:activator="{ on, attrs }">
							<v-btn fab dark small color="tertiary" @click="downloadReport()" v-bind="attrs" v-on="on">
								<v-icon>mdi-download</v-icon>
							</v-btn>
						</template>
						<span>Download Followup Report</span>
					</v-tooltip>
				</v-speed-dial>
			</div>
		</template>
		<template v-else>
			<div class="floating-button">
				<v-btn @click="downloadReport()" color="primary" dark fab>
					<v-icon>mdi-download</v-icon>
				</v-btn>
			</div>
		</template>
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import helperMixin from "../../mixins/helperMixins";
	import inputFormMixin from "../../mixins/inputFormMixin";
	import searchMixin from "../../mixins/searchMixin";
	import datePickerMixin from "../../mixins/datePickerMixin";
	import commonAPICallsMixin from "../../mixins/commonAPICallsMixin";

	import { required, email, minLength, numeric, alpha } from "vuelidate/lib/validators";
	import helpers from "../../components/helpers";
	import moment from "moment-timezone";
	import { mapActions, mapGetters, mapMutations } from "vuex";

	export default {
		name: "FollowUp",
		mixins: [defaultCRUDMixin, inputFormMixin, helperMixin, searchMixin, datePickerMixin, commonAPICallsMixin],
		async created() {
			this.setDateRange();
			// this.setHeader();
			this.getData();
			this.openLoaderDialog();
			let promiseArray = [];
			if (this.isAdminOrManagement) {
				await this.getUsers();
			}
			await this.getCountries();
			//get companies is defined in commonAPIMixins which gets companiesList and modifiedCompanyList
			promiseArray.push(this.getCompanies());
			promiseArray.push(this.getCities());
			promiseArray.push(this.getActiveCurrenciesList());
			await Promise.all(promiseArray);
			this.closeLoaderDialog();
			this.setConfig(
				this.userList,
				this.companyList,
				// this.modifiedCompanyIdsList,
				this.countriesList,
				this.activeCurrencyList,
				this.citiesList
			);
		},
		data: () => ({
			name: "Followup Entry",
			placeholder: "Search Followup Entry",
			searchConfig: [],
			inputConfig: [],
			citiesList: [],
			followUpList: [],
			fab: false,
			hover: true,
			headers: [
				{ text: "", value: "actions", width: 68 },
				{ text: "", value: "data-table-expand" },
				{ text: "Sr. No.", align: "start", value: "serial_number", width: 70 },
				{ text: "File Status", value: "status", width: 150 },
				{ text: "Company Name", value: "company_data.name", width: 200, class: "sticky-header" },
				{ text: "Product", value: "country", width: 150 },
				{ text: "Created By", value: "mortal_data.name", width: 150 },
				{ text: "Date of Enquiry", value: "date_of_enquiry", width: 200 },
				{ text: "Defaulter", value: "company_data.defaulter", width: 200 },
				{ text: "City", value: "city", width: 150 },
				{ text: "Zone", value: "zone", width: 150 },
				{ text: "Name of Contact", value: "contact_person", width: 200 },
				{ text: "Contact No.", value: "contact_number", width: 150 },
				{ text: "Date of Travel", value: "date_of_travel", width: 150 },
				{ text: "Adult Pax", value: "number_of_pax_adult", width: 150 },
				{ text: "No. of Nights", value: "no_of_nights", width: 150 },
				{ text: "Child Pax", value: "number_of_pax_child", width: 150 },
				{ text: "Inquiry Type", value: "business_types", width: 150 },
				{ text: "Email Subject", value: "email_subject", width: 150 },
				// { text: "File Status", value: "status", width: 150 },
				{ text: "Competitor Name", value: "competitor_name", width: 200 },
				{ text: "Follow Up", value: "reminder_date", width: 150 },
				{ text: "Payment Status", value: "payment_status", width: 180 },
				{ text: "Invoice No.", value: "invoice_no", width: 150 },
				{ text: "Payment Type", value: "payment_type", width: 150 },
				{ text: "Currency", value: "currency_type", width: 150 },
				{ text: "Pending (Amount)", value: "amount_pending", width: 200 },
				{ text: "Received (Amount)", value: "amount_received", width: 200 },
				{ text: "Last Updated On", value: "record.updated_on", width: 200 },
			],
			expanded: [],
			keysToWatch: ["status", "payment_status", "company_id", "employee_id"],
		}),
		computed: {
			...mapGetters(["userData"]),
			dateRangeText() {
				return this.datePickerDate.join(" ~ ");
			},
			checkDownloadButtonStatus() {
				if (this.fetchCount == 0) {
					return true;
				}
				return false;
			},
		},
		methods: {
			...mapActions("FollowUp", [
				"getActiveCurrencies",
				"getCitiesList",
				"getFollowUp",
				"addFollowUp",
				"editFollowUp",
				"deleteFollowUp",
			]),
			...mapActions("Reports", ["downloadYearlyRawReport"]),
			...mapActions("ManageAgents", [
				"getAgentCitiesList",
				"getCompanyEmployeeList",
				"getAgentEmployeeInformation",
			]),
			// setHeader() {
			// 	if (!this.isAdminOrManagement) {
			// 		this.headers.push({ text: "", value: "actions" });
			// 	}
			// },

			setDateRange() {
				let tempArray = [];
				let startDate = moment()
					.tz("Asia/Kolkata")
					.startOf("year")
					.format("YYYY-MM-DD");
				let endDate = moment()
					.tz("Asia/Kolkata")
					// .add(3, "month")
					.endOf("year")
					.format("YYYY-MM-DD");
				tempArray.push(startDate);
				tempArray.push(endDate);
				this.datePickerDate = tempArray;
			},

			getCountries() {
				if (this.userType == this.SALES_AGENT) {
					this.countriesList = [...this.userData.usr_data.countries];
				} else {
					return this.getCountryList();
				}
			},

			getCities() {
				return this.getCitiesList({
					filter: {},
				}).then((data) => {
					this.citiesList = data.list;
				});
			},

			getData() {
				this.openLoaderDialog();
				this.filter.date_from = moment(this.datePickerDate[0])
					.tz("Asia/Kolkata")
					.startOf()
					.toISOString();
				if (this.datePickerDate[1]) {
					this.filter.date_to = moment(this.datePickerDate[1])
						.tz("Asia/Kolkata")
						.endOf()
						.toISOString();
				} else {
					this.filter.date_to = this.filter.date_from;
				}

				this.getFollowUp({
					filter: this.filter,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.followUpList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;

					if (this.followUpList.length) {
						this.followUpList = this.followUpList.map((d, index) => ({
							...d,
							serial_number: (this.pageNo - 1) * this.pageSize + (index + 1),
						}));
					}
				});
			},

			setConfig(
				userList = [],
				companyList = [],
				// modifiedCompanyIdsList = [],
				countriesList = [],
				activeCurrencyList = [],
				citiesList = []
			) {
				this.searchConfig = [
					{
						name: "Product",
						key: "countries",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: countriesList,
						classes: ["half"],
					},
					{
						name: "Date of Enquiry",
						key: "date_of_enquiry",
						inputType: "datePicker",
						defaultValue: null,
						classes: ["half"],
					},
					{
						name: "Follow Up Date",
						key: "reminder_date",
						inputType: "datePicker",
						defaultValue: null,
						classes: ["half"],
					},
					{
						name: "City",
						key: "cities",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: citiesList,
						classes: ["half"],
					},
					{
						name: "Name of Contact",
						key: "contact_person",
						type: "text",
						inputType: "textfield",
						defaultValue: "",
						classes: ["half"],
					},
					{
						name: "Company",
						key: "company_names",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: companyList,
						itemText: "name",
						itemValue: "name",
						classes: ["half"],
					},
					{
						name: "Inquiry Type",
						key: "business_types",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: true,
						listVariable: "businessType",
						classes: ["half"],
					},
					{
						name: "File Status",
						key: "statuses",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: [
							"NEW ENQUIRY",
							"QUOTED",
							"REQUOTE",
							"BOOKING ON HOLD",
							"CONFIRMED",
							"FILE LOST",
							"DORMANT",
							"CANCELLED",
						],
						classes: ["half"],
					},
					{
						name: "Payment Status",
						key: "payment_statuses",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: ["PENDING", "RECEIVED", "REFUND"],
						classes: ["half"],
					},
					{
						name: "Payment Type",
						key: "payment_types",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: [
							"NONE",
							"ADVANCE RECEIVED",
							"INR FOR CONFIRMATION",
							"FULL PAYMENT",
							"CREDIT NOTE",
							"EMAIL CONFIRMATION",
						],
						classes: ["half"],
					},
					{
						name: "Currency",
						key: "currency_types",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: activeCurrencyList,
						classes: ["full"],
					},
				];

				this.inputConfig = [
					{
						name: "Product*",
						type: "Dropdown",
						key: "country",
						width: "half",
						multi: false,
						isListInStore: false,
						listItems: countriesList,
						validations: {
							required,
						},
					},
					{
						name: "Company*",
						type: "Dropdown",
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
						name: "City*",
						type: "AsyncDropdownWithMoreInfo",
						triggerKey: "company_id",
						subtitleContent: (item) => {
							return "";
						},
						titleContent: (item) => {
							return item.value;
						},
						apiCall: (company_id) => {
							// console.log("call_id", company_id);
							// let call = this.callsList.find((e) => e._id == call_id);
							return this.getAgentCitiesList({
								// filter: {
								company_id,
								// active: true,
								// },
								// active: true,
							}).then((data) => {
								return data.list;
							});
						},
						key: "city",
						width: "half",
						itemText: "text",
						itemValue: "value",
						validations: {
							required,
						},
					},
					// {
					// 	name: "City*",
					// 	type: "Dropdown",
					// 	key: "city",
					// 	width: "half",
					// 	multi: false,
					// 	isListInStore: false,
					// 	listItems: citiesList,
					// 	validations: {
					// 		required,
					// 	},
					// },
					{
						name: "Name of Contact*",
						type: "AsyncDropdownWithMoreInfo",
						triggerKey: "company_id",
						subtitleContent: (item) => {
							return item.designation + " - " + item.company_address_data.branch_name;
						},
						titleContent: (item) => {
							return item.name;
						},
						apiCall: (company_id) => {
							// let call = this.callsList.find((e) => e._id == call_id);
							return this.getCompanyEmployeeList({
								filter: {
									company_id,
									active: true,
								},
								active: true,
							}).then((data) => {
								return data.list;
							});
						},
						key: "employee_id",
						width: "full",
						itemText: "name",
						itemValue: "_id",
						validations: {
							required,
						},
					},
					// {
					// 	name: "Name of Contact*",
					// 	type: "String",
					// 	key: "contact_person",
					// 	width: "half",
					// 	validations: {
					// 		required,
					// 		minLength: minLength(1),
					// 	},
					// },
					{
						name: "Contact No.",
						type: "AsyncDropdownWithMoreInfo",
						triggerKey: "employee_id",
						subtitleContent: (item) => {
							return "";
						},
						titleContent: (item) => {
							return item.value;
						},
						apiCall: (employee_id) => {
							// let call = this.callsList.find((e) => e._id == call_id);
							return this.getAgentEmployeeInformation({
								// filter: {
								_id: employee_id,
								// active: true,
								// },
								// active: true,
							}).then((data) => {
								return data.list;
							});
						},
						key: "contact_number",
						width: "full",
						itemText: "text",
						itemValue: "value",
					},
					// {
					// 	name: "Contact No.",
					// 	type: "String",
					// 	key: "contact_number",
					// 	width: "half",
					// },
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
						name: "Adult Pax no.",
						type: "Number",
						key: "number_of_pax_adult",
						width: "half",
					},
					{
						name: "Child Pax no.",
						type: "Number",
						key: "number_of_pax_child",
						width: "half",
					},
					{
						name: "No. of Nights",
						type: "Number",
						key: "no_of_nights",
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
						name: "Email Subject*",
						type: "TextArea",
						key: "email_subject",
						width: "full",
						validations: {
							required,
							minLength: minLength(2),
						},
					},
					{
						name: "Status*",
						type: "Dropdown",
						key: "status",
						width: "half",
						multi: false,
						// triggerKey: "status",
						isListInStore: false,
						listItems: [
							"NEW ENQUIRY",
							"QUOTED",
							"REQUOTE",
							"BOOKING ON HOLD",
							"CONFIRMED",
							"FILE LOST",
							"DORMANT",
							"CANCELLED",
						],
						validations: {
							required,
						},
					},
					{
						name: "Competitor Name",
						type: "String",
						key: "competitor_name",
						width: "half",
						disableTriggerKey: "status",
						disableCheck: (data) => {
							if (data == "FILE LOST") {
								return false;
							} else {
								return true;
							}
						},
					},
					{
						name: "Follow up Date",
						type: "Date",
						key: "reminder_date",
						width: "half",
					},
					{
						name: "Any Remarks",
						type: "TextArea",
						key: "remark",
						width: "full",
					},
					{
						name: "Payment Status",
						type: "Dropdown",
						key: "payment_status",
						width: "half",
						multi: false,
						isListInStore: false,
						listItems: ["PENDING", "RECEIVED", "REFUND"],
						disableTriggerKey: "status",
						disableCheck: (data) => {
							return this.checkDisableCondition(data);
						},
					},
					{
						name: "Invoice Number",
						type: "String",
						key: "invoice_no",
						width: "half",
						disableTriggerKey: "status",
						disableCheck: (data) => this.checkDisableCondition(data),
					},
					{
						name: "Payment Type",
						type: "AsyncDropdownWithMoreInfo",
						key: "payment_type",
						width: "half",
						subtitleContent: (item) => {
							return "";
						},
						titleContent: (item) => {
							return item;
						},
						triggerKey: "payment_status",
						apiCall: (selection) => {
							let subSelection = [];
							let promise = new Promise(function(resolve, reject) {
								if (selection == "RECEIVED") {
									subSelection.push("ADVANCE RECEIVED", "INR FOR CONFIRMATION", "FULL PAYMENT");
								} else if (selection == "REFUND") {
									subSelection.push("NONE", "CREDIT NOTE", "EMAIL CONFIRMATION");
								}
								resolve(subSelection);
							});
							return promise;
						},
						disableTriggerKey: "status",
						disableCheck: (data) => {
							return this.checkDisableCondition(data);
						},
					},
					{
						name: "Currency",
						type: "Dropdown",
						key: "currency_type",
						width: "full",
						multi: false,
						isListInStore: false,
						listItems: activeCurrencyList,
						disableTriggerKey: "status",
						disableCheck: (data) => {
							return this.checkDisableCondition(data);
						},
					},
					{
						name: "Amount Pending",
						type: "Number",
						key: "amount_pending",
						width: "half",
						disableTriggerKey: "status",
						disableCheck: (data) => {
							return this.checkDisableCondition(data);
						},
					},
					{
						name: "Amount Received",
						type: "Number",
						key: "amount_received",
						width: "half",
						disableTriggerKey: "status",
						disableCheck: (data) => {
							return this.checkDisableCondition(data);
						},
					},
				];

				if (this.isAdminOrManagement || this.isOnlySalesAgent) {
					this.searchConfig.push({
						name: "Zone",
						key: "zones",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: true,
						listVariable: "zone",
						classes: ["half"],
					});
				}
				if (this.isAdminOrManagement) {
					this.searchConfig.unshift({
						name: "Created By",
						key: "names",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: userList,
						classes: ["half"],
					});
				}
				if (this.isOnlySalesAgent) {
					this.inputConfig.unshift({
						name: "Zone*",
						type: "Dropdown",
						key: "zone",
						width: "half",
						multi: false,
						isListInStore: true,
						listVariable: "zone",
						validations: {
							required,
						},
					});
				}
			},

			advanceSearch(filterObject) {
				var filterData = JSON.parse(JSON.stringify(filterObject));
				if (filterData.date_of_call) {
					filterData.date_of_call = helpers.getISODate(filterData.date_of_call);
				}

				this.filter = { ...filterData };
				this.pageNo = 1;
				this.getData();
			},

			async formOutput(data) {
				var formData = JSON.parse(JSON.stringify(data));

				if (this.isOnlyRemoteAgent) {
					formData.zone = this.userData.usr_data.zone;
				}

				if (!formData.amount_pending) {
					formData.amount_pending = 0;
				} else {
					formData.amount_pending = Number(formData.amount_pending);
				}
				if (!formData.amount_received) {
					formData.amount_received = 0;
				} else {
					formData.amount_received = Number(formData.amount_received);
				}
				if (!formData.no_of_nights || formData.no_of_nights < 0) {
					formData.no_of_nights = 0;
				} else {
					formData.no_of_nights = Number(formData.no_of_nights);
				}
				if (!formData.number_of_pax_adult || formData.number_of_pax_adult < 0) {
					formData.number_of_pax_adult = 0;
				} else {
					formData.number_of_pax_adult = Number(formData.number_of_pax_adult);
				}
				if (!formData.number_of_pax_child || formData.number_of_pax_child < 0) {
					formData.number_of_pax_child = 0;
				} else {
					formData.number_of_pax_child = Number(formData.number_of_pax_child);
				}

				if (!formData.contact_number) formData.contact_number = "";
				if (!formData.invoice_no) formData.invoice_no = "";
				if (!formData.remark) formData.remark = "";
				if (!formData.competitor_name) formData.competitor_name = "";

				if (formData.reminder_date) {
					formData.reminder_date = helpers.getISODate(formData.reminder_date);
				}

				if (formData.currency_type == "") formData.currency_type = null;
				if (formData.payment_type == "" || formData.payment_status === "PENDING") {
					console.log(formData.payment_type, "Came Here ");
					formData.payment_type = null;
				}

				if (
					formData.payment_status == "RECEIVED" &&
					!(
						formData.payment_type == "ADVANCE RECEIVED" ||
						formData.payment_type == "INR FOR CONFIRMATION" ||
						formData.payment_type == "FULL PAYMENT"
					)
				) {
					formData.payment_type = null;
				}
				if (
					formData.payment_status == "REFUND" &&
					!(
						formData.payment_type == "NONE" ||
						formData.payment_type == "CREDIT NOTE" ||
						formData.payment_type == "EMAIL CONFIRMATION"
					)
				) {
					formData.payment_type = null;
				}
				if (formData.payment_status == "") formData.payment_status = null;

				// if (formData.payment_status === "PENDING") formData.payment_type == null;

				formData.date_of_travel = helpers.getISODate(formData.date_of_travel);
				formData.month_of_travel = Number(this.getFormattedDate(formData.date_of_travel, "MM"));

				this.openLoaderDialog();
				if (!this.isEditMode) {
					this.addFollowUp(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Added FollowUp Entry" });
							this.closeForm();
							this.getData();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				} else {
					this.editFollowUp(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Edited FollowUp Entry" });
							this.closeForm();
							this.getData();
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

			deleteEntry(call) {
				if (window.confirm("Do you really want to Delete the FollowUp?")) {
					this.openLoaderDialog();
					this.deleteFollowUp({
						_id: call._id,
					}).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Deleted the FollowUp" });
							this.getData();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				}
			},

			checkDisableCondition(value) {
				if (value == "CONFIRMED") {
					return false;
				} else {
					return true;
				}
			},

			downloadReport() {
				let dateSelection = JSON.parse(JSON.stringify(this.datePickerDate));
				dateSelection.sort();
				this.filter.date_from = moment(dateSelection[0])
					.tz("Asia/Kolkata")
					.startOf("month")
					.toISOString();
				this.filter.date_to = moment(dateSelection[1])
					.tz("Asia/Kolkata")
					.endOf("month")
					.toISOString();

				this.openLoaderDialog();
				this.downloadYearlyRawReport({
					filter: this.filter,
					fileName: "Follow Up Report.xlsx",
				}).then(() => {
					this.closeLoaderDialog();
				});
			},

			// getFileStatus(item, header) {
			// 	if(header.text = "FS Indicator") {

			// 	} else {

			// 	}
			// }
		},
		watch: {},
		props: {},
	};
</script>
<style lang="scss">
	.manageFollowUpWrapper {
		height: 100%;
		.tabItemWrapper {
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
	}
	.datepicker {
		.v-input__slot {
			margin-bottom: 0;
		}
		.v-text-field__details {
			display: none;
		}
	}
</style>
<style lang="scss" scoped>
	.SearchbarWrapper {
		.searchWrapper {
			flex-shrink: 0;
		}
	}
	.reportListWrapper {
		// .info-table {
		// 	table > tbody > tr > td:nth-child(3),
		// 	table > thead > tr > th:nth-child(3) {
		// 		position: sticky !important;
		// 		position: -webkit-sticky !important;
		// 		left: 0;
		// 		z-index: 2;
		// 		background: #f8f8f8;
		// 	}
		// 	table > thead > tr > th:nth-child(3) {
		// 		z-index: 3 !important;

		// 		// &.sticky-header {
		// 		//     background-color: #f8f8f8 !important;
		// 		// }
		// 	}
		// }
		.expandable-section {
			padding: 1em !important;
			.expandable-section-title {
				font-size: 16px;
				font-weight: 600;
			}
			.expandable-section-content {
				white-space: pre-wrap;
			}
		}
	}
</style>

<style lang="scss">
	.reportListWrapper.daily-sales-report {
		.info-table {
			table > tbody > tr > td:nth-child(-n + 5),
			table > thead > tr > th:nth-child(-n + 5) {
				position: sticky !important;
				position: -webkit-sticky !important;
				z-index: 2;
				background: #f8f8f8;
			}

			table > tbody > tr > td:nth-child(1),
			table > thead > tr > th:nth-child(1) {
				left: 0;
			}
			table > tbody > tr > td:nth-child(2),
			table > thead > tr > th:nth-child(2) {
				left: 68px;
			}
			table > tbody > tr > td:nth-child(3),
			table > thead > tr > th:nth-child(3) {
				left: 122px;
			}
			table > tbody > tr > td:nth-child(4),
			table > thead > tr > th:nth-child(4) {
				left: 192px;
			}
			table > tbody > tr > td:nth-child(5),
			table > thead > tr > th:nth-child(5) {
				left: 342px;
			}

			table > thead > tr > th:nth-child(1),
			table > thead > tr > th:nth-child(2),
			table > thead > tr > th:nth-child(3),
			table > thead > tr > th:nth-child(4),
			table > thead > tr > th:nth-child(5) {
				z-index: 3 !important;
				background-color: white !important;

				// &.sticky-header {
				//     background-color: #f8f8f8 !important;
				// }
			}
		}
	}
</style>
