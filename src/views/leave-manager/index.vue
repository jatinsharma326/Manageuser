<template>
	<div class="leavesManagerWrapper">
		<v-row class="px-6 employee-search-bar" justify="center" align="center">
			<v-col cols="12" sm="8" md="6">
				<Search
					@queryString="queryString"
					@filterObject="advanceSearch"
					:placeholder="placeholder"
					:isAdvanceSearch="true"
					:filterConfig="selectedSearchConfig"
				></Search>
			</v-col>
		</v-row>
		<div class="leaves-table">
			<v-data-table :headers="headers" :items="leavesList" sort-by="" class="elevation-1">
				<template v-slot:item.doa="{ item }">
					{{ getFormattedDate(item.doa, "MMMM Do YYYY dddd") }}
				</template>
				<template v-slot:item.date_from="{ item }">
					{{ getFormattedDate(item.date_from, "MMMM Do YYYY dddd") }}
				</template>
				<template v-slot:item.date_to="{ item }">
					{{ getFormattedDate(item.date_to, "MMMM Do YYYY dddd") }}
				</template>
				<template v-slot:item.actions="{ item }">
					<template v-if="item.status != 'REJECTED' && isDateBefore(item.date_from)">
						<v-menu bottom left>
							<template v-slot:activator="{ on, attrs }">
								<v-btn icon v-bind="attrs" v-on="on">
									<v-icon>mdi-dots-vertical</v-icon>
								</v-btn>
							</template>

							<v-list>
								<v-list-item v-if="item.status == 'ACCEPTED'" @click="acceptAction(item)"
									>Accept</v-list-item
								>
								<v-list-item @click="rejectAction(item)">Reject</v-list-item>
							</v-list>
						</v-menu>
					</template>
				</template>
			</v-data-table>
		</div>
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import helpers from "../../components/helpers";
	import { required, email, minLength, numeric, alpha } from "vuelidate/lib/validators";
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import moment from "moment-timezone";

	export default {
		name: "LeaveManager",
		mixins: [defaultCRUDMixin],
		created() {
			this.getData();
			/* if (this.partnerInfo.countries) {
				this.setSearchConfig(this.partnerInfo.countries);
				this.setInputConfig(this.partnerInfo.countries);
			} */
		},
		data: () => ({
			leavesList: [],
			countriesWithEmployee: [],
			headers: [
				{
					text: "Applicant",
					align: "start",
					sortable: false,
					value: "name",
				},
				{ text: "Date of Application", value: "doa" },
				{ text: "Date From", value: "date_from" },
				{ text: "Date To", value: "date_to" },
				{ text: "No of Days", value: "no_of_days" },
				{ text: "Pending Leaves", value: "pending_leaves" },
				{ text: "Status", value: "status" },
				{ text: "", value: "actions" },
			],
			search_text: "",
			placeholder: "Search Leaves",
		}),
		methods: {
			...mapActions("LeaveManager", [
				"getAllLeaves",
				"updateStatus",
				/* "addPartnerEmployees",
				"deletePartnerEmployees", */
			]),
			isDateBefore(date) {
				if (moment().isBefore(date)) {
					return true;
				} else {
					return false;
				}
			},
			getData() {
				this.openLoaderDialog();
				// this.filter.representing_partner_id = this.partnerInfo._id;
				this.getAllLeaves({
					filter: this.filter,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.leavesList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;
					console.log(this.leavesList);
					for (let listItem of this.leavesList) {
					}
				});
			},
			acceptAction(leave) {
				this.openLoaderDialog();
				this.updateStatus({
					_id: leave._id,
					status: "ACCEPTED",
					updated_on: leave.record.updated_on,
					pending_leaves: leave.pending_leaves,
				}).then((data) => {
					this.closeLoaderDialog();
					if (data.ok) {
						this.openSnackbar({ text: "Sucessfully Updated Leave Status" });
						this.getData();
					} else {
						this.openSnackbar({ text: data.message });
					}
				});
			},
			rejectAction(leave) {
				this.openLoaderDialog();
				this.updateStatus({
					_id: leave._id,
					status: "REJECTED",
					updated_on: leave.record.updated_on,
					pending_leaves: leave.pending_leaves,
				}).then((data) => {
					this.closeLoaderDialog();
					if (data.ok) {
						this.openSnackbar({ text: "Sucessfully Updated Leave Status" });
						this.getData();
					} else {
						this.openSnackbar({ text: data.message });
					}
				});
			},
			queryString(data) {
				this.filter["search_text"] = data;
				this.getData();
			},
			advanceSearch(filterObject) {
				// make changes here to the filterObject
				this.filter = { ...filterObject };
				this.pageNo = 1;
				this.getData();
			},
			// setSearchConfig(countries = []) {
			// 	/*
			// 	 * Name of Employee - Text field - string or number - can this be empty
			// 	 * Designation of Employee - Text field - string or number - can this be empty
			// 	 * Countries - Dropdown multi Autocomplete - need some default filter provision. - can be empty in this case but not in specific cases
			// 	 */
			// 	this.selectedSearchConfig = [
			// 		{
			// 			name: "Employee Name",
			// 			key: "name",
			// 			type: "text",
			// 			inputType: "textfield",
			// 			defaultValue: "",
			// 		},
			// 		{
			// 			name: "Designation",
			// 			key: "designation",
			// 			type: "text",
			// 			inputType: "textfield",
			// 			defaultValue: "",
			// 		},
			// 		{
			// 			name: "Country",
			// 			key: "country",
			// 			multi: false,
			// 			inputType: "dropdown",
			// 			defaultValue: [],
			// 			isListInStore: false,
			// 			listItems: countries,
			// 		},
			// 	];
			// },
			/* setInputConfig(countries = []) {
				this.inputConfig = [
					{
						name: "Employee Name",
						type: "String",
						key: "name",
						width: "half",
						validations: {
							required,
							minLength: minLength(1),
						},
					},
					{
						name: "Designation",
						type: "String",
						key: "designation",
						width: "full",
						validations: {
							required,
							minLength: minLength(1),
						},
					},
					{
						name: "Country",
						type: "Dropdown",
						key: "country",
						width: "half",
						multi: false,
						isListInStore: false,
						listItems: countries,
						validations: {
							required,
						},
					},
					{
						name: "Contact Info",
						type: "MultiInput",
						key: "phone_numbers",
						width: "half",
						validations: {
							required,
							minLength: minLength(1),
							$each: {
								input: {
									required,
								},
							},
						},
					},
					{
						name: "Email",
						type: "MultiInput",
						key: "email_ids",
						width: "half",
						validations: {
							required,
							minLength: minLength(1),
							$each: {
								input: {
									email,
									required,
								},
							},
						},
					},
				];
			}, */
			// formOutput(data) {
			// 	var formData = JSON.parse(JSON.stringify(data));
			// 	// var tempArray = [];
			// 	// var tempObj = {};
			// 	formData.phone_numbers = data.phone_numbers.map((data) => data.input);
			// 	formData.email_ids = data.email_ids.map((data) => data.input);
			// 	console.log("Before API call FormData Object", formData);

			// 	this.openLoaderDialog();
			// 	if (!this.isEditMode) {
			// 		formData.representing_partner_id = this.partnerInfo._id;
			// 		this.addPartnerEmployees(formData).then((data) => {
			// 			this.closeLoaderDialog();
			// 			if (data.ok) {
			// 				this.openSnackbar({ text: "Sucessfully Added Employee Info" });
			// 				console.log("Add Partner Employee success");
			// 				this.getData();
			// 				this.closeForm();
			// 			} else {
			// 				this.openSnackbar({ text: data.message });
			// 				console.log("Add Partner Employee failed");
			// 			}
			// 		});
			// 	} else {
			// 		this.editPartnerEmployees(formData).then((data) => {
			// 			this.closeLoaderDialog();
			// 			if (data.ok) {
			// 				this.openSnackbar({ text: "Sucessfully Edited Employee Info" });
			// 				console.log("Edit Partner Employee success");
			// 				this.getData();
			// 				this.closeForm();
			// 			} else {
			// 				this.openSnackbar({ text: data.message });
			// 				console.log("Edit Partner Employee failed");
			// 			}
			// 		});
			// 	}
			// },
			// getEditRowObject(data) {
			// 	return {
			// 		...data,
			// 		_id: data._id,
			// 		updated_on: data.record.updated_on,
			// 	};
			// },
			// // Implement the delete API
			// deleteEmployee(user) {
			// 	console.log(user);
			// 	if (window.confirm("Do you really want to Delete the Partner Employee?")) {
			// 		this.openLoaderDialog();
			// 		this.deletePartnerEmployees({
			// 			_id: user._id,
			// 		}).then((data) => {
			// 			this.closeLoaderDialog();
			// 			if (data.ok) {
			// 				this.openSnackbar({ text: "Sucessfully Deleted Employee" });
			// 				this.getData();
			// 			} else {
			// 				this.openSnackbar({ text: data.message });
			// 			}
			// 		});
			// 	}
			// },
		},
		watch: {},
		props: {},
	};
</script>
<style lang="scss" scoped></style>
