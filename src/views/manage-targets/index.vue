<template>
	<div class="targetsWrapper">
		<div class="card-wrapper">
			<div v-for="target in targetList" :key="target._id" class="card-element">
				<InformationCard>
					<template v-slot:topLeft>
						Targets for Year
					</template>
					<template v-slot:mainContent>
						{{ target.year }}
					</template>
					<template v-slot:actionButtons>
						<template>
							<v-btn @click="deleteYear(target)" color="error" text>
								Delete
							</v-btn>
							<v-btn @click="openInputForm(true, target)" color="secondary" text>
								Edit
							</v-btn>
							<v-btn @click="openTargetsModal(target)" color="primary" text>
								View
							</v-btn>
						</template>
					</template>
				</InformationCard>
			</div>
		</div>

		<ViewMoreModal @closeModal="viewMoreModal = false" :toggleModal="viewMoreModal">
			<template v-slot:modalTitle>
				<div v-if="selectedTarget.year">Targets for the Year {{ selectedTarget.year }}</div>
			</template>
			<template v-slot:modalContent>
				<ProductTargets :targetYear="selectedTarget"></ProductTargets>
			</template>
		</ViewMoreModal>

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
	import { required } from "vuelidate/lib/validators";
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import helpers from "../../components/helpers";
	import ViewMoreModal from "../../components/ViewMoreModal";
	import ProductTargets from "./ProductTargets";

	export default {
		name: "ManageTargets",
		mixins: [defaultCRUDMixin, inputFormMixin],
		components: {
			ProductTargets,
		},
		created() {
			this.setInputConfig(this.yearList);
			this.getYearlyTargets();
		},
		data: () => {
			return {
				targetList: [],
				name: "Year",
				selectedTarget: {},
				inputConfig: [],
			};
		},
		computed: {
			...mapGetters("ManageTargets", ["yearList"]),
		},
		methods: {
			...mapActions("ManageTargets", ["getTargets", "addTargetYear", "editTargetYear", "deleteTargetYear"]),
			getYearlyTargets() {
				this.openLoaderDialog();
				this.getTargets({
					filter: this.filter,
				})
					.then((data) => {
						this.closeLoaderDialog();
						this.targetList = data.list;
					})
					.catch((data) => {
						this.closeLoaderDialog();
					});
			},
			formOutput(data) {
				var formData = JSON.parse(JSON.stringify(data));
				console.log("formData", formData);

				if (!formData.reference_year) {
					delete formData.reference_year;
				}

				this.openLoaderDialog();
				if (!this.isEditMode) {
					this.addTargetYear(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Added Target" });
							this.getYearlyTargets();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
							this.closeForm();
						}
					});
				} else {
					this.editTargetYear(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Edited Target" });
							this.getYearlyTargets();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
							this.closeForm();
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
			deleteYear(target) {
				console.log("Delete", target);
				if (window.confirm("Do you really want to Delete the Year?")) {
					this.openLoaderDialog();
					this.deleteTargetYear({
						_id: target._id,
					}).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully deleted the Year" });
							this.getYearlyTargets();
						} else {
							this.openSnackbar({ text: data.message });
						}
					});
				}
			},
			openTargetsModal(targetData) {
				this.selectedTarget = targetData;
				this.viewMoreModal = true;
			},
			setInputConfig(yearList = []) {
				this.inputConfig = [
					{
						name: "Target Year",
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
						name: "Duplicate Targets From Year",
						type: "Dropdown",
						key: "reference_year",
						width: "half",
						multi: false,
						isListInStore: false,
						listItems: yearList,
					},
				];
			},
		},
	};
</script>

<style lang="scss" scopped>
	.targetsWrapper {
		padding: 20px 5px;
	}
</style>
