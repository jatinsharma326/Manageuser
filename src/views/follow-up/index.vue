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
				:items="reportsList"
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
					<template v-if="canUserEdit(item)">
						<v-menu bottom left>
							<template v-slot:activator="{ on, attrs }">
								<v-btn icon v-bind="attrs" v-on="on">
									<v-icon>mdi-dots-vertical</v-icon>
								</v-btn>
							</template>
							<v-list>
								<v-list-item @click="openInputForm(true, item)">EDIT</v-list-item>
								<v-list-item @click="deleteCall(item)">DELETE</v-list-item>
							</v-list>
						</v-menu>
					</template>
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
			:type="type"
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
			// 	await this.getUsers();
			// 	this.setSearchConfig(this.userList);
			this.openLoaderDialog();
			let promiseArray = [];
			await this.getUsers();
			promiseArray.push(this.getCompanies());
			promiseArray.push(this.getCountryList());
			if (this.isSalesTeamMember) {
				promiseArray.push(this.getSalesCallList());
			}
			await Promise.all(promiseArray);
			this.closeLoaderDialog();
			this.setConfig(
				this.companyList,
				this.userList,
				this.storeStatesList,
				this.modifiedCompanyList,
				this.countriesList,
				this.callsList
			);
		},
		data: () => ({
			name: "Followup Entry",
			reportsList: [
				{
					_id: "5facf4ab75576e2d0c9ac662",
					countries: ["Fiji"],
					date_of_enquiry: "2020-12-12T18:30:00.000Z",
					travel_agent_id: "5faa6ed0bbd00900275d031a",
					company_data: {
						name: "Faridabad Consultants",
					},
					city: "Mumbai",
					zone: "NORTH",
					contact_person_name: "Taher Pardawala",
					contact_person_phone_number: "98989892892",
					date_of_travel: "2021-01-12T18:30:00.000Z",
					adult_pax: 12,
					no_of_nights: 6,
					child_pax: 0,
					business_type: "FIT",
					email_subject: "Taher Rohan",
					file_status: "Taher Rohan",
					follow_up_on_date: "Taher Rohan",
					payment_status: "Taher Rohan",
					currency: "USD",
					pending_amount: "Taher Rohan",
					received_amount: "Taher Rohan",
					record: {
						created_on: "2020-11-12T08:39:07.975Z",
						updated_on: "2020-11-12T08:39:07.975Z",
					},
					meeting_remark: "- Taher\n\n-ALi\n\n\n\n-Rohan",
				},
			],
			headers: [
				{ text: "Sr. No.", align: "start", value: "serial_number", width: 100 },
				{ text: "Product", value: "countries", width: 150 },
				{ text: "Date of Enquiry", value: "date_of_enquiry", width: 200 },
				{ text: "Company Name", value: "company_data.name", width: 200 },
				{ text: "Branch Name", value: "company_address_data.branch_name", width: 150 },
				{ text: "City", value: "company_address_data.city", width: 150 },
				{ text: "Zone", value: "company_address_data.zone", width: 150 },
				{ text: "Name of Contact", value: "contact_person_name", width: 150 },
				{ text: "Contact No.", value: "contact_person_phone_numbers", width: 150 },
				{ text: "Date of Travel", value: "date_of_travel", width: 150 },
				{ text: "Adult Pax", value: "adult_pax", width: 150 },
				{ text: "No. of Nights", value: "no_of_nights", width: 150 },
				{ text: "Child Pax", value: "child_pax", width: 150 },
				{ text: "Inquiry Type", value: "business_type", width: 150 },
				{ text: "Email Subject", value: "email_subject", width: 150 },
				{ text: "File Status", value: "file_status", width: 150 },
				{ text: "Follow Up", value: "follow_up_on_date", width: 150 },
				{ text: "Payment Status", value: "payment_status", width: 150 },
				{ text: "Invoice No.", value: "invoice_no", width: 150 },
				{ text: "Payment Type", value: "payment_type", width: 150 },
				{ text: "Currency", value: "currency", width: 150 },
				{ text: "Pending (Amount)", value: "pending_amount", width: 150 },
				{ text: "Received (Amount)", value: "received_amount", width: 150 },
				{ text: "Last Updated On", value: "record.updated_on", width: 150 },
				{ text: "Remark", value: "data-table-expand" },
				{ text: "", value: "actions" },
			],
			expanded: [],
			keysToWatch: ["file_status"],
		}),
		computed: {
			...mapGetters(["userData"]),
			dateRangeText() {
				return this.datePickerDate.join(" ~ ");
			},
		},
		methods: {
			...mapActions("DSR", ["getDSR", "addDSR", "editDSR", "deleteDSR"]),
			...mapActions("ManageAgents", ["getCompaniesList", "getAddressList", "getCompanyEmployeeList"]),
			...mapActions("UserManagement", ["getUserList"]),
			...mapActions("SalesCall", ["getSalesCall"]),
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

				this.getDSR({
					filter: this.filter,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.reportsList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;

					this.reportsList = this.reportsList.map((d, index) => ({
						...d,
						serial_number: (this.pageNo - 1) * 20 + (index + 1),
					}));
				});
			},
			setConfig(
				companyList = [],
				userList = [],
				statesList = [],
				modifiedCompanyList = [],
				activeCountriesList = [],
				callsList = []
			) {
				let searchConfigItems = [
					{
						name: "Sales Call Index",
						key: "sr_no",
						type: "text",
						inputType: "textfield",
						defaultValue: "",
						classes: ["half"],
					},
					{
						name: "Date of Visit",
						key: "date_of_call",
						inputType: "datePicker",
						defaultValue: null,
						classes: ["half"],
					},
					{
						name: "Branch Name",
						key: "branch_name",
						type: "text",
						inputType: "textfield",
						defaultValue: "",
						classes: ["half"],
					},
					{
						name: "Agent Employee",
						key: "travel_agent_employee_name",
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
						listItems: modifiedCompanyList,
						classes: ["half"],
					},
					{
						name: "State",
						key: "states",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: statesList,
						classes: ["half"],
					},
					{
						name: "Product",
						key: "countries",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: activeCountriesList,
						classes: ["half"],
					},
					{
						name: "Status",
						key: "status",
						multi: false,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: ["ON GOING", "CLOSED"],
						classes: ["half"],
					},
				];

				this.tabConfig = [
					{
						name: "My DSR",
						id: "myDSR",
						props: {
							name: "My DSR",
							type: "my_dsr",
							placeholder: "Search my DSR",
							inputConfig: [
								{
									name: "Sales Call Index*",
									type: "DropdownWithMoreInfo",
									isCustom: true,
									subtitleContent: (item) => {
										return (
											helper.getFormattedDate(item.date_of_call, "DD-MM-YYYY") +
											"-" +
											item.company_data.name
										);
									},
									titleContent: (item) => {
										return item.sr_no;
									},
									key: "sales_call_id",
									width: "full",
									multi: false,
									isListInStore: false,
									listItems: callsList,
									itemText: "sr_no",
									itemValue: "_id",
									validations: {
										required,
									},
								},
								{
									name: "Travel Agent Employee*",
									type: "AsyncDropdownWithMoreInfo",
									triggerKey: "sales_call_id",
									subtitleContent: (item) => {
										return item.designation + " - " + item.company_address_data.branch_name;
									},
									titleContent: (item) => {
										return item.name;
									},
									apiCall: (call_id) => {
										let call = this.callsList.find((e) => e._id == call_id);
										return this.getCompanyEmployeeList({
											filter: {
												company_id: call.company_id,
												active: true,
											},
										}).then((data) => {
											return data.list;
										});
									},
									key: "travel_agent_id",
									width: "full",
									itemText: "name",
									itemValue: "_id",
									validations: {
										required,
									},
								},
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
									name: "Follow up Date",
									type: "Date",
									key: "follow_up_on_date",
									width: "half",
								},
								{
									name: "Status*",
									type: "Dropdown",
									key: "status",
									width: "half",
									multi: false,
									isListInStore: false,
									listItems: ["ON GOING", "CLOSED"],
									validations: {
										required,
									},
								},
								{
									name: "Meeting Remark*",
									type: "TextArea",
									key: "meeting_remark",
									width: "full",
									validations: {
										required,
										minLength: minLength(2),
									},
								},
							],
							searchConfig: searchConfigItems,
						},
					},
					{
						name: "All DSR",
						id: "allDSR",
						component: "Users",
						props: {
							name: "All DSR",
							type: "all_dsr",
							placeholder: "Search all DSR",
							searchConfig: [
								{
									name: "Created By",
									key: "names",
									multi: true,
									inputType: "dropdown",
									defaultValue: [],
									isListInStore: false,
									listItems: userList,
									classes: ["full"],
								},
								...searchConfigItems,
							],
						},
					},
				];
				if (this.isAdminOrManagement) {
					this.tabConfig.shift();
				}
			},
			canUserEdit(item) {
				let currentMonth = moment()
					.tz("Asia/Kolkata")
					.startOf("month");
				let callMonth = moment(item.date_of_call)
					.tz("Asia/Kolkata")
					.startOf("month");
				let diffrenceInDates = currentMonth.diff(callMonth, "months", true);
				if (this.type == "my_dsr" && -2 <= diffrenceInDates && diffrenceInDates <= 1) {
					return true;
				} else {
					return false;
				}
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

				this.openLoaderDialog();
				if (!this.isEditMode) {
					this.addDSR(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Added DSR Entry" });
							this.closeForm();
							this.getData();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				} else {
					this.editDSR(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Edited DSR Entry" });
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
			deleteCall(call) {
				if (window.confirm("Do you really want to Delete the DSR?")) {
					this.openLoaderDialog();
					this.deleteDSR({
						_id: call._id,
					}).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Deleted the DSR" });
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
		},
		watch: {},
		props: {
			name: { required: true, type: String },
			type: { required: true, type: String },
			placeholder: { required: true, type: String },
			inputConfig: { required: false, type: Array },
			searchConfig: { required: true, type: Array },
		},
	};
</script>
<style lang="scss">
	.manageDSRWrapper {
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
