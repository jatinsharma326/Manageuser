<template>
	<div class="callsListWrapper">
		<div class="SearchbarWrapper">
			<div class="searchbar">
				<Search
					@queryString="queryString"
					@filterObject="advanceSearch"
					@clearFilter="advanceSearch"
					:placeholder="placeholder"
					:isAdvanceSearch="true"
					:filterConfig="searchConfig"
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
							label="Sales call range"
							readonly
							outlined
							@click="dataSelector"
							v-bind="attrs"
							v-on="on"
						></v-text-field>
					</template>
					<v-date-picker range v-model="datePickerDate" scrollable>
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

		<div class="leaves-table">
			<v-data-table hide-default-footer :headers="headers" :items="callsList" item-key="_id">
				<template v-slot:[`item.date_of_call`]="{ item }">
					{{ getFormattedDate(item.date_of_call, "MMMM Do YYYY dddd") }}
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

		<!-- <div class="text-center">
			<v-pagination
				@input="updatedPageNo"
				v-if="isPaginationRequired"
				v-model="pageNo"
				:length="Math.ceil(fetchCount / pageSize)"
			></v-pagination>
		</div> -->

		<template v-if="type == 'sales_call'">
			<UserForm
				@formOutput="formOutput"
				@closeForm="closeForm"
				:name="name"
				:type="type"
				:inputConfig="inputConfig"
				:keysToWatch="keysToWatch"
				:toggleForm="toggleForm"
				:formData="rowToEdit"
				:isEditMode="isEditMode"
			></UserForm>
			<div class="floating-button">
				<v-btn @click="openInputForm()" color="primary" dark fab>
					<v-icon>mdi-plus</v-icon>
				</v-btn>
			</div>
		</template>
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import helperMixin from "../../mixins/helperMixins";
	import inputFormMixin from "../../mixins/inputFormMixin";
	import searchMixin from "../../mixins/searchMixin";
	import datePickerMixin from "../../mixins/datePickerMixin";
	import helpers from "../../components/helpers";
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import moment from "moment-timezone";

	export default {
		name: "SalesCallManager",
		mixins: [defaultCRUDMixin, inputFormMixin, helperMixin, searchMixin, datePickerMixin],
		async created() {
			this.setDateRange();
			this.getData();
		},
		data: () => ({
			callsList: [],
			headers: [
				{ text: "Sr. No.", align: "start", value: "sr_no", width: 100 },
				{ text: "Name", value: "mortal_data.name", width: 150 },
				{ text: "Date of Visit", value: "date_of_call", width: 200 },
				{ text: "Company Name", value: "company_data.name", width: 200 },
				{ text: "Branch Name", value: "company_address_data.branch_name", width: 150 },
				{ text: "City", value: "company_address_data.city", width: 150 },
				{ text: "State", value: "company_address_data.state", width: 150 },
				{ text: "Address", value: "company_address_data.address", width: 150 },
				// { text: "Purpose", value: "data-table-expand" },
				{ text: "", value: "actions" },
			],
			keysToWatch: ["company_id"],
		}),
		computed: {
			...mapGetters(["userData"]),
			dateRangeText() {
				return this.datePickerDate.join(" ~ ");
			},
		},
		methods: {
			...mapActions("SalesCall", [
				"getSalesCall",
				"addSalesCall",
				"editSalesCall",
				"deleteSalesCall",
				"checkCallDetail",
			]),
			getData() {
				this.openLoaderDialog();
				// console.log("Test Console User Data", this.userData);
				if (this.isSalesTeamMember && this.type == "sales_call") {
					console.log("User Data ", this.userData);
					this.filter.mortal_id = this.userData.id;
				}
				console.log("filter ", this.filter);
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

				this.getSalesCall({
					filter: this.filter,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.callsList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;
				});
			},
			canUserEdit(item) {
				let currentMonth = moment()
					.tz("Asia/Kolkata")
					.startOf("month");
				let callMonth = moment(item.date_of_call)
					.tz("Asia/Kolkata")
					.startOf("month");
				let diffrenceInDates = currentMonth.diff(callMonth, "months", true);
				//Taher check the condition once
				if (this.type == "sales_call" && -2 <= diffrenceInDates && diffrenceInDates <= 1) {
					return true;
				} else {
					return false;
				}
			},
			queryString(data) {
				this.filter["search_text"] = data;
				this.getData();
			},
			advanceSearch(filterObject) {
				// make changes here to the filterObject
				var filterData = JSON.parse(JSON.stringify(filterObject));
				if (filterData.date_of_call) {
					filterData.date_of_call = helpers.getISODate(filterData.date_of_call);
				}
				console.log("Test Console Advance Search Output", filterData);
				this.filter = { ...filterData };
				this.pageNo = 1;
				this.getData();
			},
			async formOutput(data) {
				var formData = JSON.parse(JSON.stringify(data));
				// formData.company_id = this.companyInfo._id;
				if (formData.date_of_call) {
					formData.date_of_call = helpers.getISODate(formData.date_of_call);
					formData.month = Number(moment(formData.date_of_call).format("MM"));
					formData.year = Number(moment(formData.date_of_call).format("YYYY"));
				}

				console.log("Test Console Before API call FormData Object", formData);
				this.openLoaderDialog();
				if (formData.company_id || formData.date_of_call) {
					this.checkCallDetail({
						company_address_id: formData.company_address_id,
						company_id: formData.company_id,
						date_of_call: formData.date_of_call,
					}).then((data) => {
						if (data.ok && data.data && data.data.length) {
							console.log("1", data.data);
							if (
								window.confirm(
									`${data.data.map((e) => e.mortal_data.name).join(", ")} also ${
										data.data.length > 1 ? "have" : "has a"
									} Sales Call for "${data.data[0].company_data.name}" (For the Branch ${
										data.data[0].company_address_data.branch_name
									}) on ${this.getFormattedDate(
										data.data[0].date_of_call
									)}. Are you sure you want to continue.`
								)
							) {
								this.addAndEditSalesCallWrapper(formData);
							} else {
								this.closeLoaderDialog();
							}
						} else {
							this.addAndEditSalesCallWrapper(formData);
						}
					});
				} else {
					this.addAndEditSalesCallWrapper(formData);
				}
			},
			addAndEditSalesCallWrapper(formData) {
				if (!this.isEditMode) {
					this.addSalesCall(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Added Sales Call Entry" });
							this.getData();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				} else {
					this.editSalesCall(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Edited Sales Call Entry" });
							this.getData();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				}
			},
			getEditRowObject(data) {
				return {
					...data,
					_id: data._id,
					updated_on: data.record.updated_on,
				};
			},
			// setSearchConfig(teamMember = []) {
			// 	this.searchConfig = [
			// 		{
			// 			name: "Name of Applicant",
			// 			key: "names",
			// 			multi: true,
			// 			inputType: "dropdown",
			// 			defaultValue: [],
			// 			isListInStore: false,
			// 			listItems: teamMember,
			// 		},
			// 		{
			// 			name: "Date of Application",
			// 			key: "doa",
			// 			inputType: "datePicker",
			// 			defaultValue: null,
			// 		},
			// 		{
			// 			name: "Date From",
			// 			key: "date_from",
			// 			inputType: "datePicker",
			// 			defaultValue: null,
			// 		},
			// 		{
			// 			name: "Date To",
			// 			key: "date_to",
			// 			inputType: "datePicker",
			// 			defaultValue: null,
			// 		},
			// 		{
			// 			name: "Leave Status",
			// 			key: "statuses",
			// 			multi: true,
			// 			inputType: "dropdown",
			// 			defaultValue: [],
			// 			isListInStore: false,
			// 			listItems: ["PENDING", "ACCEPTED", "REJECTED"],
			// 		},
			// 	];
			// },
			deleteCall(call) {
				if (window.confirm("Do you really want to Delete the Sales Call?")) {
					this.openLoaderDialog();
					this.deleteSalesCall({
						_id: call._id,
					}).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Deleted the Sales Call" });
							this.getData();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				}
			},
			// updatedPageNo(page) {
			// 	this.getData();
			// },
		},
		watch: {},
		props: {
			name: { required: true, type: String },
			type: { required: true, type: String },
			placeholder: { required: true, type: String },
			inputConfig: { required: false, type: Array },
			searchConfig: { required: true, type: Array },
		},
	};
</script>
<style lang="scss" scoped>
	.leaves-table {
		margin: 10px;
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
		// .expandable-section-content {
		// }
	}
</style>
<style lang="scss">
	.datepicker {
		.v-input__slot {
			margin-bottom: 0;
		}
		.v-text-field__details {
			display: none;
		}
	}
</style>
