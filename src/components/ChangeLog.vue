<template>
	<div class="changelogModalWrapper">
		<v-row justify="center">
			<v-dialog v-model="modal" width="600px" persistent>
				<v-card>
					<v-card-title>
						<span class="headline">Changelogs</span>
						<v-spacer></v-spacer>
						<div class="close-dialog" @click="closeModal()">
							<v-btn fab color="error" text>
								<v-icon>mdi-close</v-icon>
							</v-btn>
						</div>
					</v-card-title>
					<div class="content-error-message" v-if="fetchCount == 0">No Logs for {{ selectedInfo.name }}</div>
					<v-timeline v-else dense>
						<v-timeline-item
							v-for="(log, index) in changelogsList"
							:key="index"
							:icon="getLogIcon(log.mutation_type)"
							fill-dot
						>
							{{ getLogType(log.mutation_type) }} by {{ log.name }} on
							{{ getFormattedDate(log.record.created_on, "MMMM Do YYYY, dddd") }}
						</v-timeline-item>
					</v-timeline>
					<v-card-actions>
						<v-btn v-if="pageSize < fetchCount" color="secondary" text @click="loadMoreLogs">
							View More
						</v-btn>
						<v-spacer></v-spacer>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-row>
	</div>
</template>
<script>
	import helperMixin from "../mixins/helperMixins";
	import searchMixin from "../mixins/searchMixin";
	import { mapActions, mapGetters, mapMutations } from "vuex";
	export default {
		name: "changeLogsModal",
		mixins: [helperMixin, searchMixin],
		components: {},
		created() {
			// this.getChangelogs(this.selectedInfo);
		},
		data: () => ({
			modal: false,
			changelogsList: [],
		}),
		methods: {
			...mapMutations(["openLoaderDialog", "closeLoaderDialog", "openSnackbar"]),
			...mapActions("ManageAgents", ["getChangelogsList"]),
			closeModal() {
				this.pageSize = 20;
				this.changelogsList = [];
				this.$emit("closeModal");
			},
			loadMoreLogs() {
				this.pageSize = this.pageSize + 20;
				this.getChangelogs(this.selectedInfo);
			},
			getChangelogs(info) {
				this.openLoaderDialog();
				this.filter.ref_id = info._id;
				this.getChangelogsList({
					filter: this.filter,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.changelogsList = data.list;
					this.fetchCount = data.fetchCount;
					this.totalCount = data.totalCount;
				});
			},
			getLogIcon(mutation_type) {
				if (mutation_type == "insert") {
					return "mdi-plus";
				} else if (mutation_type == "update") {
					return "mdi-pencil-outline";
				} else if (mutation_type == "disable") {
					return "mdi-eye-minus";
				} else if (mutation_type == "enable") {
					return "mdi-eye-check";
				}
			},
			getLogType(mutation_type) {
				if (mutation_type == "insert") {
					return "Created";
				} else if (mutation_type == "update") {
					return "Updated";
				} else if (mutation_type == "disable") {
					return "Disabled";
				} else if (mutation_type == "enable") {
					return "Enabled";
				}
			},
		},
		watch: {
			toggleChangelogModal(nv, ov) {
				this.modal = nv;
				this.changelogsList = [];
				if (nv) this.getChangelogs(this.selectedInfo);
			},
			// selectedInfo: {
			// 	deep: true,
			// 	handler(nv, ov) {
			// 		this.changelogsList = [];
			// 		this.getEmployees();
			// 		if (nv.countries) {
			// 			this.setSearchConfig(nv.countries);
			// 			this.setInputConfig(this.partnerInfo.countries);
			// 		}
			// 	},
			// },
		},
		props: {
			toggleChangelogModal: { required: true, default: false },
			selectedInfo: { required: true, type: Object },
		},
	};
</script>
<style lang="scss" scoped></style>
