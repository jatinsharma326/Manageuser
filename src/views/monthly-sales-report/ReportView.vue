<template>
	<div class="MSRReportWrapper"></div>
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
			reportInfo: {
				reportList: [
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
			},
		}),
		methods: {
			...mapActions("MSR", ["getReportList"]),
			getData() {
				this.openLoaderDialog();
				this.filter.representing_partner_id = this.partnerInfo._id;
				this.getReportList({
					filter: this.filter,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.reportList = data.list.dsr_data;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;
				});
			},
		},
		watch: {
			partnerInfo: {
				deep: true,
				handler(nv, ov) {
					console.log("Handler");
					this.filter = {};
					this.employeesList = [];
					this.getEmployees();
					if (nv.countries) {
						this.setSearchConfig(nv.countries);
						this.setInputConfig(this.partnerInfo.countries);
					}
				},
			},
		},
		props: {
			partnerInfo: { required: true, type: Object },
		},
	};
</script>
<style lang="scss" scoped>
	.MSRReportWrapper {
		height: 100%;
	}
</style>
