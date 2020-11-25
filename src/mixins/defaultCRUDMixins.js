import InformationCard from "../components/InformationCard.vue";
import ViewMoreModal from "../components/ViewMoreModal";
import { mapActions, mapGetters, mapMutations } from "vuex";

const defaultCRUDMixins = {
	components: {
		InformationCard,
		ViewMoreModal,
	},
	data: () => ({
		viewMoreModal: false,
	}),
	computed: {
		...mapGetters(["REMOTE_SALES_AGENT", "SALES_AGENT", "MANAGEMENT", "ADMIN", "userType"]),
		isAdminOrManagement: function() {
			return this.userType == this.ADMIN || this.userType == this.MANAGEMENT;
		},
		isSalesTeamMember: function() {
			return this.userType == this.SALES_AGENT || this.userType == this.REMOTE_SALES_AGENT;
		},
		isOnlySalesAgent: function() {
			return this.userType == this.SALES_AGENT;
		},
		isOnlyRemoteAgent: function() {
			return this.userType == this.REMOTE_SALES_AGENT;
		},
		isOnlyAdmin: function() {
			return this.userType == this.ADMIN;
		},
	},
	methods: {
		...mapMutations(["openLoaderDialog", "closeLoaderDialog", "openSnackbar"]),
	},
};

export default defaultCRUDMixins;
