import constants from "@/api";

const initialState = () => ({
	yearlyRevenueMainDate: [],
	yearlyRevenueFilter: {},
	currentTab: null,
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
		setCurrentTab(state, data) {
			state.currentTab = data;
		},
	},
	actions: {
		getYearlyComparison: ({ commit, dispatch }, params) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: params,
					url: constants.YEARLY_COMPARISON,
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
		getYearlyZone: ({ commit, dispatch }, params) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: params,
					url: constants.YEARLY_ZONE,
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
		currentTab: (state) => state.currentTab,
	},
};
