<template>
	<div class="yearlyComparison">
		<div class="SearchbarWrapper">
			<div class="searchbar">
				<v-btn color="secondary" text @click.stop="downloadReport()">Download Report</v-btn>
				<v-btn color="secondary" text @click.stop="downloadChart()">Download Chart</v-btn>
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
								<v-btn :disabled="!errorMessage" text color="primary" @click="submitDatePickerr">
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
		<!-- {{ secondaryAxis }} -->
		<div class="charts">
			<BarChart v-if="render" :myTabId="1" :chartData="chartData" :options="chartOptions"></BarChart>
		</div>
	</div>
</template>

<script>
	import BarChart from "../../components/BarChart";
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	// import searchMixin from "../../mixins/searchMixin";
	import datePickerMixin from "../../mixins/datePickerMixin";
	import helperMixin from "../../mixins/helperMixins";
	import moment from "moment-timezone";
	import { mapActions, mapGetters, mapMutations } from "vuex";

	export default {
		name: "YearlyRevenueComparison",
		mixins: [defaultCRUDMixin, datePickerMixin, helperMixin],
		components: {
			BarChart,
		},
		async created() {
			this.setDateRange();
			await this.getData();
		},
		data() {
			return {
				render: false,
				dataList: [],
				pageSize: 20,
				filter: {},

				selectionDateFrom: "",
				selectionDateTo: "",
				comparisonDateFrom: "",
				comparisonDateTo: "",
				dateErrorMessage: "",
				chartData: {},
				chartOptions: {
					responsive: true,
					maintainAspectRatio: false,
					// animation: {
					// 	duration: 0,
					// },
					// hover: {
					// 	animationDuration: 0,
					// },
					// responsiveAnimationDuration: 0,
				},
				errorMessage: true,
				headers: [
					{ text: "Sr. No.", align: "start", value: "serial_number", width: 100 },
					{ text: "Month", value: "month_of_travel", width: 150 },
					{ text: "Selection Date Range", value: "record_1", width: 200 },
					{ text: "Comparison Date Range", value: "record_2", width: 200 },
					{ text: "Amount Difference ($)", value: "diff", width: 200 },
					{ text: "Percentage Difference", value: "perc_incr_decr", width: 150 },
				],
			};
		},
		computed: {
			...mapGetters("Reports", ["yearlyRevenueMainDate", "yearlyRevenueFilter", "currentTab"]),
			dateRangeText() {
				return this.datePickerDate.join(" ~ ");
			},
		},
		methods: {
			...mapActions("Reports", ["getYearlyComparison", "downloadComparisonReport"]),
			...mapMutations([]),
			setDateRange() {
				let tempArray = [];
				let startDate = moment(this.yearlyRevenueMainDate[0])
					.tz("Asia/Kolkata")
					.subtract(1, "year")
					.startOf("month")
					.format("YYYY-MM");
				let endDate = moment(this.yearlyRevenueMainDate[1])
					.tz("Asia/Kolkata")
					.subtract(1, "year")
					.endOf("month")
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
				let diffrenceInStartDates = moment(this.yearlyRevenueMainDate[0])
					.tz("Asia/Kolkata")
					.diff(moment(newValue[0]).tz("Asia/Kolkata"), "months", true);
				let diffrenceInEndDates = moment(this.yearlyRevenueMainDate[1])
					.tz("Asia/Kolkata")
					.diff(moment(newValue[1]).tz("Asia/Kolkata"), "months", true);

				if (!Number.isInteger(diffrenceInStartDates / 12) || !Number.isInteger(diffrenceInEndDates / 12)) {
					this.dateErrorMessage = "Date range doesn't match the main date Range";
					return false;
				}
				if (diffrenceInStartDates == 0 && diffrenceInEndDates == 0) {
					this.dateErrorMessage = "Date range can't be the same as main date Range";
					return false;
				}
				return true;
			},
			getData() {
				this.openLoaderDialog();
				this.render = false;
				let comparisonDate = JSON.parse(JSON.stringify(this.datePickerDate));
				comparisonDate.sort();
				this.comparisonDateFrom = moment(comparisonDate[0])
					.tz("Asia/Kolkata")
					.startOf("month")
					.toISOString();
				if (this.datePickerDate[1]) {
					this.comparisonDateTo = moment(comparisonDate[1])
						.tz("Asia/Kolkata")
						.endOf("month")
						.toISOString();
				} else {
					this.comparisonDateTo = this.comparisonDateFrom;
				}

				let selectionDate = JSON.parse(JSON.stringify(this.yearlyRevenueMainDate));
				selectionDate.sort();
				this.selectionDateFrom = moment(selectionDate[0])
					.tz("Asia/Kolkata")
					.startOf("month")
					.toISOString();
				this.selectionDateTo = moment(selectionDate[1])
					.tz("Asia/Kolkata")
					.endOf("month")
					.toISOString();

				let { business_types, countries, names } = this.yearlyRevenueFilter;
				if (business_types) {
					this.filter.business_types = business_types;
				}
				if (countries) {
					this.filter.countries = countries;
				}
				if (names) {
					this.filter.names = names;
				}
				this.getYearlyComparison({
					filter: this.filter,
					comparison_date_from: this.comparisonDateFrom,
					comparison_date_to: this.comparisonDateTo,
					selection_date_from: this.selectionDateFrom,
					selection_date_to: this.selectionDateTo,
				}).then((data) => {
					this.closeLoaderDialog();
					let chartLabel = [];
					let comparisonArr = [];
					let selectionArr = [];
					// let chartDatasets = [];

					this.dataList = data.list;
					this.dataList = this.dataList.map((d, index) => ({
						...d,
						serial_number: index + 1,
					}));
					for (data of this.dataList) {
						if (data.month_of_travel !== "TOTAL") {
							chartLabel.push(data.month_of_travel);
							comparisonArr.push(data.record_1);
							selectionArr.push(data.record_2);
						}
					}

					let chartDatasets = [
						{
							label:
								this.getFormattedDate(this.comparisonDateFrom, "MMM YYYY") +
								" to " +
								this.getFormattedDate(this.comparisonDateTo, "MMM YYYY"),
							data: comparisonArr,
							borderColor: "#acdcdc",
							backgroundColor: "#acdcdc",
						},
						{
							label:
								this.getFormattedDate(this.selectionDateFrom, "MMM YYYY") +
								" to " +
								this.getFormattedDate(this.selectionDateTo, "MMM YYYY"),
							data: selectionArr,
							borderColor: "#ecdcdc",
							backgroundColor: "ecdcdc",
						},
					];
					console.log("chartDatasets", chartDatasets);
					this.chartData = {
						labels: chartLabel,
						datasets: chartDatasets,
					};
					this.render = true;
				});
			},
			downloadReport() {
				let comparisonDate = JSON.parse(JSON.stringify(this.datePickerDate));
				comparisonDate.sort();
				this.comparisonDateFrom = moment(comparisonDate[0])
					.tz("Asia/Kolkata")
					.startOf("month")
					.toISOString();
				if (this.datePickerDate[1]) {
					this.comparisonDateTo = moment(comparisonDate[1])
						.tz("Asia/Kolkata")
						.endOf("month")
						.toISOString();
				} else {
					this.comparisonDateTo = this.comparisonDateFrom;
				}

				let selectionDate = JSON.parse(JSON.stringify(this.yearlyRevenueMainDate));
				selectionDate.sort();
				this.selectionDateFrom = moment(selectionDate[0])
					.tz("Asia/Kolkata")
					.startOf("month")
					.toISOString();
				this.selectionDateTo = moment(selectionDate[1])
					.tz("Asia/Kolkata")
					.endOf("month")
					.toISOString();

				let { business_types, countries, names } = this.yearlyRevenueFilter;
				if (business_types) {
					this.filter.business_types = business_types;
				}
				if (countries) {
					this.filter.countries = countries;
				}
				if (names) {
					this.filter.names = names;
				}

				this.openLoaderDialog();
				this.downloadComparisonReport({
					filter: this.filter,
					comparison_date_from: this.comparisonDateFrom,
					comparison_date_to: this.comparisonDateTo,
					selection_date_from: this.selectionDateFrom,
					selection_date_to: this.selectionDateTo,
					type: "comparison",
				}).then(() => {
					this.closeLoaderDialog();
				});
			},
			// updatedPageNo(page) {
			// 	this.getData();
			// },
		},
		watch: {
			datePickerDate: {
				deep: true,
				async handler(nv, ov) {
					this.errorMessage = this.isDateValid(nv);
				},
			},
			yearlyRevenueMainDate: {
				deep: true,
				async handler(nv, ov) {
					this.setDateRange();
					this.getData();
				},
			},
			currentTab(nv) {
				if (nv == 1) {
					this.render = false;
					setTimeout(() => {
						this.render = true;
					}, 0);
				}
			},
			yearlyRevenueFilter: {
				deep: true,
				async handler(nv, ov) {
					this.setDateRange();
					this.getData();
					console.log("yearlyRevenueFilter", this.yearlyRevenueFilter);
				},
			},
		},
		props: {},
	};
</script>

<style lang="scss" scopped>
	.yearlyComparison {
		padding: 20px 5px;
		height: 100%;
	}
</style>
