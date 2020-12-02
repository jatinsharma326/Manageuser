<template>
	<div class="yearlyZone">
		<div class="leaves-table">
			<v-data-table
				:items-per-page="pageSize"
				hide-default-footer
				:headers="headers"
				item-key="_id"
				:items="dataList"
			>
			</v-data-table>
		</div>
		<div class="charts">
			<BarChart v-if="render" :myTabId="1" :chartData="chartData" :options="chartOptions"></BarChart>
		</div>
	</div>
</template>

<script>
	import BarChart from "../../components/BarChart";
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
			BarChart,
		},
		async created() {
			this.getData();
		},
		data: () => ({
			render: false,
			dataList: [],
			pageSize: 20,
			filter: {},
			selectionDateFrom: "",
			selectionDateTo: "",
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
			headers: [
				{ text: "Sr. No.", align: "start", value: "serial_number", width: 100 },
				{ text: "Month", value: "month_of_travel", width: 150 },
				{ text: "East", value: "east", width: 150 },
				{ text: "West(Guj)", value: "west_guj", width: 150 },
				{ text: "West", value: "west", width: 200 },
				{ text: "South", value: "south", width: 200 },
				{ text: "North", value: "north", width: 200 },
				{ text: "Total", value: "total", width: 200 },
			],
		}),
		computed: {
			...mapGetters("Reports", ["yearlyRevenueMainDate", "yearlyRevenueFilter", "currentTab"]),
			dateRangeText() {
				return this.datePickerDate.join(" ~ ");
			},
		},
		methods: {
			...mapActions("Reports", ["getYearlyZone"]),
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
				this.getYearlyZone({
					filter: this.filter,
					selection_date_from: this.selectionDateFrom,
					selection_date_to: this.selectionDateTo,
				}).then((data) => {
					this.closeLoaderDialog();
					let chartLabel = [];
					let northArr = [];
					let southArr = [];
					let eastArr = [];
					let westArr = [];
					let westGujArr = [];
					this.dataList = data.list;
					this.dataList = this.dataList.map((d, index) => ({
						...d,
						serial_number: index + 1,
					}));
					for (data of this.dataList) {
						if (data.month_of_travel !== "TOTAL") {
							chartLabel.push(data.month_of_travel);
							northArr.push(data.north);
							southArr.push(data.south);
							eastArr.push(data.east);
							westArr.push(data.west);
							westGujArr.push(data.west_guj);
						}
					}
					let chartDatasets = [
						{
							label: "East",
							data: eastArr,
							borderColor: "#acdcdc",
							backgroundColor: "#acdcdc",
						},
						{
							label: "West(Guj)",
							data: westGujArr,
							borderColor: "#ecdcdc",
							backgroundColor: "ecdcdc",
						},
						{
							label: "West",
							data: westArr,
							borderColor: "#ecdcdc",
							backgroundColor: "ecdcdc",
						},
						{
							label: "South",
							data: southArr,
							borderColor: "#ecdcdc",
							backgroundColor: "ecdcdc",
						},
						{
							label: "North",
							data: northArr,
							borderColor: "#ecdcdc",
							backgroundColor: "ecdcdc",
						},
					];
					// console.log("chartDatasets", chartDatasets);
					this.chartData = {
						labels: chartLabel,
						datasets: chartDatasets,
					};
					this.render = true;
				});
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
				if (nv == 2) {
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
