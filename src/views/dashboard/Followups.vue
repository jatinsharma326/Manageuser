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
							<!-- <InformationCard :expandCard="false">
								<template v-slot:topLeft>
									{{ listItem.usr_data.designation }}
								</template>
								<template v-slot:topRight>
									{{ getFormattedDate(listItem.birth_date) }}
								</template>
								<template v-slot:mainContent>
									{{ listItem.usr_data.name }}
								</template>
								<template v-slot:mainContentSubtitle>
									{{ daysUntil(listItem.birth_date) }}
								</template>
							</InformationCard> -->
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
									{{ listItem.meeting_remark }}
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
			// getFollowUpRemindersList();
		},
		data: () => ({
			showColumnOne: true,
			showColumnTwo: true,
			DSRReminders: [
				{
					status: "ON GOING",
					// follow_up_on_date: null,
					// meeting_remark: "Test",
					countries: ["Brazil"],
					sales_call_data: {
						date_of_call: "2020-11-14T18:30:00.000Z",
						// sr_no: "NOV20-1",
					},
					// travel_agent_employee: {
					// 	// name: "Ishwar Kumar",
					// 	// designation: "SS",
					// 	email_ids: [],
					// 	phone_numbers: ["656565"],
					// },
					// company_data: {
					// 	name: "Faridabad Consultants",
					// },
					// company_address_data: {
					// 	branch_name: "Taherabad",
					// 	state: "Maharashtra",
					// 	city: "Mumbai",
					// 	pincode: "400008",
					// 	zone: "NORTH",
					// 	address: "Bandra",
					// },
				},
			],
			followUpReminders: [],
		}),
		methods: {
			...mapMutations(["openLoaderDialog", "closeLoaderDialog", "openSnackbar"]),
			...mapActions("Dashboard", ["getDSRReminders", "getFollowUpReminders"]),

			getDSRRemindersList() {
				this.openLoaderDialog();
				this.getDSRReminders({
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

<style lang="scss"></style>
