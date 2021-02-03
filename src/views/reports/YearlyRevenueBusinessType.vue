<template>
	<div class="yearlyZone">
		<div class="download-reports">
			<!-- <v-btn :disabled="checkDownloadButtonStatus" color="primary" text @click.stop="downloadReport()"
				>Download Report</v-btn
			> -->
			<v-btn :disabled="checkDownloadButtonStatus" color="secondary" text @click.stop="downloadChart()"
				>Download Chart</v-btn
			>
		</div>
		<!-- <div class="leaves-table">
			<v-data-table
				:items-per-page="pageSize"
				hide-default-footer
				:headers="headers"
				item-key="_id"
				:items="dataList"
			>
			</v-data-table>
		</div> -->
		<div class="charts">
			<PieChart v-if="render" :myTabId="1" :chartData="chartData" :options="chartOptions"></PieChart>
		</div>
	</div>
</template>

<script>
	import PieChart from "../../components/PieChart";
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import searchMixin from "../../mixins/searchMixin";
	import datePickerMixin from "../../mixins/datePickerMixin";
	import helperMixin from "../../mixins/helperMixins";
	import moment from "moment-timezone";
	import { mapActions, mapGetters, mapMutations } from "vuex";

	export default {
		name: "YearlyRevenueZone",
		mixins: [defaultCRUDMixin, helperMixin],
		components: {
			PieChart,
		},
		async created() {
			this.getData();
		},
		data: () => ({
			render: false,
			dataList: [],
			pageSize: 100,
			filter: {},
			selectionDateFrom: "",
			selectionDateTo: "",
			chartData: {},
			chartOptions: {
				responsive: true,
				maintainAspectRatio: false,
			},
			headers: [
				{ text: "Sr. No.", align: "start", value: "serial_number", width: 100 },
				{ text: "Business Type", value: "business_type", width: 150 },
				{ text: "Revenue", value: "total_revenue", width: 150 },
			],
		}),
		computed: {
			...mapGetters("Reports", ["yearlyRevenueMainDate", "yearlyRevenueFilter", "currentTab"]),
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
			...mapActions("Reports", ["getYearlyBusinessType", "downloadYearlyZoneReport"]),
			...mapMutations([]),
			getData() {
				this.openLoaderDialog();
				this.render = false;

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

				let { business_types, countries, names, zones } = this.yearlyRevenueFilter;
				if (business_types) {
					this.filter.business_types = business_types;
				}
				if (countries) {
					this.filter.countries = countries;
				}
				if (names) {
					this.filter.names = names;
				}
				if (zones) {
					this.filter.zones = zones;
				}
				this.getYearlyBusinessType({
					filter: this.filter,
					selection_date_from: this.selectionDateFrom,
					selection_date_to: this.selectionDateTo,
				}).then((data) => {
					this.closeLoaderDialog();
					let chartLabel = [];
					// let northArr = [];
					// let southArr = [];
					// let eastArr = [];
					// let westArr = [];
					// let westGujArr = [];
					this.dataList = data.list;
					// console.log("this.dataList", this.dataList);
					let labelArray = [];
					let dataArray = [];

					if (this.dataList.length) {
						this.dataList = this.dataList.map((d, index) => {
							labelArray.push(d.business_type);
							dataArray.push(d.total_revenue);

							return {
								...d,
								serial_number: index + 1,
							};
						});
					}
					// console.log("labelArray", labelArray);
					// console.log("dataArray", dataArray);
					// for (data of this.dataList) {
					// 	if (data.month_of_travel !== "TOTAL") {
					// 		chartLabel.push(data.month_of_travel);
					// 		northArr.push(data.north);
					// 		southArr.push(data.south);
					// 		eastArr.push(data.east);
					// 		westArr.push(data.west);
					// 		westGujArr.push(data.west_guj);
					// 	}
					// }
					let chartDatasets = [
						{
							data: dataArray,
							borderColor: [
								"RGB(240, 182, 127",
								"RGB(254, 95, 85)",
								"RGB(60, 21, 24)",
								"RGB(46, 134, 171)",
								"RGB(105, 20, 14)",
								"RGB(0, 38, 38)",
							],
							backgroundColor: [
								"RGB(240, 182, 127, 0.75)",
								"RGB(254, 95, 85, 0.75)",
								"RGB(60, 21, 24, 0.75)",
								"RGB(46, 134, 171, 0.75)",
								"RGB(105, 20, 14, 0.75)",
								"RGB(0, 38, 38, 0.75)",
							],
						},
					];
					this.chartData = {
						labels: labelArray,
						datasets: chartDatasets,
					};
					this.render = true;
				});
			},
			// downloadReport() {
			// 	let selectionDate = JSON.parse(JSON.stringify(this.yearlyRevenueMainDate));
			// 	selectionDate.sort();

			// 	this.selectionDateFrom = moment(selectionDate[0])
			// 		.tz("Asia/Kolkata")
			// 		.startOf("month")
			// 		.toISOString();
			// 	this.selectionDateTo = moment(selectionDate[1])
			// 		.tz("Asia/Kolkata")
			// 		.endOf("month")
			// 		.toISOString();

			// 	let { business_types, countries, names, zones } = this.yearlyRevenueFilter;
			// 	if (business_types) {
			// 		this.filter.business_types = business_types;
			// 	}
			// 	if (countries) {
			// 		this.filter.countries = countries;
			// 	}
			// 	if (names) {
			// 		this.filter.names = names;
			// 	}
			// 	if (zones) {
			// 		this.filter.zones = zones;
			// 	}

			// 	this.openLoaderDialog();
			// 	this.downloadYearlyZoneReport({
			// 		filter: this.filter,
			// 		selection_date_from: this.selectionDateFrom,
			// 		selection_date_to: this.selectionDateTo,
			// 		type: "zone",
			// 	}).then(() => {
			// 		this.closeLoaderDialog();
			// 	});
			// },
			downloadChart() {
				let fileName =
					this.getFormattedDate(this.selection_date_from, "YYYY-MM") +
					" to " +
					this.getFormattedDate(this.selection_date_to, "YYYY-MM");

				let canvas = document.querySelector(".charts canvas");
				let dataURL = canvas.toDataURL();
				let a = document.createElement("a");
				a.href = dataURL;
				a.download = "Yearly Revenue Business Type Chart from " + fileName + ".png";
				a.click();
			},
		},
		watch: {
			yearlyRevenueMainDate: {
				deep: true,
				async handler(nv, ov) {
					this.getData();
				},
			},
			currentTab(nv) {
				if (nv == 3) {
					this.render = false;
					setTimeout(() => {
						this.render = true;
					}, 0);
				}
			},
			yearlyRevenueFilter: {
				deep: true,
				async handler(nv, ov) {
					this.getData();
				},
			},
		},
		props: {},
	};
</script>

<style lang="scss" scopped>
	.yearlyZone {
		padding: 20px 5px;
		height: 100%;
	}
	.companyaddress-search-bar {
		margin-top: 12px;
		display: flex;
		justify-content: center;
	}
</style>
