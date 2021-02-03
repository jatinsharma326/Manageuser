<template>
	<div class="companyAddressWrapper">
		<div class="SearchbarWrapper">
			<div class="searchbar">
				<Search
					@queryString="queryString"
					@filterObject="advanceSearch"
					@clearFilter="advanceSearch"
					:placeholder="placeholder"
					:isAdvanceSearch="true"
					:isOnlyAdvanceSearch="true"
					:isAdvanceAFilter="true"
					:filterConfig="selectedSearchConfig"
				>
					<template v-slot:buttonSection>
						<v-btn
							:disabled="checkDownloadButtonStatus"
							color="secondary"
							text
							@click.stop="downloadReport()"
							>Download Report</v-btn
						>
					</template>
				</Search>
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
					<v-date-picker range type="month" v-model="datePickerDate" scrollable>
						<div class="date-picker-action-section">
							<div class="date-error-message" v-show="!errorMessage">
								{{ dateErrorMessage }}
							</div>
							<div class="action-buttons">
								<v-spacer></v-spacer>
								<v-btn text color="primary" @click="resetDatePicker">
									Reset
								</v-btn>
								<v-btn text color="primary" @click="cancelDatePicker">
									Cancel
								</v-btn>
								<v-btn :disabled="!errorMessage" text color="primary" @click="submitDatePicker">
									OK
								</v-btn>
							</div>
						</div>
					</v-date-picker>
				</v-dialog>
			</div>
		</div>
		<div v-if="totalCount === 0" class="content-error-message">
			No Followup entries. Please add followup entries to see the reports
		</div>
		<div v-else class="leaves-table">
			<v-data-table
				:items-per-page="pageSize"
				hide-default-footer
				:headers="headers"
				item-key="_id"
				:items="dataList"
			>
				<!-- <template v-slot:[`item.date_of_enquiry`]="{ item }">
					{{ item.date_of_enquiry ? getFormattedDate(item.date_of_enquiry, "MMMM Do YYYY dddd") : "-" }}
				</template> -->
				<template v-slot:[`item.contact_number`]="{ item }">
					{{ item.contact_number ? item.contact_number : "-" }}
				</template>
				<template v-slot:[`item.date_of_travel`]="{ item }">
					{{ item.date_of_travel ? getFormattedDate(item.date_of_travel, "MMMM Do YYYY dddd") : "-" }}
				</template>
				<template v-slot:[`item.reminder_date`]="{ item }">
					{{ item.reminder_date ? getFormattedDate(item.reminder_date, "MMMM Do YYYY dddd") : "-" }}
				</template>
				<!-- <template v-slot:[`item.payment_status`]="{ item }">
					{{ item.payment_status ? item.payment_status : "-" }}
				</template> -->
				<template v-slot:[`item.invoice_no`]="{ item }">
					{{ item.invoice_no ? item.invoice_no : "-" }}
				</template>
				<template v-slot:[`item.payment_type`]="{ item }">
					{{ item.payment_type ? item.payment_type : "-" }}
				</template>
				<template v-slot:[`item.currency_type`]="{ item }">
					{{ item.currency_type ? item.currency_type : "-" }}
				</template>
				<!-- <template v-slot:[`item.amount_pending`]="{ item }">
					{{ item.amount_pending ? item.amount_pending : "-" }}
				</template> -->
				<template v-slot:[`item.amount_received`]="{ item }">
					{{ item.amount_received ? item.amount_received : "-" }}
				</template>
				<!-- <template v-slot:[`item.record.updated_on`]="{ item }">
					{{ item.record.updated_on ? getFormattedDate(item.record.updated_on, "MMMM Do YYYY dddd") : "-" }}
				</template> -->
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
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import searchMixin from "../../mixins/searchMixin";
	// import datePickerMixin from "../../mixins/datePickerMixin";
	import helperMixin from "../../mixins/helperMixins";
	import moment from "moment-timezone";
	import { mapActions, mapGetters, mapMutations } from "vuex";

	export default {
		name: "YearlyRevenueRaw",
		mixins: [defaultCRUDMixin, searchMixin, helperMixin],
		components: {},
		async created() {
			this.setDateRange();
			this.setYearlyRevenueMainDate(this.datePickerDate);
			this.getData();
			this.setSearchConfig(this.countriesList, this.userList);
		},
		data: () => ({
			selectedCardInfo: {},
			activeState: true,
			dataList: [],
			datePickerDate: [],
			tempDateValue: [],
			dateDialog: false,
			selectedDateRange: [],
			dateErrorMessage: "",
			errorMessage: true,
			headers: [
				{ text: "Sr. No.", align: "start", value: "serial_number", width: 100 },
				{ text: "Product", value: "country", width: 150 },
				{ text: "Created By", value: "mortal_data.name", width: 150 },
				// { text: "Date of Enquiry", value: "date_of_enquiry", width: 200 },
				{ text: "Company Name", value: "company_data.name", width: 200 },
				{ text: "City", value: "city", width: 150 },
				// { text: "Zone", value: "zone", width: 150 },
				{ text: "Date of Travel", value: "date_of_travel", width: 150 },
				{ text: "Inquiry Type", value: "business_types", width: 150 },
				// { text: "Email Subject", value: "email_subject", width: 150 },
				// { text: "File Status", value: "status", width: 150 },
				// { text: "Follow Up", value: "reminder_date", width: 150 },
				// { text: "Payment Status", value: "payment_status", width: 200 },
				{ text: "Invoice No.", value: "invoice_no", width: 150 },
				// { text: "Payment Type", value: "payment_type", width: 150 },
				{ text: "Currency", value: "currency_type", width: 150 },
				// { text: "Pending (Amount)", value: "amount_pending", width: 200 },
				{ text: "Received (Amount)", value: "amount_received", width: 200 },
				// { text: "Last Updated On", value: "record.updated_on", width: 200 },
			],
		}),
		computed: {
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
			...mapActions("FollowUp", ["getFollowUp"]),
			...mapActions("Reports", ["downloadYearlyRawReport"]),
			...mapMutations("Reports", ["setYearlyRevenueMainDate", "setYearlyRevenueFilter", ,]),
			setDateRange() {
				let tempArray = [];
				let startDate = moment()
					.tz("Asia/Kolkata")
					.startOf("year")
					.format("YYYY-MM");
				let endDate = moment()
					.tz("Asia/Kolkata")
					.endOf("year")
					.format("YYYY-MM");
				tempArray.push(startDate);
				tempArray.push(endDate);
				this.datePickerDate = tempArray;
				this.selectedDateRange = tempArray;
			},
			isDateValid() {
				if (this.datePickerDate.length != 2) {
					this.dateErrorMessage = "Please select 2 Months";
					return false;
				}

				if (this.datePickerDate.length == 2) {
					let diffrenceInDates = moment(this.datePickerDate[1])
						.tz("Asia/Kolkata")
						.diff(moment(this.datePickerDate[0]).tz("Asia/Kolkata"), "months", true);
					if (diffrenceInDates > 11) {
						this.dateErrorMessage = "Selected Date range can't exceed a year";
						return false;
					}
				}
				return true;
			},
			submitDatePicker() {
				if (this.isDateValid) {
					this.$refs.dialog.save(this.datePickerDate);
					this.selectedDateRange = this.datePickerDate;
					this.getData();
				} else {
					console.log("Please Select a Correct Date Range");
				}
			},
			dataSelector() {
				this.tempDateValue = [...this.datePickerDate];
			},
			cancelDatePicker() {
				this.datePickerDate = [...this.tempDateValue];
				this.selectedDateRange = this.datePickerDate;
				this.dateDialog = false;
			},
			resetDatePicker() {
				this.setDateRange();
				this.$refs.dialog.save(this.datePickerDate);
				this.getData();
				this.dateDialog = false;
			},
			getData() {
				this.openLoaderDialog();
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
				//To only get the Amount RECEIVED we need to filter out following conditions
				this.filter.status = "CONFIRMED";
				this.filter.payment_status = "RECEIVED";
				this.filter.payment_type = "FULL PAYMENT";

				// this.setYearlyRevenueFilter(this.filter);

				this.getFollowUp({
					filter: this.filter,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.dataList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;

					if (this.dataList.length) {
						this.dataList = this.dataList.map((d, index) => ({
							...d,
							serial_number: (this.pageNo - 1) * this.pageSize + (index + 1),
						}));
					}
				});
			},

			advanceSearch(filterObject) {
				this.filter = { ...filterObject };
				if (this.filter.active) {
					this.activeState = false;
				} else {
					this.activeState = true;
				}
				this.setYearlyRevenueFilter(this.filter);
				this.pageNo = 1;
				this.getData();
			},
			setSearchConfig(countriesList = [], userList = []) {
				this.selectedSearchConfig = [
					{
						name: "Inquiry Type",
						key: "business_types",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: true,
						listVariable: "businessType",
					},
					{
						name: "Product",
						key: "countries",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: countriesList,
					},
				];
				if (this.isAdminOrManagement) {
					this.selectedSearchConfig.unshift({
						name: "Created By",
						key: "names",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: userList,
					});
				}

				if (this.isAdminOrManagement || this.isOnlySalesAgent) {
					this.selectedSearchConfig.push({
						name: "Zone",
						key: "zones",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: true,
						listVariable: "zone",
					});
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
				//To only get the Amount RECEIVED we need to filter out following conditions
				this.filter.status = "CONFIRMED";
				this.filter.payment_status = "RECEIVED";
				this.filter.payment_type = "FULL PAYMENT";

				this.openLoaderDialog();
				this.downloadYearlyRawReport({
					filter: this.filter,
				}).then(() => {
					this.closeLoaderDialog();
				});
			},
		},
		watch: {
			datePickerDate: {
				deep: true,
				async handler(nv, ov) {
					this.errorMessage = this.isDateValid();
				},
			},
			selectedDateRange: {
				deep: true,
				handler(nv, ov) {
					this.setYearlyRevenueMainDate(this.datePickerDate);
				},
			},
		},
		props: {
			name: { required: true, type: String },
			placeholder: { required: false, type: String },
			userList: { required: false, type: Array, default: () => [] },
			countriesList: { required: false, type: Array, default: () => [] },
		},
	};
</script>

<style lang="scss" scopped>
	.companyAddressWrapper {
		padding: 20px 5px;
		height: 100%;
	}
</style>
