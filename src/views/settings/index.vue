<template>
	<div class="settingsWrapper">
		<div class="settings-row">
			<div class="settings-key">
				<div class="key-title">Total Number of paid leaves</div>
				<div class="key-subtitle">
					Total number of paid leaves for the next financial year
				</div>
			</div>
			<div class="settings-value text-field">
				<v-text-field v-model="totalPaidLeaves" label="No of Leaves"></v-text-field>
			</div>
		</div>
		<div class="settings-row">
			<div class="settings-key">
				<div class="key-title">Currency</div>
				<div class="key-subtitle">
					Please select a currency from the dropdown. List of active currency below the dropdown
				</div>
			</div>
			<div class="settings-value">
				<div class="currency-dropdown">
					<v-autocomplete
						v-model="currencyValue"
						label="Select a Currency"
						chips
						deletable-chips
						:items="allCurrencies"
						:multiple="true"
					></v-autocomplete>
				</div>
				<div class="currency-table">
					<v-data-table
						hide-default-footer
						:headers="headers"
						:items="activeCurrencies"
						mobile-breakpoint="300"
					>
						<template v-slot:[`item.conversion_to_usd`]="props">
							<v-edit-dialog :return-value.sync="props.item.conversion_to_usd" large persistent>
								<div>{{ props.item.conversion_to_usd }}</div>
								<template v-slot:input>
									<div class="mt-4 title">
										Update Conversion Rate
									</div>
									<v-text-field
										v-model="props.item.conversion_to_usd"
										type="number"
										label="Edit Conversion Rate"
										single-line
										autofocus
										required
										:rules="[(v) => !!v || 'Input can\'t be empty!']"
									></v-text-field>
								</template>
							</v-edit-dialog>
						</template>
					</v-data-table>
				</div>
			</div>
		</div>
		<div class="settings-row">
			<div class="settings-key">
				<div class="key-title">Policies</div>
				<div class="key-subtitle">
					Company Policies
				</div>
			</div>
			<div class="settings-value text-field">
				<div class="file-input">
					<v-file-input
						v-model="file"
						class="file-picker"
						accept="application/pdf"
						:label="policiesCheck()"
					></v-file-input>
					<v-progress-circular v-if="showProgress" :value="uploadPercentage"></v-progress-circular>
				</div>
				<div class="upload-actions">
					<v-btn
						outlined
						:disabled="!showProgress && file ? false : true"
						color="primary"
						class="action-button"
						@click="uploadFile()"
						>Upload</v-btn
					>
					<v-btn color="green" class="action-button" v-if="policies" @click="downloadPoliciesF()" text
						>Download</v-btn
					>
				</div>
			</div>
		</div>
		<v-btn color="primary" @click="editAdminSettings">SUBMIT</v-btn>
	</div>
</template>

<script>
	import { mapActions, mapGetters, mapMutations } from "vuex";

	export default {
		name: "Settings",
		components: {},
		created() {
			this.getSettings();
			// this.currencyValue = this.activeCurrencies.map(function(active) {
			//   return active.currency_type;
			// });
		},
		mounted() {},
		data: () => ({
			totalPaidLeaves: 0,
			activeCurrencies: [],
			policies: false,
			file: null,
			showProgress: false,
			headers: [
				{
					text: "Currency Name",
					align: "start",
					sortable: false,
					value: "currency_type",
				},
				{ text: "Conversion to USD", value: "conversion_to_usd" },
			],
			currencyValue: [],
		}),
		methods: {
			...mapActions("Settings", [
				"getGlobalSettings",
				"updateGlobalSettings",
				"uploadPolicies",
				"downloadPolicies",
			]),
			...mapMutations(["openLoaderDialog", "closeLoaderDialog", "openSnackbar"]),
			getSettings() {
				this.openLoaderDialog();
				this.getGlobalSettings().then((data) => {
					this.closeLoaderDialog();
					if (!data.ok) {
						this.openSnackbar({ text: "Failed to Fetch Global settings" });
					}
					this.totalPaidLeaves = data.totalPaidLeaves;
					this.activeCurrencies = data.activeCurrencies;
					this.policies = data.policies;
					this.currencyValue = this.activeCurrencies.map(function(active) {
						return active.currency_type;
					});
				});
			},
			uploadFile() {
				this.showProgress = true;
				let formData = this.createFormData(this.file);
				this.uploadPolicies(formData).then((data) => {
					this.showProgress = false;
					if (data.ok) {
						this.openSnackbar({ text: "File Upload Sucessful" });
						this.file = null;
					} else {
						this.openSnackbar({ text: data.message });
					}
				});
			},
			downloadPoliciesF() {
				this.downloadPolicies().then(() => {});
			},
			createFormData(file) {
				let formData = new FormData();
				formData.append("policies", file);
				return formData;
			},
			editAdminSettings() {
				for (let currency of this.activeCurrencies) {
					if (!currency.conversion_to_usd) {
						currency.conversion_to_usd = 1;
					}
					currency.conversion_to_usd = Number(currency.conversion_to_usd);
				}
				this.totalPaidLeaves = Number(this.totalPaidLeaves);
				//   updateGlobalSettings
				this.openLoaderDialog();
				this.updateGlobalSettings({
					total_paid_leaves: this.totalPaidLeaves,
					active_currencies: this.activeCurrencies,
				}).then((data) => {
					this.closeLoaderDialog();
					if (data.ok) {
						this.openSnackbar({ text: "Settings Edited Sucessfully" });
						this.getSettings();
					} else {
						this.openSnackbar({ text: data.message });
					}
				});
			},
			policiesCheck() {
				if (this.policies) {
					return "Select Replacement Policies";
				} else {
					return "Select Policies";
				}
			},
			save() {
				event.preventDefault();
			},
		},
		computed: {
			...mapGetters(["uploadPercentage", "allCurrencies"]),
		},
		watch: {
			currencyValue(nv, ov) {
				let tempObj = [];
				let found;
				for (let value of nv) {
					found = false;
					// compare the active currencies with the selected currency and if they match sent found to true
					for (let currency of this.activeCurrencies) {
						if (currency.currency_type == value) {
							tempObj.push(currency);
							found = true;
						}
					}

					if (!found) {
						tempObj.push({
							currency_type: value,
							conversion_to_usd: 1,
						});
					}
				}

				this.activeCurrencies = tempObj;
			},
		},
	};
</script>

<style lang="scss">
	.settingsWrapper {
		padding: 20px;

		.action-button {
			margin-right: 10px;
		}

		.key-subtitle {
			font-size: 14px;
			color: gray;
		}

		.settings-row {
			display: flex;
			margin-bottom: 40px;
			@include custom-max(600px) {
				flex-wrap: wrap;
			}

			.settings-key {
				flex: 0 0 30%;
				@include custom-max(1000px) {
					flex: 0 0 40%;
				}
				@include custom-max(600px) {
					flex: 0 0 100%;
				}
			}
			.settings-value {
				flex: 0 0 40%;
				@include custom-max(1000px) {
					flex: 0 0 50%;
				}
				@include custom-max(600px) {
					flex: 0 0 100%;
				}
			}
			//     .text-field {
			//       flex: 0 0 40%;
			//       @include custom-max(1000px) {
			//         flex: 0 0 50%;
			//       }
			//       //   @include custom-max(767px) {
			//       //     flex: 0 0 50%;
			//       //   }
			//     }
		}

		.file-input {
			display: flex;
			justify-content: center;
			align-items: center;

			.file-picker {
				flex-basis: 90%;
			}
		}
	}
</style>
