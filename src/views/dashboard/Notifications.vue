<template>
	<div class="NotificationsWrapper">
		<div class="dashboardColumnWrapper">
			<div class="column-one column">
				<div class="title-section">
					<div class="title">DSR Notifications</div>
					<v-btn color="tertiary" icon @click="showColumnOne = !showColumnOne">
						<v-icon>{{ showColumnOne ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
					</v-btn>
				</div>
				<!-- <v-expand-transition> -->
				<div v-show="showColumnOne">
					<div class="content-section">
						<div
							v-for="(listItem, index) in notificationsList"
							:key="index + '_DSRNotifications'"
							class="card-element"
						>
							<InformationCard :expandCard="true">
								<template v-slot:topLeft>
									{{ listItem.sales_call_data.sr_no }}
								</template>
								<template v-slot:topRight>
									{{ getFormattedDate(listItem.follow_up_on_date) }}
								</template>
								<template v-slot:mainContent>
									{{
										listItem.travel_agent_employee.name +
											" ( " +
											listItem.travel_agent_employee.designation +
											" )"
									}}
								</template>
								<template v-slot:mainContentSubtitle>
									{{ daysUntil(listItem.follow_up_on_date) }}
								</template>
								<template v-slot:moreInfo>
									<div @click="toggleReadmore(listItem)" :class="setClass(listItem)">
										{{ listItem.meeting_remark }}
									</div>
								</template>
								<template v-slot:actionButtons>
									{{ listItem.countries.join(", ") }}
								</template>
								<template v-slot:expandCardContent>
									<v-list>
										<v-list-item
											v-for="(number, index) in listItem.travel_agent_employee.phone_numbers"
											:key="listItem._id + '+' + index"
										>
											<v-list-item-icon>
												<v-icon v-if="index == 0" color="secondary">
													mdi-phone
												</v-icon>
											</v-list-item-icon>

											<v-list-item-content>
												<v-list-item-title>{{ number }}</v-list-item-title>
											</v-list-item-content>
										</v-list-item>

										<v-divider inset></v-divider>

										<v-list-item>
											<v-list-item-icon>
												<v-icon color="secondary">
													mdi-email
												</v-icon>
											</v-list-item-icon>

											<v-list-item-content>
												<v-list-item-title>{{
													listItem.travel_agent_employee.email_ids.join(", ")
												}}</v-list-item-title>
											</v-list-item-content>
										</v-list-item>

										<v-divider inset></v-divider>

										<v-list-item>
											<v-list-item-icon>
												<v-icon color="secondary">
													mdi-map-marker
												</v-icon>
											</v-list-item-icon>

											<v-list-item-content>
												<v-list-item-title>{{
													listItem.company_address_data.branch_name +
														" ( " +
														listItem.company_data.name +
														" )"
												}}</v-list-item-title>
												<v-list-item-subtitle>{{
													listItem.company_address_data.address +
														", " +
														listItem.company_address_data.zone +
														", " +
														listItem.company_address_data.state +
														", " +
														listItem.company_address_data.city +
														", " +
														listItem.company_address_data.pincode
												}}</v-list-item-subtitle>
											</v-list-item-content>
										</v-list-item>
									</v-list>
								</template>
							</InformationCard>
						</div>
					</div>
				</div>
				<!-- </v-expand-transition> -->
			</div>
		</div>
	</div>
</template>

<script>
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import InformationCard from "../../components/InformationCard";
	import helperMixin from "../../mixins/helperMixins";
	export default {
		name: "Notifications",
		mixins: [helperMixin],
		components: { InformationCard },
		created() {
			this.getDSRRemindersList();
		},
		data: () => ({
			showColumnOne: true,
			notificationsList: [],
			hideCompleteRemark: {},
		}),
		methods: {
			...mapMutations(["openLoaderDialog", "closeLoaderDialog", "openSnackbar"]),
			...mapActions("Dashboard", ["getDSRReminders", "getFollowUpReminders"]),

			getFollowUpRemindersList() {
				this.openLoaderDialog();
				this.getFollowUpReminders({
					// filter: {
					// 	type: this.type,
					// 	search_text: this.search_text,
					// 	active: this.activeState,
					// },
					// pageSize: this.pageSize,
					// pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					if (!data.ok) {
						this.openSnackbar({ text: "Failed to Fetched Follow Up List" });
					}
					this.notificationsList = data.list;
					// this.totalCount = data.totalCount;
					// this.fetchCount = data.fetchCount;
				});
			},
			initializeToggleObject(list) {
				for (let listItem of list) {
					this.$set(this.hideCompleteRemark, listItem._id, true);
				}
			},
			toggleReadmore(listItem) {
				this.hideCompleteRemark[listItem._id] = !this.hideCompleteRemark[listItem._id];
			},
			setClass(listItem) {
				return { "hide-complete-content": this.hideCompleteRemark[listItem._id] };
			},
		},
		computed: {},
		watch: {},
	};
</script>

<style lang="scss">
	.NotificationsWrapper {
		.more-info {
			cursor: pointer;
		}
	}
</style>
