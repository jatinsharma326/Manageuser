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
				<InformationCard :expandCard="true">
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
							<v-btn icon color="secondary" text><v-icon>mdi-information-outline</v-icon></v-btn>
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
											>{{ grade.product }} {{ index
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
			:inputConfig="userType == ADMIN ? adminInputConfig : salesInputConfig"
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
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import { required, email, minLength, numeric, alpha } from "vuelidate/lib/validators";
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import helpers from "../../components/helpers";
	import companyInfo from "./CompanyInfo";
	import ViewMoreModal from "../../components/ViewMoreModal";

	export default {
		name: "ManageAgents",
		mixins: [defaultCRUDMixin],
		components: {
			companyInfo,
		},
		created() {
			this.getCompanies();
			this.setSearchConfig();
		},
		data: () => ({
			companyList: [
				{
					_id: "5f857918e43f60826225",
					name: "Thomas Cook",
					business_types: ["FIT", "GIT", "MICE", "ADHOC", "LUXURY"],
					website: "thomascook.in",
					grading: [
						{
							product: "United State",
							grade: "A",
						},
					],
					admin_grade: "A",
					blacklist: false,
					record: {
						active: true,
						created_on: "date",
						updated_on: "date",
					},
				},
				{
					_id: "5f857918e43f76087225",
					name: "SOTC",
					business_types: ["FIT", "LUXURY"],
					website: "sotc.com",
					grading: [
						{
							product: "Vietnam",
							grade: "C",
						},
						{
							product: "Afghanistan",
							grade: "C",
						},
					],
					admin_grade: "B",
					blacklist: false,
					record: {
						active: true,
						created_on: "date",
						updated_on: "date",
					},
				},
				{
					_id: "5f9985ac96e9d514f0e4df55",
					updated_on: "2020-10-28T14:52:28.603Z",
					name: "Thomas Cook New",
					blacklist: false,
					admin_grade: "A",
					grading: [
						{
							country: "Algeria",
							grade: "A",
						},
					],
					business_types: ["FIT", "MICE"],
					record: {
						active: true,
						created_on: "date",
						updated_on: "date",
					},
				},
			],
			search_text: "",
			name: "Travel Agents",
			keysToWatch: ["product"],
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
					key: "name",
					width: "half",
				},
				{
					name: "Defaulter?",
					type: "Switch",
					key: "blacklist",
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
					key: "product",
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
					keyToGroup: "product",
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
					key: "blacklist",
					width: "half",
				},
				{
					name: "Countries*",
					type: "Dropdown",
					key: "product",
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
					keyToGroup: "product",
				},
			],
			selectedCompanyInfo: {},
			placeholder: "Search Companies",
		}),
		computed: {},
		methods: {
			...mapActions("ManageAgents", ["getCompaniesList", "addCompany", "editCompany"]),
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
							tempObj["product"] = grade.groupKey;
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
