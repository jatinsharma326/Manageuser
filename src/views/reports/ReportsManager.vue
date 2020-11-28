<template>
	<div class="reportsManagerWrapper">
		<template v-if="id == 'yearlyRevenue'">
			<v-tabs grow v-model="tab">
				<v-tab>Raw Data</v-tab>
				<v-tab>Yearly Comparison</v-tab>
				<v-tab>Zone Wise Summary</v-tab>
			</v-tabs>
			<v-tabs-items class="tabItemWrapper" v-model="tab">
				<v-tab-item>
					<YearlyRevenueRaw
						@mainDateRange="yearlyRevenueMainDate"
						v-bind="{ ...propsList }"
					></YearlyRevenueRaw>
				</v-tab-item>
				<v-tab-item>
					<YearlyRevenueComparison></YearlyRevenueComparison>
				</v-tab-item>
				<v-tab-item>
					<YearlyRevenueZone></YearlyRevenueZone>
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

	export default {
		name: "ReportsManager",
		components: {
			YearlyRevenueRaw,
			YearlyRevenueComparison,
			YearlyRevenueZone,
		},
		created() {
			this.setProps();
			// this.getPartnerList();
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
			setProps() {
				this.propsList = {
					name: this.name,
					placeholder: this.placeholder,
					userList: this.userList,
					countriesList: this.countriesList,
				};
			},
		},
		watch: {},
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
