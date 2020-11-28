<template>
	<div class="companyAddressWrapper">
		<div class="SearchbarWrapper">
			<div class="searchbar">
				<Search
					@queryString="queryString"
					@filterObject="advanceSearch"
					@clearFilter="advanceSearch"
					:placeholder="placeholder"
					:isAdvanceSearch="true"
					:isOnlyAdvanceSearch="true"
					:isAdvanceAFilter="true"
					:filterConfig="selectedSearchConfig"
				></Search>
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
		<div v-else class="leaves-table">
			<v-data-table
				:items-per-page="pageSize"
				hide-default-footer
				:headers="headers"
				item-key="_id"
				:items="dataList"
			>
				<template v-slot:[`item.date_of_enquiry`]="{ item }">
					{{ item.date_of_enquiry ? getFormattedDate(item.date_of_enquiry, "MMMM Do YYYY dddd") : "-" }}
				</template>
				<template v-slot:[`item.contact_number`]="{ item }">
					{{ item.contact_number ? item.contact_number : "-" }}
				</template>
				<template v-slot:[`item.date_of_travel`]="{ item }">
					{{ item.date_of_travel ? getFormattedDate(item.date_of_travel, "MMMM Do YYYY dddd") : "-" }}
				</template>
				<template v-slot:[`item.reminder_date`]="{ item }">
					{{ item.reminder_date ? getFormattedDate(item.reminder_date, "MMMM Do YYYY dddd") : "-" }}
				</template>
				<template v-slot:[`item.payment_status`]="{ item }">
					{{ item.payment_status ? item.payment_status : "-" }}
				</template>
				<template v-slot:[`item.invoice_no`]="{ item }">
					{{ item.invoice_no ? item.invoice_no : "-" }}
				</template>
				<template v-slot:[`item.payment_type`]="{ item }">
					{{ item.payment_type ? item.payment_type : "-" }}
				</template>
				<template v-slot:[`item.currency_type`]="{ item }">
					{{ item.currency_type ? item.currency_type : "-" }}
				</template>
				<template v-slot:[`item.amount_pending`]="{ item }">
					{{ item.amount_pending ? item.amount_pending : "-" }}
				</template>
				<template v-slot:[`item.amount_received`]="{ item }">
					{{ item.amount_received ? item.amount_received : "-" }}
				</template>
				<template v-slot:[`item.record.updated_on`]="{ item }">
					{{ item.record.updated_on ? getFormattedDate(item.record.updated_on, "MMMM Do YYYY dddd") : "-" }}
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
	import searchMixin from "../../mixins/searchMixin";
	import datePickerMixin from "../../mixins/datePickerMixin";
	import helperMixin from "../../mixins/helperMixins";
	import moment from "moment-timezone";
	import { mapActions, mapGetters, mapMutations } from "vuex";

	export default {
		name: "YearlyRevenueRaw",
		mixins: [defaultCRUDMixin, searchMixin, datePickerMixin, helperMixin],
		components: {},
		async created() {
			this.setDateRange();
			this.getData();
			this.setSearchConfig(this.countriesList, this.userList);
		},
		data: () => ({
			selectedCardInfo: {},
			activeState: true,
			dataList: [],
			headers: [
				{ text: "Sr. No.", align: "start", value: "serial_number", width: 100 },
				{ text: "Product", value: "country", width: 150 },
				{ text: "Created By", value: "mortal_data.name", width: 150 },
				{ text: "Date of Enquiry", value: "date_of_enquiry", width: 200 },
				{ text: "Company Name", value: "company_data.name", width: 200 },
				{ text: "City", value: "city", width: 150 },
				{ text: "Zone", value: "zone", width: 150 },
				{ text: "Date of Travel", value: "date_of_travel", width: 150 },
				{ text: "Inquiry Type", value: "business_types", width: 150 },
				{ text: "Email Subject", value: "email_subject", width: 150 },
				{ text: "File Status", value: "status", width: 150 },
				{ text: "Follow Up", value: "reminder_date", width: 150 },
				{ text: "Payment Status", value: "payment_status", width: 200 },
				{ text: "Invoice No.", value: "invoice_no", width: 150 },
				{ text: "Payment Type", value: "payment_type", width: 150 },
				{ text: "Currency", value: "currency_type", width: 150 },
				{ text: "Pending (Amount)", value: "amount_pending", width: 200 },
				{ text: "Received (Amount)", value: "amount_received", width: 200 },
				{ text: "Last Updated On", value: "record.updated_on", width: 200 },
			],
		}),
		computed: {
			dateRangeText() {
				return this.datePickerDate.join(" ~ ");
			},
		},
		methods: {
			...mapActions("FollowUp", ["getFollowUp"]),
			...mapMutations([]),
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
			getData() {
				this.openLoaderDialog();
				this.filter.date_from = moment(this.datePickerDate[0])
					.tz("Asia/Kolkata")
					.startOf()
					.toISOString();
				if (this.datePickerDate[1]) {
					this.filter.date_to = moment(this.datePickerDate[1])
						.tz("Asia/Kolkata")
						.endOf()
						.toISOString();
				} else {
					this.filter.date_to = this.filter.date_from;
				}
				//To only get the Amount RECEIVED we need to filter out following conditions
				this.filter.status = "CONFIRMED";
				this.filter.payment_status = "RECEIVED";
				this.filter.payment_type = "FULL PAYMENT";

				this.getFollowUp({
					filter: this.filter,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
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
			queryString(data) {
				this.filter["search_text"] = data;
				this.getData();
			},
			advanceSearch(filterObject) {
				this.filter = { ...filterObject };
				if (this.filter.active) {
					this.activeState = false;
				} else {
					this.activeState = true;
				}
				this.pageNo = 1;
				this.getData();
			},
			setSearchConfig(countriesList = [], userList = []) {
				// console.log(countriesList);
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
						name: "Created By",
						key: "names",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: userList,
						classes: ["full"],
					},
				];
			},
			updatedPageNo(page) {
				this.getData();
			},
		},
		watch: {
			datePickerDate: {
				deep: true,
				async handler(nv, ov) {
					// console.log("ov", ov, "nv", nv);
					for (let valueOV of ov) {
						for (let valueNV of nv) {
							if (valueOV != valueNV) {
								this.$emit("mainDateRange", this.datePickerDate);
							}
						}
					}
					// this.filter = {};
					// this.dataList = [];
					// this.pageNo = 1;
					// console.log("Company Info changed");
					// this.getData();
					// await this.getStates();
					// this.setInputConfig(this.statesList);
					// this.setSearchConfig(this.statesList);
				},
			},
			// companyInfo: {
			// 	deep: true,
			// 	async handler(nv, ov) {
			// 		this.filter = {};
			// 		this.dataList = [];
			// 		this.pageNo = 1;
			// 		console.log("Company Info changed");
			// 		this.getData();
			// 		await this.getStates();
			// 		this.setInputConfig(this.statesList);
			// 		this.setSearchConfig(this.statesList);
			// 	},
			// },
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
	.companyAddressWrapper {
		padding: 20px 5px;
		height: 100%;
	}
	.companyaddress-search-bar {
		margin-top: 12px;
		display: flex;
		justify-content: center;
	}
</style>
