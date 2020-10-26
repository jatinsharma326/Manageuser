<template>
	<div class="targetsWrapper">
		<div class="card-wrapper">
			<div v-for="user in targetList" :key="user._id" class="card-element">
				<InformationCard :expandCard="true">
					<template v-slot:topLeft>
						{{ user.business_types.join(", ") }}
					</template>
					<template v-slot:mainContent>
						{{ user.name }}
					</template>
					<template v-slot:mainContentSubtitle>
						{{ user.proprietor_info }}
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
							<v-btn
								v-if="userType == ADMIN || userType == MANAGEMENT"
								@click="disablePartner(user)"
								color="error"
								text
							>
								{{ user.record.active ? "Disable" : "Enable" }}
							</v-btn>
							<v-btn
								v-if="userType == ADMIN || userType == MANAGEMENT"
								@click="openInputForm(true, user)"
								color="secondary lighten-2"
								text
							>
								Edit
							</v-btn>
							<v-btn @click="openTargetsModal(user)" color="primary lighten-2" text>
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
									<v-icon color="indigo">
										mdi-phone
									</v-icon>
								</v-list-item-icon>

								<v-list-item-content>
									<v-list-item-title>{{ contact.contacts.join(", ") }}</v-list-item-title>
									<v-list-item-subtitle>{{ contact.country }}</v-list-item-subtitle>
								</v-list-item-content>
								<!-- <v-divider inset></v-divider> -->
							</v-list-item>
						</v-list>
					</template>
				</InformationCard>
			</div>
		</div>

		<ViewMoreModal @closeModal="viewMoreModal = false" :toggleModal="viewMoreModal">
			<!-- <template v-slot:modalTitle>
				<div v-if="selectedPartnerInfo.name">
					{{ selectedPartnerInfo.name }}
				</div>
			</template>
			<template v-slot:modalSubtitle>
				<div v-if="selectedPartnerInfo.business_types">
					{{ selectedPartnerInfo.business_types.join("/ ") }}
				</div>
			</template> -->
			<template v-slot:modalContent>
				<!-- <partnerEmployees :partnerInfo="selectedPartnerInfo"></partnerEmployees> -->
			</template>
		</ViewMoreModal>

		<!-- <UserForm
			@formOutput="formOutput"
			@closeForm="closeForm"
			:name="name"
			:inputConfig="inputConfig"
			:keysToWatch="keysToWatch"
			:toggleForm="toggleForm"
			:formData="rowToEdit"
			:isEditMode="isEditMode"
		></UserForm> -->

		<div v-if="userType == ADMIN || userType == MANAGEMENT" class="floating-button">
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
	import ViewMoreModal from "../../components/ViewMoreModal";

	export default {
		name: "ManageTargets",
		mixins: [defaultCRUDMixin],
		components: {},
		created() {
			// this.getPartners();
		},
		data: () => ({
			targetList: [],
			name: "Year",
			inputConfig: [
				{
					name: "Partner Name",
					type: "String",
					key: "name",
					width: "half",
					validations: {
						required,
						minLength: minLength(1),
					},
				},
				{
					name: "Proprietor Info",
					type: "String",
					key: "proprietor_info",
					width: "full",
					validations: {
						required,
						minLength: minLength(1),
					},
				},
				{
					name: "Countries",
					type: "Dropdown",
					key: "countries",
					width: "half",
					multi: true,
					isListInStore: true,
					listVariable: "countries",
					validations: {
						required,
					},
				},
				{
					name: "Business Type",
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
					name: "Emergency Numbers",
					type: "MultiInputWithGroupKey",
					key: "emergency_contacts",
					width: "half",
					keyToGroup: "countries",
				},
			],
		}),
		computed: {},
		methods: {
			...mapActions("ManageTargets", ["getPartnerList", "addPartner", "editPartner"]),
			getPartners() {
				this.openLoaderDialog();
				this.getPartnerList({
					filter: this.filter,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					this.targetList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;
				});
			},
			async formOutput(data) {
				console.log("Before Cleaning", data);
				var tempFile = data.logo;
				var formData = JSON.parse(JSON.stringify(data));
				formData.logo = tempFile;
				console.log("After Cleaning", formData);
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
					this.addPartner(formData).then((data) => {
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
					this.editPartner(formData).then((data) => {
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
						"Do you really want to " + (data.record.active ? "Disable the User?" : "Enable the User?")
					)
				) {
					this.openLoaderDialog();
					this.editPartner({
						_id: data._id,
						active: !data.record.active,
						updated_on: data.record.updated_on,
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
			openTargetsModal(userData) {
				this.selectedPartnerInfo = { ...userData };
				// console.log(this.selectedPartnerInfo);
				this.viewMoreModal = true;
			},
		},
	};
</script>

<style lang="scss" scopped>
	.targetsWrapper {
		padding: 20px 5px;
	}
</style>
