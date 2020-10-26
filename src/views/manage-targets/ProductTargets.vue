<template>
	<div class="salesLeavesManagerWrapper">
		<div class="leaves-table">
			<!-- <v-data-table hide-default-footer :headers="headers" :items="productTargetList" mobile-breakpoint="300"> -->
			<v-data-table
				:items-per-page="fetchCount"
				:headers="headers"
				:items="productTargetList"
				mobile-breakpoint="300"
			>
				<template v-slot:top>
					<v-toolbar flat>
						<v-toolbar-title>Product Wise Targets</v-toolbar-title>
						<v-divider class="mx-4" inset vertical></v-divider>
						<v-spacer></v-spacer>
						<v-btn @click="discardChange" color="error" text> Discard Changes </v-btn>
						<v-btn @click="saveChanges" color="primary" outlined> Save Changes </v-btn>
					</v-toolbar>
				</template>
				<template v-slot:[`item.target`]="props">
					<v-edit-dialog :return-value.sync="props.item.target" large persistent>
						<div>{{ props.item.target }}</div>
						<template v-slot:input>
							<div class="mt-4 title">
								Update Target
							</div>
							<v-text-field
								v-model="props.item.target"
								type="number"
								label="Edit target value"
								single-line
								autofocus
								required
								:rules="[(v) => !!v || 'Input can\'t be empty!']"
							></v-text-field>
						</template>
					</v-edit-dialog>
				</template>
				<template v-slot:[`item.currency`]="props">
					<v-edit-dialog :return-value.sync="props.item.currency" large persistent>
						<div>{{ props.item.currency }}</div>
						<template v-slot:input>
							<div class="mt-4 title">
								Update currency
							</div>
							<v-autocomplete
								v-model="props.item.currency"
								label="Edit currency value"
								chips
								clearable
								:items="currencyList"
								:multiple="false"
							></v-autocomplete>
						</template>
					</v-edit-dialog>
				</template>
			</v-data-table>
		</div>

		<UserForm
			@formOutput="formOutput"
			@closeForm="closeForm"
			:name="name"
			:inputConfig="inputConfig"
			:toggleForm="toggleForm"
			:isEditMode="false"
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
		name: "SalesLeaveManager",
		mixins: [defaultCRUDMixin],
		created() {
			this.getData();
			this.getCurrencyList();
		},
		components: {},
		data: () => ({
			name: "ProductTargets",
			inputConfig: [],
			headers: [
				{ text: "Sr. No.", value: "serial_number", width: 100 },
				{ text: "Product", align: "start", value: "country", width: 200 },
				{ text: "Target", value: "target", width: 150 },
				{ text: "Currency", value: "currency", width: 150 },
				{ text: "", value: "action", width: 150 },
			],
			productTargetList: [],
			initialTargetList: [],
			currencyList: [],
			countriesList: [],
		}),
		methods: {
			...mapActions("ManageTargets", ["getTargetsForYear", "getActiveCountries"]),
			...mapActions("Settings", ["getGlobalSettings"]),
			getCurrencyList() {
				this.openLoaderDialog();
				this.getGlobalSettings().then((data) => {
					this.closeLoaderDialog();
					if (!data.ok) {
						this.openSnackbar({ text: "Failed to Fetch Currency list" });
					}
					this.currencyList = data.activeCurrencies.map(function(active) {
						return active.currency_type;
					});
				});
			},
			getData() {
				this.openLoaderDialog();
				this.getTargetsForYear({
					filter: {
						year: this.targetYear.year,
					},
				}).then((data) => {
					this.closeLoaderDialog();
					this.productTargetList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;

					this.productTargetList = this.productTargetList.map((d, index) => ({
						...d,
						serial_number: index + 1,
					}));
					this.initialTargetList = data.list;
				});
			},
			getCountryList() {
				this.openLoaderDialog();
				this.getActiveCountries().then((data) => {
					console.log("countries List", data);
					this.closeLoaderDialog();
					this.countriesList = data.list;
				});
			},
			saveChanges() {
				// Edit API call here
			},
			discardChange() {
				this.productTargetList = this.initialTargetList;
			},
			setInputConfig(countries = []) {
				this.inputConfig = [
					{
						name: "Country",
						type: "Dropdown",
						key: "country",
						width: "full",
						multi: false,
						isListInStore: false,
						listItems: countries,
						validations: {
							required,
						},
					},
					{
						name: "Target",
						type: "String",
						key: "target",
						width: "half",
						validations: {
							required,
							minLength: minLength(1),
						},
					},
					{
						name: "Country",
						type: "Dropdown",
						key: "country",
						width: "half",
						multi: false,
						isListInStore: false,
						listItems: countries,
						validations: {
							required,
						},
					},
				];
			},
			formOutput(data) {
				var formData = JSON.parse(JSON.stringify(data));
				formData.date_from = helpers.getISODate(formData.date_from);
				formData.date_to = helpers.getISODate(formData.date_to);
				formData.no_of_days = Number(formData.no_of_days);
				console.log("Before API call FormData Object", formData);

				this.openLoaderDialog();
				if (!this.isEditMode) {
					this.addLeave(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Added a Leave Entry" });
							console.log("Sucessfully Added a Leave Entry");
							this.getData();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
							console.log("Failed to add a Leave Entry");
						}
					});
				} else {
					this.editLeave(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully edited the Leave entry" });
							console.log("Sucessfully edited the Leave entry");
							this.getData();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
							console.log("Failed to edit the Leave entry");
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
			deleteLeaveEntry(user) {
				console.log("Delete", user);
				if (window.confirm("Do you really want to Delete the Leave Entry?")) {
					this.openLoaderDialog();
					this.deleteLeave({
						_id: user._id,
					}).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Deleted Leave" });
							this.getEmployees();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				}
			},
		},
		watch: {},
		props: {
			targetYear: {
				type: Object,
				required: true,
			},
		},
	};
</script>
<style lang="scss" scoped>
	.leaves-title-section {
		display: flex;
		justify-content: space-between;

		margin: 20px;
		.leaves-title {
			font-size: 20px;
			font-weight: 600;
		}
	}
	.leaves-table {
		margin: 10px;
		padding: 10px;
		border: 1px solid $primary;
		border-radius: 5px;
	}
	.expandable-section {
		background-color: white;
		.expandable-section-title {
			font-size: 16px;
			font-weight: 600;
		}
		// .expandable-section-content {
		// }
	}
</style>
