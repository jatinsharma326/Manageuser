<template>
	<div class="settingsWrapper">
		<div v-if="isAdmin" class="settings-row">
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
		<div v-if="isAdmin" class="settings-row">
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
		<div v-if="!isAdmin" class="settings-row">
			<div class="settings-key">
				<div class="key-title">Old Password</div>
			</div>
			<div class="settings-value text-field">
				<v-text-field v-model="oldPassword" label="Old Password" name="oldPassword"></v-text-field>
			</div>
		</div>
		<div v-if="!isAdmin" class="settings-row">
			<div class="settings-key">
				<div class="key-title">New Password</div>
			</div>
			<div class="settings-value text-field">
				<v-text-field
					v-model="newPassword"
					label="New Password"
					name="newPassword"
					:rules="passwordRules"
					ref="newPassword"
				/>

				<v-text-field
					v-model="confirmPassword"
					label="Confirm Password"
					name="confirmPassword"
					:rules="confirmPasswordRules"
					ref="confirmPassword"
				/>
				<v-btn
					v-if="!isAdmin"
					:disabled="
						!($refs.newPassword && $refs.newPassword.valid && $refs.confirmPassword.valid && oldPassword)
					"
					color="primary"
					@click="updatePassword()"
					class="submit-button password-change"
					>SUBMIT</v-btn
				>
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
				<div v-if="isAdmin" class="file-input">
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
						v-if="isAdmin"
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
					<div v-if="!policies && !isAdmin">There is no policy file.</div>
				</div>
			</div>
		</div>
		<v-btn v-if="isAdmin" color="primary" class="submit-button" @click="editAdminSettings()">SUBMIT</v-btn>
	</div>
</template>

<script>
	import { mapActions, mapGetters, mapMutations } from "vuex";

	export default {
		name: "Settings",
		components: {},
		created() {
			if (this.isAdmin) {
				this.getSettings();
			} else {
				this.setRules();
				this.getPolicyFileStatus();
			}
			// this.currencyValue = this.activeCurrencies.map(function(active) {
			//   return active.currency_type;
			// });
		},
		mounted() {},
		data: () => ({
			totalPaidLeaves: 0,
			activeCurrencies: [],
			policies: false,
			oldPassword: "",
			newPassword: "",
			confirmPassword: "",
			passwordRules: [],
			confirmPasswordRules: [],
			policyFileStatus: false,
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
		computed: {
			...mapGetters(["REMOTE_SALES_AGENT", "SALES_AGENT", "MANAGEMENT", "ADMIN", "userType", "userData"]),
			...mapGetters(["uploadPercentage", "allCurrencies"]),
			isAdmin: function() {
				return this.userType == this.ADMIN;
			},
			isSalesTeam: function() {
				return this.userType == this.SALES_AGENT || this.userType == this.REMOTE_SALES_AGENT;
			},
		},
		methods: {
			...mapActions("Settings", [
				"getGlobalSettings",
				"updateGlobalSettings",
				"uploadPolicies",
				"downloadPolicies",
				"getPolicyStatus",
				"updatePasswordAPI",
			]),
			...mapMutations(["openLoaderDialog", "closeLoaderDialog", "openSnackbar"]),

			/**
			 *  Only called for the Admin User it gets
			 * - *totalPaidLeaves Current Total number of Leaves
			 * - *activeCurrencies Array of active Currencies
			 * - *policies True/False Indicator to show if any policies have been uploaded or no. This check is to show download button
			 * - *currencyValue Is given to the Currency selection dropdown. Theres a watcher set on this field to see if any new values have been selected
			 */
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
			/**
			 * For the All Other Users except admin
			 * - Rules are set for New Password and Old password Input fields
			 */
			setRules() {
				this.passwordRules = [
					(value) => !!value || "Required",
					(value) => (value && value.length >= 6) || "Minimum 6 characters",
				];
				this.confirmPasswordRules = [
					(value) => !!value || "Required",
					(value) => value === this.newPassword || "The password confirmation does not match.",
				];
			},
			/**
			 * For the All Other Users except admin
			 * - Check to see if a policy exists or no, based on which the user is either shown a warning or an error message
			 */
			getPolicyFileStatus() {
				this.openLoaderDialog();
				this.getPolicyStatus().then((data) => {
					this.closeLoaderDialog();
					if (data.ok) {
						if (data.policyStatus) {
							this.policies = data.policyStatus;
						}
					} else {
						this.openSnackbar({ text: data.message });
					}
				});
			},
			/**
			 * For the Admin Users only
			 * - This function is called when the User has already selected the file using the file picker.
			 * - The File needs to be converted to file format and hence is given to the createFormData function
			 * - If the file is uploaded correctly "this.file" is set to null to empty the file picker
			 * - On failure of upload "this.file" is not set to null as the user can attempt to upload the file again
			 */
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
			/**
			 * For the Admin Users only
			 * - To convert the data into file format with the name of policies
			 */
			createFormData(file) {
				let formData = new FormData();
				formData.append("policies", file);
				return formData;
			},
			/**
			 * This function is called by all the System Users
			 * - To download the policies
			 */
			downloadPoliciesF() {
				this.downloadPolicies().then(() => {});
			},
			/**
			 * For the Admin Users only
			 * - to set label for the File picker
			 */
			policiesCheck() {
				if (this.policies) {
					return "Select Replacement Policies";
				} else {
					return "Select Policies";
				}
			},
			/**
			 * For the Admin Users only
			 * - Called when submit button is clicked
			 * - From the active Currencies list each value is checked, for a value where conversion_to_usd is not present it is set to 1
			 * - All Conversion to USD are then converted to numbers as the input is made in string format
			 */
			editAdminSettings() {
				for (let currency of this.activeCurrencies) {
					if (!currency.conversion_to_usd) {
						currency.conversion_to_usd = 1;
					}
					currency.conversion_to_usd = Number(currency.conversion_to_usd);
				}
				this.totalPaidLeaves = Number(this.totalPaidLeaves);

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
			/**
			 * For the All Other Users except admin
			 * - $refs.newPassword.reset & $refs.confirmPassword.reset are done to reset the text feilds
			 * - All the text feild are set to null to clear their values
			 */
			updatePassword() {
				this.openLoaderDialog();
				this.updatePasswordAPI({
					old_password: this.oldPassword,
					new_password: this.confirmPassword,
				}).then((data) => {
					this.closeLoaderDialog();
					this.oldPassword = null;
					this.newPassword = null;
					this.confirmPassword = null;
					this.$refs.newPassword.reset();
					this.$refs.confirmPassword.reset();

					if (data.ok) {
						this.openSnackbar({ text: "Password Changed Sucessfully" });
					} else {
						this.openSnackbar({ text: data.message });
					}
				});
			},
			// save() {
			// 	event.preventDefault();
			// },
		},
		watch: {
			/**
			 * For the Admin Users only
			 * - This watcher is called everytime a new value is selected from the currencies dropdown
			 * - nv is an array of updated values, for every value in nv it is compared to all the values in active currencies.
			 * - If found, an object is created with that name and conversion set to 1
			 */
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

		.submit-button {
			&.password-change {
				margin-top: 20px;
			}
		}

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
