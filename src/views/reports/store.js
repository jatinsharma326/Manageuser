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
		getTravelAgentReport: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.TRAVEL_AGENT_REPORT,
				},
				{ root: true }
			)
				.then((data) => {
					if (data.ok) {
						return {
							ok: true,
							totalCount: data.totalCount,
							fetchCount: data.fetchCount,
							list: data.data,
						};
					} else {
						fail(data.message || "Failed to load Agencywise Reports List");
						return {
							ok: false,
							totalCount: data.totalCount,
							fetchCount: 0,
							list: [],
						};
					}
				})
				.catch((err) => {
					console.log("Yo ", err);
					fail(err.toString() || "Failed to load Agencywise Reports List");
					return { ok: false, totalCount: 0, fetchCount: 0, list: [] };
				});
		},
		getTargetReport: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.TARGET_REPORT,
				},
				{ root: true }
			)
				.then((data) => {
					if (data.ok) {
						return {
							ok: true,
							totalCount: data.totalCount,
							fetchCount: data.fetchCount,
							list: data.data,
						};
					} else {
						fail(data.message || "Failed to load Agencywise Reports List");
						return {
							ok: false,
							totalCount: data.totalCount,
							fetchCount: 0,
							list: [],
						};
					}
				})
				.catch((err) => {
					console.log("Yo ", err);
					fail(err.toString() || "Failed to load Agencywise Reports List");
					return { ok: false, totalCount: 0, fetchCount: 0, list: [] };
				});
		},
	},
	getters: {
		yearlyRevenueMainDate: (state) => state.yearlyRevenueMainDate,
		yearlyRevenueFilter: (state) => state.yearlyRevenueFilter,
		currentTab: (state) => state.currentTab,
	},
};
