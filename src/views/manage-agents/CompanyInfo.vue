<template>
	<div class="companyInfoWrapper">
		<v-tabs grow v-model="tab">
			<v-tab>Addresses</v-tab>
			<v-tab>Employees</v-tab>
			<v-tab>Fam Trip</v-tab>
		</v-tabs>
		<v-tabs-items class="tabItemWrapper" v-model="tab">
			<v-tab-item>
				<CompanyAddresses :companyInfo="companyInfo"></CompanyAddresses>
			</v-tab-item>
			<v-tab-item>
				<CompanyEmployees :companyInfo="companyInfo"></CompanyEmployees>
			</v-tab-item>
			<v-tab-item>
				<CompanyFamTrip :companyInfo="companyInfo"></CompanyFamTrip>
			</v-tab-item>
		</v-tabs-items>
	</div>
</template>

<script>
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import CompanyAddresses from "./CompanyAddresses";
	import CompanyEmployees from "./CompanyEmployees";
	import CompanyFamTrip from "./CompanyFamTrip";

	export default {
		name: "CompanyInfo",
		components: {
			CompanyAddresses,
			CompanyEmployees,
			CompanyFamTrip,
		},
		created() {
			// this.getPartnerList();
		},
		data: () => ({
			tab: "",
		}),
		computed: {
			...mapGetters([]),
		},
		methods: {
			...mapActions([]),
		},
		props: {
			companyInfo: { required: true, type: Object },
		},
	};
</script>
<style lang="scss">
	.companyInfoWrapper {
		height: 100%;
		.tabItemWrapper {
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
	}
</style>
