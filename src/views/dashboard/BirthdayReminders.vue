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
									{{ person.name }}
								</template>
								<template v-slot:topRight>
									{{ person.designation }}
								</template>
								<template v-slot:mainContent>
									{{ getFormattedDate(person.birth_date) }}
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
									{{ person.usr_data.name }}
								</template>
								<template v-slot:topRight>
									{{ person.usr_data.designation }}
								</template>
								<template v-slot:mainContent>
									{{ getFormattedDate(person.birth_date) }}
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
		created() {},
		data: () => ({
			showColumnOne: true,
			showColumnTwo: true,
			travelAgentBirthdays: [
				{
					name: "Ishwar Kumar",
					designation: "SS",
					dob: "1995-07-21T18:30:00.000Z",
					inputYear: 2021,
					birth_date: "2021-07-21T00:00:00.000Z",
				},
			],
			gloablDestinationsBirthdays: [
				{
					usr_data: {
						name: "Atul Chhetri",
						dob: "1988-12-01T18:30:00.000Z",
						designation: "Manager - Sales ",
					},
					inputYear: 2020,
					birth_date: "2020-12-01T00:00:00.000Z",
				},
				{
					usr_data: {
						name: "Sameena Reshamvala ",
						dob: "1976-12-07T18:30:00.000Z",
						designation: "Manager - Sales ",
					},
					inputYear: 2020,
					birth_date: "2020-12-07T00:00:00.000Z",
				},
				{
					usr_data: {
						name: "Manasi Shenoy ",
						dob: "1998-01-07T18:30:00.000Z",
						designation: "Manager - Sales ",
					},
					inputYear: 2021,
					birth_date: "2021-01-07T00:00:00.000Z",
				},
				{
					usr_data: {
						name: "Payel Dutta",
						dob: "1988-01-23T18:30:00.000Z",
						designation: "Manager - Sales ",
					},
					inputYear: 2021,
					birth_date: "2021-01-23T00:00:00.000Z",
				},
				{
					usr_data: {
						name: "Shabbir Kapadia",
						dob: "1984-01-30T18:30:00.000Z",
						designation: "Manager - Sales ",
					},
					inputYear: 2021,
					birth_date: "2021-01-30T00:00:00.000Z",
				},
				{
					usr_data: {
						name: "Pearl Ghadiali ",
						dob: "1996-02-06T18:30:00.000Z",
						designation: "Manager - Sales ",
					},
					inputYear: 2021,
					birth_date: "2021-02-06T00:00:00.000Z",
				},
				{
					usr_data: {
						name: "Hycinth D'Souza ",
						dob: "1988-02-10T18:30:00.000Z",
						designation: "Manager - Sales ",
					},
					inputYear: 2021,
					birth_date: "2021-02-10T00:00:00.000Z",
				},
				{
					usr_data: {
						name: "Ali Pocketwala",
						dob: "2008-02-13T18:30:00.000Z",
						designation: "Sales Lead",
					},
					inputYear: 2021,
					birth_date: "2021-02-13T00:00:00.000Z",
				},
				{
					usr_data: {
						name: "Kanishka Khemani ",
						dob: "1979-04-22T18:30:00.000Z",
						designation: "Country Manager ",
					},
					inputYear: 2021,
					birth_date: "2021-04-22T00:00:00.000Z",
				},
				{
					usr_data: {
						name: "Sunil Menon",
						dob: "1993-05-05T18:30:00.000Z",
						designation: "Country Manager ",
					},
					inputYear: 2021,
					birth_date: "2021-05-05T00:00:00.000Z",
				},
				{
					usr_data: {
						name: "Hiten Dhruv ",
						dob: "1983-05-16T18:30:00.000Z",
						designation: "Manager - Sales ",
					},
					inputYear: 2021,
					birth_date: "2021-05-16T00:00:00.000Z",
				},
				{
					usr_data: {
						name: "Aditi Desai",
						dob: "1997-06-03T18:30:00.000Z",
						designation: "Manager - Sales ",
					},
					inputYear: 2021,
					birth_date: "2021-06-03T00:00:00.000Z",
				},
				{
					usr_data: {
						name: "Pranav Kapadia",
						dob: "1970-06-29T18:30:00.000Z",
						designation: "Founder ",
					},
					inputYear: 2021,
					birth_date: "2021-06-29T00:00:00.000Z",
				},
				{
					usr_data: {
						name: "Parth Mehta",
						dob: "1989-07-09T18:30:00.000Z",
						designation: "Manager - Sales ",
					},
					inputYear: 2021,
					birth_date: "2021-07-09T00:00:00.000Z",
				},
				{
					usr_data: {
						name: "Nupoor Desai ",
						dob: "1984-08-18T18:30:00.000Z",
						designation: "Manager - Sales ",
					},
					inputYear: 2021,
					birth_date: "2021-08-18T00:00:00.000Z",
				},
				{
					usr_data: {
						name: "Pruthvi Khetani ",
						dob: "1980-09-09T18:30:00.000Z",
						designation: "CEO",
					},
					inputYear: 2021,
					birth_date: "2021-09-09T00:00:00.000Z",
				},
				{
					usr_data: {
						name: "Admin",
						dob: "2020-10-01T07:51:41.381Z",
						designation: "Admin",
					},
					inputYear: 2021,
					birth_date: "2021-10-01T00:00:00.000Z",
				},
				{
					usr_data: {
						name: "Admin",
						dob: "2020-10-01T07:51:41.381Z",
						designation: "Admin",
					},
					inputYear: 2021,
					birth_date: "2021-10-01T00:00:00.000Z",
				},
				{
					usr_data: {
						name: "Admin",
						dob: "2020-10-01T07:51:41.381Z",
						designation: "Admin",
					},
					inputYear: 2021,
					birth_date: "2021-10-01T00:00:00.000Z",
				},
				{
					usr_data: {
						name: "Christina Aitiwadekar",
						dob: "1990-10-03T18:30:00.000Z",
						designation: "Manager - Sales ",
					},
					inputYear: 2021,
					birth_date: "2021-10-03T00:00:00.000Z",
				},
				{
					usr_data: {
						name: "Jai Beniwal",
						dob: "1986-10-19T18:30:00.000Z",
						designation: "Manager - Sales ",
					},
					inputYear: 2021,
					birth_date: "2021-10-19T00:00:00.000Z",
				},
				{
					usr_data: {
						name: "Atul Chhetri",
						dob: "1988-12-01T18:30:00.000Z",
						designation: "Manager - Sales ",
					},
					inputYear: 2021,
					birth_date: "2021-12-01T00:00:00.000Z",
				},
				{
					usr_data: {
						name: "Sameena Reshamvala ",
						dob: "1976-12-07T18:30:00.000Z",
						designation: "Manager - Sales ",
					},
					inputYear: 2021,
					birth_date: "2021-12-07T00:00:00.000Z",
				},
			],
		}),
		methods: {
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

		.column {
			flex: 0 0 46%;
			margin: 10px;
			padding: 10px;
			border: 1px solid $primary;
			border-radius: 5px;
		}

		.title-section {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.title {
				display: inline-block;
			}
		}

		.content-section {
			display: grid;
			grid-gap: 0;
			// grid-template-columns: 50% 50%;
			grid-template-rows: max-content;

			// @include custom-max(1050px) {
			// 	grid-template-columns: 50% 50%;
			// }
			// @include custom-max(767px) {
			// 	grid-template-columns: 100%;
			// }
		}
	}
</style>
