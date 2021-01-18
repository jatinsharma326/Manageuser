<template>
	<div class="BirthdayRemindersWrapper">
		<div class="dashboardColumnWrapper">
			<div class="column-one column">
				<div class="title-section">
					<div class="title">Partner Birthdays</div>
					<v-btn color="tertiary" icon @click="showColumnOne = !showColumnOne">
						<v-icon>{{ showColumnOne ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
					</v-btn>
				</div>
				<div class="contentSectionWrapper" v-show="showColumnOne">
					<div v-if="columnOneTotalCount === 0" class="content-error-message">
						Please add Date of Birth for any of your Partners.
					</div>
					<div v-else class="content-section">
						<div
							v-for="(person, index) in partnerBirthdays"
							:key="index + '_travelAgentEmployee'"
							class="card-element"
						>
							<InformationCard :isBirthDate="checkForBirthDate(person.birth_date)" :expandCard="false">
								<template v-slot:topLeft>
									{{ person.company_data.name }}
								</template>
								<template v-slot:topRight>
									{{ getFormattedDate(person.birth_date, "DD/MM") }}
								</template>
								<template v-slot:mainContent>
									{{ person.name + " ( " + person.designation + " )" }}
								</template>
								<template v-slot:mainContentSubtitle>
									{{ daysUntil(person.birth_date, "Today 🎂🎉 ") }}
								</template>
							</InformationCard>
						</div>
						<div v-if="columnOnePageSize < columnOneTotalCount" class="action-button">
							<v-btn color="secondary" text @click="loadMoreColumnOne">
								View More
							</v-btn>
						</div>
					</div>
				</div>
			</div>
			<div class="column-two column">
				<div class="title-section">
					<div class="title">Teams Birthdays</div>
					<v-btn color="tertiary" icon @click="showColumnTwo = !showColumnTwo">
						<v-icon>{{ showColumnTwo ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
					</v-btn>
				</div>
				<div class="contentSectionWrapper" v-show="showColumnTwo">
					<div class="content-section">
						<div
							v-for="(person, index) in gloablDestinationsBirthdays"
							:key="index + '_GDEmployee'"
							class="card-element"
						>
							<InformationCard
								:isBirthDate="isSelectedDateCurrentDate(person.birth_date)"
								:expandCard="false"
							>
								<template v-slot:topLeft>
									{{ person.usr_data.designation }}
								</template>
								<template v-slot:topRight>
									{{ getFormattedDate(person.birth_date, "DD/MM") }}
								</template>
								<template v-slot:mainContent>
									{{ person.usr_data.name }}
								</template>
								<template v-slot:mainContentSubtitle>
									{{ daysUntil(person.birth_date, "Today 🎂🎉 ") }}
								</template>
							</InformationCard>
						</div>
						<div v-if="columnTwoPageSize < columnTwoTotalCount" class="action-button">
							<v-btn color="secondary" text @click="loadMoreColumnTwo">
								View More
							</v-btn>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import InformationCard from "../../components/InformationCard";
	import helperMixin from "../../mixins/helperMixins";
	import moment from "moment-timezone";
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
			pageNo: 1,
			columnOnePageSize: 20,
			columnTwoPageSize: 20,
			columnOneTotalCount: "",
			columnTwoTotalCount: "",
			partnerBirthdays: [],
			gloablDestinationsBirthdays: [],
		}),
		methods: {
			...mapMutations(["openLoaderDialog", "closeLoaderDialog", "openSnackbar"]),
			...mapActions("Dashboard", ["getAgentBirthdays", "getGDEmployeeBirthdays"]),

			loadMoreColumnOne() {
				this.columnOnePageSize = this.columnOnePageSize + 20;
				this.getAgentBirthdayList();
			},
			loadMoreColumnTwo() {
				this.columnTwoPageSize = this.columnTwoPageSize + 20;
				this.getGDEmployeeBirthdayList();
			},
			checkForBirthDate(date) {
				let dateToCheck = moment(date)
					.tz("Asia/Kolkata")
					.format("DD-MM-YYYY");
				let dateToday = moment()
					.tz("Asia/Kolkata")
					.format("DD-MM-YYYY");
				if (dateToday == dateToCheck) {
					return true;
				}
				return false;
			},
			getAgentBirthdayList() {
				this.openLoaderDialog();
				this.getAgentBirthdays({
					pageSize: this.columnOnePageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					if (!data.ok) {
						this.openSnackbar({ text: "Failed to Fetched Agent Birthday List" });
					}
					this.partnerBirthdays = data.list;
					this.columnOneTotalCount = data.totalCount;
				});
			},
			getGDEmployeeBirthdayList() {
				this.openLoaderDialog();
				this.getGDEmployeeBirthdays({
					pageSize: this.columnTwoPageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					if (!data.ok) {
						this.openSnackbar({
							text: "Failed to Fetched Employee Birthday List",
						});
					}
					this.gloablDestinationsBirthdays = data.list;
					this.columnTwoTotalCount = data.totalCount;
				});
			},
		},
		computed: {},
		watch: {},
	};
</script>

<style lang="scss">
	.BirthdayRemindersWrapper {
		.card-element:last-child {
			padding-bottom: 10px;
		}
	}

	.birthday-gif {
		background-image: url("../../assets/BirthdayGIF.gif");
		background-repeat: no-repeat;
		background-size: contain;
		background-position: right;
	}

	.breathing {
		animation: breathing 5s ease-out infinite normal;
	}

	@keyframes breathing {
		0% {
			transform: scale(1);
		}

		25% {
			transform: scale(1.05);
		}

		50% {
			transform: scale(1);
		}

		75% {
			transform: scale(1.05);
		}

		100% {
			transform: scale(1);
		}
	}
</style>
