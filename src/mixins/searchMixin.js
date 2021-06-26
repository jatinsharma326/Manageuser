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
		// This computed function divides the fetchcount with the pagesize to determine if pagination needs to be displayed or not.
		isPaginationRequired: function() {
			return !(this.fetchCount / this.pageSize <= 1);
		},
	},
	methods: {
		...mapMutations(["openSnackbar"]),

		// 4))) This function is used for finding out the error within a certain condition
		checkForErrorMessage(data, key) {
			if (data.totalCount === 0 && data.ok) {
				// Enters This condition when theres no data in the database, hence totalcount = 0 and data is 'ok' which means there was no errors in fetching the data
				// 3)) It means that their is no data so according the situation you will trigger the solution
				this.showErrorMessage = true;
				this.errorMessage = "No data found.";
				return null;
				// 6))) If their is no fetching of the data then we can say that retry their is no data regarding what you search
			} else if (data.fetchCount === 0 && data.ok) {
				// Enters This condition when theres is data in the database but still nothing was fetched, for example when we filter things when we use advance search, hence fetchcount = 0 and data is 'ok' which means there is no errors in fetching the data
				this.showErrorMessage = true;
				this.errorMessage = "No Results for your Search. Please try again.";
				return null;	
			} 
			// If their comes an error while fetching the data then this type of error occurs 
			else if (!data.ok) {
				// Enters This condition data.ok is set to false which means there was an error while fetching the data
				this.openSnackbar({ text: `Failed to Fetch ${key} Data` });
				this.showErrorMessage = true;
				this.errorMessage = `Failed to Fetch ${key} Data. Please Refresh`;
				return null;
			} else {
			// 7)))	// Enters This condition when Everything is fine
				// Collect the information if everything is ok
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
			this.pageNo = 1;
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
