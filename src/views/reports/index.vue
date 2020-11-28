<template>
	<div class="targetsWrapper">
		<div class="card-wrapper">
			<div v-for="configItem in config" :key="configItem._id" class="card-element">
				<InformationCard>
					<template v-slot:topLeft>
						Based Reports
					</template>
					<template v-slot:mainContent>
						{{ configItem.name }}
					</template>
					<template v-slot:actionButtons>
						<template>
							<v-btn @click="openconfigItemsModal(configItem)" color="primary" text>
								View
							</v-btn>
						</template>
					</template>
				</InformationCard>
			</div>
		</div>

		<ViewMoreModal @closeModal="viewMoreModal = false" :toggleModal="viewMoreModal">
			<template v-slot:modalTitle>
				<div v-if="selectedTarget.name">{{ selectedTarget.name }}</div>
			</template>
			<template v-slot:modalContent>
				<ReportsManager v-bind="{ ...selectedTarget.props }"></ReportsManager>
			</template>
		</ViewMoreModal>
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import commonAPICallsMixin from "../../mixins/commonAPICallsMixin";
	import ViewMoreModal from "../../components/ViewMoreModal";
	import ReportsManager from "./ReportsManager";
	import { mapGetters } from "vuex";

	export default {
		name: "Reports",
		mixins: [defaultCRUDMixin, commonAPICallsMixin],
		components: {
			ReportsManager,
		},
		async created() {
			this.openLoaderDialog();
			let promiseArray = [];
			if (this.isAdminOrManagement) {
				await this.getUsers();
			}
			await this.getCountries();
			this.closeLoaderDialog();
			this.setConfig(this.businessType, this.countriesList, this.userList);
		},
		data: () => {
			return {
				selectedTarget: {},
				config: [],
			};
		},
		computed: {
			...mapGetters([
				"zone",
				"businessType",
				"REMOTE_SALES_AGENT",
				"SALES_AGENT",
				"MANAGEMENT",
				"ADMIN",
				"userType",
				"userData",
			]),
		},
		methods: {
			getCountries() {
				if (this.userType == this.SALES_AGENT) {
					this.countriesList = [...this.userData.usr_data.countries];
				} else {
					return this.getCountryList();
				}
			},
			setConfig(businessType = [], countriesList = [], userList = []) {
				this.config = [
					{
						name: "Yearly Revenue",
						id: "yearlyRevenue",
						props: {
							name: "Yearly Revenue",
							placeholder: "Search Yearly Revenue",
							businessType,
							userList,
							countriesList,
						},
					},
					{
						name: "Travel Agent",
						id: "travelAgent",
						props: {
							name: "Travel Agent",
							placeholder: "Search Travel Agent",
							businessType,
							userList,
							countriesList,
						},
					},
					{
						name: "Zone / City",
						id: "zoneOrCity",
						props: {
							name: "Zone / City",
							placeholder: "Search Zone / City",
							businessType,
							userList,
							countriesList,
						},
					},
					{
						name: "Target",
						id: "target",
						props: {
							name: "Target",
							placeholder: "Search Target",
							businessType,
							userList,
							countriesList,
						},
					},
				];
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
