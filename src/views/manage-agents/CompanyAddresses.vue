<template>
	<div class="companyAddressWrapper">
		<!-- <v-row class="companyaddress-search-bar" justify="center" align="center">
			<v-col cols="12" sm="8" md="6"> -->
		<div class="companyaddress-search-bar">
			<Search
				@queryString="queryString"
				@filterObject="advanceSearch"
				@clearFilter="advanceSearch"
				:placeholder="placeholder"
				:isAdvanceSearch="true"
				:filterConfig="selectedSearchConfig"
			></Search>
		</div>
		<!-- </v-col>
		</v-row> -->

		<div v-if="showErrorMessage" class="content-error-message">
			{{ errorMessage }}
		</div>

		<div class="card-wrapper">
			<div v-for="address in addressList" :key="address._id" class="card-element">
				<InformationCard :expandCard="false" :isCardDisabled="!address.record.active">
					<template v-slot:topLeft>
						<span class="branch-name">
							{{ address.branch_name }}
						</span>
					</template>
					<template v-slot:topRight>
						{{ address.zone }}
					</template>
					<template v-slot:moreInfo>
						{{ address.address }}<br />
						{{ address.state }}<br />
						{{ address.city }} - {{ address.pincode }}
					</template>
					<template v-slot:actionButtons>
						<template>
							<v-btn @click="openChangelogsModal(address)" icon color="secondary" text
								><v-icon>mdi-information-outline</v-icon></v-btn
							>
							<v-btn @click="disablePartner(address)" color="error" text>
								{{ address.record.active ? "Disable" : "Enable" }}
							</v-btn>
							<v-btn @click="openInputForm(true, address)" color="secondary" text>
								Edit
							</v-btn>
						</template>
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

		<ChangeLogModal
			@closeModal="toggleChangelogModal = false"
			:toggleChangelogModal="toggleChangelogModal"
			:selectedInfo="selectedCardInfo"
		></ChangeLogModal>

		<UserForm
			@formOutput="formOutput"
			@closeForm="closeForm"
			:name="name"
			:inputConfig="inputConfig"
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
	import inputFormMixin from "../../mixins/inputFormMixin";
	import searchMixin from "../../mixins/searchMixin";
	import { required, email, minLength, numeric, alpha } from "vuelidate/lib/validators";
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import helpers from "../../components/helpers";
	import ChangeLogModal from "../../components/ChangeLog";

	export default {
		name: "CompanyAddress",
		mixins: [defaultCRUDMixin, inputFormMixin, searchMixin],
		components: { ChangeLogModal },
		async created() {
			this.getAddresses();
			// await this.getStates();
			this.setInputConfig(this.storeStatesList);
			this.setSearchConfig(this.storeStatesList);
		},
		data: () => ({
			name: "Branch Address",
			placeholder: "Search Addresses",
			toggleChangelogModal: false,
			selectedCardInfo: {},
			activeState: true,
			addressList: [],
			inputConfig: [],
		}),
		computed: {
			...mapGetters("ManageAgents", ["storeStatesList"]),
		},
		methods: {
			...mapActions("ManageAgents", ["getAddressList", "addAddress", "editAddress"]),
			...mapMutations("ManageAgents", ["setAddressList"]),
			getAddresses(callMutation = false) {
				this.openLoaderDialog();
				this.filter.company_id = this.companyInfo._id;
				this.filter.active = this.activeState;
				this.getAddressList({
					filter: this.filter,
					company_id: this.companyInfo._id,
					active: this.activeState,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.addressList = this.checkForErrorMessage(data, "address");
					// this.addressList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;
					if (callMutation) {
						this.setAddressList(this.addressList);
					}
				});
			},
			// getStates() {
			// 	return this.getStatesList({
			// 		filter: {},
			// 	}).then((data) => {
			// 		this.statesList = data.list;
			// 	});
			// },
			openChangelogsModal(info) {
				// this.getChangelogs(info);
				this.selectedCardInfo = { ...info };
				this.toggleChangelogModal = true;
			},
			setInputConfig(statesList = []) {
				this.inputConfig = [
					{
						name: "Branch Name*",
						type: "String",
						key: "branch_name",
						width: "half",
						validations: {
							required,
							minLength: minLength(1),
						},
					},
					{
						name: "Address*",
						type: "String",
						key: "address",
						width: "half",
						validations: {
							required,
							minLength: minLength(1),
						},
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
						type: "String",
						key: "city",
						width: "half",
						validations: {
							required,
							minLength: minLength(1),
						},
					},
					{
						name: "Pincode*",
						type: "Number",
						key: "pincode",
						width: "half",
						validations: {
							required,
							numeric,
						},
					},
				];
			},
			queryString(data) {
				this.filter["search_text"] = data;
				this.getAddresses();
			},
			advanceSearch(filterObject) {
				this.filter = { ...filterObject };
				if (this.filter.active) {
					this.activeState = false;
				} else {
					this.activeState = true;
				}
				this.pageNo = 1;
				this.getAddresses();
			},
			async formOutput(data) {
				var formData = JSON.parse(JSON.stringify(data));
				formData.company_id = this.companyInfo._id;

				this.openLoaderDialog();
				if (!this.isEditMode) {
					this.addAddress(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Added Address" });
							this.getAddresses(true);
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				} else {
					this.editAddress(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Edited Address" });
							this.getAddresses(true);
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
						"Do you really want to " + (data.record.active ? "Disable the Address?" : "Enable the Address?")
					)
				) {
					this.openLoaderDialog();
					this.editAddress({
						_id: data._id,
						active: !data.record.active,
						updated_on: data.record.updated_on,
						status: data.record.active ? "disabled" : "enabled",
					}).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Updated Address Status" });
							this.getAddresses();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				}
			},
			setSearchConfig(statesList = []) {
				/*
				 * Name of Address - Text field - string or number - can this be empty?
				 * Business Type - Dropdown multi Autocomplete - need some default filter provision. - can be empty in this case but not in specific cases
				 * Countries - Dropdown multi Autocomplete - need some default filter provision. - can be empty in this case but not in specific cases
				 */
				this.selectedSearchConfig = [
					{
						name: "Branch Name",
						key: "branch_name",
						type: "text",
						inputType: "textfield",
						defaultValue: "",
					},
					{
						name: "Zone",
						key: "zones",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: true,
						listVariable: "zone",
					},
					{
						name: "State",
						key: "states",
						multi: true,
						inputType: "dropdown",
						defaultValue: [],
						isListInStore: false,
						listItems: statesList,
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
				this.getAddresses();
			},
		},
		watch: {
			companyInfo: {
				deep: true,
				async handler(nv, ov) {
					this.filter = {};
					this.addressList = [];
					this.pageNo = 1;

					this.getAddresses();
					// await this.getStates();
					this.setInputConfig(this.storeStatesList);
					this.setSearchConfig(this.storeStatesList);
				},
			},
		},
		props: {
			companyInfo: { required: true, type: Object },
		},
	};
</script>

<style lang="scss" scopped>
	.companyAddressWrapper {
		padding: 20px 5px;
		height: 100%;
		// display: flex;
		// flex-direction: column;

		.branch-name {
			text-transform: none;
		}
	}
	.card-image img {
		max-width: 100%;
	}
	.companyaddress-search-bar {
		margin-top: 12px;
		display: flex;
		justify-content: center;
	}
</style>

<style lang="scss">
	.companyAddressWrapper .v-list-item__title,
	.v-list-item__subtitle {
		white-space: normal;
	}
</style>
