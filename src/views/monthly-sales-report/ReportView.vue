<template>
	<div class="MSRReportWrapper">
		<div class="title-section">
			<div class="title">MSR for {{ monthInfo.month_name }} by {{ monthInfo.mortal_data.name }}</div>
			<v-btn color="primary" @click="downloadReport">Export Report</v-btn>
		</div>
		<div class="highlight-section">
			{{ monthInfo.highlights }}
		</div>
		<div class="leaves-table">
			<v-data-table
				hide-default-footer
				:headers="headers"
				:expanded.sync="expanded"
				show-expand
				item-key="_id"
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
				<template v-slot:expanded-item="{ headers, item }">
					<td class="expandable-section table-expanded-background " :colspan="headers.length">
						<div class="expandable-section-title">Remark</div>
						<div class="expandable-section-content" v-html="item.meeting_remark">{{}}</div>
					</td>
				</template>
			</v-data-table>
		</div>

		<div class="text-center">
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
	import helperMixins from "../../mixins/helperMixins";
	import searchMixin from "../../mixins/searchMixin";
	import { mapActions, mapGetters, mapMutations } from "vuex";

	export default {
		name: "MSRReportView",
		mixins: [searchMixin, helperMixins, defaultCRUDMixin],
		created() {
			this.getData();
		},
		data: () => ({
			reportsList: [
				{
					sales_call_id: "5faa849bbbd00900275d0322",
					travel_agent_id: "5faa6ed0bbd00900275d0319",
					status: "ON GOING",
					follow_up_on_date: "2020-11-28T18:30:00.000Z",
					meeting_remark: "Met with Akshay Sir, was a productive call. Might get business.",
					mortal_id: "5f9fa9ea077a8d00252e1278",
					sales_call_data: {
						date_of_call: "2020-07-03T18:30:00.000Z",
						sr_no: "JUL20-0",
						mortal_id: "5f9fa9ea077a8d00252e1278",
						company_id: "5faa6ed0bbd00900275d0315",
						company_address_id: "5faa6ed0bbd00900275d0317",
						company_data: {
							name: "Haridwar Apps",
						},
						company_address_data: {
							branch_name: "Dhongra",
							zone: "NORTH",
							address: "Bandra",
							city: "Mumbai",
							state: "Maharashtra",
							pincode: "400008",
							company_id: "5faa6ed0bbd00900275d0315",
						},
					},
					travel_agent_data: {
						name: "Aishwarya",
						phone_numbers: ["125546"],
						designation: "ASM",
						email_ids: ["test@test.com", "d@gd.com"],
					},
				},
			],
			headers: [
				{ text: "Sr. No.", align: "start", value: "sales_call_data.sr_no", width: 100 },
				{ text: "Name", value: "mortal_data.name", width: 150 },
				{ text: "Date of Visit", value: "sales_call_data.date_of_call", width: 200 },
				{ text: "Company Name", value: "sales_call_data.company_data.name", width: 200 },
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
		}),
		methods: {
			...mapActions("MSR", ["getReportList", "getReportFileURL"]),
			getData() {
				this.openLoaderDialog();
				this.filter.month = this.monthInfo.month;
				this.filter.year = this.monthInfo.year;
				this.filter.country = this.monthInfo.country;
				this.getReportList({
					filter: this.filter,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.reportsList = data.list.dsr_data;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;
				});
			},
			downloadReport() {
				this.openSnackbar({ text: "Nothing to see here" });
				/*
				this.openLoaderDialog();
				this.getReportFileURL({
					// folder_name: log.folder_name,
					// file_name: log.file_name,
				}).then((data) => {
					this.closeLoaderDialog();
					if (data.ok) {
						this.openSnackbar({ text: "Starting Download" });
						const link = document.createElement("a");
						link.href = data.url;
						link.setAttribute("download", "report.xlsx"); //or any other extension
						document.body.appendChild(link);
						link.click();
					} else {
						this.openSnackbar({ text: "Failed to get Report File URL" });
					}
				});
				*/
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
	.leaves-table {
		padding: 10px;
		border: 1px solid $primary;
		border-radius: 5px;
	}
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
