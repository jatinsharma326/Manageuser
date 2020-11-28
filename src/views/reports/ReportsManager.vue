<template>
	<div class="reportsManagerWrapper">
		<template v-if="id == 'yearlyRevenue'">
			<v-tabs grow v-model="tab">
				<v-tab>Raw Data</v-tab>
				<!-- <v-tab>Employees</v-tab>
				<v-tab>Fam Trip</v-tab> -->
			</v-tabs>
			<v-tabs-items class="tabItemWrapper" v-model="tab">
				<v-tab-item>
					<!-- :name="name"
						:placeholder="placeholder"
						:userList="userList"
						:countriesList="countriesList" -->
					<YearlyRevenueRaw v-bind="{ ...propsList }"></YearlyRevenueRaw>
				</v-tab-item>
				<!-- <v-tab-item>
					<CompanyEmployees :companyInfo="companyInfo"></CompanyEmployees>
				</v-tab-item>
				<v-tab-item>
					<CompanyFamTrip :companyInfo="companyInfo"></CompanyFamTrip>
				</v-tab-item> -->
			</v-tabs-items>
		</template>
	</div>
</template>

<script>
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import YearlyRevenueRaw from "./YearlyRevenueRaw";
	// import CompanyEmployees from "./CompanyEmployees";
	// import CompanyFamTrip from "./CompanyFamTrip";

	export default {
		name: "ReportsManager",
		components: {
			YearlyRevenueRaw,
			// CompanyEmployees,
			// CompanyFamTrip,
		},
		created() {
			this.setProps();
			// this.getPartnerList();
		},
		data: () => ({
			tab: "",
			propsList: {},
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
