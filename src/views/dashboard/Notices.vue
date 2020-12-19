<template>
	<div class="noticesWrapper">
		<div class="dashboardColumnWrapper">
			<div class="column-one column">
				<div class="title-section">
					<div class="title">Admin Bulletin</div>
					<v-btn color="tertiary" icon @click="showColumnOne = !showColumnOne">
						<v-icon>{{ showColumnOne ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
					</v-btn>
				</div>
				<div class="contentSectionWrapper" v-show="showColumnOne">
					<div v-if="columnOneTotalCount === 0" class="content-error-message">
						No Bulletin Entry
					</div>
					<div v-else class="content-section">
						<div
							v-for="(entry, index) in adminBulletin"
							:key="index + '_adminBulletin'"
							class="card-element"
						>
							<InformationCard :expandCard="false">
								<template v-slot:topLeft>
									{{ getFormattedDate(entry.date_of_creation) }}
								</template>
								<template v-slot:moreInfo>
									<div v-if="entry.mortals_on_leave.length">
										{{ entry.mortals_on_leave.join(", ") }} are on a leave.
									</div>
									<div v-if="entry.half_day_sales_calls.length">
										{{ entry.half_day_sales_calls.join(", ") }} are on a half day sales call.
									</div>
									<div v-if="entry.full_day_sales_calls.length">
										{{ entry.full_day_sales_calls.join(", ") }} are on a full day sales.
									</div>
									<div v-if="entry.outstation_sales_calls.length">
										{{ entry.outstation_sales_calls.join(", ") }} are on a outstation sales call.
									</div>
									<div v-if="entry.running_late.length">
										{{ entry.running_late.join(", ") }} are running late.
									</div>
									<div v-if="entry.bulletin">{{ entry.bulletin }}</div>
								</template>
							</InformationCard>
						</div>
						<div v-if="columnOnePageSize < columnOneTotalCount" class="action-button">
							<v-btn color="secondary" text @click="loadMoreColumnOne">
								View More
							</v-btn>
						</div>
					</div>
				</div>
			</div>
			<div class="column-two column">
				<div class="title-section">
					<div class="title">Notice Board</div>
					<v-btn color="tertiary" icon @click="showColumnTwo = !showColumnTwo">
						<v-icon>{{ showColumnTwo ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
					</v-btn>
				</div>
				<div class="contentSectionWrapper" v-show="showColumnTwo">
					<div class="content-section">
						<div v-for="(entry, index) in noticeBoard" :key="index + '_noticeBoard'" class="card-element">
							<InformationCard :expandCard="false">
								<template v-slot:topLeft>
									{{ getFormattedDate(entry.date_of_creation) }}
								</template>
								<template v-slot:moreInfo>
									{{ entry.notice_board_bulletin }}
								</template>
							</InformationCard>
						</div>
						<div v-if="columnTwoPageSize < columnTwoTotalCount" class="action-button">
							<v-btn color="secondary" text @click="loadMoreColumnTwo">
								View More
							</v-btn>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import InformationCard from "../../components/InformationCard";
	import helperMixin from "../../mixins/helperMixins";
	import moment from "moment-timezone";
	export default {
		name: "NoticesDasboard",
		mixins: [helperMixin],
		components: { InformationCard },
		created() {
			this.getAdminBulletinList();
			this.getNoticeBoardList();
		},
		data: () => ({
			showColumnOne: true,
			showColumnTwo: true,
			pageNo: 1,
			columnOnePageSize: 20,
			columnTwoPageSize: 20,
			columnOneTotalCount: "",
			columnTwoTotalCount: "",
			adminBulletin: [],
			noticeBoard: [],
		}),
		methods: {
			...mapMutations(["openLoaderDialog", "closeLoaderDialog", "openSnackbar"]),
			...mapActions("AdminBulletin", ["getAdminBulletin"]),
			...mapActions("NoticeBoard", ["getNoticeBoard"]),

			loadMoreColumnOne() {
				this.columnOnePageSize = this.columnOnePageSize + 20;
				this.getAdminBulletinList();
			},
			loadMoreColumnTwo() {
				this.columnTwoPageSize = this.columnTwoPageSize + 20;
				this.getNoticeBoardList();
			},
			getAdminBulletinList() {
				this.openLoaderDialog();
				this.getAdminBulletin({
					pageSize: this.columnOnePageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					if (!data.ok) {
						this.openSnackbar({ text: "Failed to Fetched Admin Bulletin List" });
					}
					this.adminBulletin = data.list;
					this.columnOneTotalCount = data.totalCount;
				});
			},
			getNoticeBoardList() {
				this.openLoaderDialog();
				this.getNoticeBoard({
					pageSize: this.columnTwoPageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					if (!data.ok) {
						this.openSnackbar({ text: "Failed to Fetched Notice Board List" });
					}
					this.noticeBoard = data.list;
					this.columnTwoTotalCount = data.totalCount;
				});
			},
		},
		computed: {},
		watch: {},
	};
</script>

<style lang="scss">
	.noticesWrapper {
		.card-element:last-child {
			padding-bottom: 10px;
		}
	}

	.birthday-gif {
		background-image: url("../../assets/BirthdayGIF.gif");
		background-repeat: no-repeat;
		background-size: contain;
		background-position: right;
	}

	.breathing {
		animation: breathing 5s ease-out infinite normal;
	}

	@keyframes breathing {
		0% {
			transform: scale(1);
		}

		25% {
			transform: scale(1.05);
		}

		50% {
			transform: scale(1);
		}

		75% {
			transform: scale(1.05);
		}

		100% {
			transform: scale(1);
		}
	}
</style>
