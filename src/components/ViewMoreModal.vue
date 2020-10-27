<template>
	<div class="viewMoreModalWrapper">
		<v-dialog v-model="modal" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
			<div class="toolbarWrapper">
				<div>
					<v-toolbar color="primary">
						<v-btn color="accent" icon @click="closeModal">
							<v-icon>mdi-close</v-icon>
						</v-btn>
						<div class="titleWrapperContainer">
							<v-toolbar-title>
								<div class="modalTitleWrapper">
									<slot name="modalTitle"></slot>
								</div>
							</v-toolbar-title>
							<div class="modalSubtitle">
								<slot name="modalSubtitle"></slot>
							</div>
						</div>
						<v-spacer></v-spacer>
						<v-toolbar-items>
							<slot name="toolbarActions"></slot>
						</v-toolbar-items>
					</v-toolbar>

					<div class="modalContent">
						<slot name="modalContent"></slot>
					</div>
				</div>
			</div>
		</v-dialog>
	</div>
</template>
<script>
	export default {
		name: "ViewMoreModal",
		components: {},
		created() {},
		data: () => ({
			modal: false,
		}),
		methods: {
			closeModal() {
				this.$emit("closeModal");
			},
		},
		watch: {
			toggleModal(nv, ov) {
				this.modal = nv;
			},
		},
		props: {
			toggleModal: { required: true, default: false },
		},
	};
</script>
<style lang="scss" scoped>
	.toolbarWrapper {
		background-color: white;
		height: 100%;

		.titleWrapperContainer {
			display: flex;
			align-items: flex-end;

			.modalTitleWrapper {
				color: white;
				line-height: 1;
			}

			.modalSubtitle {
				font-size: 14px;
				color: $secondaryFontColor;
				margin-left: 6px;
				line-height: 1;
			}
		}
	}
</style>
