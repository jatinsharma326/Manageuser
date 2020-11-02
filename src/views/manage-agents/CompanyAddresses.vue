<template>
	<div class="companyAddressWrapper">
		<v-row class="px-6 companyaddress-search-bar" justify="center" align="center">
			<v-col cols="12" sm="8" md="6">
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
			<div v-for="address in addressList" :key="address._id" class="card-element">
				<InformationCard :expandCard="false" :isCardDisabled="!address.record.active">
					<template v-slot:topLeft>
						{{ address.branch_name }}
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
							<v-btn
								v-if="userType == ADMIN || userType == MANAGEMENT"
								@click="disablePartner(address)"
								color="error"
								text
							>
								{{ address.record.active ? "Disable" : "Enable" }}
							</v-btn>
							<v-btn
								v-if="(userType == ADMIN || userType == MANAGEMENT) && address.record.active"
								@click="openInputForm(true, address)"
								color="secondary"
								text
							>
								Edit
							</v-btn>
						</template>
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
			:selectedInfo="selectedCardInfo"
		></ChangeLogModal>

		<!-- :keysToWatch="keysToWatch" -->
		<UserForm
			@formOutput="formOutput"
			@closeForm="closeForm"
			:name="name"
			:inputConfig="inputConfig"
			:toggleForm="toggleForm"
			:formData="rowToEdit"
			:isEditMode="isEditMode"
		></UserForm>

		<div v-if="userType == ADMIN || userType == MANAGEMENT" class="floating-button">
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

	import ViewMoreModal from "../../components/ViewMoreModal";

	export default {
		name: "CompanyAddress",
		mixins: [defaultCRUDMixin, inputFormMixin, searchMixin],
		components: { ChangeLogModal },
		created() {
			this.getAddresses();
			// this.setSearchConfig();
		},
		data: () => ({
			addressList: [
				// {
				// 	_id: "5f9a990d4667e23dac5fc70d",
				// 	record: {
				// 		created_on: "2020-10-29T10:27:25.734Z",
				// 		updated_on: "2020-10-29T10:27:25.734Z",
				// 		active: true,
				// 	},
				// 	zone: "EAST",
				// 	branch_name: "Dadar",
				// 	address: "Dadar Mumbai",
				// 	city: "Mumbai",
				// 	state: "Maharashtra",
				// 	pincode: "400008",
				// 	company_id: "5f9985ac96e9d514f0e4df55",
				// },
			],
			toggleChangelogModal: false,
			selectedCardInfo: {},
			name: "Branch Address",
			inputConfig: [
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
					name: "State*",
					type: "String",
					key: "state",
					width: "half",
					validations: {
						required,
						minLength: minLength(1),
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
					type: "String",
					key: "pincode",
					width: "half",
					validations: {
						required,
						numeric,
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
			],
			placeholder: "Search Addresses",
		}),
		computed: {},
		methods: {
			...mapActions("ManageAgents", ["getAddressList", "addAddress", "editAddress"]),
			getAddresses() {
				this.openLoaderDialog();
				this.getAddressList({
					filter: this.filter,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.addressList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;
				});
			},
			openChangelogsModal(info) {
				// this.getChangelogs(info);
				this.selectedCardInfo = { ...info };
				this.toggleChangelogModal = true;
			},
			queryString(data) {
				this.filter["search_text"] = data;
				this.getAddresses();
			},
			advanceSearch(filterObject) {
				this.filter = { ...filterObject };
				this.pageNo = 1;
				this.getAddresses();
			},
			async formOutput(data) {
				var tempFile = data.logo;
				var formData = JSON.parse(JSON.stringify(data));
				// formData.email_ids = formData.email_ids.map((data) => data.input).filter((e) => e != "");
				// formData.logo = tempFile;
				// var tempArray = [];
				// var tempObj = {};

				// // loop over the emergency contacts objects to convert it into theh backend format
				// for (let contact of formData.emergency_contacts) {
				// 	tempObj = {};
				// 	for (let num of contact.input) {
				// 		if (num.input != "") {
				// 			tempObj["country"] = contact.groupKey;
				// 			if (!tempObj["contacts"]) tempObj["contacts"] = [];
				// 			tempObj["contacts"].push(num.input);
				// 		}
				// 	}
				// 	if (Object.keys(tempObj).length) {
				// 		tempArray.push(tempObj);
				// 	}
				// }
				// formData.emergency_contacts = tempArray;

				// // remove logo key if it's empty
				// if (formData.logo) {
				// 	formData.logo = await helpers.toBase64(formData.logo);
				// } else {
				// 	delete formData.logo;
				// }
				formData.company_id = this.companyInfo._id;

				console.log("Before API call FormData Object", formData);

				this.openLoaderDialog();
				if (!this.isEditMode) {
					this.addAddress(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Added Address" });
							this.getAddresses();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
							this.getAddresses();
						}
					});
				} else {
					this.editAddress(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Edited Address" });
							this.getAddresses();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
							this.getAddresses();
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
							this.getAddresses();
						}
					});
				}
			},
			setSearchConfig() {
				/*
				 * Name of Address - Text field - string or number - can this be empty?
				 * Business Type - Dropdown multi Autocomplete - need some default filter provision. - can be empty in this case but not in specific cases
				 * Countries - Dropdown multi Autocomplete - need some default filter provision. - can be empty in this case but not in specific cases
				 */
				this.selectedSearchConfig = [
					{
						name: "Address Name",
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
				this.getAddresses();
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
	}
	.card-image img {
		max-width: 100%;
	}
	.companyaddress-search-bar {
		margin-top: 12px;
	}
</style>

<style lang="scss">
	.companyAddressWrapper .v-list-item__title,
	.v-list-item__subtitle {
		white-space: normal;
	}
</style>
