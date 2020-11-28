import constants from "@/api";

const initialState = () => ({
	yearlyRevenueMainDate: [],
	yearlyRevenueFilter: {},
});
export default {
	namespaced: true,
	state: initialState(),
	mutations: {
		failure: (s, msg) => {
			console.log("[failure] ", msg);
		},
		resetState(state) {
			const initial = initialState();
			Object.keys(initial).forEach((key) => {
				state[key] = initial[key];
			});
		},
		setYearlyRevenueMainDate(state, data) {
			state.yearlyRevenueMainDate = data;
		},
		setYearlyRevenueFilter(state, data) {
			state.yearlyRevenueFilter = data;
		},
	},
	actions: {
		getTargets: ({ commit, dispatch }) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: {},
					url: constants.FINANCIAL_YEAR,
				},
				{ root: true }
			)
				.then((data) => {
					if (data.ok) {
						return {
							ok: true,
							list: data.data,
						};
					} else {
						fail(data.message || "Failed to load Targets");
						return {
							ok: false,
							list: [],
						};
					}
				})
				.catch((err) => {
					console.log("Yo ", err);
					fail(err.toString() || "Failed to load Targets");
					return {
						ok: false,
						list: [],
					};
				});
		},
	},
	getters: {
		yearlyRevenueMainDate: (state) => state.yearlyRevenueMainDate,
		yearlyRevenueFilter: (state) => state.yearlyRevenueFilter,
	},
};
