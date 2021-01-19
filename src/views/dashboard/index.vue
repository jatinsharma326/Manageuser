<template>
	<div class="DashboardWrapper">
		<v-tabs grow v-model="tab">
			<v-tab v-for="(ele, index) in tabConfig" :key="ele.id + '__' + index">
				<v-badge :value="ele.displayBadge" color="primary" dot>
					{{ ele.name }}
				</v-badge>
			</v-tab>
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
	import PartnerBirthdayReminders from "./PartnerBirthdayReminders";
	import Notifications from "./Notifications";
	import DashboardNotices from "./Notices";
	import helperMixin from "../../mixins/helperMixins";
	import moment from "moment-timezone";

	export default {
		name: "Dashboard",
		mixins: [helperMixin],
		components: {
			Followups,
			BirthdayReminders,
			PartnerBirthdayReminders,
			Notifications,
			DashboardNotices,
		},
		async created() {
			this.getDateRange();
			this.openLoaderDialog();
			await this.checkNotifications();
			this.closeLoaderDialog();
			this.setTabConfig();
		},
		data: () => ({
			tabConfig: [],
			tab: "",
			startDate: "",
			endDate: "",
			noticesBadge: false,
			birthdayBadge: false,
			followupBadge: false,
			dsrNotificationBadge: false,
		}),
		methods: {
			...mapMutations(["openLoaderDialog", "closeLoaderDialog", "openSnackbar"]),
			...mapActions("AdminBulletin", ["getAdminBulletin"]),
			...mapActions("NoticeBoard", ["getNoticeBoard"]),
			...mapActions("Dashboard", [
				"getDSRReminders",
				"getFollowUpReminders",
				"getAgentBirthdays",
				"getGDEmployeeBirthdays",
				"getPartnerBirthdays",
				"getPartnerEmployeeBirthdays",
				"getDSRNotification",
			]),
			getDateRange() {
				this.startDate = moment()
					.tz("Asia/Kolkata")
					.startOf("month");
				this.endDate = moment()
					.tz("Asia/Kolkata")
					.endOf("month");
				this.dateToday = moment().tz("Asia/Kolkata");
			},
			async checkNotifications() {
				await this.getAdminBulletin({
					filter: {
						date_from: this.startDate,
						date_to: this.endDate,
					},
					pageSize: 1,
					pageNo: 1,
				}).then((data) => {
					console.log("DATA", data.list[0]);
					if (data.ok && data.list.length) {
						console.log(this.isSelectedDateCurrentDate(data.list[0].date_of_creation));
						this.noticesBadge = this.isSelectedDateCurrentDate(data.list[0].date_of_creation);
					}
				});

				await this.getNoticeBoard({
					filter: {
						date_from: this.startDate,
						date_to: this.endDate,
					},
					pageSize: 1,
					pageNo: 1,
				}).then((data) => {
					if (data.ok && !this.noticesBadge && data.list.length) {
						console.log(this.isSelectedDateCurrentDate(data.list[0].date_of_creation));
						this.noticesBadge = this.isSelectedDateCurrentDate(data.list[0].date_of_creation);
					}
				});

				await this.getAgentBirthdays({
					pageSize: 1,
					pageNo: 1,
				}).then((data) => {
					if (data.ok && data.list.length) {
						console.log(this.isSelectedDateCurrentDate(data.list[0].birth_date));
						this.birthdayBadge = this.isSelectedDateCurrentDate(data.list[0].birth_date);
					}
				});

				await this.getGDEmployeeBirthdays({
					pageSize: 1,
					pageNo: 1,
				}).then((data) => {
					if (data.ok && !this.birthdayBadge && data.list.length) {
						console.log(this.isSelectedDateCurrentDate(data.list[0].birth_date));
						this.birthdayBadge = this.isSelectedDateCurrentDate(data.list[0].birth_date);
					}
				});

				await this.getPartnerBirthdays({
					pageSize: 1,
					pageNo: 1,
				}).then((data) => {
					if (data.ok && data.list.length) {
						console.log(this.isSelectedDateCurrentDate(data.list[0].birth_date));
						this.partnerBirthdayBadge = this.isSelectedDateCurrentDate(data.list[0].birth_date);
					}
				});

				await this.getPartnerEmployeeBirthdays({
					pageSize: 1,
					pageNo: 1,
				}).then((data) => {
					if (data.ok && !this.birthdayBadge && data.list.length) {
						console.log(this.isSelectedDateCurrentDate(data.list[0].birth_date));
						this.partnerBirthdayBadge = this.isSelectedDateCurrentDate(data.list[0].birth_date);
					}
				});

				if (this.userType == this.SALES_AGENT || this.userType == this.REMOTE_SALES_AGENT) {
					await this.getDSRReminders({
						pageSize: 1,
						pageNo: 1,
					}).then((data) => {
						if (data.ok && data.list.length) {
							console.log(this.isSelectedDateCurrentDate(data.list[0].follow_up_on_date));
							this.followupBadge = this.isSelectedDateCurrentDate(data.list[0].follow_up_on_date);
						}
					});

					await this.getFollowUpReminders({
						pageSize: 1,
						pageNo: 1,
					}).then((data) => {
						if (data.ok && !this.followupBadge && data.list.length) {
							console.log(this.isSelectedDateCurrentDate(data.list[0].reminder_date));
							this.followupBadge = this.isSelectedDateCurrentDate(data.list[0].reminder_date);
						}
					});
				}

				if (this.userType == this.SALES_AGENT) {
					await this.getDSRNotification({
						pageSize: 1,
						pageNo: 1,
					}).then((data) => {
						if (data.ok && data.list.length) {
							console.log(this.isSelectedDateCurrentDate(data.list[0].sales_call_data.date_of_call));
							this.dsrNotificationBadges = this.isSelectedDateCurrentDate(
								data.list[0].sales_call_data.date_of_call
							);
						}
					});
				}
			},
			setTabConfig() {
				let followupTabObj = {
					name: "Follow Ups",
					id: "followups",
					component: "Followups",
					props: {},
					displayBadge: this.followupBadge,
				};

				if (this.userType == this.SALES_AGENT) {
					this.tabConfig = [
						followupTabObj,
						{
							name: "Notifications",
							id: "notifications",
							component: "Notifications",
							props: {},
							displayBadge: this.dsrNotificationBadge,
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
					displayBadge: this.birthdayBadge,
				});

				this.tabConfig.push({
					name: "Partner Birthdays",
					id: "partnerBirthdays",
					component: "PartnerBirthdayReminders",
					props: {},
					displayBadge: this.partnerBirthdayBadge,
				});

				this.tabConfig.unshift({
					name: "Notices",
					id: "notices",
					component: "DashboardNotices",
					props: {},
					displayBadge: this.noticesBadge,
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
