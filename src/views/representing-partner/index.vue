<template>
	<div class="partnersWrapper primary-background-color">
		<!-- <Users v-bind="{ ...ele.props }"></Users> -->
		<v-row class="px-6 managepartners-search-bar" justify="center" align="center">
			<v-col cols="12" sm="8" md="6">
				<!-- @queryString="queryString" -->
				<Search
					@queryString="queryString"
					@filterObject="advanceSearch"
					@clearFilter="advanceSearch"
					:placeholder="placeholder"
					:isAdvanceSearch="true"
					:filterConfig="selectedSearchConfig"
				></Search>
			</v-col>
		</v-row>

		<div v-if="showErrorMessage" class="content-error-message">
			{{ errorMessage }}
		</div>

		<div class="card-wrapper">
			<div v-for="user in partnerList" :key="user._id" class="card-element">
				<InformationCard :expandCard="true" :isCardDisabled="!user.record.active">
					<template v-slot:topLeft>
						{{ user.business_types.join(", ") }}
					</template>
					<!-- <template v-slot:topRight>
            {{ user.dob ? getFormattedDate(user.dob, "DD/MM") : "-" }}
          </template> -->
					<template v-slot:mainContent>
						{{ user.name }}
					</template>
					<template v-slot:mainContentSubtitle>
						{{ user.proprietor_info + (user.designation ? " ( " + user.designation + " )" : "") }}
					</template>
					<template v-slot:mainContentRight>
						<div class="card-image">
							<img :src="user.logo" alt="" />
						</div>
					</template>
					<template v-slot:moreInfo>
						{{ user.countries.join(", ") }}
					</template>
					<template v-slot:actionButtons>
						<template>
							<v-btn v-if="isAdminOrManagement" @click="disablePartner(user)" color="error" text>
								{{ user.record.active ? "Disable" : "Enable" }}
							</v-btn>
							<v-btn v-if="isAdminOrManagement" @click="openInputForm(true, user)" color="secondary" text>
								Edit
							</v-btn>
							<v-btn @click="openEmployeeModal(user)" color="primary" text>
								View
							</v-btn>
						</template>
					</template>
					<template v-slot:expandCardContent>
						<v-list>
							<v-list-item
								v-for="(contact, index) in user.emergency_contacts"
								:key="user._id + '+' + index"
								two-line
							>
								<v-list-item-icon>
									<v-icon color="secondary">
										mdi-phone
									</v-icon>
								</v-list-item-icon>

								<v-list-item-content>
									<v-list-item-title>{{ contact.contacts.join(", ") }}</v-list-item-title>
									<v-list-item-subtitle>{{ contact.country }}</v-list-item-subtitle>
								</v-list-item-content>
								<!-- <v-divider inset></v-divider> -->
							</v-list-item>

							<v-list-item
								v-for="(contact, index) in user.emergency_landline_numbers"
								:key="user._id + '+' + index + '+' + contact.landline_numbers"
								two-line
							>
								<v-list-item-icon>
									<v-icon color="secondary">
										mdi-phone-classic
									</v-icon>
								</v-list-item-icon>

								<v-list-item-content>
									<v-list-item-title>{{ contact.landline_numbers.join(", ") }}</v-list-item-title>
									<v-list-item-subtitle>{{ contact.country }}</v-list-item-subtitle>
								</v-list-item-content>
								<!-- <v-divider inset></v-divider> -->
							</v-list-item>

							<v-list-item
								v-for="(email, index) in user.email_ids"
								:key="user._id + '+' + index + 'Email'"
							>
								<v-list-item-icon>
									<v-icon v-if="index == 0" color="secondary">
										mdi-email
									</v-icon>
								</v-list-item-icon>

								<v-list-item-content>
									<v-list-item-title>{{ email }}</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
							<v-list-item>
								<v-list-item-content>
									<v-list-item-title
										>DOB:
										{{
											user.dob ? getFormattedDate(user.dob, "DD/MM") : "--/--"
										}}</v-list-item-title
									>
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</template>
				</InformationCard>
			</div>
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

		<ViewMoreModal @closeModal="viewMoreModal = false" :toggleModal="viewMoreModal">
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
				<partnerEmployees v-if="viewMoreModal" :partnerInfo="selectedPartnerInfo"></partnerEmployees>
			</template>
		</ViewMoreModal>

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
	import { required, email, minLength, numeric, alpha } from "vuelidate/lib/validators";
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import helpers from "../../components/helpers";
	import helperMixin from "../../mixins/helperMixins";
	import PartnerEmployees from "./PartnerEmployees";
	import ViewMoreModal from "../../components/ViewMoreModal";

	export default {
		name: "Partners",
		mixins: [defaultCRUDMixin, inputFormMixin, searchMixin, helperMixin],
		components: {
			PartnerEmployees,
		},
		created() {
			this.getData();
			this.setSearchConfig();
		},
		data: () => ({
			name: "Representing Partner",
			placeholder: "Search Partners",
			selectedPartnerInfo: {},
			activeState: true,
			keysToWatch: ["countries"],
			partnerList: [],
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
					name: "Partner Info*",
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
					name: "Designation",
					type: "String",
					key: "designation",
					width: "half",
					// validations: {
					//     required,
					//     minLength: minLength(1),
					// },
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
					name: "Numbers",
					type: "MultiInputWithGroupKey",
					multi: true,
					key: "emergency_contacts",
					width: "half",
					keyToGroup: "countries",
					keyforGrouped: "country",
					keyBeingGrouped: "contacts",
				},
				{
					name: "Landline Numbers",
					type: "MultiInputWithGroupKey",
					multi: true,
					key: "emergency_landline_numbers",
					width: "half",
					keyToGroup: "countries",
					keyforGrouped: "country",
					keyBeingGrouped: "landline_numbers",
				},
				{
					name: "Partner DOB",
					type: "Date",
					key: "dob",
					width: "half",
				},
			],
		}),
		computed: {},
		methods: {
			...mapActions("PartnerManagement", ["getPartnerList", "addPartner", "editPartner"]),
			getData() {
				this.openLoaderDialog();
				this.filter.active = this.activeState;
				this.getPartnerList({
					filter: this.filter,
					active: this.activeState,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.partnerList = this.checkForErrorMessage(data, "company");
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;
					// this.partnerList = data.list;
				});
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
			async formOutput(data) {
				var tempFile = data.logo;
				var formData = JSON.parse(JSON.stringify(data));
				formData.email_ids = formData.email_ids.map((data) => data.input).filter((e) => e != "");
				if (!formData.designation) formData.designation = "";
				formData.logo = tempFile;
				var tempArray = [];
				var tempArrayLandline = [];
				var tempObj = {};
				if (formData.dob) {
					formData.dob = helpers.getISODate(formData.dob);
				}

				// loop over the emergency contacts objects to convert it into the backend format
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

				// for emergency_landline_numbers
				if (formData.emergency_landline_numbers) {
					for (let contact of formData.emergency_landline_numbers) {
						tempObj = {};
						for (let num of contact.input) {
							if (num.input != "") {
								tempObj["country"] = contact.groupKey;
								if (!tempObj["landline_numbers"]) tempObj["landline_numbers"] = [];
								tempObj["landline_numbers"].push(num.input);
							}
						}
						if (Object.keys(tempObj).length) {
							tempArrayLandline.push(tempObj);
						}
					}
				}
				formData.emergency_landline_numbers = tempArrayLandline;

				// remove logo key if it's empty
				if (formData.logo) {
					formData.logo = await helpers.toBase64(formData.logo);
				} else {
					formData.logo = null;
				}

				this.openLoaderDialog();
				if (!this.isEditMode) {
					this.addPartner(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({
								text: "Sucessfully Added Partner",
							});
							this.getData();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				} else {
					this.editPartner(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({
								text: "Sucessfully Edited Partner",
							});
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
			disablePartner(data) {
				if (
					window.confirm(
						"Do you really want to " + (data.record.active ? "Disable the Partner?" : "Enable the Partner?")
					)
				) {
					this.openLoaderDialog();
					this.editPartner({
						_id: data._id,
						active: !data.record.active,
						updated_on: data.record.updated_on,
						status: data.record.active ? "disabled" : "enabled",
					}).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({
								text: "Sucessfully Updated Partner Status",
							});
							this.getData();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				}
			},
			openEmployeeModal(userData) {
				this.selectedPartnerInfo = { ...userData };
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
		},
	};
</script>

<style lang="scss" scopped>
	.partnersWrapper {
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
