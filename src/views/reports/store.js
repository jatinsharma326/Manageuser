import constants from "@/api";
import helpers from "../../components/helpers";

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
		downloadYearlyRawReport: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			let fileName = "Raw Data";
			return dispatch(
				"fileDownload_API_Call",
				{
					method: "get",
					params: payload,
					url: constants.YEARLY_REVENUE_RAW_DOWNLOAD,
					responseType: "blob",
				},
				{ root: true }
			)
				.then(({ data, response }) => {
					if (response.status === 200) {
						commit("openSnackbar", { text: "Starting Download" }, { root: true });
						const url = window.URL.createObjectURL(new Blob([data]));
						const link = document.createElement("a");
						link.href = url;
						link.setAttribute("download", "Yearly Revenue Raw Data.xlsx");
						document.body.appendChild(link);
						link.click();
						return;
					} else {
						commit("openSnackbar", { text: "Could not start download" }, { root: true });
						fail(data.message || "Failed to start download");
						return;
					}
				})
				.catch((err) => {
					console.log("Yo ", err);
					commit("openSnackbar", { text: "Could not start download" }, { root: true });
					fail(err.toString() || "Failed to Download Report File");
				});
		},
		downloadYearlyComparisonReport: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			let fileName =
				"Comparison report ( " +
				helpers.getFormattedDate(payload.comparison_date_from, "YYYY-MM") +
				"_" +
				helpers.getFormattedDate(payload.comparison_date_to, "YYYY-MM") +
				" to " +
				helpers.getFormattedDate(payload.selection_date_from, "YYYY-MM") +
				"_" +
				helpers.getFormattedDate(payload.selection_date_to, "YYYY-MM") +
				" )";

			return dispatch(
				"fileDownload_API_Call",
				{
					method: "get",
					params: payload,
					url: constants.YEARLY_REVENUE_COMPARISON_DOWNLOAD,
					responseType: "blob",
				},
				{ root: true }
			)
				.then(({ data, response }) => {
					if (response.status === 200) {
						commit("openSnackbar", { text: "Starting Download" }, { root: true });
						const url = window.URL.createObjectURL(new Blob([data]));
						const link = document.createElement("a");
						link.href = url;
						link.setAttribute("download", "Yearly Revenue " + fileName + ".xlsx");
						document.body.appendChild(link);
						link.click();
						return;
					} else {
						commit("openSnackbar", { text: "Could not start download" }, { root: true });
						fail(data.message || "Failed to start download");
						return;
					}
				})
				.catch((err) => {
					console.log("Yo ", err);
					commit("openSnackbar", { text: "Could not start download" }, { root: true });
					fail(err.toString() || "Failed to Download Report File");
				});
		},
		downloadYearlyZoneReport: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			let fileName =
				"Zone report from " +
				helpers.getFormattedDate(payload.selection_date_from, "YYYY-MM") +
				" to " +
				helpers.getFormattedDate(payload.selection_date_to, "YYYY-MM");

			return dispatch(
				"fileDownload_API_Call",
				{
					method: "get",
					params: payload,
					url: constants.YEARLY_REVENUE_ZONE_DOWNLOAD,
					responseType: "blob",
				},
				{ root: true }
			)
				.then(({ data, response }) => {
					if (response.status === 200) {
						commit("openSnackbar", { text: "Starting Download" }, { root: true });
						const url = window.URL.createObjectURL(new Blob([data]));
						const link = document.createElement("a");
						link.href = url;
						link.setAttribute("download", "Yearly Revenue " + fileName + ".xlsx");
						document.body.appendChild(link);
						link.click();
						return;
					} else {
						commit("openSnackbar", { text: "Could not start download" }, { root: true });
						fail(data.message || "Failed to start download");
						return;
					}
				})
				.catch((err) => {
					console.log("Yo ", err);
					commit("openSnackbar", { text: "Could not start download" }, { root: true });
					fail(err.toString() || "Failed to Download Report File");
				});
		},
		downloadAgencyWiseReport: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			let fileName = "complete Report";
			if (payload.isCityGroup) {
				fileName = "city wise Report";
			}
			if (payload.isZoneGroup) {
				fileName = "city wise Report";
			}

			return dispatch(
				"fileDownload_API_Call",
				{
					method: "get",
					params: payload,
					url: constants.AGENCY_WISE_DOWNLOAD,
					responseType: "blob",
				},
				{ root: true }
			)
				.then(({ data, response }) => {
					if (response.status === 200) {
						commit("openSnackbar", { text: "Starting Download" }, { root: true });
						const url = window.URL.createObjectURL(new Blob([data]));
						const link = document.createElement("a");
						link.href = url;
						link.setAttribute("download", "Travel Agent Revenue " + fileName + ".xlsx");
						document.body.appendChild(link);
						link.click();
						return;
					} else {
						commit("openSnackbar", { text: "Could not start download" }, { root: true });
						fail(data.message || "Failed to start download");
						return;
					}
				})
				.catch((err) => {
					console.log("Yo ", err);
					commit("openSnackbar", { text: "Could not start download" }, { root: true });
					fail(err.toString() || "Failed to Download Report File");
				});
		},
	},
	getters: {
		yearlyRevenueMainDate: (state) => state.yearlyRevenueMainDate,
		yearlyRevenueFilter: (state) => state.yearlyRevenueFilter,
		currentTab: (state) => state.currentTab,
	},
};
