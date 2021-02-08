import Search from "../components/Search.vue";
import { mapMutations } from "vuex";

const searchMixins = {
	components: {
		Search,
	},
	data: () => ({
		pageSize: 100,
		pageNo: 1,
		totalCount: 0,
		fetchCount: 0,
		showErrorMessage: false,
		errorMessage: "",
		selectedSearchConfig: [],
		paginationTotalVisible: 7,
		// pageSizeList: [2, 4, 6, 8, 10],
		pageSizeList: [20, 40, 60, 80, 100],
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
		updatedPageNo(page) {
			this.getData();
		},
		queryString(data) {
			this.filter["search_text"] = data;
			this.getData();
		},
	},
	watch: {
		pageSize: function(nv, ov) {
			if (nv != ov) {
				this.pageNo = 1;
				this.getData();
			}
		},
	},
};

export default searchMixins;
