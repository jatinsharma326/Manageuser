<template>
	<div class="callsListWrapper">
		<v-row class="px-6 salescall-search-bar" justify="center" align="center">
			<v-col cols="12" sm="8" md="6">
				<!-- <div class="companyaddress-search-bar"> -->
				<Search
					@queryString="queryString"
					@filterObject="advanceSearch"
					@clearFilter="advanceSearch"
					:placeholder="placeholder"
					:isAdvanceSearch="true"
					:filterConfig="selectedSearchConfig"
				></Search>
				<!-- </div> -->
			</v-col>
		</v-row>

		<div class="leaves-table">
			<v-data-table hide-default-footer :headers="headers" :items="callsList" item-key="_id">
				<template v-slot:[`item.date_of_call`]="{ item }">
					{{ getFormattedDate(item.date_of_call, "MMMM Do YYYY dddd") }}
				</template>
				<template v-slot:[`item.actions`]="{ item }">
					<template v-if="type == 'sales_call'">
						<v-menu bottom left>
							<template v-slot:activator="{ on, attrs }">
								<v-btn icon v-bind="attrs" v-on="on">
									<v-icon>mdi-dots-vertical</v-icon>
								</v-btn>
							</template>
							<v-list>
								<v-list-item @click="openInputForm(true, item)">EDIT</v-list-item>
								<v-list-item>DELETE</v-list-item>
							</v-list>
						</v-menu>
					</template>
				</template>
			</v-data-table>
		</div>

		<div class="text-center">
			<v-pagination
				@input="updatedPageNo"
				v-model="pageNo"
				:length="Math.ceil(fetchCount / pageSize)"
			></v-pagination>
		</div>

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
	import helpers from "../../components/helpers";
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import moment from "moment-timezone";

	export default {
		name: "SalesCallManager",
		mixins: [defaultCRUDMixin, inputFormMixin, helperMixin, searchMixin],
		async created() {
			this.getData();
			// 	await this.getUsers();
			// 	this.setSearchConfig(this.userList);
		},
		data: () => ({
			callsList: [
				{
					_id: "5fa124ee6bff062f60d5fcc2",
					date_of_call: "2020-10-30T18:30:00.000Z",
					sr_no: "AUG20-0",
					record: {
						created_on: "2020-11-03T09:37:50.737Z",
						updated_on: "2020-11-03T09:37:50.737Z",
					},
					mortal_id: "5fa1075dab44e634a4d90c83",
					company_id: "5f9d03eb92bff8363cf43565",
					company_address_id: "5f9d4f9ce639cb1de070195f",
					company_address_data: {
						branch_name: "Nagpada",
						state: "Maharashtra",
						city: "Mumbai",
						pincode: "400008",
						zone: "EAST",
						address: "Dadar Mumbai",
					},
					company_data: {
						name: "Thomas Cook",
					},
					mortal_data: {
						name: "Aliasgar Pocketwala",
					},
				},
			],
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
			// userList: [],
			// serialNumber: 0,
		}),
		methods: {
			// ...mapActions("LeaveManager", ["getAllLeaves", "updateStatus"]),
			...mapActions("SalesCall", ["getSalesCall", "addSalesCall", "editSalesCall", "deleteSalesCall"]),

			// isDateBefore(date) {
			// 	if (moment().isBefore(date)) {
			// 		return true;
			// 	} else {
			// 		return false;
			// 	}
			// },
			getData() {
				this.openLoaderDialog();
				// this.filter.representing_partner_id = this.partnerInfo._id;
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
				}
				formData.month = 9;
				formData.year = 2020;

				console.log("Test Console Before API call FormData Object", formData);

				this.openLoaderDialog();
				if (!this.isEditMode) {
					this.addSalesCall(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Added Sales Call Entry" });
							this.getData();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
							this.getData();
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
							this.getData();
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
			// 	this.selectedSearchConfig = [
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
			updatedPageNo(page) {
				this.getData();
			},
		},
		watch: {},
		props: {
			name: { required: true, type: String },
			type: { required: true, type: String },
			placeholder: { required: true, type: String },
			inputConfig: { required: false, type: Array },
		},
	};
</script>
<style lang="scss" scoped>
	.salescall-search-bar {
		margin-top: 20px;
		margin-bottom: 20px;
	}
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
