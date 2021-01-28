<template>
	<div class="agentsWrapper primary-background-color">
		<!-- <Users v-bind="{ ...ele.props }"></Users> -->
		<v-row class="px-6 manageagents-search-bar" justify="space-around" align="center">
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
			<div class="toggle-data-view">
				<v-icon>mdi-grid</v-icon><v-switch v-model="listLayout" flat></v-switch>
				<v-icon>mdi-format-list-bulleted</v-icon>
			</div>
		</v-row>

		<div v-if="showErrorMessage" class="content-error-message">
			{{ errorMessage }}
		</div>

		<div v-if="listLayout" class="leaves-table">
			<v-data-table
				:items-per-page="pageSize"
				hide-default-footer
				:headers="headers"
				:items="companyList"
				item-key="_id"
			>
				<template v-slot:[`item.defaulter`]="{ item }">
					<template v-if="item.defaulter">
						<v-chip small color="error">Yes</v-chip>
					</template>
					<template v-else>
						-
					</template>
				</template>
			</v-data-table>
		</div>
		<div v-else class="card-wrapper">
			<div v-for="company in companyList" :key="company._id" class="card-element">
				<InformationCard
					:expandCard="true"
					:isCardDisabled="!company.record.active"
					:isDefaulter="company.defaulter"
				>
					<template v-slot:topLeft>
						{{ company.business_types.join(", ") }}
					</template>
					<template v-if="company.city" v-slot:topRight>
						<v-chip outlined x-small color="primary">
							{{ company.city }}
						</v-chip>
					</template>
					<template v-slot:mainContent>
						{{ company.name }}
					</template>
					<template v-slot:mainContentSubtitle>
						{{ company.website }}
					</template>
					<template v-slot:mainContentRight>
						<div
							class="big-grade"
							:class="{
								'admin-grade-is-p': company.admin_grade === 'P' || company.admin_grade === 'p',
							}"
						>
							{{ company.admin_grade ? company.admin_grade : "-" }}
						</div>
					</template>
					<template v-if="company.remarks" v-slot:moreInfo>
						{{ company.remarks }}
					</template>
					<template v-slot:actionButtons>
						<template>
							<v-btn @click="openChangelogsModal(company)" icon color="secondary" text
								><v-icon>mdi-information-outline</v-icon></v-btn
							>
							<v-btn large icon v-if="isAdminOrManagement" @click="deleteTravelAgentEntry(company)">
								<v-icon color="red darken-3">mdi-delete</v-icon>
							</v-btn>
							<v-btn @click="disableCompany(company)" color="error" text>
								{{ company.record.active ? "Disable" : "Enable" }}
							</v-btn>
							<v-btn @click="openInputForm(true, company)" color="secondary" text>
								Edit
							</v-btn>
							<v-btn @click="openInformationModal(company)" color="primary" text>
								View
							</v-btn>
						</template>
					</template>
					<template v-slot:expandCardContent>
						<v-list class="gradeListWrapper">
							<v-list-item>
								<v-list-item-icon>
									<v-icon color="secondary">
										mdi-map-marker
									</v-icon>
								</v-list-item-icon>

								<v-list-item-content>
									<v-list-item-title>{{ company.zone }}</v-list-item-title>
									<v-list-item-subtitle>Zone</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>

							<v-divider inset></v-divider>

							<v-list-item>
								<v-list-item-icon>
									<v-icon color="secondary">
										mdi-map-marker
									</v-icon>
								</v-list-item-icon>

								<v-list-item-content>
									<v-list-item-title>{{ company.state }}</v-list-item-title>
									<v-list-item-subtitle>State</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>

							<v-divider inset></v-divider>

							<v-list-item>
								<v-list-item-icon>
									<v-icon color="secondary">
										mdi-airplane-takeoff
									</v-icon>
								</v-list-item-icon>

								<v-list-item-content>
									<v-list-item-title>{{ company.iata_code }}</v-list-item-title>
									<v-list-item-subtitle>Iata Code</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>

							<v-divider inset></v-divider>

							<template v-for="(grade, index) in company.grading">
								<v-list-item :key="company._id + '+' + index">
									<v-list-item-icon class="smallGradeWrapper">
										<div class="small-grade">
											{{ grade.grade }}
										</div>
									</v-list-item-icon>

									<v-list-item-content>
										<v-list-item-title
											>{{ grade.country ? grade.country : "-" }}
										</v-list-item-title>
									</v-list-item-content>
								</v-list-item>
								<v-divider
									v-if="index + 1 != company.grading.length"
									:key="company._id + '+' + index + 'divider'"
								></v-divider>
							</template>
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

		<ChangeLogModal
			@closeModal="toggleChangelogModal = false"
			:toggleChangelogModal="toggleChangelogModal"
			:selectedInfo="selectedCompanyInfo"
		></ChangeLogModal>

		<UploadLogs
			@closeModal="toggleUploadlogModal = false"
			:toggleUploadlogModal="toggleUploadlogModal"
		></UploadLogs>

		<UploadModal
			accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
			@closeModal="closeUploadModal"
			:toggleModal="uploadModal"
			title="Bulk Upload Agents"
			:uploadFunction="uploadFileFunc"
			:downloadSampleFunc="downloadSampleFileFunc"
			:process_id="process_id"
			:showDownloadSampleButton="true"
		>
		</UploadModal>

		<ViewMoreModal @closeModal="viewMoreModal = false" :toggleModal="viewMoreModal">
			<template v-slot:modalTitle>
				<div v-if="selectedCompanyInfo.name">
					{{ selectedCompanyInfo.name }}
				</div>
			</template>
			<template v-slot:modalSubtitle>
				<div class="tertiary-font-color" v-if="selectedCompanyInfo.business_types">
					{{ selectedCompanyInfo.business_types.join("/ ") }}
				</div>
			</template>
			<template v-slot:toolbarActions>
				<v-icon
					:disabled="hidePreviousIcon"
					class="previous-button-viewmore-modal"
					color="accent"
					@click="previousItem()"
					x-large
					>mdi-arrow-left-bold</v-icon
				>
				<v-icon
					:disabled="hideNextIcon"
					class="next-button-viewmore-modal"
					color="accent"
					@click="nextItem()"
					x-large
					>mdi-arrow-right-bold</v-icon
				>
			</template>
			<template v-slot:modalContent>
				<companyInfo v-if="viewMoreModal" :companyInfo="selectedCompanyInfo"></companyInfo>
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

		<div class="floating-button">
			<v-speed-dial v-model="fab" direction="top" :open-on-hover="true" transition="scale-transition">
				<template v-slot:activator>
					<v-btn v-model="fab" color="primary" dark fab>
						<v-icon v-if="fab"> mdi-arrow-down-drop-circle </v-icon>
						<v-icon v-else> mdi-arrow-up-drop-circle </v-icon>
					</v-btn>
				</template>
				<v-tooltip left>
					<template v-slot:activator="{ on, attrs }">
						<v-btn @click="openInputForm()" color="secondary" dark small fab v-bind="attrs" v-on="on">
							<v-icon>mdi-plus</v-icon>
						</v-btn>
					</template>
					<span>Add</span>
				</v-tooltip>
				<v-tooltip left>
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							fab
							dark
							small
							color="tertiary"
							@click="toggleUploadModal(true)"
							v-bind="attrs"
							v-on="on"
						>
							<v-icon>mdi-upload</v-icon>
						</v-btn>
					</template>
					<span>Upload Excel</span>
				</v-tooltip>
				<v-tooltip left>
					<template v-slot:activator="{ on, attrs }">
						<v-btn fab dark small color="error" @click="openUploadlogsModal(true)" v-bind="attrs" v-on="on">
							<v-icon>mdi-math-log</v-icon>
						</v-btn>
					</template>
					<span>Show Logs</span>
				</v-tooltip>
			</v-speed-dial>
		</div>
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import inputFormMixin from "../../mixins/inputFormMixin";
	import searchMixin from "../../mixins/searchMixin";
	import { required, email, minLength, numeric, alpha } from "vuelidate/lib/validators";
	import { mapActions, mapGetters } from "vuex";
	import companyInfo from "./CompanyInfo";
	import ViewMoreModal from "../../components/ViewMoreModal";
	import ChangeLogModal from "../../components/ChangeLog";
	import UploadModal from "../../components/UploadModal";
	import UploadLogs from "./UploadLogs";

	export default {
		name: "ManageAgents",
		mixins: [defaultCRUDMixin, inputFormMixin, searchMixin],
		components: {
			companyInfo,
			ChangeLogModal,
			UploadModal,
			UploadLogs,
		},
		async created() {
			this.getData();
			// this.setSearchConfig();

			let promiseArray = [];
			promiseArray.push(this.getCountryList());
			promiseArray.push(this.getCities());

			await Promise.all(promiseArray);

			this.setConfig(this.activeCountriesList, this.storeStatesList, this.citiesList);
		},
		data: () => ({
			name: "Agents",
			placeholder: "Search Companies",
			toggleChangelogModal: false,
			toggleUploadlogModal: false,
			selectedCompanyInfo: {},
			fab: false,
			uploadModal: false,
			activeState: true,
			companyList: [],
			keysToWatch: ["countries"],
			activeCountriesList: [],
			inputConfig: [],
			citiesList: [],
			process_id: "",
			listLayout: false,
			headers: [
				{
					text: "Sr. No.",
					align: "start",
					value: "serial_number",
					width: 100,
				},
				{ text: "Name", value: "name", width: 250 },
				{ text: "Defaulter?", value: "defaulter", width: 120 },
				{ text: "City", value: "city", width: 150 },
				{ text: "State", value: "state", width: 150 },
				{ text: "Zone", value: "zone", width: 150 },
				// { text: "Purpose", value: "data-table-expand" },
				// { text: "", value: "actions" },
			],
		}),
		computed: {
			...mapGetters("ManageAgents", ["storeStatesList"]),
			hidePreviousIcon() {
				let selectedCompanyIndex = this.companyList.findIndex((e) => e._id === this.selectedCompanyInfo._id);
				// console.log("selectedCompanyIndex", selectedCompanyIndex);
				if (selectedCompanyIndex == 0) {
					return true;
				}
				return false;
			},
			hideNextIcon() {
				let selectedCompanyIndex = this.companyList.findIndex((e) => e._id === this.selectedCompanyInfo._id);
				// console.log("selectedCompanyIndex", selectedCompanyIndex);
				// console.log("this.pageSize", this.pageSize);
				if (selectedCompanyIndex == this.pageSize - 1) {
					return true;
				}
				return false;
			},
		},
		methods: {
			...mapActions("ManageAgents", [
				"getChangelogsList",
				"getCompaniesList",
				"addCompany",
				"editCompany",
				"spawnProcess",
				"deleteSpawnProcess",
				"uploadTravelAgents",
				"downloadSample",
				"deleteTravelAgent",
			]),
			...mapActions("FollowUp", ["getCitiesList"]),
			...mapActions("ManageTargets", ["getActiveCountries"]),
			getCountryList() {
				return this.getActiveCountries().then((data) => {
					this.activeCountriesList = data.list;
				});
			},
			getData() {
				this.openLoaderDialog();
				this.filter.active = this.activeState;
				this.getCompaniesList({
					filter: this.filter,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
					active: this.activeState,
				}).then((data) => {
					this.closeLoaderDialog();
					this.companyList = this.checkForErrorMessage(data, "company");
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;

					this.companyList = this.companyList.map((d, index) => ({
						...d,
						serial_number: (this.pageNo - 1) * this.pageSize + (index + 1),
					}));
					// this.companyList = data.list;
				});
			},
			openChangelogsModal(company) {
				// this.getChangelogs(company);
				this.selectedCompanyInfo = { ...company };
				this.toggleChangelogModal = true;
			},
			openUploadlogsModal(company) {
				this.toggleUploadlogModal = true;
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
				var formData = JSON.parse(JSON.stringify(data));

				formData.countries = formData.countries.filter((e) => !!this.activeCountriesList.find((f) => f == e));
				var tempArray = [];
				var tempObj = {};
				if (!formData.admin_grade || formData.admin_grade === null) {
					formData.admin_grade = "-";
				}
				if (formData.website === null) {
					formData.website = "";
				}
				if (formData.iata_code === null) {
					formData.iata_code = "";
				}
				if (formData.remarks === null) {
					formData.remarks = "";
				}

				// loop over the Grading objects to convert it into theh backend format

				for (let grade of formData.grading) {
					tempObj = {};
					if (formData.countries.find((f) => f == grade.groupKey)) {
						for (let alpha of grade.input) {
							if (alpha.input != "") {
								tempObj["country"] = grade.groupKey;
								tempObj["grade"] = alpha.input;
							}
						}
					}
					if (Object.keys(tempObj).length) {
						tempArray.push(tempObj);
					}
				}
				formData.grading = tempArray;

				this.openLoaderDialog();
				if (!this.isEditMode) {
					this.addCompany(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({
								text: "Sucessfully Added Company",
							});
							this.getData();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				} else {
					this.editCompany(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({
								text: "Sucessfully Edited Company",
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
			disableCompany(data) {
				if (
					window.confirm(
						"Do you really want to " + (data.record.active ? "Disable the Company?" : "Enable the Company?")
					)
				) {
					this.openLoaderDialog();
					this.editCompany({
						_id: data._id,
						active: !data.record.active,
						updated_on: data.record.updated_on,
						status: data.record.active ? "disabled" : "enabled",
					}).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({
								text: "Sucessfully Updated Company Status",
							});
							this.getData();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				}
			},
			deleteTravelAgentEntry(entry) {
				if (window.confirm("Do you really want to Delete the Travel Agent?")) {
					this.openLoaderDialog();
					this.deleteTravelAgent({
						_id: entry._id,
					}).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({
								text: "Sucessfully Deleted the Travel Agent",
							});
							this.getData();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				}
			},
			openInformationModal(userData) {
				this.selectedCompanyInfo = { ...userData };
				this.viewMoreModal = true;
			},
			toggleUploadModal(value) {
				if (value) {
					this.openLoaderDialog();
					this.spawnProcess().then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.process_id = data.process_id;
							this.uploadModal = value;
						} else {
							this.openSnackbar({
								text: "Another Upload Process is running. Please try again later",
							});
						}
					});
				} else {
					this.uploadModal = value;
				}
			},
			// setSearchConfig() {},
			setConfig(activeCountriesList = [], statesList = [], citiesList = []) {
				this.inputConfig = [
					{
						name: "Company Name*",
						type: "String",
						key: "name",
						width: "half",
						validations: {
							required,
							minLength: minLength(1),
						},
					},
					{
						name: "Website Info",
						type: "String",
						key: "website",
						width: "half",
					},
					{
						name: "Defaulter?",
						type: "Switch",
						key: "defaulter",
						width: "half",
					},
					{
						name: "Zone*",
						type: "Dropdown",
						key: "zone",
						width: "half",
						multi: false,
						isListInStore: true,
						listVariable: "zone",
						validations: {
							required,
						},
					},
					{
						name: "State*",
						type: "Dropdown",
						key: "state",
						width: "half",
						multi: false,
						isListInStore: false,
						listItems: statesList,
						validations: {
							required,
						},
					},
					{
						name: "City*",
						type: "Dropdown",
						key: "city",
						width: "half",
						multi: false,
						isListInStore: false,
						listItems: citiesList,
						validations: {
							required,
						},
					},
					{
						name: "IATA Code",
						type: "String",
						key: "iata_code",
						width: "half",
					},
					{
						name: "Business Type*",
						type: "Dropdown",
						key: "business_types",
						width: "full",
						multi: true,
						isListInStore: true,
						listVariable: "businessType",
						validations: {
							required,
						},
					},
					{
						name: "Remarks",
						type: "TextArea",
						key: "remarks",
						width: "full",
					},
					{
						name: "Countries*",
						type: "Dropdown",
						key: "countries",
						width: "full",
						multi: true,
						isListInStore: false,
						listItems: activeCountriesList,
						validations: {
							required,
						},
					},
					{
						name: "Grade",
						type: "MultiInputWithGroupKey",
						key: "grading",
						width: "full",
						keyToGroup: "countries",
						keyforGrouped: "country",
						keyBeingGrouped: "grade",
					},
				];

				if (this.isAdminOrManagement) {
					this.inputConfig.unshift({
						name: "Admin Grade",
						type: "String",
						key: "admin_grade",
						width: "half",
					});
				}

				this.selectedSearchConfig = [
					{
						name: "Company Name",
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
						classes: ["half"],
					},
					{
						name: "Zone",
						key: "zones",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: true,
						listVariable: "zone",
						classes: ["half"],
					},
					{
						name: "State",
						key: "states",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: statesList,
						classes: ["half"],
					},
					{
						name: "City",
						key: "cities",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: citiesList,
						classes: ["half"],
					},
					{
						name: "Show Disabled Users",
						key: "active",
						inputType: "switch",
						defaultValue: false,
					},
				];
			},
			getCities() {
				return this.getCitiesList({
					filter: {},
				}).then((data) => {
					this.citiesList = data.list;
				});
			},
			uploadFileFunc(formData) {
				return this.uploadTravelAgents(formData);
			},
			closeUploadModal(data) {
				if (data) {
					this.deleteSpawnProcess({
						process_id: this.process_id,
					});
				}
				this.toggleUploadModal(false);
			},
			previousItem() {
				let selectedCompanyIndex = this.companyList.findIndex((e) => e._id === this.selectedCompanyInfo._id);
				this.selectedCompanyInfo = this.companyList[selectedCompanyIndex - 1];
			},
			nextItem() {
				let selectedCompanyIndex = this.companyList.findIndex((e) => e._id === this.selectedCompanyInfo._id);
				this.selectedCompanyInfo = this.companyList[selectedCompanyIndex + 1];
			},
			downloadSampleFileFunc(formData) {
				return new Promise((res, rej) => {
					const link = document.createElement("a");
					link.href = "https://global-destinations-bucket.s3-us-west-2.amazonaws.com/travelAg.xlsx";
					link.setAttribute("download", "sample.xlsx"); //or any other extension
					document.body.appendChild(link);
					link.click();
					res();
				});
			},
		},
	};
</script>

<style lang="scss" scopped>
	.agentsWrapper {
		padding: 20px 5px;
		height: 100%;
	}
	.manageagents-search-bar {
		margin-top: 12px;
	}
	.smallGradeWrapper {
		margin: 10px 16px 10px 0 !important;
	}
	.gradeListWrapper {
		padding: 0;
	}
	.toggle-data-view {
		display: flex;
		justify-content: center;
		align-items: center;

		.v-input {
			margin-left: 10px;
		}
	}
</style>

<style lang="scss">
	.toolbarWrapper {
		.v-toolbar__content {
			.v-toolbar__items {
				.previous-button-viewmore-modal {
					margin: 12px;
				}
				.next-button-viewmore-modal {
					margin: 12px;
				}
			}
		}
	}
</style>
