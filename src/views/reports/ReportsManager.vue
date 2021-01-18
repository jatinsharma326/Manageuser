<template>
	<div class="reportsManagerWrapper">
		<template v-if="id == 'yearlyRevenue'">
			<v-tabs grow v-model="tab">
				<v-tab>Raw Data</v-tab>
				<v-tab>Yearly Comparison</v-tab>
				<v-tab>Zone Wise Summary</v-tab>
				<v-tab>Business Type Summary</v-tab>
			</v-tabs>
			<v-tabs-items class="tabItemWrapper" v-model="tab">
				<v-tab-item>
					<YearlyRevenueRaw @switchTab="switchTab" v-bind="{ ...propsList }"></YearlyRevenueRaw>
				</v-tab-item>
				<v-tab-item>
					<YearlyRevenueComparison @switchTab="switchTab"></YearlyRevenueComparison>
				</v-tab-item>
				<v-tab-item>
					<YearlyRevenueZone @switchTab="switchTab"></YearlyRevenueZone>
				</v-tab-item>
				<v-tab-item>
					<YearlyRevenueBusinessType @switchTab="switchTab"></YearlyRevenueBusinessType>
				</v-tab-item>
			</v-tabs-items>
		</template>
		<template v-if="id == 'travelAgent'">
			<v-tabs grow v-model="tab">
				<v-tab>Raw Data</v-tab>
			</v-tabs>
			<v-tabs-items class="tabItemWrapper" v-model="tab">
				<v-tab-item>
					<TravelAgentReport v-bind="{ ...propsList }"></TravelAgentReport>
				</v-tab-item>
			</v-tabs-items>
		</template>
		<template v-if="id == 'zoneOrCity'">
			<v-tabs grow v-model="tab">
				<v-tab>Zone</v-tab>
				<v-tab>City</v-tab>
			</v-tabs>
			<v-tabs-items class="tabItemWrapper" v-model="tab">
				<v-tab-item>
					<ZoneReport v-bind="{ ...propsList }"></ZoneReport>
				</v-tab-item>
				<v-tab-item>
					<CityReport v-bind="{ ...propsList }"></CityReport>
				</v-tab-item>
			</v-tabs-items>
		</template>
		<template v-if="id == 'target'">
			<v-tabs grow v-model="tab">
				<v-tab>Target Overview</v-tab>
			</v-tabs>
			<v-tabs-items class="tabItemWrapper" v-model="tab">
				<v-tab-item>
					<TargetReport v-bind="{ ...propsList }"></TargetReport>
				</v-tab-item>
			</v-tabs-items>
		</template>
	</div>
</template>

<script>
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import YearlyRevenueRaw from "./YearlyRevenueRaw";
	import YearlyRevenueComparison from "./YearlyRevenueComparison";
	import YearlyRevenueZone from "./YearlyRevenueZone";
	import YearlyRevenueBusinessType from "./YearlyRevenueBusinessType";
	import TravelAgentReport from "./TravelAgentReport";
	import ZoneReport from "./ZoneReport";
	import CityReport from "./CityReport";
	import TargetReport from "./TargetReport";

	export default {
		name: "ReportsManager",
		components: {
			YearlyRevenueRaw,
			YearlyRevenueComparison,
			YearlyRevenueZone,
			TravelAgentReport,
			ZoneReport,
			CityReport,
			TargetReport,
		},
		created() {
			this.setProps();
		},
		data: () => ({
			tab: "",
			propsList: {},
			yearlyRevenueMainDate: [],
		}),
		computed: {
			...mapGetters([]),
		},
		methods: {
			...mapActions([]),
			...mapMutations("Reports", ["setCurrentTab"]),
			setProps() {
				this.propsList = {
					name: this.name,
					placeholder: this.placeholder,
					userList: this.userList,
					countriesList: this.countriesList,
				};
			},
			switchTab(tabId) {
				this.tab = tabId;
			},
		},
		watch: {
			tab(nv) {
				this.setCurrentTab(nv);
			},
		},
		props: {
			name: { required: true, type: String },
			id: { required: true, type: String },
			placeholder: { required: false, type: String },
			userList: { required: false, type: Array, default: () => [] },
			countriesList: { required: false, type: Array, default: () => [] },
		},
	};
</script>
<style lang="scss">
	.reportsManagerWrapper {
		height: 100%;
		.tabItemWrapper {
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
	}
</style>
