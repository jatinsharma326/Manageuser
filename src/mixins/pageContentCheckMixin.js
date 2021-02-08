import { mapMutations } from "vuex";

const pageContentCheckMixin = {
	components: {},
	data: () => ({
		pageSize: 100,
		pageNo: 1,
		totalCount: 0,
		fetchCount: 0,
		showErrorMessage: false,
		errorMessage: "",
	}),
	computed: {
		// This computed function divides the fetchcount with the pagesize to determine if pagination needs to be displayed or not.
		isPaginationRequired: function() {
			return !(this.fetchCount / this.pageSize <= 1);
		},
	},
	methods: {
		...mapMutations(["openSnackbar"]),
		checkForErrorMessage(data, key) {
			if (data.totalCount === 0 && data.ok) {
				// Enters This condition when theres no data in the database, hence totalcount = 0 and data is 'ok' which means there was no errors in fetching the data
				this.showErrorMessage = true;
				this.errorMessage = `No data in the database. Please add a ${key}`;
				return null;
			} else if (data.fetchCount === 0 && data.ok) {
				// Enters This condition when theres is data in the database but still nothing was fetched, for example when we filter things when we use advance search, hence fetchcount = 0 and data is 'ok' which means there is no errors in fetching the data
				this.showErrorMessage = true;
				this.errorMessage = "No Results for your Search. Please try again";
				return null;
			} else if (!data.ok) {
				// Enters This condition data.ok is set to false which means there was an error while fetching the data
				this.openSnackbar({ text: `Failed to Fetch ${key} Data` });
				this.showErrorMessage = true;
				this.errorMessage = `Failed to Fetch ${key} Data. Please Refresh`;
				return null;
			} else {
				// Enters This condition when Everything is fine
				this.showErrorMessage = false;
				this.totalCount = data.totalCount;
				this.fetchCount = data.fetchCount;
				return data.list;
			}
		},
	},
};

export default pageContentCheckMixin;
