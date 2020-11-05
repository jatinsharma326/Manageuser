<template>
	<div class="uploadWrapper">
		<v-row justify="center">
			<v-dialog v-model="modal" width="600px" persistent>
				<v-card>
					<v-card-title>
						<span class="headline">Bulk Upload Travel Agent</span>
						<div class="close-dialog" @click="closeModal">
							<v-icon>mdi-close</v-icon>
						</div>
					</v-card-title>
					<div class="file-upload-section">
						<v-file-input
							v-model="file"
							type="file"
							class="upload-file-selector"
							accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
						></v-file-input>
						<div class="upload-actions">
							<v-btn
								outlined
								:disabled="!showProgress && file ? false : true"
								color="primary"
								class="action-button"
								@click="uploadFile()"
								>Upload</v-btn
							>
							<v-btn
								color="green"
								class="action-button"
								v-if="sampleFile"
								@click="downloadSampleFile()"
								text
								>Download</v-btn
							>
						</div>
					</div>
					<div v-if="showProgress" class="file-upload-progress-container">
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
							<div class="section-title progress-completion-status">{{ uploadPercentage }}%</div>
						</div>
						<div class="time-elapsed-section">
							<!-- <TimeElapsed :date="startTime"></TimeElapsed>&nbsp;elapsed -->
						</div>
					</div>
				</v-card>
			</v-dialog>
		</v-row>
	</div>
</template>
<script>
	import helperMixin from "../mixins/helperMixins";
	import { mapActions, mapGetters, mapMutations } from "vuex";
	export default {
		name: "UploadModal",
		mixins: [helperMixin],
		components: {},
		created() {},
		data: () => ({
			modal: false,
			logsList: [],
			filter: {},
			fetchCount: 0,
			totalCount: 0,
			pageSize: 20,
			pageNo: 1,
			sampleFile: false,
			showProgress: false,
			file: null,
		}),
		methods: {
			...mapMutations(["openLoaderDialog", "closeLoaderDialog", "openSnackbar"]),
			...mapActions("ManageAgents", ["uploadTravelAgents", "downloadSample"]),
			closeModal() {
				this.pageSize = 20;
				this.logsList = [];
				this.$emit("closeModal");
			},
			loadMoreLogs() {
				this.pageSize = this.pageSize + 20;
				this.getAllUploadLogs(this.selectedInfo);
			},
			uploadFile() {
				this.showProgress = true;
				let formData = this.createFormData(this.file);
				this.uploadTravelAgents(formData).then((data) => {
					this.showProgress = false;
					if (data.ok) {
						this.openSnackbar({ text: "File Upload Sucessful" });
						this.file = null;
					} else {
						this.openSnackbar({ text: data.message });
					}
				});
			},
			createFormData(file) {
				let formData = new FormData();
				formData.append("sampleFile", file);
				return formData;
			},
			downloadSampleFile() {
				this.downloadSample().then(() => {});
			},
		},
		computed: {
			...mapGetters(["uploadPercentage"]),
		},
		watch: {
			toggleModal(nv, ov) {
				this.modal = nv;
				this.logsList = [];
				// if (nv) this.getAllUploadLogs(this.selectedInfo);
			},
		},
		props: {
			toggleModal: { required: true, default: false },
			// selectedInfo: { required: true, type: Object },
		},
	};
</script>
<style lang="scss" scoped></style>
