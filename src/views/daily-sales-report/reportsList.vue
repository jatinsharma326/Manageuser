<template>
	<div class="reportListWrapper">
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
							label="Date Range"
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
		<div v-if="totalCount === 0" class="content-error-message">
			Please add a DSR Entry.
		</div>
		<div v-else class="leaves-table">
			<v-data-table
				:items-per-page="pageSize"
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
				<template v-slot:[`item.countries`]="{ item }">
					{{ item.countries.join(", ") }}
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

		<template v-if="type == 'my_dsr'">
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
		</template>
		<div class="floating-button">
			<v-btn v-if="type == 'my_dsr'" @click="openInputForm()" color="primary" dark fab>
				<v-icon>mdi-plus</v-icon>
			</v-btn>
			<template v-else>
				<v-tooltip left>
					<template v-slot:activator="{ on, attrs }">
						<v-btn @click="getData()" color="primary" dark fab v-bind="attrs" v-on="on">
							<v-icon>mdi-refresh</v-icon>
						</v-btn>
					</template>
					<span>Refresh List</span>
				</v-tooltip>
			</template>
		</div>
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
		name: "DSRListManager",
		mixins: [defaultCRUDMixin, inputFormMixin, helperMixin, searchMixin, datePickerMixin],
		async created() {
			this.setDateRange();
			this.getData();
			// 	await this.getUsers();
			// 	this.setSearchConfig(this.userList);
		},
		data: () => ({
			reportsList: [],
			headers: [
				{ text: "Sr. No.", align: "start", value: "serial_number", width: 100 },
				{ text: "Index", align: "start", value: "sales_call_data.sr_no", width: 100 },
				{ text: "Product", value: "countries", width: 150 },
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
			keysToWatch: ["sales_call_id"],
		}),
		computed: {
			...mapGetters(["userData"]),
			dateRangeText() {
				return this.datePickerDate.join(" ~ ");
			},
		},
		methods: {
			...mapActions("DSR", ["getDSR", "addDSR", "editDSR", "deleteDSR"]),

			getData() {
				this.openLoaderDialog();
				if (this.isSalesTeamMember && this.type == "my_dsr") {
					this.filter.mortal_id = this.userData.id;
				}
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

				this.getDSR({
					filter: this.filter,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
					reportType: this.type,
				}).then((data) => {
					this.closeLoaderDialog();
					this.reportsList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;

					if (this.reportsList.length) {
						this.reportsList = this.reportsList.map((d, index) => ({
							...d,
							serial_number: (this.pageNo - 1) * this.pageSize + (index + 1),
						}));
					}
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
				if (this.type == "my_dsr" && -2 <= diffrenceInDates && diffrenceInDates <= 1) {
					return true;
				} else {
					return false;
				}
			},

			advanceSearch(filterObject) {
				var filterData = JSON.parse(JSON.stringify(filterObject));
				if (filterData.date_of_call) {
					filterData.date_of_call = helpers.getISODate(filterData.date_of_call);
				}

				this.filter = { ...filterData };
				this.pageNo = 1;
				this.getData();
			},
			async formOutput(data) {
				var formData = JSON.parse(JSON.stringify(data));

				this.openLoaderDialog();
				if (!this.isEditMode) {
					this.addDSR(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Added DSR Entry" });
							this.closeForm();
							this.getData();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				} else {
					this.editDSR(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Edited DSR Entry" });
							this.closeForm();
							this.getData();
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
			deleteCall(call) {
				if (window.confirm("Do you really want to Delete the DSR?")) {
					this.openLoaderDialog();
					this.deleteDSR({
						_id: call._id,
					}).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Deleted the DSR" });
							this.getData();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				}
			},
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
	.SearchbarWrapper {
		.searchWrapper {
			flex-shrink: 0;
		}
	}
	.reportListWrapper {
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
			.expandable-section-content {
				white-space: pre-wrap;
			}
		}
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
