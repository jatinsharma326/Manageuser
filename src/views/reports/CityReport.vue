<template>
	<div class="cityWiseReportWrapper">
		<div class="SearchbarWrapper">
			<div class="searchbar">
				<Search
					@filterObject="advanceSearch"
					@clearFilter="advanceSearch"
					:placeholder="placeholder"
					:isAdvanceSearch="true"
					:isOnlyAdvanceSearch="true"
					:isAdvanceAFilter="true"
					:filterConfig="selectedSearchConfig"
				>
					<template v-slot:buttonSection>
						<v-btn
							:disabled="checkDownloadButtonStatus"
							color="secondary"
							text
							@click.stop="downloadReport()"
							>Download Report</v-btn
						>
					</template>
				</Search>
			</div>
			<div class="datepicker">
				<v-dialog
					ref="dialog"
					v-model="dateDialog"
					:return-value.sync="datePickerDate"
					persistent
					width="290px"
				>
					<template v-slot:activator="{ on, attrs }">
						<v-text-field
							v-model="dateRangeText"
							label="Date Range"
							readonly
							outlined
							@click="dataSelector"
							v-bind="attrs"
							v-on="on"
						></v-text-field>
					</template>
					<v-date-picker range type="month" v-model="datePickerDate" scrollable>
						<v-spacer></v-spacer>
						<v-btn text color="primary" @click="resetDatePicker">
							Reset
						</v-btn>
						<v-btn text color="primary" @click="cancelDatePicker">
							Cancel
						</v-btn>
						<v-btn text color="primary" @click="submitDatePicker">
							OK
						</v-btn>
					</v-date-picker>
				</v-dialog>
			</div>
		</div>
		<div v-if="totalCount === 0" class="content-error-message">
			No Followup entries. Please add followup entries to see the reports
		</div>
		<div v-else class="info-table">
			<v-data-table
				:items-per-page="pageSize"
				hide-default-footer
				:headers="headers"
				item-key="_id"
				:items="dataList"
			>
			</v-data-table>
		</div>

		<div v-if="isPaginationRequired" class="paginationWrapper text-center">
			<v-pagination
				@input="updatedPageNo"
				v-model="pageNo"
				:length="Math.ceil(fetchCount / pageSize)"
				:total-visible="paginationTotalVisible"
				class="pagination-component"
			></v-pagination>
			<div class="page-size-dropdown">
				<v-autocomplete v-model="pageSize" :items="pageSizeList" auto-select-first solo dense></v-autocomplete>
			</div>
		</div>
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import searchMixin from "../../mixins/searchMixin";
	import datePickerMixin from "../../mixins/datePickerMixin";
	import helperMixin from "../../mixins/helperMixins";
	import moment from "moment-timezone";
	import { mapActions, mapGetters, mapMutations } from "vuex";

	export default {
		name: "CityWiseReport",
		mixins: [defaultCRUDMixin, searchMixin, datePickerMixin],
		components: {},
		async created() {
			this.setDateRange();
			this.getData();
			await this.getCities();
			this.setSearchConfig(this.countriesList, this.userList, this.citiesList);
		},
		data: () => ({
			selectedCardInfo: {},
			activeState: true,
			dataList: [],
			selectionDateTo: [],
			selectionDateFrom: [],
			citiesList: [],
			headers: [
				{ text: "Sr. No.", align: "start", value: "serial_number", width: 100 },
				{ text: "Travel Agent", value: "agency_name", width: 200 },
				{ text: "No. of Adults", value: "number_of_pax_adult", width: 150 },
				{ text: "No. of Children", value: "number_of_pax_child", width: 150 },
				{ text: "Revenue", value: "revenue_amount", width: 200 },
				{ text: "Currency", value: "currency_type", width: 200 },
				{ text: "Revenue ($)", value: "revenue_amount_in_usd", width: 200 },
				{ text: "City", value: "city", width: 150 },
			],
		}),
		computed: {
			dateRangeText() {
				return this.datePickerDate.join(" ~ ");
			},
			checkDownloadButtonStatus() {
				if (this.fetchCount == 0) {
					return true;
				}
				return false;
			},
		},
		methods: {
			...mapActions("Reports", ["getTravelAgentReport", "downloadAgencyWiseReport"]),
			...mapActions("FollowUp", ["getCitiesList"]),
			setDateRange() {
				let tempArray = [];
				let startDate = moment()
					.tz("Asia/Kolkata")
					.startOf("year")
					.format("YYYY-MM");
				let endDate = moment()
					.tz("Asia/Kolkata")
					.endOf("year")
					.format("YYYY-MM");
				tempArray.push(startDate);
				tempArray.push(endDate);
				this.datePickerDate = tempArray;
			},
			getCities() {
				return this.getCitiesList({
					filter: {},
				}).then((data) => {
					this.citiesList = data.list;
				});
			},
			getData() {
				this.openLoaderDialog();
				this.datePickerDate.sort();
				this.selectionDateFrom = moment(this.datePickerDate[0])
					.tz("Asia/Kolkata")
					.startOf("month")
					.toISOString();
				if (this.datePickerDate[1]) {
					this.selectionDateTo = moment(this.datePickerDate[1])
						.tz("Asia/Kolkata")
						.endOf("month")
						.toISOString();
				} else {
					this.selectionDateTo = moment(this.datePickerDate[0])
						.tz("Asia/Kolkata")
						.endOf("month")
						.toISOString();
				}

				this.getTravelAgentReport({
					filter: this.filter,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
					selection_date_from: this.selectionDateFrom,
					selection_date_to: this.selectionDateTo,
					isCityGroup: true,
				}).then((data) => {
					this.closeLoaderDialog();
					this.dataList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;

					if (this.dataList.length) {
						this.dataList = this.dataList.map((d, index) => ({
							...d,
							serial_number: (this.pageNo - 1) * this.pageSize + (index + 1),
						}));
					}
				});
			},
			advanceSearch(filterObject) {
				this.filter = { ...filterObject };
				this.pageNo = 1;
				this.getData();
			},
			setSearchConfig(countriesList = [], userList = [], citiesList = []) {
				this.selectedSearchConfig = [
					{
						name: "Inquiry Type",
						key: "business_types",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: true,
						listVariable: "businessType",
					},
					{
						name: "Product",
						key: "countries",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: countriesList,
					},
					{
						name: "City",
						key: "cities",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: citiesList,
					},
				];
				if (this.isAdminOrManagement) {
					this.selectedSearchConfig.unshift({
						name: "Created By",
						key: "names",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: userList,
					});
				}
			},
			downloadReport() {
				this.datePickerDate.sort();
				this.selectionDateFrom = moment(this.datePickerDate[0])
					.tz("Asia/Kolkata")
					.startOf("month")
					.toISOString();
				if (this.datePickerDate[1]) {
					this.selectionDateTo = moment(this.datePickerDate[1])
						.tz("Asia/Kolkata")
						.endOf("month")
						.toISOString();
				} else {
					this.selectionDateTo = this.selectionDateFrom;
				}
				this.openLoaderDialog();
				this.downloadAgencyWiseReport({
					filter: this.filter,
					selection_date_from: this.selectionDateFrom,
					selection_date_to: this.selectionDateTo,
					isCityGroup: true,
				}).then(() => {
					this.closeLoaderDialog();
				});
			},
			updatedPageNo(page) {
				this.getData();
			},
		},
		watch: {},
		props: {
			name: { required: true, type: String },
			placeholder: { required: false, type: String },
			userList: { required: false, type: Array, default: () => [] },
			countriesList: { required: false, type: Array, default: () => [] },
		},
	};
</script>

<style lang="scss" scopped>
	.cityWiseReportWrapper {
		padding: 20px 5px;
		height: 100%;
	}
</style>
