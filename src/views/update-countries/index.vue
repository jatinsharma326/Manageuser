<template>
	<div class="updateCountryWrapper">
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
		</div>
		<div v-if="totalCount === 0" class="content-error-message">
			Please add an Entry
		</div>
		<div v-else class="info-table">
			<!-- :expanded.sync="expanded" -->
			<!-- show-expand -->
			<v-data-table
				:items-per-page="pageSize"
				hide-default-footer
				:headers="headers"
				item-key="_id"
				:items="dataList"
			>
				<template v-slot:[`item.action`]="{ item }">
					<!-- mdi-minus-circle-outline
					<v-btn @click="disablePartner(item)" color="error" text>
						{{ item.record.active ? "Disable" : "Enable" }}
					</v-btn> -->
					<v-icon v-if="item.record.active" color="error" @click="disableEntry(item)">
						mdi-minus-circle
					</v-icon>
					<v-icon v-else color="primary" @click="disableEntry(item)">
						mdi-plus-circle
					</v-icon>
				</template>
				<!-- <template v-slot:[`item.actions`]="{ item }">
					<template v-if="isSalesTeamMember">
						<v-menu bottom left>
							<template v-slot:activator="{ on, attrs }">
								<v-btn icon v-bind="attrs" v-on="on">
									<v-icon>mdi-dots-vertical</v-icon>
								</v-btn>
							</template>
							<v-list>
								<v-list-item @click="openInputForm(true, item)">EDIT</v-list-item>
								<v-list-item @click="deleteEntry(item)">DELETE</v-list-item>
							</v-list>
						</v-menu>
					</template>
				</template> -->
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
		<!-- <div class="floating-button">
				<v-btn @click="openInputForm()" color="primary" dark fab>
					<v-icon>mdi-plus</v-icon>
				</v-btn>
			</div> -->
		<div class="floating-button">
			<v-btn @click="openInputForm()" color="primary" dark fab>
				<v-icon>mdi-plus</v-icon>
			</v-btn>
		</div>
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import helperMixin from "../../mixins/helperMixins";
	import inputFormMixin from "../../mixins/inputFormMixin";
	import searchMixin from "../../mixins/searchMixin";
	import commonAPICallsMixin from "../../mixins/commonAPICallsMixin";

	import { required, email, minLength, numeric, alpha } from "vuelidate/lib/validators";
	import helpers from "../../components/helpers";
	import moment from "moment-timezone";
	import { mapActions, mapGetters, mapMutations } from "vuex";

	export default {
		name: "UpdateCountries",
		mixins: [defaultCRUDMixin, inputFormMixin, helperMixin, searchMixin, commonAPICallsMixin],
		async created() {
			this.getData();
			this.setConfig();
		},
		data: () => ({
			name: "Country",
			placeholder: "Search a Country",
			fab: false,
			searchConfig: [],
			inputConfig: [],
			citiesList: [],
			dataList: [],
			headers: [
				{ text: "Sr. No.", align: "start", value: "serial_number", width: 100 },
				{ text: "Name", value: "name", width: 150 },
				{ text: "Country Code", value: "code", width: 150 },
				{ text: "Update Country Status", value: "action", width: 250 },
				{ text: "", value: "actions" },
			],
			expanded: [],
			keysToWatch: [],
		}),
		computed: {
			...mapGetters(["userData"]),
		},
		methods: {
			...mapActions(["getCountries"]),
			...mapActions("UpdateCountries", ["getCountriesToUpdate", "addCountry", "editCountry"]),
			getData() {
				this.openLoaderDialog();
				this.getCountriesToUpdate({
					filter: this.filter,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.dataList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;

					if (this.dataList.length) {
						this.dataList = this.dataList.map((d, index) => ({
							...d,
							serial_number: (this.pageNo - 1) * this.pageSize + (index + 1),
						}));
					}
				});
			},
			disableEntry(data) {
				if (
					window.confirm(
						"Do you really want to " + (data.record.active ? "Disable" : "Enable") + " the country"
					)
				) {
					this.openLoaderDialog();
					this.editCountry({
						_id: data._id,
						active: !data.record.active,
						updated_on: data.record.updated_on,
						status: data.record.active ? "disabled" : "enabled",
					}).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.getCountries();
							this.openSnackbar({
								text: "Sucessfully Updated Country Status",
							});
							this.getData();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				}
			},
			setConfig() {
				this.searchConfig = [];

				this.inputConfig = [
					{
						name: "Country Name",
						type: "String",
						key: "country",
						width: "half",
						validations: {
							required,
						},
					},
					{
						name: "Country Code",
						type: "String",
						key: "code",
						width: "half",
						validations: {
							required,
						},
					},
				];
			},
			advanceSearch(filterObject) {
				var filterData = JSON.parse(JSON.stringify(filterObject));
				this.filter = { ...filterData };
				this.pageNo = 1;
				this.getData();
			},
			async formOutput(data) {
				var formData = JSON.parse(JSON.stringify(data));

				// formData.conducted_on_date = helpers.getISODate(formData.conducted_on_date);
				// if (!formData.reach) {
				// 	formData.reach = 0;
				// } else if (formData.reach < 0) {
				// 	formData.reach = 0;
				// } else {
				// 	formData.reach = Number(formData.reach);
				// }

				this.openLoaderDialog();
				if (!this.isEditMode) {
					this.addCountry(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.getCountries();
							this.openSnackbar({
								text: "Sucessfully Added the Country",
							});
							this.closeForm();
							this.getData();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				}
				// else {
				// 	this.editCountry(formData).then((data) => {
				// 		this.closeLoaderDialog();
				// 		if (data.ok) {
				// 			this.openSnackbar({
				// 				text: "Sucessfully Edited the Country",
				// 			});
				// 			this.closeForm();
				// 			this.getData();
				// 		} else {
				// 			this.openSnackbar({ text: data.message });
				// 		}
				// 	});
				// }
			},
			getEditRowObject(data) {
				return {
					...data,
					_id: data._id,
					updated_on: data.record.updated_on,
				};
			},
		},
		watch: {},
		props: {},
	};
</script>
<style lang="scss">
	.manageVirtualReachWrapper {
		height: 100%;
		.tabItemWrapper {
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
	}
</style>
<style lang="scss" scoped>
	.SearchbarWrapper {
		.searchWrapper {
			flex-shrink: 0;
		}
	}
	.updateCountryWrapper {
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
