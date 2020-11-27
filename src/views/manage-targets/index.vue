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
			this.getYearlyTargets();
		},
		data: () => {
			let years = [
				2000,
				2001,
				2002,
				2003,
				2004,
				2005,
				2006,
				2007,
				2008,
				2009,
				2010,
				2011,
				2012,
				2013,
				2014,
				2015,
				2016,
				2017,
				2018,
				2019,
				2020,
				2021,
				2022,
				2023,
				2024,
				2025,
				2026,
				2027,
				2028,
				2029,
				2030,
				2031,
				2032,
				2033,
				2034,
				2035,
				2036,
				2037,
				2038,
				2039,
				2040,
				2041,
				2042,
				2043,
				2044,
				2045,
				2046,
				2047,
				2048,
				2049,
				2050,
				2051,
				2052,
				2053,
				2054,
				2055,
				2056,
				2057,
				2058,
				2059,
				2060,
				2061,
				2062,
				2063,
				2064,
				2065,
				2066,
				2067,
				2068,
				2069,
				2070,
				2071,
				2072,
				2073,
				2074,
				2075,
				2076,
				2077,
				2078,
				2079,
				2080,
				2081,
				2082,
				2083,
				2084,
				2085,
				2086,
				2087,
				2088,
				2089,
				2090,
				2091,
				2092,
				2093,
				2094,
				2095,
				2096,
				2097,
				2098,
				2099,
				2100,
			];
			return {
				targetList: [],
				name: "Year",
				selectedTarget: {},
				inputConfig: [
					{
						name: "Target Year",
						type: "Dropdown",
						key: "year",
						width: "half",
						multi: false,
						isListInStore: false,
						listItems: years,
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
						listItems: years,
					},
				],
			};
		},
		computed: {},
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
		},
	};
</script>

<style lang="scss" scopped>
	.targetsWrapper {
		padding: 20px 5px;
	}
</style>
