<template>
	<div class="uploadModalWrapper">
		<v-row justify="center">
			<v-dialog v-model="modal" width="600px" persistent>
				<v-card class="uploadModalContentWrapper">
					<v-card-title>
						<span class="headline">Upload Logs</span>
					</v-card-title>
					<v-timeline dense>
						<v-timeline-item
							v-for="(log, index) in logsList"
							:key="index"
							icon="mdi-pan-right"
							fill-dot
							:color="logIconColor(log)"
						>
							<div class="log-card">
								<div class="log-title">
									{{ log.status }}
								</div>
								<div class="log-subtitle">
									{{ log.name }} - {{ getFormattedDate(log.created_at, "MMMM Do YYYY, dddd") }}
								</div>
								<div class="log-buttons">
									<v-btn @click="downloadInputFile(log)" color="primary" outlined>Input File</v-btn>
									<v-btn v-if="log.error_rows_exists" @click="downloadError(log)" color="error" text
										>Error File</v-btn
									>
								</div>
							</div>
						</v-timeline-item>
					</v-timeline>
					<v-card-actions>
						<v-btn v-if="pageSize < fetchCount" color="secondary" text @click="loadMoreLogs">
							View More
						</v-btn>
						<v-spacer></v-spacer>
						<v-btn color="error" text @click="closeModal">
							Close
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-row>
	</div>
</template>
<script>
	import helperMixin from "../../mixins/helperMixins";
	import searchMixin from "../../mixins/searchMixin";
	import { mapActions, mapGetters, mapMutations } from "vuex";
	export default {
		name: "uploadLogsModal",
		mixins: [helperMixin, searchMixin],
		components: {},
		created() {
			// this.getLogs();
		},
		data: () => ({
			modal: false,
			logsList: [],
		}),
		methods: {
			...mapMutations(["openLoaderDialog", "closeLoaderDialog", "openSnackbar"]),
			...mapActions("ManageAgents", ["getUploadLogs", "getInputFileURL", "downloadErrorFile"]),
			closeModal() {
				this.pageSize = 20;
				this.logsList = [];
				this.$emit("closeModal");
			},
			loadMoreLogs() {
				this.pageSize = this.pageSize + 20;
				this.getLogs(this.selectedInfo);
			},
			logIconColor(log) {
				if (log.success && log.error) {
					return "orange";
				} else if (log.error) {
					return "error";
				} else {
					return "green";
				}
			},
			getLogs(info) {
				this.openLoaderDialog();
				this.getUploadLogs({
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.logsList = data.list;
					this.fetchCount = data.fetchCount;
					this.totalCount = data.totalCount;
				});
			},
			downloadInputFile(log) {
				this.openLoaderDialog();
				this.getInputFileURL({
					folder_name: log.folder_name,
					file_name: log.file_name,
				}).then((data) => {
					this.closeLoaderDialog();
					if (data.ok) {
						this.openSnackbar({ text: "Starting Download" });
						const link = document.createElement("a");
						link.href = data.url;
						link.setAttribute("download", "InputFile.xlsx"); //or any other extension
						document.body.appendChild(link);
						link.click();
					} else {
						this.openSnackbar({ text: "Failed to get Input File URL" });
					}
				});
			},
			downloadError(log) {
				this.openLoaderDialog();
				this.downloadErrorFile({
					process_id: log.process_id,
				}).then(() => this.closeLoaderDialog());
			},
		},
		watch: {
			toggleUploadlogModal(nv, ov) {
				this.modal = nv;
				this.logsList = [];
				if (nv) this.getLogs(this.selectedInfo);
			},
			// selectedInfo: {
			// 	deep: true,
			// 	handler(nv, ov) {
			// 		this.logsList = [];
			// 		this.getEmployees();
			// 		if (nv.countries) {
			// 			this.setSearchConfig(nv.countries);
			// 			this.setInputConfig(this.partnerInfo.countries);
			// 		}
			// 	},
			// },
		},
		props: {
			toggleUploadlogModal: { required: true, default: false },
		},
	};
</script>
<style lang="scss" scoped>
	.uploadModalContentWrapper {
		padding-right: 20px;
	}
	.log-card {
		// border: 1px solid $primary;
		.log-title {
			font-size: 18px;
			font-weight: 600;
		}
		.log-subtitle {
			font-size: 14px;
			color: grey;
			// font-weight: 600;
		}
		.log-buttons {
			margin-top: 5px;
		}
	}
</style>
