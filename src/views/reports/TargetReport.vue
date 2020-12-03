<template>
	<div class="travelAgentRawWrapper">
		<div class="SearchbarWrapper">
			<div class="searchbar"></div>
			<div class="datepicker">
				<v-autocomplete v-model="selectedYear" :items="yearList" outlined label="Select Year"></v-autocomplete>
			</div>
		</div>
		<div v-if="totalCount === 0" class="content-error-message">
			No Followup entries. Please add followup entries to see the reports
		</div>
		<div v-else class="leaves-table">
			<v-data-table
				:items-per-page="pageSize"
				hide-default-footer
				:headers="headers"
				item-key="_id"
				:items="dataList"
			>
			</v-data-table>
		</div>

		<div class="paginationWrapper text-center">
			<v-pagination
				@input="updatedPageNo"
				v-if="isPaginationRequired"
				v-model="pageNo"
				:length="Math.ceil(fetchCount / pageSize)"
			></v-pagination>
		</div>
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import searchMixin from "../../mixins/searchMixin";
	import helperMixin from "../../mixins/helperMixins";
	import moment from "moment-timezone";
	import { mapActions, mapGetters, mapMutations } from "vuex";

	export default {
		name: "TravelReport",
		mixins: [defaultCRUDMixin, searchMixin, helperMixin],
		components: {},
		async created() {
			this.setYear();
			this.getData();
		},
		data: () => ({
			selectedCardInfo: {},
			activeState: true,
			dataList: [],
			selectionDateTo: [],
			selectionDateFrom: [],
			selectedYear: 2020,
			headers: [
				{ text: "Sr. No.", align: "start", value: "serial_number", width: 100 },
				{ text: "Product", value: "country", width: 200 },
				{ text: "Revenue", value: "revenue_amount", width: 200 },
				{ text: "Target", value: "target", width: 200 },
				{ text: "Difference", value: "diff", width: 200 },
				{ text: "Currency", value: "currency_type", width: 200 },
				{ text: "Revenue ($)", value: "revenue_amount_in_usd", width: 200 },
				{ text: "Target ($)", value: "target_in_usd", width: 200 },
				{ text: "Difference ($)", value: "diff_in_usd", width: 200 },
			],
		}),
		computed: {
			...mapGetters("ManageTargets", ["yearList"]),
			dateRangeText() {
				return this.datePickerDate.join(" ~ ");
			},
		},
		methods: {
			...mapActions("Reports", ["getTargetReport"]),
			getData() {
				this.openLoaderDialog();
				this.selectionDateFrom = moment(this.selectedYear, "YYYY")
					.tz("Asia/Kolkata")
					.startOf("year")
					.toISOString();
				this.selectionDateTo = moment(this.selectedYear, "YYYY")
					.tz("Asia/Kolkata")
					.endOf("year")
					.toISOString();

				this.getTargetReport({
					filter: this.filter,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
					selection_date_from: this.selectionDateFrom,
					selection_date_to: this.selectionDateTo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.dataList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;

					this.dataList = this.dataList.map((d, index) => ({
						...d,
						serial_number: (this.pageNo - 1) * this.pageSize + (index + 1),
					}));
				});
			},
			setYear() {
				this.currentYear = moment().format("YYYY");
				this.selectedYear = Number(this.currentYear);
			},
			updatedPageNo(page) {
				this.getData();
			},
		},
		watch: {
			selectedYear(nv, ov) {
				this.getData();
			},
		},
		props: {
			name: { required: true, type: String },
			placeholder: { required: false, type: String },
			userList: { required: false, type: Array, default: () => [] },
			countriesList: { required: false, type: Array, default: () => [] },
		},
	};
</script>

<style lang="scss" scopped>
	.travelAgentRawWrapper {
		padding: 20px 5px;
		height: 100%;
	}
</style>
