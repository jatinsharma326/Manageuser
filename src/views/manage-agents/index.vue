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
							{{ company.admin_grade }}
						</div>
					</template>
					<template v-slot:actionButtons>
						<template>
							<v-btn @click="openChangelogsModal(company)" icon color="secondary" text
								><v-icon>mdi-information-outline</v-icon></v-btn
							>
							<v-btn
								v-if="userType == ADMIN || userType == MANAGEMENT"
								@click="disableCompany(company)"
								color="error"
								text
							>
								{{ company.record.active ? "Disable" : "Enable" }}
							</v-btn>
							<v-btn
								v-if="userType == ADMIN || userType == MANAGEMENT"
								@click="openInputForm(true, company)"
								color="secondary"
								text
							>
								Edit
							</v-btn>
							<v-btn @click="openInformationModal(company)" color="primary" text>
								View
							</v-btn>
						</template>
					</template>
					<template v-slot:expandCardContent>
						<v-list>
							<template v-for="(grade, index) in company.grading">
								<v-list-item :key="company._id + '+' + index">
									<v-list-item-icon class="smallGradeWrapper">
										<div class="small-grade">
											{{ grade.grade }}
										</div>
									</v-list-item-icon>

									<v-list-item-content>
										<v-list-item-title
											>{{ grade.country }} {{ index
											}}{{ company.grading.length }}</v-list-item-title
										>
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
				v-model="pageNo"
				:length="Math.ceil(fetchCount / pageSize)"
			></v-pagination>
		</div>

		<ChangeLogModal
			@closeModal="toggleChangelogModal = false"
			:toggleChangelogModal="toggleChangelogModal"
			:selectedInfo="selectedCompanyInfo"
		></ChangeLogModal>

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
			:inputConfig="userType == ADMIN || userType == MANAGEMENT ? adminInputConfig : salesInputConfig"
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
						<v-btn fab dark small color="tertiary" v-bind="attrs" v-on="on">
							<v-icon>mdi-upload</v-icon>
						</v-btn>
					</template>
					<span>Upload Excel</span>
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

	export default {
		name: "ManageAgents",
		mixins: [defaultCRUDMixin, inputFormMixin, searchMixin],
		components: {
			companyInfo,
			ChangeLogModal,
		},
		created() {
			this.getCompanies();
			this.setSearchConfig();
		},
		data: () => ({
			name: "Travel Agents",
			placeholder: "Search Companies",
			toggleChangelogModal: false,
			selectedCompanyInfo: {},
			fab: false,
			hover: false,
			companyList: [
				// {
				// 	_id: "5f857918e43f60826225",
				// 	name: "Thomas Cook",
				// 	business_types: ["FIT", "GIT", "MICE", "ADHOC", "LUXURY"],
				// 	website: "thomascook.in",
				// 	grading: [
				// 		{
				// 			country: "United State",
				// 			grade: "A",
				// 		},
				// 	],
				// 	admin_grade: "A",
				// 	blacklist: false,
				// 	record: {
				// 		active: true,
				// 		created_on: "date",
				// 		updated_on: "date",
				// 	},
				// },
				// {
				// 	_id: "5f857918e43f76087225",
				// 	name: "SOTC",
				// 	business_types: ["FIT", "LUXURY"],
				// 	website: "sotc.com",
				// 	grading: [
				// 		{
				// 			country: "Vietnam",
				// 			grade: "C",
				// 		},
				// 		{
				// 			country: "Afghanistan",
				// 			grade: "C",
				// 		},
				// 	],
				// 	admin_grade: "B",
				// 	blacklist: false,
				// 	record: {
				// 		active: true,
				// 		created_on: "date",
				// 		updated_on: "date",
				// 	},
				// },
				// {
				// 	_id: "5f9985ac96e9d514f0e4df55",
				// 	updated_on: "2020-10-28T14:52:28.603Z",
				// 	name: "Thomas Cook New",
				// 	blacklist: false,
				// 	admin_grade: "A",
				// 	grading: [
				// 		{
				// 			country: "Algeria",
				// 			grade: "A",
				// 		},
				// 	],
				// 	business_types: ["FIT", "MICE"],
				// 	record: {
				// 		active: true,
				// 		created_on: "date",
				// 		updated_on: "date",
				// 	},
				// },
			],
			keysToWatch: ["countries"],
			adminInputConfig: [
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
					isListInStore: true,
					listVariable: "countries",
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
			],
			salesInputConfig: [
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
					isListInStore: true,
					listVariable: "countries",
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
			],
		}),
		computed: {},
		methods: {
			...mapActions("ManageAgents", ["getChangelogsList", "getCompaniesList", "addCompany", "editCompany"]),
			getCompanies() {
				this.openLoaderDialog();
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
			/*
			getChangelogs(company) {
				this.openLoaderDialog();
				this.filter.ref_id = company._id;
				this.getChangelogsList({
					filter: this.filter,
				}).then((data) => {
					this.closeLoaderDialog();
					this.changelogsList = data.list;
				});
			},
			getLogIcon(mutation_type) {
				if (mutation_type == "insert") {
					return "mdi-plus";
				} else if (mutation_type == "update") {
					return "mdi-pencil-outline";
				} else if (mutation_type == "disable") {
					return "mdi-eye-minus";
				} else if (mutation_type == "enable") {
					return "mdi-eye-check";
				}
			},
			getLogType(mutation_type) {
				if (mutation_type == "insert") {
					return "Created";
				} else if (mutation_type == "update") {
					return "Updated";
				} else if (mutation_type == "disable") {
					return "Disabled";
				} else if (mutation_type == "enable") {
					return "Enabled";
				}
			},
			*/
			queryString(data) {
				this.filter["search_text"] = data;
				this.getCompanies();
			},
			advanceSearch(filterObject) {
				this.filter = { ...filterObject };
				this.pageNo = 1;
				this.getCompanies();
			},
			async formOutput(data) {
				var formData = JSON.parse(JSON.stringify(data));
				// formData.email_ids = formData.email_ids.map((data) => data.input).filter((e) => e != "");
				var tempArray = [];
				var tempObj = {};
				console.log("Before API call FormData Object", formData);

				// loop over the emergency contacts objects to convert it into theh backend format

				for (let grade of formData.grading) {
					tempObj = {};
					for (let alpha of grade.input) {
						if (alpha.input != "") {
							tempObj["country"] = grade.groupKey;
							tempObj["grade"] = alpha.input;
							// if (!tempObj["contacts"]) tempObj["contacts"] = [];
							// tempObj["contacts"].push(alpha.input);
						}
					}
					if (Object.keys(tempObj).length) {
						tempArray.push(tempObj);
					}
				}
				formData.grading = tempArray;
				formData.admin_grade = "A";

				console.log("Before API call FormData Object", formData);
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
							this.getCompanies();
						}
					});
				} else {
					this.editCompany(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Edited Company" });
							console.log("Edit Company success");
							this.getCompanies();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
							console.log("Edit Company failed");
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
				];
			},
			updatedPageNo(page) {
				// console.log("Page", page);
				// console.log("Page Number", this.pageNo);
				this.getCompanies();
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
	.big-grade {
		font-size: 32px;
		font-weight: 300;
		color: white;
		display: inline-flex;
		padding: 10px 22px;
		border-radius: 4px;
		box-shadow: 5px 5px 10px #adbacf, -5px -5px 10px #f9ffff;
		background: linear-gradient(145deg, #7fb2ff, #6b95de);
	}
	.small-grade {
		font-size: 20px;
		font-weight: 300;
		color: white;
		display: inline-flex;
		padding: 10px 16px;
		border-radius: 4px;
		box-shadow: 5px 5px 10px #adbacf, -5px -5px 10px #f9ffff;
		background: linear-gradient(145deg, #7fb2ff, #6b95de);
	}
	.smallGradeWrapper {
		margin: 10px 16px 10px 0 !important;
	}
</style>

<style lang="scss">
	.agentsWrapper .v-list-item__title,
	.v-list-item__subtitle {
		white-space: normal;
	}
</style>
