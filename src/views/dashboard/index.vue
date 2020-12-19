<template>
	<div class="DashboardWrapper">
		<v-tabs grow v-model="tab">
			<v-tab v-for="(ele, index) in tabConfig" :key="ele.id + '__' + index">{{ ele.name }}</v-tab>
		</v-tabs>
		<v-tabs-items class="tabItemWrapper" v-model="tab">
			<v-tab-item v-for="(ele, index) in tabConfig" :key="ele.id + '__' + index">
				<component :dataProp="ele.props" v-bind:is="ele.component" />
			</v-tab-item>
		</v-tabs-items>
	</div>
</template>

<script>
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import Followups from "./Followups";
	import BirthdayReminders from "./BirthdayReminders";
	import Notifications from "./Notifications";
	import DashboardNotices from "./Notices";

	export default {
		name: "Dashboard",
		components: {
			Followups,
			BirthdayReminders,
			Notifications,
			DashboardNotices,
		},
		created() {
			this.setTabConfig();
		},
		data: () => ({
			tabConfig: [],
			tab: "",
		}),
		methods: {
			setTabConfig() {
				let followupTabObj = {
					name: "Follow Ups",
					id: "followups",
					component: "Followups",
					props: {},
				};

				if (this.userType == this.SALES_AGENT) {
					this.tabConfig = [
						followupTabObj,
						{
							name: "Notifications",
							id: "notifications",
							component: "Notifications",
							props: {},
						},
					];
				} else if (this.userType == this.REMOTE_SALES_AGENT) {
					this.tabConfig = [followupTabObj];
				}

				this.tabConfig.push({
					name: "Birthdays",
					id: "birthdays",
					component: "BirthdayReminders",
					props: {},
				});

				this.tabConfig.unshift({
					name: "Notices",
					id: "notices",
					component: "DashboardNotices",
					props: {},
				});
			},
		},
		computed: {
			...mapGetters(["userType", "REMOTE_SALES_AGENT", "SALES_AGENT", "MANAGEMENT", "ADMIN"]),
		},
		watch: {},
	};
</script>

<style lang="scss"></style>
