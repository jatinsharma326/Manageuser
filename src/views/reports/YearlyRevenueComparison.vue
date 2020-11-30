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

		<div class="leaves-table">
			<v-data-table :items-per-page="pageSize" hide-default-footer :headers="headers" :items="dataList">
				<template v-slot:[`header.record_1`]="{ header }">
					{{ getFormattedDate(comparisonDateFrom, "MMM YYYY") }} to
					{{ getFormattedDate(comparisonDateTo, "MMM YYYY") }}
				</template>
				<template v-slot:[`header.record_2`]="{ header }">
					{{ getFormattedDate(selectionDateFrom, "MMM YYYY") }} to
					{{ getFormattedDate(selectionDateTo, "MMM YYYY") }}
				</template>
			</v-data-table>
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
			selectionDateFrom: "",
			selectionDateTo: "",
			comparisonDateFrom: "",
			comparisonDateTo: "",
			showErrorMessage: true,
			headers: [
				{ text: "Sr. No.", align: "start", value: "serial_number", width: 100 },
				{ text: "Month", value: "month_of_travel", width: 150 },
				{ text: "Created By", value: "record_2", width: 200 },
				{ text: "Date of Enquiry", value: "record_1", width: 200 },
				{ text: "Amount Difference ($)", value: "diff", width: 200 },
				{ text: "Percentage Difference", value: "perc_incr_decr", width: 150 },
			],
		}),
		computed: {
			...mapGetters("Reports", ["yearlyRevenueMainDate", "yearlyRevenueFilter"]),
			dateRangeText() {
				return this.datePickerDate.join(" ~ ");
			},
		},
		methods: {
			...mapActions("Reports", ["getYearlyComparison"]),
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
				this.comparisonDateFrom = moment(this.datePickerDate[0])
					.tz("Asia/Kolkata")
					.startOf()
					.toISOString();
				if (this.datePickerDate[1]) {
					this.comparisonDateTo = moment(this.datePickerDate[1])
						.tz("Asia/Kolkata")
						.endOf("month")
						.toISOString();
				} else {
					this.comparisonDateTo = this.comparisonDateFrom;
				}

				this.selectionDateFrom = moment(this.yearlyRevenueMainDate[0])
					.tz("Asia/Kolkata")
					// .startOf()
					.toISOString();
				if (this.datePickerDate[1]) {
					this.selectionDateTo = moment(this.yearlyRevenueMainDate[1])
						.tz("Asia/Kolkata")
						.endOf("month")
						.toISOString();
				} else {
					this.selectionDateTo = this.selectionDateFrom;
				}

				// this.filter = this.yearlyRevenueFilter;
				console.log(
					"comparison_date_from: ",
					this.comparisonDateFrom,
					"comparison_date_to:",
					this.comparisonDateTo,
					"selection_date_from:",
					this.selectionDateFrom,
					"selection_date_to:",
					this.selectionDateTo
				);
				// if (this.filter.status) delete this.filter.status;
				// if (this.filter.payment_status) delete this.filter.payment_status;
				// if (this.filter.payment_type) delete this.filter.payment_type;
				// if (this.filter.date_from) delete this.filter.date_from;
				// if (this.filter.date_to) delete this.filter.date_to;

				this.getYearlyComparison({
					filter: this.filter,
					comparison_date_from: this.comparisonDateFrom,
					comparison_date_to: this.comparisonDateTo,
					selection_date_from: this.selectionDateFrom,
					selection_date_to: this.selectionDateTo,
					// pageSize: this.pageSize,
					// pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					console.log("data", data);
					this.dataList = data.list;
					console.log(this.dataList);
					// this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;

					this.dataList = this.dataList.map((d, index) => ({
						...d,
						serial_number: index + 1,
					}));
					console.log(this.dataList);
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
