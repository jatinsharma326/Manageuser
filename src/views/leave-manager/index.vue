<template>
	<div class="leavesManagerWrapper">
		<adminLeaves v-if="userType == ADMIN || userType == MANAGEMENT"></adminLeaves>
		<salesLeaves v-else></salesLeaves>
	</div>
</template>

<script>
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import adminLeaves from "./AdminLeaves";
	import salesLeaves from "./SalesLeave";
	export default {
		name: "LeaveManager",
		created() {},
		components: {
			adminLeaves,
			salesLeaves,
		},
		data: () => ({}),
		methods: {},
		computed: {
			...mapGetters(["REMOTE_SALES_AGENT", "SALES_AGENT", "MANAGEMENT", "ADMIN", "userType"]),
		},
		watch: {},
		props: {},
	};
</script>
<style lang="scss" scoped></style>
