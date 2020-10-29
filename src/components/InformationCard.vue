<template>
	<div class="informationCardWrapper">
		<v-card
			:class="{ 'remove-bottom-border-radius': show, 'disabled-card': isCardDisabled }"
			class="information-card"
			min-width="300px"
		>
			<div class="top-content-wrapper">
				<div class="subtitle color-secondary fw-600 text-uppercase">
					<slot name="topLeft"></slot>
				</div>
				<div class="subtitle text-right color-secondary fw-600 text-uppercase">
					<slot name="topRight"></slot>
				</div>
			</div>

			<div class="main-content-wrapper">
				<div class="main-content-left">
					<div class="main-content">
						<slot name="mainContent"></slot>
					</div>
					<div class="subtitle">
						<slot name="mainContentSubtitle"></slot>
					</div>
				</div>
				<div class="main-content-right">
					<slot name="mainContentRight"></slot>
				</div>
			</div>
			<div class="more-info subtitle">
				<slot name="moreInfo"></slot>
			</div>

			<div class="bottom-content-wrapper">
				<v-card-actions>
					<div class="action-button">
						<slot name="actionButtons"></slot>
					</div>

					<v-spacer></v-spacer>
					<div v-if="expandCard">
						<v-btn color="tertiary" icon @click="show = !show">
							<v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
						</v-btn>
					</div>
				</v-card-actions>
			</div>
		</v-card>
		<v-card class="expansionPanelWrapper">
			<v-expand-transition>
				<div v-show="show">
					<v-divider></v-divider>
					<slot name="expandCardContent"></slot>
				</div>
			</v-expand-transition>
		</v-card>
	</div>
</template>

<script>
	export default {
		name: "InformationCard",
		created() {},
		mounted() {
			// this.dialog = false;
		},
		data: () => ({
			show: false,
		}),
		methods: {},
		computed: {},
		watch: {},
		props: {
			expandCard: {
				required: false,
				type: Boolean,
				default: false,
			},
			isCardDisabled: {
				required: false,
				type: Boolean,
				default: false,
			},
		},
	};
</script>

<style lang="scss" scoped>
	.informationCardWrapper {
		position: relative;
		height: 100%;
	}

	.expansionPanelWrapper {
		border-top-right-radius: 0px;
		border-top-left-radius: 0px;
		@include custom-min(767px) {
			position: absolute;
			top: 100%;
			width: 100%;
			z-index: 1;
			margin-bottom: 1em;
		}
	}

	.v-card__actions {
		padding: 0;
	}
	.subtitle {
		font-size: 14px;
	}

	.main-content {
		font-size: 32px;
		font-weight: 500;
		@include custom-max(475px) {
			font-size: 24px;
		}
	}

	.information-card {
		padding: 16px;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		&.remove-bottom-border-radius {
			border-bottom-right-radius: 0px !important;
			border-bottom-left-radius: 0px !important;
		}
		&.disabled-card {
			background-color: #eee;
		}

		.top-content-wrapper {
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: nowrap;

			padding-bottom: 10px;
		}
		.main-content-wrapper {
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: nowrap;

			padding-bottom: 10px;
			.main-content-left {
				flex-basis: 75%;
			}
			.main-content-right {
				flex-basis: 25%;
			}
		}
		.bottom-content-wrapper {
			padding-top: 10px;
		}
	}
</style>
<style lang="scss">
	// .information-card {
	//   height: 100%;
	//   display: flex;
	//   flex-direction: column;
	//   justify-content: space-between;
	// }
</style>
