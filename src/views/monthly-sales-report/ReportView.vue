<template>
	<div class="MSRReportWrapper">
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
				<template v-slot:[`item.follow_up_on_date`]="{ item }">
					{{ item.follow_up_on_date ? getFormattedDate(item.follow_up_on_date, "MMMM Do YYYY dddd") : "-" }}
				</template>
				<template v-slot:expanded-item="{ headers, item }">
					<td class="expandable-section table-expanded-background " :colspan="headers.length">
						<div class="expandable-section-title">Remark</div>
						<div class="expandable-section-content" v-html="item.meeting_remark">{{}}</div>
					</td>
				</template>
				<template v-slot:[`item.actions`]="{ item }">
					<template v-if="canUserEdit(item)">
						<v-menu bottom left>
							<template v-slot:activator="{ on, attrs }">
								<v-btn icon v-bind="attrs" v-on="on">
									<v-icon>mdi-dots-vertical</v-icon>
								</v-btn>
							</template>
							<v-list>
								<v-list-item @click="openInputForm(true, item)">EDIT</v-list-item>
								<v-list-item @click="deleteCall(item)">DELETE</v-list-item>
							</v-list>
						</v-menu>
					</template>
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
	import { mapActions, mapGetters, mapMutations } from "vuex";

	export default {
		name: "MSRReportView",
		mixins: [defaultCRUDMixin],
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
				{ text: "Company Name", value: "company_data.name", width: 200 },
				{ text: "Branch Name", value: "company_address_data.branch_name", width: 150 },
				{ text: "City", value: "company_address_data.city", width: 150 },
				{ text: "State", value: "company_address_data.state", width: 150 },
				{ text: "Address", value: "company_address_data.address", width: 150 },
				{ text: "Employee", value: "travel_agent_employee.name", width: 150 },
				{ text: "Designation", value: "travel_agent_employee.designation", width: 150 },
				{ text: "Contact No.", value: "travel_agent_employee.phone_numbers", width: 150 },
				{ text: "Email ID", value: "travel_agent_employee.email_ids", width: 150 },
				{ text: "Follow Up", value: "follow_up_on_date", width: 150 },
				{ text: "Status", value: "status", width: 150 },
				// { text: "Remark", value: "data-table-expand" },
				{ text: "", value: "actions" },
			],
			expanded: [],
			filter: {},
		}),
		methods: {
			...mapActions("MSR", ["getReportList"]),
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
	}
</style>
