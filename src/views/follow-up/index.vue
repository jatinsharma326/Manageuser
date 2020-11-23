<template>
	<div class="reportListWrapper">
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

		<div class="leaves-table">
			<v-data-table
				:items-per-page="pageSize"
				hide-default-footer
				:headers="headers"
				:expanded.sync="expanded"
				show-expand
				item-key="_id"
				:items="followUpList"
			>
				<template v-slot:[`item.sales_call_data.date_of_call`]="{ item }">
					{{ getFormattedDate(item.sales_call_data.date_of_call, "MMMM Do YYYY dddd") }}
				</template>
				<template v-slot:[`item.travel_agent_employee.phone_numbers`]="{ item }">
					{{ item.travel_agent_employee.phone_numbers.join(", ") }}
				</template>
				<template v-slot:[`item.countries`]="{ item }">
					{{ item.countries.join(", ") }}
				</template>
				<template v-slot:[`item.travel_agent_employee.email_ids`]="{ item }">
					{{ item.travel_agent_employee.email_ids.join(", ") }}
				</template>
				<template v-slot:[`item.follow_up_on_date`]="{ item }">
					{{ item.follow_up_on_date ? getFormattedDate(item.follow_up_on_date, "MMMM Do YYYY dddd") : "-" }}
				</template>
				<template v-slot:expanded-item="{ headers, item }">
					<td class="expandable-section table-expanded-background " :colspan="headers.length">
						<div class="expandable-section-title">Remark</div>
						<div class="expandable-section-content" v-html="item.meeting_remark">{{}}</div>
					</td>
				</template>
				<template v-slot:[`item.actions`]="{ item }">
					<v-menu bottom left>
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon v-bind="attrs" v-on="on">
								<v-icon>mdi-dots-vertical</v-icon>
							</v-btn>
						</template>
						<v-list>
							<v-list-item @click="openInputForm(true, item)">EDIT</v-list-item>
							<v-list-item @click="deleteEntry(item)">DELETE</v-list-item>
						</v-list>
					</v-menu>
				</template>
			</v-data-table>
		</div>

		<div class="text-center">
			<v-pagination
				@input="updatedPageNo"
				v-if="isPaginationRequired"
				v-model="pageNo"
				:length="Math.ceil(fetchCount / pageSize)"
			></v-pagination>
		</div>

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
			this.getData();
			this.openLoaderDialog();
			let promiseArray = [];
			await this.getUsers();
			//get companies is defined in commonAPIMixins which gets companiesList and modifiedCompanyList
			promiseArray.push(this.getCompanies());
			promiseArray.push(this.getCountryList());
			await Promise.all(promiseArray);
			this.closeLoaderDialog();
			this.setConfig(
				this.userList,
				this.companyList,
				this.modifiedCompanyIdsList,
				this.countriesList,
				this.activeCurrencyList
			);
		},
		data: () => ({
			name: "Followup Entry",
			placeholder: "Search Followup Entry",
			searchConfig: [],
			inputConfig: [],
			activeCurrencyList: [],
			followUpList: [
				{
					_id: "5fb75c954fe7ba447c013758",
					country: "Brazil",
					date_of_enquiry: "2020-11-19T18:30:00.000Z",
					company_id: "5faa6ed0bbd00900275d0315",
					city: "Rio de Janerio",
					zone: "WEST",
					mortal_id: "5faf76736365ae32d4be2576",
					contact_person: "Cristiano Jr",
					contact_number: "+25 884222214",
					date_of_travel: "2021-01-14T18:30:00.000Z",
					month_of_travel: 1,
					number_of_pax_adult: 8,
					number_of_pax_child: 3,
					no_of_nights: 7,
					business_type: "MICE",
					email_subject: "email_subject_here",
					status: "CONFIRMED",
					remark: "remark_here",
					reminder_date: "2021-01-09T18:30:00.000Z",
					payment_status: "",
					invoice_no: "",
					payment_type: "",
					currency_type: "",
					amount_received: "",
					amount_pending: "",
					record: {
						created_on: "2020-11-20T06:05:09.728Z",
						updated_on: "2020-11-19T18:30:00.000Z",
					},
					company_data: {
						name: "Haridwar Apps",
					},
					mortal_data: {
						name: "Remote Sales Agent No 15012",
					},
				},
			],
			headers: [
				{ text: "Sr. No.", align: "start", value: "serial_number", width: 100 },
				{ text: "Product", value: "country", width: 150 },
				{ text: "User", value: "mortal_data.name", width: 150 },
				{ text: "Date of Enquiry", value: "date_of_enquiry", width: 200 },
				{ text: "Company Name", value: "company_data.name", width: 200 },
				{ text: "City", value: "city", width: 150 },
				{ text: "Zone", value: "zone", width: 150 },
				{ text: "Name of Contact", value: "contact_person", width: 150 },
				{ text: "Contact No.", value: "contact_number", width: 150 },
				{ text: "Date of Travel", value: "date_of_travel", width: 150 },
				{ text: "Adult Pax", value: "number_of_pax_adult", width: 150 },
				{ text: "No. of Nights", value: "no_of_nights", width: 150 },
				{ text: "Child Pax", value: "number_of_pax_child", width: 150 },
				{ text: "Inquiry Type", value: "business_type", width: 150 },
				{ text: "Email Subject", value: "email_subject", width: 150 },
				{ text: "File Status", value: "status", width: 150 },
				{ text: "Follow Up", value: "reminder_date", width: 150 },
				{ text: "Payment Status", value: "payment_status", width: 150 },
				{ text: "Invoice No.", value: "invoice_no", width: 150 },
				{ text: "Payment Type", value: "payment_type", width: 150 },
				{ text: "Currency", value: "currency_type", width: 150 },
				{ text: "Pending (Amount)", value: "amount_pending", width: 150 },
				{ text: "Received (Amount)", value: "amount_received", width: 150 },
				{ text: "Last Updated On", value: "record.updated_on", width: 150 },
				{ text: "", value: "actions" },
			],
			expanded: [],
			keysToWatch: ["status", "payment_status"],
		}),
		computed: {
			...mapGetters(["userData"]),
			dateRangeText() {
				return this.datePickerDate.join(" ~ ");
			},
		},
		methods: {
			...mapActions("FollowUp", ["getFollowUp", "addFollowUp", "editFollowUp", "deleteFollowUp"]),
			...mapActions("ManageAgents", ["getCompaniesList"]),
			...mapActions("UserManagement", ["getUserList"]),
			...mapActions("ManageTargets", ["getActiveCountries"]),
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

					this.followUpList = this.followUpList.map((d, index) => ({
						...d,
						serial_number: (this.pageNo - 1) * 20 + (index + 1),
					}));
				});
			},
			setConfig(
				userList = [],
				companyList = [],
				modifiedCompanyIdsList = [],
				activeCountriesList = [],
				activeCurrencyList = []
			) {
				// this.searchConfigItems = [
				// 	{
				// 		name: "Sales Call Index",
				// 		key: "sr_no",
				// 		type: "text",
				// 		inputType: "textfield",
				// 		defaultValue: "",
				// 		classes: ["half"],
				// 	},
				// 	{
				// 		name: "Date of Visit",
				// 		key: "date_of_call",
				// 		inputType: "datePicker",
				// 		defaultValue: null,
				// 		classes: ["half"],
				// 	},
				// 	{
				// 		name: "Branch Name",
				// 		key: "branch_name",
				// 		type: "text",
				// 		inputType: "textfield",
				// 		defaultValue: "",
				// 		classes: ["half"],
				// 	},
				// 	{
				// 		name: "Agent Employee",
				// 		key: "travel_agent_employee_name",
				// 		type: "text",
				// 		inputType: "textfield",
				// 		defaultValue: "",
				// 		classes: ["half"],
				// 	},
				// 	{
				// 		name: "Company",
				// 		key: "company_names",
				// 		multi: true,
				// 		inputType: "dropdown",
				// 		defaultValue: [],
				// 		isListInStore: false,
				// 		listItems: modifiedCompanyList,
				// 		classes: ["half"],
				// 	},
				// 	{
				// 		name: "State",
				// 		key: "states",
				// 		multi: true,
				// 		inputType: "dropdown",
				// 		defaultValue: [],
				// 		isListInStore: false,
				// 		listItems: statesList,
				// 		classes: ["half"],
				// 	},
				// 	{
				// 		name: "Product",
				// 		key: "countries",
				// 		multi: true,
				// 		inputType: "dropdown",
				// 		defaultValue: [],
				// 		isListInStore: false,
				// 		listItems: activeCountriesList,
				// 		classes: ["half"],
				// 	},
				// 	{
				// 		name: "Status",
				// 		key: "status",
				// 		multi: false,
				// 		inputType: "dropdown",
				// 		defaultValue: [],
				// 		isListInStore: false,
				// 		listItems: ["ON GOING", "CLOSED"],
				// 		classes: ["half"],
				// 	},
				// ];

				this.inputConfig = [
					{
						name: "Product*",
						type: "Dropdown",
						key: "countries",
						width: "full",
						multi: true,
						isListInStore: false,
						listItems: activeCountriesList,
						validations: {
							required,
						},
					},
					{
						name: "Company*",
						type: "Dropdown",
						key: "company_id",
						width: "full",
						multi: false,
						isListInStore: false,
						listItems: modifiedCompanyIdsList,
						validations: {
							required,
						},
					},
					{
						name: "City*",
						type: "String",
						key: "city",
						width: "half",
						validations: {
							required,
							minLength: minLength(1),
						},
					},
					{
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
					},
					{
						name: "Name of Contact*",
						type: "String",
						key: "contact_person",
						width: "half",
						validations: {
							required,
							minLength: minLength(1),
						},
					},
					{
						name: "Contact No.",
						type: "String",
						key: "contact_number",
						width: "half",
					},
					{
						name: "Date of Travel",
						type: "Date",
						key: "date_of_travel",
						width: "half",
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
						width: "full",
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
							"CANCELLED",
						],
						validations: {
							required,
						},
						// disableCheck: function(data, value) {
						// 	console.log("Disable Data", data);
						// 	let a = JSON.parse(JSON.stringify(data));

						// 	console.log("Disable Function", a);
						// 	console.log("Disable Value", value);
						// 	if (value == "CONFIRMED") {
						// 		a["payment_status"] = false;
						// 		a["payment_type"] = false;
						// 	} else {
						// 		a["payment_status"] = true;
						// 		a["payment_type"] = true;
						// 	}
						// 	return a;
						// },
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
									subSelection.push("CREDIT NOTE");
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
						name: "Invoice Number",
						type: "String",
						key: "invoice_no",
						width: "half",
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
			},
			queryString(data) {
				this.filter["search_text"] = data;
				this.getData();
			},
			advanceSearch(filterObject) {
				var filterData = JSON.parse(JSON.stringify(filterObject));
				if (filterData.date_of_call) {
					filterData.date_of_call = helpers.getISODate(filterData.date_of_call);
				}
				console.log("Test Console Advance Search Output", filterData);
				this.filter = { ...filterData };
				this.pageNo = 1;
				this.getData();
			},
			async formOutput(data) {
				var formData = JSON.parse(JSON.stringify(data));
				// if (!formData.designation) formData.designation = "";
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
			updatedPageNo(page) {
				this.getData();
			},
			checkDisableCondition(value) {
				console.log("Disable Value", value);
				if (value == "CONFIRMED") {
					return false;
				} else {
					return true;
				}
			},
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
		.leaves-table {
			margin: 10px;
			padding: 10px;
			border: 1px solid $primary;
			border-radius: 5px;
		}
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
