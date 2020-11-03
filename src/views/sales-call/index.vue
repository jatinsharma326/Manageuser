<template>
	<div class="manageSalesCallWrapper">
		<v-tabs grow v-model="tab">
			<v-tab v-for="(ele, index) in tabConfig" :key="ele.id + '__' + index">{{ ele.name }}</v-tab>
		</v-tabs>
		<v-tabs-items class="tabItemWrapper" v-model="tab">
			<v-tab-item v-for="(ele, index) in tabConfig" :key="ele.id + '__' + index">
				<callsList v-bind="{ ...ele.props }"></callsList>
			</v-tab-item>
		</v-tabs-items>
	</div>
</template>

<script>
	import { required, email, minLength, numeric, alpha } from "vuelidate/lib/validators";
	import { mapActions, mapGetters } from "vuex";
	import callsList from "./callsList";
	export default {
		name: "ManageUsers",
		components: { Users },
		created() {
			this.getPartnerList();
		},
		data: () => ({
			tab: "",
			tabConfig: [
				{
					name: "Sales Call",
					id: "salesCall",
					component: "Users",
					props: {
						name: "Sales Call",
						type: "sales_call",
						placeholder: "Search Sales Call",
						inputConfig: [
							{
								name: "Date of Visit*",
								type: "Date",
								key: "dob",
								width: "half",
								validations: {
									required,
								},
							},
						],
					},
				},
				{
					name: "Remote Sales Team",
					id: "allSalesCall",
					component: "Users",
					props: {
						name: "All Sales Call",
						type: "all_sales_call",
						placeholder: "Search All Sales Call",
					},
				},
			],
		}),
		computed: {
			...mapGetters([]),
		},
		methods: {
			...mapActions(["getPartnerList"]),
		},
	};
</script>
<style lang="scss">
	.manageSalesCallWrapper {
		height: 100%;
		.tabItemWrapper {
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
	}
</style>
