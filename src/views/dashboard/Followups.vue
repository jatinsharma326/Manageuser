<template>
	<div class="FollowupsWrapper">
		<div class="dashboardColumnWrapper">
			<div class="column-one column">
				<div class="title-section">
					<div class="title">Follow Up Reminders</div>
					<v-btn color="tertiary" icon @click="showColumnOne = !showColumnOne">
						<v-icon>{{ showColumnOne ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
					</v-btn>
				</div>
				<!-- <v-expand-transition> -->
				<div v-show="showColumnOne">
					<div class="content-section">
						<div
							v-for="(listItem, index) in followUpReminders"
							:key="index + '_followUpReminders'"
							class="card-element"
						>
							<InformationCard :expandCard="true">
								<template v-slot:topLeft>
									{{ listItem.status }}
								</template>
								<template v-slot:topRight>
									Date of Enquiry: {{ getFormattedDate(listItem.date_of_enquiry) }}
								</template>
								<template v-slot:mainContent>
									{{ listItem.contact_person + " ( " + listItem.company_data.name + " )" }}
								</template>
								<template v-slot:mainContentSubtitle>
									{{ daysUntil(listItem.reminder_date) }}
								</template>
								<template v-slot:moreInfo>
									<div @click="toggleReadmore(listItem)" :class="setClass(listItem)">
										{{ listItem.email_subject }}
									</div>
								</template>
								<template v-slot:actionButtons>
									{{ listItem.country }}
								</template>
								<template v-slot:expandCardContent>
									<v-list>
										<v-list-item>
											<v-list-item-icon>
												<v-icon color="secondary">
													mdi-clock-time-four-outline
												</v-icon>
											</v-list-item-icon>

											<v-list-item-content>
												<v-list-item-title>Date of travel</v-list-item-title>
												<v-list-item-subtitle>{{
													getFormattedDate(listItem.date_of_travel)
												}}</v-list-item-subtitle>
											</v-list-item-content>
										</v-list-item>

										<template v-if="listItem.contact_number">
											<v-divider inset></v-divider>
											<v-list-item>
												<v-list-item-icon>
													<v-icon color="secondary">
														mdi-phone
													</v-icon>
												</v-list-item-icon>

												<v-list-item-content>
													<v-list-item-title>{{ listItem.contact_number }}</v-list-item-title>
												</v-list-item-content>
											</v-list-item>
										</template>
										<template v-if="listItem.remark">
											<v-divider inset></v-divider>
											<v-list-item>
												<v-list-item-icon>
													<v-icon color="secondary">
														mdi-note
													</v-icon>
												</v-list-item-icon>

												<v-list-item-content>
													<v-list-item-title>{{ listItem.remark }}</v-list-item-title>
												</v-list-item-content>
											</v-list-item>
										</template>
									</v-list>
								</template>
							</InformationCard>
						</div>
					</div>
				</div>
				<!-- </v-expand-transition> -->
			</div>
			<div class="column-two column">
				<div class="title-section">
					<div class="title">DSR Reminders</div>
					<v-btn color="tertiary" icon @click="showColumnTwo = !showColumnTwo">
						<v-icon>{{ showColumnTwo ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
					</v-btn>
				</div>
				<!-- <v-expand-transition> -->
				<div v-show="showColumnTwo">
					<div class="content-section">
						<div
							v-for="(listItem, index) in DSRReminders"
							:key="index + '_DSRReminders'"
							class="card-element"
						>
							<InformationCard :expandCard="true">
								<template v-slot:topLeft>
									{{ listItem.sales_call_data.sr_no }}
									<!-- {{ listItem.company_data.name }} -->
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
									<!-- {{ listItem.travel_agent_employee }} -->
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
		name: "Followups",
		mixins: [helperMixin],
		components: { InformationCard },
		created() {
			this.getDSRRemindersList();
			this.getFollowUpRemindersList();
			// this.initializeToggleObject();
		},
		data: () => ({
			showColumnOne: true,
			showColumnTwo: true,
			DSRReminders: [],
			followUpReminders: [],
			hideCompleteRemark: {},
		}),
		methods: {
			...mapMutations(["openLoaderDialog", "closeLoaderDialog", "openSnackbar"]),
			...mapActions("Dashboard", ["getDSRReminders", "getFollowUpReminders"]),

			getDSRRemindersList() {
				this.openLoaderDialog();
				return this.getDSRReminders({
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
						this.openSnackbar({ text: "Failed to Fetched DSR Reminder List" });
					}
					this.initializeToggleObject(data.list);
					this.DSRReminders = data.list;
					// this.totalCount = data.totalCount;
					// this.fetchCount = data.fetchCount;
				});
			},
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
					this.followUpReminders = data.list;
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
			// daysUntil(dateToCheckAgainst) {
			// 	let dateToCheck = moment(dateToCheckAgainst);
			// 	let dateToday = moment();
			// 	if (dateToday.format("DD-MM-YYYY") == dateToCheck.format("DD-MM-YYYY")) {
			// 		return "Today";
			// 	} else {
			// 		return dateToday.to(dateToCheck);
			// 	}
			// },
		},
		computed: {},
		watch: {},
	};
</script>

<style lang="scss">
	.FollowupsWrapper {
		.more-info {
			cursor: pointer;
		}
	}
</style>
