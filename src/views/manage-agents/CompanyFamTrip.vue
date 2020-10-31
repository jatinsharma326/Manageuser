<template>
	<div class="famTripWrapper">
		<v-row class="px-6 famtrip-search-bar" justify="center" align="center">
			<v-col cols="12" sm="8" md="6">
				<Search
					@queryString="queryString"
					@filterObject="advanceSearch"
					@clearFilter="advanceSearch"
					:placeholder="placeholder"
					:isAdvanceSearch="true"
					:filterConfig="selectedSearchConfig"
				></Search>
			</v-col>
		</v-row>

		<div class="card-wrapper">
			<div v-for="trip in tripList" :key="trip._id" class="card-element">
				<InformationCard :expandCard="true">
					<template v-slot:topLeft>
						{{ trip.dot }}
					</template>
					<template v-slot:topRight>
						{{ trip.no_of_days }}
					</template>
					<template v-slot:mainContent>
						{{ trip.country }}
					</template>
					<template v-slot:mainContentSubtitle>
						{{ trip.representing_partner }}
					</template>
					<template v-slot:actionButtons>
						<template>
							<v-btn
								v-if="(userType == ADMIN || userType == MANAGEMENT) && trip.record.active"
								@click="openInputForm(true, trip)"
								color="secondary"
								text
							>
								Edit
							</v-btn>
						</template>
					</template>
					<template v-slot:expandCardContent>
						<v-list>
							<v-list-item v-for="(passenger, index) in trip.passengers" :key="trip._id + '+' + index">
								<v-list-item-content>
									<v-list-item-title>{{ passenger }}</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</template>
				</InformationCard>
			</div>
		</div>

		<div class="text-center">
			<v-pagination
				@input="updatedPageNo"
				v-model="pageNo"
				:length="Math.ceil(fetchCount / pageSize)"
			></v-pagination>
		</div>

		<!-- :keysToWatch="keysToWatch" -->
		<UserForm
			@formOutput="formOutput"
			@closeForm="closeForm"
			:name="name"
			:inputConfig="inputConfig"
			:toggleForm="toggleForm"
			:formData="rowToEdit"
			:isEditMode="isEditMode"
		></UserForm>

		<div class="floating-button">
			<v-btn @click="openInputForm()" color="primary" dark fab>
				<v-icon>mdi-plus</v-icon>
			</v-btn>
		</div>
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import { required, email, minLength, numeric, alpha } from "vuelidate/lib/validators";
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import helpers from "../../components/helpers";

	export default {
		name: "FamTrip",
		mixins: [defaultCRUDMixin],
		components: {},
		created() {
			// this.getFamTrips();
			// this.setSearchConfig();
		},
		data: () => ({
			tripList: [
				{
					_id: "5f9030204c38c0313714",
					dot: "2020-09-30T18:30:00.000Z",
					no_of_days: "Sachin Tendulkar",
					country: "SS",
					passengers: ["Ali Pocketwala", "Rohan Dhamapurkar"],
					representing_partner: "Allied T Pro",
					admin_grade: "C",
					record: {
						created_on: "2020-10-21T10:52:50.445Z",
						updated_on: "2020-10-21T10:52:50.445Z",
						active: true,
					},
				},
			],
			search_text: "",
			name: "Fam Trip Log",
			// keysToWatch: ["countries"],
			inputConfig: [
				// {
				// 	name: "Employee Name*",
				// 	type: "String",
				// 	key: "name",
				// 	width: "half",
				// 	validations: {
				// 		required,
				// 		minLength: minLength(1),
				// 	},
				// },
				// {
				// 	name: "Designation",
				// 	type: "String",
				// 	key: "designation",
				// 	width: "half",
				// },
				// {
				// 	name: "Business Type*",
				// 	type: "Dropdown",
				// 	key: "business_types",
				// 	width: "half",
				// 	multi: true,
				// 	isListInStore: true,
				// 	listVariable: "businessType",
				// 	validations: {
				// 		required,
				// 	},
				// },
				// {
				// 	name: "Branch Name*",
				// 	type: "Dropdown",
				// 	key: "branch_name",
				// 	width: "half",
				// 	multi: true,
				// 	isListInStore: true,
				// 	listVariable: "businessType",
				// 	validations: {
				// 		required,
				// 	},
				// },
				// {
				// 	name: "Email",
				// 	type: "MultiInput",
				// 	key: "email_ids",
				// 	width: "full",
				// 	validations: {
				// 		$each: {
				// 			input: {
				// 				email,
				// 			},
				// 		},
				// 	},
				// },
				// {
				// 	name: "Contact Numbers*",
				// 	type: "MultiInput",
				// 	key: "phone_numbers",
				// 	width: "half",
				// 	validations: {
				// 		required,
				// 		minLength: minLength(1),
				// 		$each: {
				// 			input: {
				// 				required,
				// 				minLength: minLength(8),
				// 			},
				// 		},
				// 	},
				// },
				// {
				// 	name: "DOB*",
				// 	type: "Date",
				// 	key: "dob",
				// 	width: "oneThird",
				// 	validations: {
				// 		required,
				// 	},
				// },
			],
			placeholder: "Search Fam Trip",
		}),
		computed: {},
		methods: {
			...mapActions("ManageAgents", ["getFamTripList", "addFamTrip", "editFamTrip"]),
			getFamTrip() {
				this.openLoaderDialog();
				this.getFamTripList({
					filter: this.filter,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.tripList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;
				});
			},
			queryString(data) {
				this.filter["search_text"] = data;
				this.getFamTrip();
			},
			advanceSearch(filterObject) {
				this.filter = { ...filterObject };
				this.pageNo = 1;
				this.getFamTrip();
			},
			async formOutput(data) {
				var tempFile = data.logo;
				var formData = JSON.parse(JSON.stringify(data));
				// formData.email_ids = formData.email_ids.map((data) => data.input).filter((e) => e != "");
				// formData.logo = tempFile;
				// var tempArray = [];
				// var tempObj = {};

				// // loop over the emergency contacts objects to convert it into theh backend format
				// for (let contact of formData.emergency_contacts) {
				// 	tempObj = {};
				// 	for (let num of contact.input) {
				// 		if (num.input != "") {
				// 			tempObj["country"] = contact.groupKey;
				// 			if (!tempObj["contacts"]) tempObj["contacts"] = [];
				// 			tempObj["contacts"].push(num.input);
				// 		}
				// 	}
				// 	if (Object.keys(tempObj).length) {
				// 		tempArray.push(tempObj);
				// 	}
				// }
				// formData.emergency_contacts = tempArray;

				// // remove logo key if it's empty
				// if (formData.logo) {
				// 	formData.logo = await helpers.toBase64(formData.logo);
				// } else {
				// 	delete formData.logo;
				// }

				console.log("Before API call FormData Object", formData);

				this.openLoaderDialog();
				if (!this.isEditMode) {
					this.addFamTrip(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Added Fam Trip" });
							this.getFamTrip();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
							this.getFamTrip();
						}
					});
				} else {
					this.editFamTrip(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Edited Fam Trip" });
							this.getFamTrip();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
							this.getFamTrip();
						}
					});
				}
			},
			getEditRowObject(data) {
				return {
					...data,
					_id: data._id,
					updated_on: data.record.updated_on,
				};
			},
			disableEmployee(data) {
				if (
					window.confirm(
						"Do you really want to " +
							(data.record.active ? "Disable the Fam Trip?" : "Enable the Fam Trip?")
					)
				) {
					this.openLoaderDialog();
					this.editFamTrip({
						_id: data._id,
						active: !data.record.active,
						updated_on: data.record.updated_on,
						disable: true,
					}).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Updated Fam Trip Status" });
							this.getFamTrip();
						} else {
							this.openSnackbar({ text: data.message });
							this.getFamTrip();
						}
					});
				}
			},
			setSearchConfig() {
				this.selectedSearchConfig = [
					{
						name: "Partner Name",
						key: "name",
						type: "text",
						inputType: "textfield",
						defaultValue: "",
					},
					{
						name: "Business Type",
						key: "business_types",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: true,
						listVariable: "businessType",
					},
					{
						name: "Countries",
						key: "countries",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: true,
						listVariable: "countries",
					},
				];
			},
			updatedPageNo(page) {
				this.getFamTrip();
			},
		},
	};
</script>

<style lang="scss" scopped>
	.FamTripWrapper {
		padding: 20px 5px;
		height: 100%;
		// display: flex;
		// flex-direction: column;
	}
	.card-image img {
		max-width: 100%;
	}
	.famtrip-search-bar {
		margin-top: 12px;
	}
</style>

<style lang="scss">
	.famtripWrapper .v-list-item__title,
	.v-list-item__subtitle {
		white-space: normal;
	}
</style>
