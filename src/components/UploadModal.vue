<template>
	<div class="uploadModalWrapper">
		<v-row justify="center">
			<v-dialog v-model="modal" width="600px" persistent>
				<v-card class="upload-card">
					<v-card-title>
						<span class="headline">{{ title }}</span>
						<v-spacer></v-spacer>
						<div class="close-dialog" @click="closeModal">
							<v-icon color="error">mdi-close</v-icon>
						</div>
					</v-card-title>
					<div class="file-upload-section">
						<v-file-input
							v-model="file"
							type="file"
							class="upload-file-selector"
							:accept="accept"
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
								v-if="showDownloadSampleButton"
								color="green"
								class="action-button"
								@click="downloadSampleFile()"
								text
								>Download Sample</v-btn
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
	import { mapActions, mapGetters, mapMutations } from "vuex";
	export default {
		name: "UploadModal",
		mixins: [],
		components: {},
		created() {},
		data: () => ({
			modal: false,
			file: false,
			showProgress: false,
			file: null,
		}),
		methods: {
			...mapMutations(["openLoaderDialog", "closeLoaderDialog", "openSnackbar"]),
			...mapActions("ManageAgents", ["downloadSample"]),
			closeModal() {
				this.$emit("closeModal");
			},
			uploadFile() {
				let formData = this.createFormData(this.file);
				this.showProgress = true;
				this.uploadFunction(formData).then((data) => {
					this.showProgress = false;
					if (data.ok) {
						this.openSnackbar({ text: "File Upload Sucessful" });
						this.closeModal();
						this.file = null;
					} else {
						this.openSnackbar({ text: data.message });
					}
				});
			},
			createFormData(file) {
				let formData = new FormData();
				formData.append("travelAgents", file);
				if (this.process_id) formData.append("process_id", this.process_id);
				return formData;
			},
			downloadSampleFile() {
				this.downloadSampleFunc().then(() => {});
			},
		},
		computed: {
			...mapGetters(["uploadPercentage"]),
		},
		watch: {
			toggleModal(nv, ov) {
				this.modal = nv;
				if (nv) this.file = null;
			},
		},
		props: {
			toggleModal: { required: true, default: false },
			accept: { required: true, type: String },
			title: { required: true, type: String },
			uploadFunction: { required: true, type: Function },
			downloadSampleFunc: { required: false, type: Function },
			showDownloadSampleButton: { required: true, type: Boolean },
			process_id: { required: false, type: String },
		},
	};
</script>
<style lang="scss" scoped>
	.uploadModalWrapper {
		.file-upload-section {
			padding: 20px;
			display: flex;
			justify-content: center;
		}
	}
</style>
