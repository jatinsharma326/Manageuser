<template>
	<div class="MSRWrapper primary-background-color">
		<div class="SearchbarWrapper">
			<div class="searchbar">
				<Search
					@queryString="queryString"
					@filterObject="advanceSearch"
					@clearFilter="advanceSearch"
					:placeholder="placeholder"
					:isAdvanceSearch="userType == SALES_AGENT ? false : true"
					:filterConfig="selectedSearchConfig"
				></Search>
			</div>
			<div class="datepicker">
				<v-autocomplete v-model="selectedYear" :items="yearList" outlined label="Select Year"></v-autocomplete>
			</div>
		</div>

		<div v-if="showErrorMessage" class="content-error-message">
			{{ errorMessage }}
		</div>

		<div class="card-wrapper">
			<div v-for="listItem in msrList" :key="listItem._id" class="card-element">
				<InformationCard :expandCard="true">
					<template v-slot:topLeft>
						{{ listItem.mortal_data.name }}
					</template>
					<template v-slot:mainContent>
						{{ getMonthName(listItem.month) }}
					</template>
					<template v-slot:mainContentSubtitle>
						{{ listItem.country }}
					</template>
					<template v-slot:moreInfo>
						{{ listItem.highlights }}
					</template>
					<template v-slot:actionButtons>
						<template>
							<v-btn @click="openInputForm(true, listItem)" color="secondary" text>
								Edit
							</v-btn>
							<v-btn @click="openMonthModal(listItem)" color="primary" text>
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

		<div class="paginationWrapper text-center">
			<v-pagination
				@input="updatedPageNo"
				v-if="isPaginationRequired"
				v-model="pageNo"
				:length="Math.ceil(fetchCount / pageSize)"
			></v-pagination>
		</div>

		<ViewMoreModal @closeModal="viewMoreModal = false" :toggleModal="viewMoreModal">
			<template v-slot:modalTitle>
				<div v-if="selectedMonthInfo.month">
					{{ getMonthName(selectedMonthInfo.month) }}, {{ selectedMonthInfo.year }}
				</div>
			</template>
			<template v-slot:modalSubtitle>
				<div class="tertiary-font-color" v-if="selectedMonthInfo.country">
					{{ selectedMonthInfo.country }}
				</div>
			</template>
			<template v-slot:modalContent>
				<ReportView v-if="viewMoreModal" :monthInfo="selectedMonthInfo"></ReportView>
			</template>
		</ViewMoreModal>
		<!-- Below is the form for Add and Edit -->
		<UserForm
			@formOutput="formOutput"
			@closeForm="closeForm"
			:name="name"
			:inputConfig="inputConfig"
			:toggleForm="toggleForm"
			:formData="rowToEdit"
			:isEditMode="isEditMode"
		></UserForm>

		<!-- Below is the form for Extract -->
		<UserForm
			@formOutput="exportFormOutput"
			@closeForm="closeExportForm"
			name="Export MSR for all products"
			:inputConfig="exportConfig"
			:toggleForm="toggleExportForm"
			:prependFormName="false"
			:isEditMode="false"
		></UserForm>

		<div v-if="userType == SALES_AGENT" class="floating-button">
			<v-btn @click="openInputForm()" color="primary" dark fab>
				<v-icon>mdi-plus</v-icon>
			</v-btn>
		</div>

		<div v-if="userType == REMOTE_SALES_AGENT" class="floating-button">
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
					<span>Add MSR Month</span>
				</v-tooltip>
				<v-tooltip left>
					<template v-slot:activator="{ on, attrs }">
						<v-btn fab dark small color="tertiary" @click="openExportForm()" v-bind="attrs" v-on="on">
							<v-icon>mdi-download</v-icon>
						</v-btn>
					</template>
					<span>Export Complete MSR</span>
				</v-tooltip>
			</v-speed-dial>
		</div>
	</div>
</template>

<script>
	import ReportView from "./ReportView";
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import commonAPICallsMixin from "../../mixins/commonAPICallsMixin";
	import inputFormMixin from "../../mixins/inputFormMixin";
	import searchMixin from "../../mixins/searchMixin";
	import moment from "moment-timezone";
	import helpers from "../../components/helpers";
	import ViewMoreModal from "../../components/ViewMoreModal";
	import { required, email, minLength, numeric, alpha } from "vuelidate/lib/validators";
	import { mapActions, mapGetters, mapMutations } from "vuex";

	export default {
		name: "MonthlySalesReport",
		mixins: [defaultCRUDMixin, inputFormMixin, searchMixin, commonAPICallsMixin],
		components: {
			ReportView,
		},
		async created() {
			this.openLoaderDialog();
			await this.getCountries();
			this.setInputConfig(this.yearList, this.monthList, this.countriesList);
			if (this.userType != this.SALES_AGENT) {
				if (this.isAdminOrManagement) {
					await this.getUsers();
				}
				this.setSearchConfig(this.userList, this.countriesList, this.monthList);
			}
			this.setYear();
			this.closeLoaderDialog();

			// this.getData();
		},
		data: () => ({
			name: "Month Sales Report",
			placeholder: "Search",
			selectedMonthInfo: {},
			selectedYear: 0,
			currentYear: 2020,
			toggleExportForm: false,
			fab: false,
			hover: true,
			// yearList: [
			// 	2000,
			// 	2001,
			// 	2002,
			// 	2003,
			// 	2004,
			// 	2005,
			// 	2006,
			// 	2007,
			// 	2008,
			// 	2009,
			// 	2010,
			// 	2011,
			// 	2012,
			// 	2013,
			// 	2014,
			// 	2015,
			// 	2016,
			// 	2017,
			// 	2018,
			// 	2019,
			// 	2020,
			// 	2021,
			// 	2022,
			// 	2023,
			// 	2024,
			// 	2025,
			// 	2026,
			// 	2027,
			// 	2028,
			// 	2029,
			// 	2030,
			// 	2031,
			// 	2032,
			// 	2033,
			// 	2034,
			// 	2035,
			// 	2036,
			// 	2037,
			// 	2038,
			// 	2039,
			// 	2040,
			// 	2041,
			// 	2042,
			// 	2043,
			// 	2044,
			// 	2045,
			// 	2046,
			// 	2047,
			// 	2048,
			// 	2049,
			// 	2050,
			// 	2051,
			// 	2052,
			// 	2053,
			// 	2054,
			// 	2055,
			// 	2056,
			// 	2057,
			// 	2058,
			// 	2059,
			// 	2060,
			// 	2061,
			// 	2062,
			// 	2063,
			// 	2064,
			// 	2065,
			// 	2066,
			// 	2067,
			// 	2068,
			// 	2069,
			// 	2070,
			// 	2071,
			// 	2072,
			// 	2073,
			// 	2074,
			// 	2075,
			// 	2076,
			// 	2077,
			// 	2078,
			// 	2079,
			// 	2080,
			// 	2081,
			// 	2082,
			// 	2083,
			// 	2084,
			// 	2085,
			// 	2086,
			// 	2087,
			// 	2088,
			// 	2089,
			// 	2090,
			// 	2091,
			// 	2092,
			// 	2093,
			// 	2094,
			// 	2095,
			// 	2096,
			// 	2097,
			// 	2098,
			// 	2099,
			// 	2100,
			// ],
			monthList: [
				{
					text: "January",
					value: 1,
				},
				{
					text: "February",
					value: 2,
				},
				{
					text: "March",
					value: 3,
				},
				{
					text: "April",
					value: 4,
				},
				{
					text: "May",
					value: 5,
				},
				{
					text: "June",
					value: 6,
				},
				{
					text: "July",
					value: 7,
				},
				{
					text: "August",
					value: 8,
				},
				{
					text: "September",
					value: 9,
				},
				{
					text: "October",
					value: 10,
				},
				{
					text: "November",
					value: 11,
				},
				{
					text: "December",
					value: 12,
				},
			],
			msrList: [],
			inputConfig: [],
			exportConfig: [],
		}),
		computed: {
			...mapGetters("ManageTargets", ["yearList"]),
			...mapGetters(["REMOTE_SALES_AGENT", "SALES_AGENT", "MANAGEMENT", "ADMIN", "userType", "userData"]),
		},
		methods: {
			...mapActions("MSR", ["getMonthList", "addReportMonth", "editReportMonth", "downloadCompleteReportFile"]),
			getData() {
				this.openLoaderDialog();
				this.filter.year = this.selectedYear;
				if (this.isSalesTeamMember) {
					this.filter.mortal_id = this.userData.id;
				}
				this.getMonthList({
					filter: this.filter,
					year: this.selectedYear,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.msrList = this.checkForErrorMessage(data, "MSR");
					// this.msrList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;
				});
			},
			setYear() {
				this.currentYear = moment().format("YYYY");
				this.selectedYear = Number(this.currentYear);
			},
			getMonthName(monthNumber) {
				return moment(monthNumber, "MM").format("MMMM");
			},
			getCountries() {
				if (this.userType == this.SALES_AGENT) {
					this.countriesList = [...this.userData.usr_data.countries];
				} else {
					return this.getCountryList();
				}
			},
			openExportForm() {
				this.isExportForm = true;
				this.toggleExportForm = true;
			},
			closeExportForm() {
				this.isExportForm = false;
				this.toggleExportForm = false;
			},
			exportFormOutput(data) {
				this.openLoaderDialog();
				this.downloadCompleteReportFile({
					month: data.month,
					year: data.year,
					highlights: data.highlights,
					mortal_id: this.userData.id,
				}).then(() => {
					this.closeLoaderDialog();
				});
			},
			setInputConfig(yearList = [], monthList = [], countriesList = []) {
				this.inputConfig = [
					{
						name: "Product*",
						type: "Dropdown",
						key: "country",
						width: "full",
						multi: false,
						isListInStore: false,
						listItems: countriesList,
						validations: {
							required,
						},
					},
					{
						name: "Year*",
						type: "Dropdown",
						key: "year",
						width: "half",
						multi: false,
						isListInStore: false,
						listItems: yearList,
						validations: {
							required,
						},
					},
					{
						name: "Month*",
						type: "Dropdown",
						key: "month",
						width: "half",
						multi: false,
						isListInStore: false,
						listItems: monthList,
						validations: {
							required,
						},
					},
					{
						name: "Month Highlight*",
						type: "TextArea",
						key: "highlights",
						width: "full",
						validations: {
							required,
							minLength: minLength(1),
						},
					},
				];
				this.exportConfig = [
					{
						name: "Year*",
						type: "Dropdown",
						key: "year",
						width: "half",
						multi: false,
						isListInStore: false,
						listItems: yearList,
						validations: {
							required,
						},
					},
					{
						name: "Month*",
						type: "Dropdown",
						key: "month",
						width: "half",
						multi: false,
						isListInStore: false,
						listItems: monthList,
						validations: {
							required,
						},
					},
					{
						name: "Month Highlight*",
						type: "TextArea",
						key: "highlights",
						width: "full",
						validations: {
							required,
							minLength: minLength(1),
						},
					},
				];
			},
			queryString(data) {
				this.filter["search_text"] = data;
				this.getData();
			},
			advanceSearch(filterObject) {
				this.filter = { ...filterObject };
				this.pageNo = 1;
				this.getData();
			},
			async formOutput(data) {
				var formData = JSON.parse(JSON.stringify(data));

				formData.month_name = this.getMonthName(formData.month);
				formData.mortal_id = this.userData.id;

				console.log("Before API call FormData Object", formData);

				this.openLoaderDialog();
				if (!this.isEditMode) {
					this.addReportMonth(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Added Partner" });
							console.log("Add Partner success");
							this.getData();
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
							this.getData();
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
							this.getData();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
							console.log("Failed to Update Partner status");
						}
					});
				}
			},
			openMonthModal(monthData) {
				this.selectedMonthInfo = { ...monthData };
				// console.log(this.selectedMonthInfo);
				this.viewMoreModal = true;
			},
			setSearchConfig(teamMember = [], countriesList = [], monthList = []) {
				this.selectedSearchConfig = [
					{
						name: "Select Month",
						key: "month_numbers",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: monthList,
					},
					{
						name: "Select Product",
						key: "countries",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: countriesList,
					},
				];
				if (this.isAdminOrManagement) {
					let userObject = {
						name: "Select User",
						key: "names",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: teamMember,
					};
					this.selectedSearchConfig.push(userObject);
				}
			},
			updatedPageNo(page) {
				this.getData();
			},
		},
		watch: {
			selectedYear(nv, ov) {
				this.getData();
			},
		},
	};
</script>

<style lang="scss" scopped>
	.MSRWrapper {
		padding: 20px 5px;
		height: 100%;

		.more-info {
			overflow: hidden;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
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
