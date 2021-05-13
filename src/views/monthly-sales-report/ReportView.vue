<template>
	<div class="MSRReportWrapper">
		<div class="title-section">
			<div class="title">MSR for {{ monthInfo.month_name }} by {{ monthInfo.mortal_data.name }}</div>
			<v-btn color="primary" @click="downloadReport">Export Report</v-btn>
		</div>
		<div class="highlight-section">
			{{ monthInfo.highlights }}
		</div>
		<div v-if="totalCount === 0" class="content-error-message">
			No data in the DSR for the selected product
		</div>
		<div v-else class="info-table">
			<v-data-table
				:items-per-page="fetchCount"
				hide-default-footer
				:headers="headers"
				:expanded.sync="expanded"
				show-expand
				item-key="serial_number"
				:items="reportsList"
			>
				<template v-slot:[`item.sales_call_data.date_of_call`]="{ item }">
					{{ getFormattedDate(item.sales_call_data.date_of_call, "MMMM Do YYYY dddd") }}
				</template>
				<template v-slot:[`item.travel_agent_employee.phone_numbers`]="{ item }">
					{{ item.travel_agent_employee.phone_numbers.join(", ") }}
				</template>
				<template v-slot:[`item.travel_agent_employee.email_ids`]="{ item }">
					{{ item.travel_agent_employee.email_ids.join(", ") }}
				</template>
				<template v-slot:[`item.sales_call_data.company_data`]="{ item }">
					{{ item && item.sales_call_data.company_data ? item.sales_call_data.company_data.name : "-" }}
				</template>
				<template v-slot:expanded-item="{ headers, item }">
					<td class="expandable-section table-expanded-background " :colspan="headers.length">
						<div class="expandable-section-title">Remark</div>
						<div class="expandable-section-content" v-html="item.meeting_remark">{{}}</div>
					</td>
				</template>
			</v-data-table>
		</div>

		<!-- <div class="paginationWrapper text-center">
			<v-pagination
				@input="updatedPageNo"
				v-if="isPaginationRequired"
				v-model="pageNo"
				:length="Math.ceil(fetchCount / pageSize)"
			></v-pagination>
		</div> -->
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import helperMixins from "../../mixins/helperMixins";
	// import searchMixin from "../../mixins/searchMixin";
	import { mapActions, mapGetters, mapMutations } from "vuex";

	export default {
		name: "MSRReportView",
		mixins: [helperMixins, defaultCRUDMixin],
		created() {
			this.getData();
		},
		data: () => ({
			reportsList: [],
			headers: [
				{ text: "Sr. No.", align: "start", value: "serial_number", width: 100 },
				{ text: "Index", align: "start", value: "sales_call_data.sr_no", width: 100 },
				{ text: "Name", value: "mortal_data.name", width: 150 },
				{ text: "Date of Visit", value: "sales_call_data.date_of_call", width: 200 },
				{ text: "Company Name", value: "sales_call_data.company_data", width: 200 },
				{ text: "Branch Name", value: "sales_call_data.company_address_data.branch_name", width: 150 },
				{ text: "City", value: "sales_call_data.company_address_data.city", width: 150 },
				{ text: "State", value: "sales_call_data.company_address_data.state", width: 150 },
				{ text: "Address", value: "sales_call_data.company_address_data.address", width: 150 },
				{ text: "Employee", value: "travel_agent_data.name", width: 150 },
				{ text: "Designation", value: "travel_agent_data.designation", width: 150 },
				{ text: "Contact No.", value: "travel_agent_data.phone_numbers", width: 150 },
				{ text: "Email ID", value: "travel_agent_data.email_ids", width: 150 },
				// { text: "Remark", value: "data-table-expand" },
			],
			expanded: [],
			filter: {},
			fetchCount: 0,
			totalCount: 0,
		}),
		methods: {
			...mapActions("MSR", ["getReportList", "downloadReportFile"]),
			getData() {
				this.openLoaderDialog();
				this.filter.month = this.monthInfo.month;
				this.filter.year = this.monthInfo.year;
				this.filter.country = this.monthInfo.country;
				this.filter.mortal_id = this.monthInfo.mortal_id;
				this.getReportList({
					filter: this.filter,
					// pageSize: this.pageSize,
					// pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.reportsList = data.list.dsr_data;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;

					if (this.reportsList.length) {
						this.reportsList = this.reportsList.map((d, index) => ({
							...d,
							serial_number: index + 1,
						}));
					}
				});
			},
			downloadReport() {
				this.openLoaderDialog();
				this.downloadReportFile({
					month: this.monthInfo.month,
					year: this.monthInfo.year,
					country: this.monthInfo.country,
					mortal_id: this.monthInfo.mortal_id,
				}).then(() => {
					this.closeLoaderDialog();
				});
			},
		},
		watch: {
			monthInfo: {
				deep: true,
				handler(nv, ov) {
					console.log("Handler");
					this.filter = {};
					this.reportsList = [];
					this.getData();
				},
			},
		},
		props: {
			monthInfo: { required: true, type: Object },
		},
	};
</script>
<style lang="scss" scoped>
	.MSRReportWrapper {
		height: 100%;
		margin: 20px;

		.title-section {
			margin-bottom: 20px;
			display: flex;
			justify-content: space-between;
		}
		.highlight-section {
			white-space: pre-wrap;
			margin-bottom: 20px;
		}
	}
	// .info-table {
	// 	padding: 10px;
	// 	border: 1px solid $primary;
	// 	border-radius: 5px;
	// }
	.expandable-section {
		padding: 1em !important;
		.expandable-section-title {
			font-size: 16px;
			font-weight: 600;
		}
		.expandable-section-content {
			white-space: pre-wrap;
		}
	}
</style>
