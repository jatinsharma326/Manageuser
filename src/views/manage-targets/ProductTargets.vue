<template>
	<div class="salesLeavesManagerWrapper">
		<div v-if="totalCount === 0" class="content-error-message">
			Please add a country to set Targets
		</div>
		<div v-else class="leaves-table">
			<!-- <v-data-table hide-default-footer :headers="headers" :items="productTargetList" mobile-breakpoint="300"> -->
			<v-data-table
				:items-per-page="fetchCount"
				:headers="headers"
				:items="productTargetList"
				mobile-breakpoint="300"
				hide-default-footer
			>
				<template v-slot:top>
					<v-toolbar flat>
						<v-toolbar-title>Product Wise Targets</v-toolbar-title>
						<v-divider class="mx-4" inset vertical></v-divider>
						<v-spacer></v-spacer>
						<v-btn v-if="targetsHaveUpdated" @click="discardChange" color="error" text>
							Discard Changes
						</v-btn>
						<v-btn v-if="targetsHaveUpdated" @click="saveChanges" color="primary" outlined>
							Save Changes
						</v-btn>
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
				<template v-slot:[`item.action`]="{ item }">
					<v-icon color="error" small @click="deleteTarget(item)">
						mdi-delete
					</v-icon>
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
	import inputFormMixin from "../../mixins/inputFormMixin";
	import searchMixin from "../../mixins/searchMixin";
	import { required, email, minLength, numeric, alpha } from "vuelidate/lib/validators";
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import helpers from "../../components/helpers";

	export default {
		name: "SalesLeaveManager",
		mixins: [defaultCRUDMixin, inputFormMixin, searchMixin],
		async created() {
			this.getData();
			let promises = [];
			promises.push(this.getCurrencyList());
			promises.push(this.getCountryList());
			await Promise.all(promises);
			this.setInputConfig(this.countriesList, this.currencyList);
		},
		components: {},
		data: () => ({
			name: "ProductTargets",
			inputConfig: [],
			headers: [
				{ text: "Sr. No.", value: "serial_number", width: 60 },
				{ text: "Product", align: "start", value: "country", width: 200 },
				{ text: "Target", value: "target", width: 150 },
				{ text: "Currency", value: "currency", width: 150 },
				{ text: "", value: "action", width: 150 },
			],
			productTargetList: [],
			initialTargetList: [],
			currencyList: [],
			countriesList: [],
			targetsHaveUpdated: false,
		}),
		methods: {
			...mapActions("ManageTargets", [
				"getTargetsForYear",
				"addTargetForYear",
				"editTargetForYear",
				"deleteTargetForYear",
				"getActiveCountries",
			]),
			...mapActions("Settings", ["getGlobalSettings"]),
			getCurrencyList() {
				// this.openLoaderDialog();
				return this.getGlobalSettings().then((data) => {
					// this.closeLoaderDialog();
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
				this.resetValues();
				this.getTargetsForYear({
					filter: {
						financial_year_id: this.targetYear._id,
					},
					financial_year_id: this.targetYear._id,
				}).then((data) => {
					this.closeLoaderDialog();
					this.productTargetList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;

					if (this.productTargetList.length) {
						this.productTargetList = this.productTargetList.map((d, index) => ({
							...d,
							serial_number: index + 1,
						}));
					}

					this.initialTargetList = JSON.parse(JSON.stringify(this.productTargetList));
				});
			},
			getCountryList() {
				// this.openLoaderDialog();
				return this.getActiveCountries().then((data) => {
					// this.closeLoaderDialog();
					this.countriesList = data.list;
				});
			},
			saveChanges() {
				let targetList = JSON.parse(JSON.stringify(this.productTargetList));
				for (let listItem of targetList) {
					if (!listItem.target) {
						listItem.target = 0;
					}
					listItem.target = Number(listItem.target);

					if (listItem.serial_number) {
						delete listItem.serial_number;
					}
				}
				this.openLoaderDialog();
				this.editTargetForYear({
					data: targetList,
					financial_year_id: this.targetYear._id,
				}).then((data) => {
					this.closeLoaderDialog();
					if (data.ok) {
						this.openSnackbar({ text: "Sucessfully edited the Target Entries" });
						this.getData();
					} else {
						this.openSnackbar({ text: data.message });
					}
				});
			},
			discardChange() {
				this.productTargetList = JSON.parse(JSON.stringify(this.initialTargetList));
			},
			setInputConfig(countries = [], currencyList = []) {
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
						type: "Number",
						key: "target",
						width: "full",
						validations: {
							required,
							minLength: minLength(1),
						},
					},
					{
						name: "Currency",
						type: "Dropdown",
						key: "currency",
						width: "full",
						multi: false,
						isListInStore: false,
						listItems: currencyList,
						validations: {
							required,
						},
					},
				];
			},
			formOutput(data) {
				var formData = JSON.parse(JSON.stringify(data));
				formData.financial_year_id = this.targetYear._id;
				formData.target = Number(formData.target);

				this.openLoaderDialog();
				if (!this.isEditMode) {
					this.addTargetForYear(formData)
						.then((data) => {
							this.closeLoaderDialog();
							if (data.ok) {
								this.openSnackbar({ text: "Sucessfully Added a target entry" });
								this.getData();
								this.closeForm();
							} else {
								this.openSnackbar({ text: data.message });
								this.closeForm();
							}
						})
						.catch((data) => {
							this.closeLoaderDialog();
							this.getData();
							this.closeForm();
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
			deleteTarget(target) {
				if (window.confirm("Do you really want to Delete the target row")) {
					this.openLoaderDialog();
					this.deleteTargetForYear({
						_id: target._id,
					}).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Deleted the Target row" });
							this.getData();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				}
			},
			resetValues() {
				this.productTargetList = [];
				this.initialTargetList = [];
				this.targetsHaveUpdated = false;
			},
		},
		watch: {
			productTargetList: {
				deep: true,
				handler(nv, ov) {
					if (ov.length) {
						this.targetsHaveUpdated = true;
					} else {
						this.targetsHaveUpdated = false;
					}
				},
			},
			targetYear: {
				deep: true,
				handler(nv, ov) {
					this.resetValues();
					this.getData();
				},
			},
		},
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
