<template>
	<div class="companyAddressWrapper">
		<div class="SearchbarWrapper">
			<div class="searchbar"></div>
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
							<div class="date-error-message" v-show="!showErrorMessage">
								Date doesn't match range selected in previous tab
							</div>
							<div class="action-buttons">
								<v-spacer></v-spacer>
								<v-btn text color="primary" @click="resetDatePicker">
									Reset
								</v-btn>
								<v-btn text color="primary" @click="cancelDatePicker">
									Cancel
								</v-btn>
								<v-btn :disabled="!showErrorMessage" text color="primary" @click="submitDatePickerr">
									OK
								</v-btn>
							</div>
						</div>
					</v-date-picker>
				</v-dialog>
			</div>
		</div>
		{{ yearlyRevenueMainDate }}
		{{ yearlyRevenueFilter }}
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
				<template v-slot:[`item.date_of_enquiry`]="{ item }">
					{{ item.date_of_enquiry ? getFormattedDate(item.date_of_enquiry, "MMMM Do YYYY dddd") : "-" }}
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
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import searchMixin from "../../mixins/searchMixin";
	import datePickerMixin from "../../mixins/datePickerMixin";
	import helperMixin from "../../mixins/helperMixins";
	import moment from "moment-timezone";
	import { mapActions, mapGetters, mapMutations } from "vuex";

	export default {
		name: "YearlyRevenueComparison",
		mixins: [defaultCRUDMixin, searchMixin, datePickerMixin, helperMixin],
		components: {},
		async created() {
			this.setDateRange();
			this.getData();
		},
		data: () => ({
			selectedCardInfo: {},
			activeState: true,
			dataList: [],
			showErrorMessage: true,
			headers: [
				{ text: "Sr. No.", align: "start", value: "serial_number", width: 100 },
				{ text: "Product", value: "country", width: 150 },
				{ text: "Created By", value: "mortal_data.name", width: 150 },
				{ text: "Date of Enquiry", value: "date_of_enquiry", width: 200 },
				{ text: "Company Name", value: "company_data.name", width: 200 },
				{ text: "City", value: "city", width: 150 },
				{ text: "Zone", value: "zone", width: 150 },
				{ text: "Date of Travel", value: "date_of_travel", width: 150 },
				{ text: "Inquiry Type", value: "business_types", width: 150 },
				{ text: "Email Subject", value: "email_subject", width: 150 },
				{ text: "File Status", value: "status", width: 150 },
				{ text: "Follow Up", value: "reminder_date", width: 150 },
				{ text: "Payment Status", value: "payment_status", width: 200 },
				{ text: "Invoice No.", value: "invoice_no", width: 150 },
				{ text: "Payment Type", value: "payment_type", width: 150 },
				{ text: "Currency", value: "currency_type", width: 150 },
				{ text: "Pending (Amount)", value: "amount_pending", width: 200 },
				{ text: "Received (Amount)", value: "amount_received", width: 200 },
				{ text: "Last Updated On", value: "record.updated_on", width: 200 },
			],
		}),
		computed: {
			...mapGetters("Reports", ["yearlyRevenueMainDate", "yearlyRevenueFilter"]),
			dateRangeText() {
				return this.datePickerDate.join(" ~ ");
			},
		},
		methods: {
			...mapActions("FollowUp", ["getFollowUp"]),
			...mapMutations([]),
			setDateRange() {
				let tempArray = [];
				let startDate = moment(this.yearlyRevenueMainDate[0])
					.tz("Asia/Kolkata")
					.subtract(1, "year")
					.startOf("year")
					.format("YYYY-MM");
				let endDate = moment(this.yearlyRevenueMainDate[1])
					.tz("Asia/Kolkata")
					.subtract(1, "year")
					.endOf("year")
					.format("YYYY-MM");
				// let diffrenceInDates = currentMonth.diff(callMonth, "months", true);
				tempArray.push(startDate);
				tempArray.push(endDate);
				this.datePickerDate = tempArray;
			},
			submitDatePickerr() {
				if (this.isDateValid) {
					this.$refs.dialog.save(this.datePickerDate);
					this.getData();
				} else {
					console.log("Please Select a Correct Date Range");
				}
			},
			isDateValid(newValue) {
				let diffrenceInStartDates, diffrenceInEndDates;
				diffrenceInStartDates = moment(this.yearlyRevenueMainDate[0])
					.tz("Asia/Kolkata")
					.diff(moment(newValue[0]).tz("Asia/Kolkata"), "months", true);
				diffrenceInEndDates = moment(this.yearlyRevenueMainDate[1])
					.tz("Asia/Kolkata")
					.diff(moment(newValue[1]).tz("Asia/Kolkata"), "months", true);

				if (Number.isInteger(diffrenceInStartDates / 12) && Number.isInteger(diffrenceInEndDates / 12)) {
					return true;
				} else {
					return false;
				}
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
				//To only get the Amount RECEIVED we need to filter out following conditions
				this.filter.status = "CONFIRMED";
				this.filter.payment_status = "RECEIVED";
				this.filter.payment_type = "FULL PAYMENT";

				this.getFollowUp({
					filter: this.filter,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.dataList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;

					this.dataList = this.dataList.map((d, index) => ({
						...d,
						serial_number: (this.pageNo - 1) * this.pageSize + (index + 1),
					}));
				});
			},
			updatedPageNo(page) {
				this.getData();
			},
		},
		watch: {
			datePickerDate: {
				deep: true,
				async handler(nv, ov) {
					for (let valueOV of ov) {
						for (let valueNV of nv) {
							if (valueOV != valueNV) {
								this.showErrorMessage = this.isDateValid(nv);
							}
						}
					}
				},
			},
		},
		props: {},
	};
</script>

<style lang="scss" scopped>
	.companyAddressWrapper {
		padding: 20px 5px;
		height: 100%;
	}
	.companyaddress-search-bar {
		margin-top: 12px;
		display: flex;
		justify-content: center;
	}
	.date-picker-action-section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.date-error-message {
			color: $error;
			padding: 10px;
			text-align: center;
		}
	}
</style>
