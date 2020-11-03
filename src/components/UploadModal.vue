<template>
	<div class="inputModalWrapper">
		<v-dialog v-model="dialog" persistent max-width="80%">
			<v-card flat>
				<div class="upload-container">
					<div class="card-title-section">
						<div class="modal-title">Upload new data set</div>
						<div v-if="allowClose" class="close-dialog" @click="closeModal">
							<v-icon>close</v-icon>
						</div>
					</div>
					<div class="stepper-section">
						<v-stepper v-model="step" alt-labels flat>
							<v-stepper-header>
								<v-stepper-step :step="1">Select & Preview</v-stepper-step>

								<v-divider></v-divider>

								<v-stepper-step :step="2">Processing</v-stepper-step>

								<v-divider></v-divider>

								<v-stepper-step :step="3">Output</v-stepper-step>
							</v-stepper-header>

							<v-stepper-items>
								<v-stepper-content :step="1">
									<div class="stepper-content-wrapper">
										<div v-if="!previewMode && !uploadMode" class="dropzone-container">
											<div class="file-selection-area">
												<input
													accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
													@change="loadExcelFile"
													class="upload-file-selector"
													type="file"
													ref="upload-file-selector"
												/>
												<button
													@click.stop="triggerFileUpload"
													class="action-btns filled-button"
												>
													Select file
												</button>
												<div class="drag-drop-section-label">
													or drag and drop here
												</div>
												<div class="download-file-section">
													Download Sample Format
													<button
														@click.stop="downloadSampleFile"
														class="action-btns outlined-button"
													>
														XLSX
													</button>
													<a
														class="download-anchor"
														ref="download-anchor-sample"
														href=""
														target="_blank"
														>Download</a
													>
												</div>
											</div>
											<v-overlay :absolute="true" :value="overlay" :opacity="0.3"></v-overlay>
										</div>
										<div v-else-if="previewMode && !uploadMode" class="file-preview-container">
											<div class="file-preview-section">
												<div filterAndTableWrapper>
													<div class="filterable-table-inner">
														<table cellspacing="0" cellpadding="0" class="sticky">
															<thead>
																<tr>
																	<template v-for="(header, index) of headers">
																		<td :key="index">
																			{{ header }}
																		</td>
																	</template>
																</tr>
															</thead>
															<tbody>
																<tr v-for="row of tableData" :key="row._id">
																	<template v-for="(header, index) of headers">
																		<td :key="index">
																			{{ row[header] ? row[header] : "NA" }}
																		</td>
																	</template>
																</tr>
															</tbody>
														</table>
													</div>
												</div>
											</div>
											<div class="file-preview-action">
												<button
													:disabled="disableActionButtons"
													@click="resetComponentState"
													class="action-btns outlined-button"
													:class="{
														'disabled-btn': disableActionButtons,
													}"
												>
													Select a different File
												</button>
												<button
													:disabled="disableActionButtons || isMasterLocked"
													@click="uploadSelectedFile"
													class="action-btns filled-button"
													:class="{
														'disabled-btn': disableActionButtons || isMasterLocked,
													}"
												>
													Confirm File
												</button>
											</div>
										</div>
										<div v-else class="file-upload-progress-container">
											<div class="section-title">
												Uploading
											</div>
											<div class="progress-bar-wrapper">
												<v-progress-linear
													height="24px"
													color="primary"
													rounded
													:value="uploadPercentage"
												></v-progress-linear>
												<div class="section-title progress-completion-status">
													{{ uploadPercentage }}%
												</div>
											</div>
											<div class="time-elapsed-section">
												<TimeElapsed :date="startTime"></TimeElapsed>&nbsp;elapsed
											</div>
										</div>
									</div>
								</v-stepper-content>
								<v-stepper-content :step="2">
									<div class="stepper-content-wrapper">
										<div class="journey-status-container">
											<div class="section-title">
												{{ currentStatus }}
											</div>
											<div class="progress-bar-wrapper">
												<v-progress-linear
													:striped="true"
													height="24px"
													color="primary"
													rounded
													:value="100"
												></v-progress-linear>
											</div>
											<div v-if="step == 2" class="time-elapsed-section">
												<TimeElapsed :date="startTime"></TimeElapsed>&nbsp;elapsed
											</div>
										</div>
									</div>
								</v-stepper-content>
								<v-stepper-content :step="3">
									<div class="stepper-content-wrapper">
										<div class="journey-output-container">
											<div class="journey-result-status">
												{{ journeyOutputStatus }}
											</div>
											<div v-if="showCheckerRequestSent" class="checker-request-sent-section">
												<span>
													<img src="@/assets/check-symbol.svg" alt />
												</span>
												<span>Checker Request Sent!</span>
											</div>
											<div v-if="showJourneyStatusActionBtns" class="journey-result-action">
												<button
													@click="resetComponentState"
													class="action-btns outlined-button"
												>
													Upload Corrected File
												</button>
												<button @click="downloadErrorFile" class="action-btns filled-button">
													Download CSV
												</button>
												<a
													class="download-anchor"
													ref="download-anchor-error-file"
													href=""
													target="_blank"
												></a>
											</div>
										</div>
									</div>
								</v-stepper-content>
							</v-stepper-items>
						</v-stepper>
					</div>
				</div>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
	import { mapGetters, mapActions, mapMutations } from "vuex";
	import moment from "moment-timezone";
	import XLSX from "xlsx";
	import TimeElapsed from "../components/time-elapsed";

	export default {
		name: "MasterInputFormModal",
		components: {
			TimeElapsed,
		},
		created() {},
		mounted() {
			this.moment = moment;
		},
		data: () => ({
			dialog: false,
			step: 1,
			previewMode: false,
			uploadMode: false,
			headers: [],
			tableData: [],
			selectedFile: {},
			overlay: false,
			startTime: new Date(),
			currentStatus: "Validating",
			disableActionButtons: false,
			count: 0,
			processId: null,
			showJourneyStatusActionBtns: false,
			showCheckerRequestSent: false,
			journeyOutputStatus: "",
			currentStatusObj: {},
			errorFilePath: "",
		}),
		methods: {
			...mapActions(["getFileURL", "pollMasterLockStatus"]),
			...mapActions("maker", [
				"spawnProcess",
				"uploadMasterFile",
				"getJourneyStatus",
				"getSampleFileDownloadLink",
			]),
			...mapMutations(["openLoaderDialog", "closeLoaderDialog"]),
			getSentenceCaseName(str) {
				return str.charAt(0).toUpperCase() + str.substring(1);
			},
			closeModal() {
				this.dialog = false;
			},
			triggerFileUpload() {
				this.$refs["upload-file-selector"].click();
			},
			downloadSampleFile() {
				let anchor = this.$refs["download-anchor-sample"];
				this.getSampleFileDownloadLink({
					key: `${this.currentMaster}.xlsx`,
				}).then((data) => {
					if (data.ok) {
						anchor.href = data.url;
						anchor.click();
					} else {
						console.log("Download Failed please try again");
					}
				});
			},
			loadExcelFile(ev) {
				this.overlay = true;
				try {
					const file = ev.target.files[0];
					this.selectedFile = file;
					const reader = new FileReader();

					reader.readAsArrayBuffer(file);

					reader.onload = (e) => {
						var wb = XLSX.read(new Uint8Array(reader.result), {
							type: "array",
						});
						var json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
						this.headers = json.reduce((acc, cv) => {
							acc = Object.assign(acc, Object.keys(cv));
							return acc;
						}, []);
						this.tableData = json;

						console.log(this.headers);
						this.overlay = false;
						this.previewMode = true;
					};
				} catch (e) {
					console.error(e);
					this.overlay = false;
				}
			},
			createFormData(file, process_id) {
				let formData = new FormData();
				formData.append(this.currentMaster, file);
				formData.append("processId", process_id);
				return formData;
			},
			selectAnotherFile() {
				this.previewMode = false;
				this.selectedFile = {};
				this.tableData = [];
			},
			uploadSelectedFile() {
				this.disableActionButtons = true;
				this.spawnProcess({
					masterName: this.currentMaster,
				}).then((data) => {
					if (data.ok) {
						console.log(data);
						this.startFileUpload(data.processId);
						this.uploadMode = true;
						this.startTime = this.moment()
							.tz("Asia/Kolkata")
							.toDate();
					} else {
						this.disableActionButtons = false;
					}
				});
			},
			startFileUpload(processId) {
				let formData = this.createFormData(this.selectedFile, processId);
				console.log(formData);
				this.uploadMasterFile(formData).then((udata) => {
					if (udata.ok) {
						this.step = 2;
						this.startStatusPolling(processId);
					} else {
						this.uploadMode = false;
						this.disableActionButtons = false;
					}
				});
			},
			startStatusPolling(processId) {
				setTimeout(() => {
					if (this.count <= 3) {
						this.getJourneyStatus({
							processId,
						}).then((data) => {
							console.log(data);
							if (data.ok) {
								this.currentStatusObj = data.status;
								if (data.status && data.status.success) {
									this.step = 3;
									this.uploadMode = false;
									this.pollMasterLockStatus();
									if (data.status.error) {
										this.journeyOutputStatus =
											"Data set uploaded successfully with errors. A CSV containing these rows has been generated.";
										this.showJourneyStatusActionBtns = true;
										this.showCheckerRequestSent = true;
										this.errorFilePath = data.status.errorFilePath;
									} else {
										this.journeyOutputStatus =
											"Data set uploaded successfully and ready for verification.";
										this.showCheckerRequestSent = true;
									}
									this.$emit("refreshMasterData");
								} else if (data.status && data.status.error) {
									this.pollMasterLockStatus();
									this.step = 3;
									this.uploadMode = false;
									this.journeyOutputStatus =
										"Failed to create the master. A CSV containing these rows has been generated.";
									this.showJourneyStatusActionBtns = true;
									this.errorFilePath = data.status.errorFilePath;
									this.$emit("refreshMasterData");
								} else {
									this.startStatusPolling(processId);
								}
							} else {
								this.startStatusPolling(processId);
								this.count++;
							}
						});
					}
				}, 3000);
			},
			downloadErrorFile() {
				let anchor = this.$refs["download-anchor-error-file"];
				this.getFileURL({
					key: this.errorFilePath,
					foldername: "process_log_files",
				}).then((data) => {
					if (data.ok) {
						anchor.href = data.url;
						anchor.click();
					} else {
						console.log("Download Failed please try again");
					}
				});
			},
			resetComponentState() {
				// this.dialog = false;
				this.step = 1;
				this.previewMode = false;
				this.uploadMode = false;
				this.headers = [];
				this.tableData = [];
				this.selectedFile = {};
				this.overlay = false;
				this.startTime = new Date();
				this.currentStatus = "Validating";
				this.disableActionButtons = false;
				this.count = 0;
				this.processId = null;
				this.showJourneyStatusActionBtns = false;
				this.showCheckerRequestSent = false;
				this.journeyOutputStatus = "";
			},
		},
		computed: {
			...mapGetters(["selectedVisualConfig", "uploadPercentage"]),
			allowClose: function() {
				return !this.uploadMode && (this.step == 1 || this.step == 3);
			},
		},
		watch: {
			value: function(nv) {
				if (nv != this.dialog) {
					this.dialog = nv;
					if (this.dialog) {
						this.resetComponentState();
					}
				}
			},
			dialog: function(nv) {
				this.$emit("input", nv);
			},
		},
		props: {
			value: {
				type: Boolean,
				required: true,
			},
			currentMaster: {
				type: String,
				required: true,
			},
			isMasterLocked: {
				type: Boolean,
				required: false,
				default: false,
			},
		},
	};
</script>

<style lang="scss" scoped>
	.upload-container {
		padding: 30px;
		.card-title-section {
			margin-bottom: 36px;
			display: flex;
			justify-content: space-between;

			.modal-title {
				font-size: 24px;
				color: $primaryFontColor;
			}

			.close-dialog {
				cursor: pointer;
			}
		}

		.action-btns {
			padding: 8px 24px;

			&:focus {
				outline: none;
			}
		}

		.download-anchor {
			display: none;
		}

		.filled-button {
			background-color: $primary;
			border: 1px solid $primary;
			border-radius: 500px;
			opacity: 1;
			color: white;
		}

		.outlined-button {
			border: 1px solid $primary;
			border-radius: 500px;
			opacity: 1;
			color: $primaryFontColor;
		}

		.stepper-content-wrapper {
			.time-elapsed-section {
				text-align: center;
				font-size: 18px;
				color: #999999;
				opacity: 1;
			}

			.v-progress-linear--rounded {
				border-radius: 500px;
			}

			.section-title {
				font-size: 16px;
				color: $primaryFontColor;
				opacity: 1;
				margin-bottom: 14px;
			}

			.dropzone-container {
				background: #f7f7f7 0% 0% no-repeat padding-box;
				border: 2px dashed #dddddd;
				border-radius: 10px;
				opacity: 1;
				height: 220px;

				display: flex;
				justify-content: center;

				.file-selection-area {
					margin-top: 40px;
					display: flex;
					// justify-content: center;
					flex-direction: column;
					align-items: center;

					.drag-drop-section-label {
						margin-top: 18px;
						color: #666666;
					}

					.download-file-section {
						margin-top: 40px;
						align-self: flex-end;
						z-index: 3;

						.outlined-button {
							margin-left: 12px;
						}
					}

					.upload-file-selector {
						// display: none;
						z-index: 1;
						opacity: 0;
						width: 100%;
						height: 220px;
						position: absolute;
						cursor: pointer;
						top: 0;
					}
				}
			}

			.file-preview-container {
				.file-preview-section {
					background: #f7f7f7 0% 0% no-repeat padding-box;
					border: 2px solid #dddddd;
					border-radius: 10px;
					opacity: 1;
					height: 220px;
					overflow-y: auto;
					margin-bottom: 24px;

					.filterable-table-inner {
						padding-bottom: 0px;
						margin-left: 0;
						max-width: 100%;
					}
				}

				.file-preview-action {
					display: flex;
					justify-content: center;

					.outlined-button {
						margin-right: 18px;
					}
				}
			}

			.file-upload-progress-container {
				.progress-bar-wrapper {
					display: flex;

					.progress-completion-status {
						margin-left: 16px;
					}
				}
			}

			.journey-status-container {
				.progress-bar-wrapper {
					margin-bottom: 16px;
				}
			}

			.journey-output-container {
				.journey-result-status {
					text-align: center;
					font-size: 18px;
					letter-spacing: 0;
					color: #666666;
					opacity: 1;
					margin-bottom: 24px;
				}

				.checker-request-sent-section {
					display: flex;
					justify-content: center;
					align-items: center;
					margin-bottom: 40px;

					span {
						font-size: 18px;
						color: $primaryFontColor;

						img {
							width: 21px;
							margin-right: 12px;
						}
					}
				}

				.journey-result-action {
					display: flex;
					justify-content: center;

					.outlined-button {
						margin-right: 18px;
					}
				}
			}
		}
	}
</style>

<style lang="scss">
	.upload-container {
		.v-stepper,
		.v-stepper__header {
			box-shadow: none;
		}

		.v-stepper__step__step {
			height: 42px;
			min-width: 42px;
		}

		.v-stepper .v-stepper__step--active .v-stepper__label {
			color: $primaryFontColor;
		}

		.v-stepper .v-stepper__step__step {
			border: 1px solid $secondaryFontColor !important;
		}

		.v-stepper .v-stepper__header .v-divider {
			border-width: 1.5px;
		}

		.v-stepper--alt-labels .v-stepper__header .v-divider {
			margin: 44px -67px 0;
		}

		.v-stepper__content {
			padding: 0;
		}

		.v-progress-linear--striped .v-progress-linear__determinate {
			animation: move 2s linear infinite;
		}

		@keyframes move {
			0% {
				background-position-x: 0;
			}
			100% {
				background-position-x: 40%;
			}
		}
	}
</style>
