<template>
	<div class="leavesManagerWrapper">
		<!-- <adminLeaves></adminLeaves> -->
		<salesLeaves></salesLeaves>
	</div>
</template>

<script>
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
		watch: {},
		props: {},
	};
</script>
<style lang="scss" scoped></style>
