import Search from "../components/Search.vue";
import { mapMutations } from "vuex";

const searchMixins = {
	components: {
		Search,
	},
	data: () => ({
		pageSize: 20,
		pageNo: 1,
		totalCount: 0,
		fetchCount: 0,
		showErrorMessage: false,
		errorMessage: "",
		selectedSearchConfig: [],
		filter: {},
		search_text: "",
	}),
	computed: {
		isPaginationRequired: function() {
			return !(this.fetchCount / this.pageSize <= 1);
		},
	},
	methods: {
		...mapMutations(["openSnackbar"]),
		checkForErrorMessage(data, key) {
			if (data.totalCount === 0 && data.ok) {
				this.showErrorMessage = true;
				this.errorMessage = "No data found.";
				return null;
			} else if (data.fetchCount === 0 && data.ok) {
				this.showErrorMessage = true;
				this.errorMessage = "No Results for your Search. Please try again.";
				return null;
			} else if (!data.ok) {
				this.openSnackbar({ text: `Failed to Fetch ${key} Data` });
				this.showErrorMessage = true;
				this.errorMessage = `Failed to Fetch ${key} Data. Please Refresh`;
				return null;
			} else {
				this.showErrorMessage = false;
				this.totalCount = data.totalCount;
				this.fetchCount = data.fetchCount;
				return data.list;
			}
		},
	},
};

export default searchMixins;
