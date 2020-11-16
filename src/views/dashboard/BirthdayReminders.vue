<template>
	<div class="BirthdayRemindersWrapper">
		<div class="dashboardColumnWrapper">
			<div class="column-one column">
				<div class="title-section">
					<div class="title">Travel Agent Birthdays</div>
					<v-btn color="tertiary" icon @click="showColumnOne = !showColumnOne">
						<v-icon>{{ showColumnOne ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
					</v-btn>
				</div>
				<!-- <v-expand-transition> -->
				<div v-show="showColumnOne">
					<div class="content-section">
						<div
							v-for="(person, index) in travelAgentBirthdays"
							:key="index + '_travelAgentEmployee'"
							class="card-element"
						>
							<InformationCard :expandCard="false">
								<template v-slot:topLeft>
									{{ person.company_data.name }}
								</template>
								<template v-slot:topRight>
									{{ getFormattedDate(person.birth_date) }}
								</template>
								<template v-slot:mainContent>
									{{ person.name + " ( " + person.designation + " )" }}
								</template>
								<template v-slot:mainContentSubtitle>
									{{ daysUntil(person.birth_date) }}
								</template>
							</InformationCard>
						</div>
					</div>
				</div>
				<!-- </v-expand-transition> -->
			</div>
			<div class="column-two column">
				<div class="title-section">
					<div class="title">GD Empoyees Birthdays</div>
					<v-btn color="tertiary" icon @click="showColumnTwo = !showColumnTwo">
						<v-icon>{{ showColumnTwo ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
					</v-btn>
				</div>
				<!-- <v-expand-transition> -->
				<div v-show="showColumnTwo">
					<div class="content-section">
						<div
							v-for="(person, index) in gloablDestinationsBirthdays"
							:key="index + '_GDEmployee'"
							class="card-element"
						>
							<InformationCard :expandCard="false">
								<template v-slot:topLeft>
									{{ person.usr_data.designation }}
								</template>
								<template v-slot:topRight>
									{{ getFormattedDate(person.birth_date) }}
								</template>
								<template v-slot:mainContent>
									{{ person.usr_data.name }}
								</template>
								<template v-slot:mainContentSubtitle>
									{{ daysUntil(person.birth_date) }}
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
		name: "BirthdayReminders",
		mixins: [helperMixin],
		components: { InformationCard },
		created() {
			this.getAgentBirthdayList();
			this.getGDEmployeeBirthdayList();
		},
		data: () => ({
			showColumnOne: true,
			showColumnTwo: true,
			travelAgentBirthdays: [],
			gloablDestinationsBirthdays: [],
		}),
		methods: {
			...mapMutations(["openLoaderDialog", "closeLoaderDialog", "openSnackbar"]),
			...mapActions("Dashboard", ["getAgentBirthdays", "getGDEmployeeBirthdays"]),

			getAgentBirthdayList() {
				this.openLoaderDialog();
				this.getAgentBirthdays({
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
						this.openSnackbar({ text: "Failed to Fetched Agent Birthday List" });
					}
					this.travelAgentBirthdays = data.list;
					// this.totalCount = data.totalCount;
					// this.fetchCount = data.fetchCount;
				});
			},
			getGDEmployeeBirthdayList() {
				this.openLoaderDialog();
				this.getGDEmployeeBirthdays({
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
						this.openSnackbar({ text: "Failed to Fetched Employee Birthday List" });
					}
					this.gloablDestinationsBirthdays = data.list;
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

<style lang="scss">
	.dashboardColumnWrapper {
		display: flex;
		justify-content: space-evenly;
		align-items: flex-start;
		@include custom-max(767px) {
			flex-wrap: wrap;
		}

		.column {
			flex: 0 0 46%;
			margin: 15px 10px 10px 10px;
			padding: 10px;
			border: 1px solid $primary;
			border-radius: 5px;
			@include custom-max(767px) {
				flex: 0 0 94%;
			}
		}

		.title-section {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 5px 10px;
			.title {
				display: inline-block;
			}
		}

		.content-section {
			display: grid;
			grid-gap: 0;
			grid-template-rows: max-content;
			height: calc(86vh - 64px - 48px);
			overflow: auto;
			/*
			grid-template-columns: 50% 50%;

			@include custom-max(1050px) {
				grid-template-columns: 50% 50%;
			}
			@include custom-max(767px) {
				grid-template-columns: 100%;
			}
			*/
		}
	}
</style>
