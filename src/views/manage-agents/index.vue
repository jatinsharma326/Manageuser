<template>
	<div class="agentsWrapper primary-background-color">
		<!-- <Users v-bind="{ ...ele.props }"></Users> -->
		<v-row class="px-6 manageagents-search-bar" justify="center" align="center">
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

		<div class="card-wrapper">
			<div v-for="company in companyList" :key="company._id" class="card-element">
				<InformationCard
					:expandCard="true"
					:isCardDisabled="!company.record.active"
					:isDefaulter="company.defaulter"
				>
					<template v-slot:topLeft>
						{{ company.business_types.join(", ") }}
					</template>
					<template v-slot:mainContent>
						{{ company.name }}
					</template>
					<template v-slot:mainContentSubtitle>
						{{ company.website }}
					</template>
					<template v-slot:mainContentRight>
						<div class="big-grade">
							{{ company.admin_grade ? company.admin_grade : "-" }}
						</div>
					</template>
					<template v-slot:actionButtons>
						<template>
							<v-btn @click="openChangelogsModal(company)" icon color="secondary" text
								><v-icon>mdi-information-outline</v-icon></v-btn
							>
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

		<div class="text-center">
			<v-pagination
				@input="updatedPageNo"
				v-if="isPaginationRequired"
				v-model="pageNo"
				:length="Math.ceil(fetchCount / pageSize)"
			></v-pagination>
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
			title="Bulk Upload Travel Agents"
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
			<template v-slot:modalContent>
				<companyInfo :companyInfo="selectedCompanyInfo"></companyInfo>
			</template>
		</ViewMoreModal>

		<UserForm
			@formOutput="formOutput"
			@closeForm="closeForm"
			:name="name"
			:inputConfig="isAdminOrManagement ? adminInputConfig : salesInputConfig"
			:keysToWatch="keysToWatch"
			:toggleForm="toggleForm"
			:formData="rowToEdit"
			:isEditMode="isEditMode"
		></UserForm>

		<div class="floating-button">
			<v-speed-dial v-model="fab" direction="top" :open-on-hover="hover" transition="scale-transition">
				<template v-slot:activator>
					<v-btn v-model="fab" color="primary" dark fab>
						<v-icon v-if="fab">
							mdi-arrow-down-drop-circle
						</v-icon>
						<v-icon v-else>
							mdi-arrow-up-drop-circle
						</v-icon>
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
	import { mapActions } from "vuex";
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
			this.getCompanies();
			this.setSearchConfig();
			await this.getCountryList();
			this.setInputConfig(this.activeCountriesList);
		},
		data: () => ({
			name: "Travel Agents",
			placeholder: "Search Companies",
			toggleChangelogModal: false,
			toggleUploadlogModal: false,
			selectedCompanyInfo: {},
			fab: false,
			hover: false,
			uploadModal: false,
			activeState: true,
			companyList: [],
			keysToWatch: ["countries"],
			activeCountriesList: [],
			adminInputConfig: [],
			salesInputConfig: [],
			process_id: "",
		}),
		computed: {},
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
			]),
			...mapActions("ManageTargets", ["getActiveCountries"]),
			getCountryList() {
				return this.getActiveCountries().then((data) => {
					this.activeCountriesList = data.list;
				});
			},
			getCompanies() {
				this.openLoaderDialog();
				this.filter.active = this.activeState;
				this.getCompaniesList({
					filter: this.filter,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.companyList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;
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
			queryString(data) {
				this.filter["search_text"] = data;
				this.getCompanies();
			},
			advanceSearch(filterObject) {
				this.filter = { ...filterObject };
				if (this.filter.active) {
					this.activeState = false;
				} else {
					this.activeState = true;
				}
				// console.log("Test Console advance search filter obj", this.filter);
				this.pageNo = 1;
				this.getCompanies();
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
							this.openSnackbar({ text: "Sucessfully Added Company" });
							this.getCompanies();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				} else {
					this.editCompany(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Edited Company" });
							this.getCompanies();
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
							this.openSnackbar({ text: "Sucessfully Updated Company Status" });
							console.log("Updated Company status");
							this.getCompanies();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
							console.log("Failed to Update Company status");
						}
					});
				}
			},
			openInformationModal(userData) {
				this.selectedCompanyInfo = { ...userData };
				// console.log(this.selectedCompanyInfo);
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
							this.openSnackbar({ text: "Another Upload Process is running. Please try again later" });
						}
					});
				} else {
					this.uploadModal = value;
				}
			},
			setSearchConfig() {
				/*
				 * Name of Partner - Text field - string or number - can this be empty?
				 * Business Type - Dropdown multi Autocomplete - need some default filter provision. - can be empty in this case but not in specific cases
				 * Countries - Dropdown multi Autocomplete - need some default filter provision. - can be empty in this case but not in specific cases
				 */
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
					},
					{
						name: "Show Disabled Users",
						key: "active",
						inputType: "switch",
						defaultValue: false,
					},
				];
			},
			setInputConfig(activeCountriesList = []) {
				this.adminInputConfig = [
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
						name: "Admin Grade",
						type: "String",
						key: "admin_grade",
						width: "half",
					},
					{
						name: "Defaulter?",
						type: "Switch",
						key: "defaulter",
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
				this.salesInputConfig = [
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
						name: "Website Info*",
						type: "String",
						key: "website",
						width: "half",
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
						name: "Defaulter?",
						type: "Switch",
						key: "defaulter",
						width: "half",
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
			},
			updatedPageNo(page) {
				this.getCompanies();
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
			// Huzefa to check
			downloadSampleFileFunc(formData) {
				return new Promise((res, rej) => {
					const link = document.createElement("a");
					link.href = "https://global-destinations-bucket.s3-us-west-2.amazonaws.com/travelAgents.xlsx";
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
		// display: flex;
		// flex-direction: column;
	}
	.card-image img {
		max-width: 100%;
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
</style>

<style lang="scss">
	.agentsWrapper .v-list-item__title,
	.v-list-item__subtitle {
		white-space: normal;
	}
</style>
