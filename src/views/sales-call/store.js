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
		getSalesCall: ({ commit, dispatch }, payload) => {
			let URLparam = payload.callType;
			delete payload.callType;
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.SALES_CALLS + URLparam + "/",
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
						fail(data.message || "Failed to load All SalesCalls List");
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
					fail(err.toString() || "Failed to All SalesCalls List");
					return { ok: false, totalCount: 0, fetchCount: 0, list: [] };
				});
		},
		addSalesCall: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "post",
					data: payload,
					url: constants.SALES_CALLS,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to add SalesCall Entry");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to add SalesCall Entry");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		editSalesCall: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "put",
					data: payload,
					url: constants.SALES_CALLS,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to edit SalesCall entry");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to edit SalesCall Entry");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		deleteSalesCall: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "delete",
					data: payload,
					url: constants.SALES_CALLS,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to Delete SalesCall");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to Delete SalesCall");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		checkCallDetail: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.DUPLICATE_CALL_WARNING,
				},
				{ root: true }
			)
				.then((data) => {
					// console.log("Test Console Warning Main API", data);
					if (data.ok) {
						return {
							ok: true,
							data: data.data,
						};
					} else {
						fail(data.message || "Failed to get Employee Details");
						return {
							ok: false,
							data: {},
						};
					}
				})
				.catch((err) => {
					console.log("Yo ", err);
					fail(err.toString() || "Failed to get Employee Details");
					return { ok: false, data: {} };
				});
		},
	},
	getters: {
		// masterData: (state) => state.masterData,
		// masterDataCount: (state) => state.masterDataCount,
	},
};
