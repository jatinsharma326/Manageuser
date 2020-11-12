<template>
	<div class="MSRWrapper primary-background-color">
		<div class="MSRSearchbarWrapper">
			<div class="searchbar">
				<Search
					@queryString="queryString"
					@filterObject="advanceSearch"
					@clearFilter="advanceSearch"
					:placeholder="placeholder"
					:isAdvanceSearch="true"
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

		<div class="card-wrapper">
			<div v-for="listItem in monthList" :key="listItem._id" class="card-element">
				<InformationCard :expandCard="true" :isCardDisabled="!listItem.record.active">
					<template v-slot:topLeft>
						{{ listItem.mortal_data.name }}
					</template>
					<template v-slot:mainContent>
						{{ listItem.month }}
					</template>
					<template v-slot:mainContentSubtitle>
						{{ listItem.highlights }}
					</template>
					<template v-slot:moreInfo>
						{{ listItem.countries.join(", ") }}
					</template>
					<template v-slot:actionButtons>
						<template>
							<v-btn @click="openInputForm(true, listItem)" color="secondary" text>
								Edit
							</v-btn>
							<v-btn @click="openEmployeeModal(listItem)" color="primary" text>
								View
							</v-btn>
						</template>
					</template>
					<template v-slot:expandCardContent>
						<v-list>
							<v-list-item>
								<v-list-item-content>
									{{ listItem.highlights }}
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</template>
				</InformationCard>
			</div>
		</div>

		<div class="text-center">
			<v-pagination
				@input="updatedPageNo"
				v-if="isPaginationRequired"
				v-model="pageNo"
				:length="Math.ceil(fetchCount / pageSize)"
			></v-pagination>
		</div>

		<!-- <ViewMoreModal @closeModal="viewMoreModal = false" :toggleModal="viewMoreModal">
			<template v-slot:modalTitle>
				<div v-if="selectedPartnerInfo.name">
					{{ selectedPartnerInfo.name }}
				</div>
			</template>
			<template v-slot:modalSubtitle>
				<div class="tertiary-font-color" v-if="selectedPartnerInfo.business_types">
					{{ selectedPartnerInfo.business_types.join("/ ") }}
				</div>
			</template>
			<template v-slot:modalContent>
				<partnerEmployees :partnerInfo="selectedPartnerInfo"></partnerEmployees>
			</template>
		</ViewMoreModal> -->

		<UserForm
			@formOutput="formOutput"
			@closeForm="closeForm"
			:name="name"
			:inputConfig="inputConfig"
			:keysToWatch="keysToWatch"
			:toggleForm="toggleForm"
			:formData="rowToEdit"
			:isEditMode="isEditMode"
		></UserForm>

		<div v-if="isAdminOrManagement" class="floating-button">
			<v-btn @click="openInputForm()" color="primary" dark fab>
				<v-icon>mdi-plus</v-icon>
			</v-btn>
		</div>
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import inputFormMixin from "../../mixins/inputFormMixin";
	import searchMixin from "../../mixins/searchMixin";
	import datePickerMixin from "../../mixins/datePickerMixin";
	import { required, email, minLength, numeric, alpha } from "vuelidate/lib/validators";
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import helpers from "../../components/helpers";
	import PartnerEmployees from "./PartnerEmployees";
	import ViewMoreModal from "../../components/ViewMoreModal";

	export default {
		name: "Partners",
		mixins: [defaultCRUDMixin, inputFormMixin, searchMixin, datePickerMixin],
		components: {
			PartnerEmployees,
		},
		created() {
			this.getPartners();
			this.setSearchConfig();
		},
		data: () => ({
			name: "Representing Partner",
			placeholder: "Search Partners",
			selectedPartnerInfo: {},
			activeState: true,
			monthList: [],
			inputConfig: [
				{
					name: "Partner Name*",
					type: "String",
					key: "name",
					width: "half",
					validations: {
						required,
						minLength: minLength(1),
					},
				},
				{
					name: "Proprietor Info*",
					type: "String",
					key: "proprietor_info",
					width: "half",
					validations: {
						required,
						minLength: minLength(1),
					},
				},
				{
					name: "Business Type*",
					type: "Dropdown",
					key: "business_types",
					width: "half",
					multi: true,
					isListInStore: true,
					listVariable: "businessType",
					validations: {
						required,
					},
				},
				{
					name: "Partner Logo",
					type: "FilePicker",
					key: "logo",
					width: "half",
					acceptRules: "image/png, image/jpeg, image/bmp",
					rules: [
						(value) =>
							!value || value.size <= 100000 || "Partner logo should be less than or equal to 100 kb!",
					],
				},
				{
					name: "Email",
					type: "MultiInput",
					key: "email_ids",
					width: "full",
					validations: {
						$each: {
							input: {
								email,
							},
						},
					},
				},
				{
					name: "Countries*",
					type: "Dropdown",
					key: "countries",
					width: "full",
					multi: true,
					isListInStore: true,
					listVariable: "countries",
					validations: {
						required,
					},
				},
				{
					name: "Emergency Numbers",
					type: "MultiInputWithGroupKey",
					multi: true,
					key: "emergency_contacts",
					width: "half",
					keyToGroup: "countries",
					keyforGrouped: "country",
					keyBeingGrouped: "contacts",
				},
			],
		}),
		computed: {},
		methods: {
			...mapActions("PartnerManagement", ["getMonthList", "addReportMonth", "editReportMonth"]),
			getPartners() {
				this.openLoaderDialog();
				this.filter.active = this.activeState;
				this.getPartnerList({
					filter: this.filter,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.monthList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;
				});
			},
			queryString(data) {
				this.filter["search_text"] = data;
				this.getPartners();
			},
			advanceSearch(filterObject) {
				this.filter = { ...filterObject };
				if (this.filter.active) {
					this.activeState = false;
				} else {
					this.activeState = true;
				}
				this.pageNo = 1;
				this.getPartners();
			},
			async formOutput(data) {
				var tempFile = data.logo;
				var formData = JSON.parse(JSON.stringify(data));
				formData.email_ids = formData.email_ids.map((data) => data.input).filter((e) => e != "");
				formData.logo = tempFile;
				var tempArray = [];
				var tempObj = {};

				// loop over the emergency contacts objects to convert it into theh backend format
				for (let contact of formData.emergency_contacts) {
					tempObj = {};
					for (let num of contact.input) {
						if (num.input != "") {
							tempObj["country"] = contact.groupKey;
							if (!tempObj["contacts"]) tempObj["contacts"] = [];
							tempObj["contacts"].push(num.input);
						}
					}
					if (Object.keys(tempObj).length) {
						tempArray.push(tempObj);
					}
				}
				formData.emergency_contacts = tempArray;

				// remove logo key if it's empty
				if (formData.logo) {
					formData.logo = await helpers.toBase64(formData.logo);
				} else {
					delete formData.logo;
				}

				console.log("Before API call FormData Object", formData);

				this.openLoaderDialog();
				if (!this.isEditMode) {
					this.addReportMonth(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Added Partner" });
							console.log("Add Partner success");
							this.getPartners();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
							console.log("Add Partner failed");
						}
					});
				} else {
					this.editReportMonth(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Edited Partner" });
							console.log("Edit Partner success");
							this.getPartners();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
							console.log("Edit Partner failed");
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
			disablePartner(data) {
				if (
					window.confirm(
						"Do you really want to " + (data.record.active ? "Disable the Partner?" : "Enable the Partner?")
					)
				) {
					this.openLoaderDialog();
					this.editReportMonth({
						_id: data._id,
						active: !data.record.active,
						updated_on: data.record.updated_on,
						status: data.record.active ? "disabled" : "enabled",
					}).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Updated Partner Status" });
							console.log("Updated Partner status");
							this.getPartners();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
							console.log("Failed to Update Partner status");
						}
					});
				}
			},
			openEmployeeModal(userData) {
				this.selectedPartnerInfo = { ...userData };
				// console.log(this.selectedPartnerInfo);
				this.viewMoreModal = true;
			},
			setSearchConfig() {
				/*
				 * Name of Partner - Text field - string or number - can this be empty?
				 * Business Type - Dropdown multi Autocomplete - need some default filter provision. - can be empty in this case but not in specific cases
				 * Countries - Dropdown multi Autocomplete - need some default filter provision. - can be empty in this case but not in specific cases
				 */
				this.selectedSearchConfig = [
					{
						name: "Partner Name",
						key: "name",
						type: "text",
						inputType: "textfield",
						defaultValue: "",
					},
					{
						name: "Business Type",
						key: "business_types",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: true,
						listVariable: "businessType",
					},
					{
						name: "Countries",
						key: "countries",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: true,
						listVariable: "countries",
					},
					{
						name: "Show Disabled Users",
						key: "active",
						inputType: "switch",
						defaultValue: false,
					},
				];
			},
			updatedPageNo(page) {
				this.getPartners();
			},
		},
	};
</script>

<style lang="scss" scopped>
	.MSRWrapper {
		padding: 20px 5px;
		height: 100%;
	}
	.card-image img {
		max-width: 100%;
	}
	.managepartners-search-bar {
		margin-top: 12px;
	}
</style>

<style lang="scss">
	.MSRWrapper .v-list-item__title,
	.v-list-item__subtitle {
		white-space: normal;
	}
</style>
