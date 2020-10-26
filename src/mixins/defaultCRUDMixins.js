import InformationCard from "../components/InformationCard.vue";
import Search from "../components/Search.vue";
import UserForm from "../components/Form";
import ViewMoreModal from "../components/ViewMoreModal";
import { mapActions, mapGetters, mapMutations } from "vuex";
import helpers from "../components/helpers";

const defaultCRUDMixins = {
	components: {
		InformationCard,
		Search,
		UserForm,
		ViewMoreModal,
	},
	data: () => ({
		pageSize: 20,
		pageNo: 1,
		totalCount: 0,
		fetchCount: 0,
		toggleForm: false,
		isEditMode: false,
		rowToEdit: {},
		viewMoreModal: false,
		selectedSearchConfig: [],
		filter: {},
	}),
	computed: {
		...mapGetters(["REMOTE_SALES_AGENT", "SALES_AGENT", "MANAGEMENT", "ADMIN", "userType"]),
	},
	methods: {
		...mapMutations(["openLoaderDialog", "closeLoaderDialog", "openSnackbar"]),
		openInputForm(mode = false, data = {}) {
			this.isEditMode = mode;
			if (this.isEditMode) {
				this.rowToEdit = this.getEditRowObject(data);
			}
			this.toggleForm = true;
		},
		closeForm() {
			this.rowToEdit = {};
			this.isEditMode = false;
			this.toggleForm = false;
		},
		getFormattedDate(date, format = "DD/MM/YYYY") {
			return helpers.getFormattedDate(date, format);
		},
	},
};

export default defaultCRUDMixins;
