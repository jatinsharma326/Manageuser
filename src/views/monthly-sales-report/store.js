import constants from "@/api";

const initialState = () => ({});
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
	},
	actions: {
		getMonthList: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.MSR,
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
						fail(data.message || "Failed to load Partner List");
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
					fail(err.toString() || "Failed to load Partner List");
					return { ok: false, totalCount: 0, fetchCount: 0, list: [] };
				});
		},
		getReportList: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.MSR_REPORT_LIST,
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
						fail(data.message || "Failed to load MSR Report List");
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
					fail(err.toString() || "Failed to load MSR Report List");
					return { ok: false, totalCount: 0, fetchCount: 0, list: [] };
				});
		},
		addReportMonth: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "post",
					data: payload,
					url: constants.MSR,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to add Partner");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to add Partner");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		editReportMonth: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "put",
					data: payload,
					url: constants.MSR,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to edit Partner");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to edit Partner");
					return {
						ok: false,
						message: err.message,
					};
				});
		},

		// getPartnerEmployeesList: ({ commit, dispatch }, payload) => {
		// 	let fail = (msg) => commit("failure", msg);
		// 	return dispatch(
		// 		"apiCall",
		// 		{
		// 			method: "get",
		// 			params: payload,
		// 			url: constants.MANAGE_PARTNER_EMPLOYEES,
		// 		},
		// 		{ root: true }
		// 	)
		// 		.then((data) => {
		// 			if (data.ok) {
		// 				return {
		// 					ok: true,
		// 					totalCount: data.totalCount,
		// 					fetchCount: data.fetchCount,
		// 					list: data.data,
		// 				};
		// 			} else {
		// 				fail(data.message || "Failed to Load Partner Employees List");
		// 				return {
		// 					ok: false,
		// 					totalCount: data.totalCount,
		// 					fetchCount: 0,
		// 					list: [],
		// 				};
		// 			}
		// 		})
		// 		.catch((err) => {
		// 			console.log("Yo ", err);
		// 			fail(err.toString() || "Failed to Load Partner Employees List");
		// 			return { ok: false, totalCount: 0, fetchCount: 0, list: [] };
		// 		});
		// },
	},
	getters: {
		// masterData: (state) => state.masterData,
		// masterDataCount: (state) => state.masterDataCount,
	},
};
