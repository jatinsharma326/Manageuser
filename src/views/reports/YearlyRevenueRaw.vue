<template>
	<div class="companyInfoWrapper"></div>
</template>

<script>
	import { mapActions, mapGetters, mapMutations } from "vuex";
	// import CompanyAddresses from "./CompanyAddresses";
	// import CompanyEmployees from "./CompanyEmployees";
	// import CompanyFamTrip from "./CompanyFamTrip";

	export default {
		name: "ReportsManager",
		components: {
			// CompanyAddresses,
			// CompanyEmployees,
			// CompanyFamTrip,
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
			name: { required: true, type: String },
			placeholder: { required: false, type: String },
			businessType: { required: false, type: Array, default: () => [] },
			userList: { required: false, type: Array, default: () => [] },
			countriesList: { required: false, type: Array, default: () => [] },
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
