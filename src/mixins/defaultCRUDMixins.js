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
			if (userType == ADMIN || userType == MANAGEMENT) {
				return true;
			} else {
				return false;
			}
		},
		isSalesTeamMember: function() {
			if (userType == SALES_AGENT || userType == REMOTE_SALES_AGENT) {
				return true;
			} else {
				return false;
			}
		},
	},
	methods: {
		...mapMutations(["openLoaderDialog", "closeLoaderDialog", "openSnackbar"]),
	},
};

export default defaultCRUDMixins;
