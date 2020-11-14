<template>
	<div class="BirthdayRemindersWrapper">
		<div class="dashboardColumnWrapper">
			<div class="column-one column">
				<div class="title-section">
					<div class="title">Travel Agent Birthdays</div>
					<v-btn color="tertiary" icon @click="show = !show">
						<v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
					</v-btn>
				</div>
			</div>
			<div class="column-two column">
				<div class="title-section">
					<div class="title">GD Empoyees Birthdays</div>
					<v-btn color="tertiary" icon @click="show = !show">
						<v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
					</v-btn>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import InformationCard from "../../components/InformationCard";
	export default {
		name: "BirthdayReminders",
		components: { InformationCard },
		created() {},
		data: () => ({
			show: false,
		}),
		methods: {},
		computed: {},
		watch: {},
	};
</script>

<style lang="scss">
	.dashboardColumnWrapper {
		display: flex;
		justify-content: space-evenly;

		.column {
			flex: 0 0 46%;
			margin: 10px;
			padding: 10px;
			border: 1px solid $primary;
			border-radius: 5px;
		}
	}
</style>
