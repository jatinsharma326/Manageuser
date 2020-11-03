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
		getAllLeaves: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.ALL_SALES_LEAVES,
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
						fail(data.message || "Failed to load All Leaves List");
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
					fail(err.toString() || "Failed to All Leaves List");
					return { ok: false, totalCount: 0, fetchCount: 0, list: [] };
				});
		},
		getSalesLeaves: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.SALES_LEAVES,
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
						fail(data.message || "Failed to load Leaves List");
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
					fail(err.toString() || "Failed to load Leaves List");
					return { ok: false, totalCount: 0, fetchCount: 0, list: [] };
				});
		},
		getPendingLeaves: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.PENDING_LEAVES,
				},
				{ root: true }
			)
				.then((data) => {
					console.log("Test Console Pending Leaves", data);
					if (data.ok) {
						return {
							ok: true,
							pendingLeaves: data.pending_leaves,
						};
					} else {
						fail(data.message || "Failed to load Leaves List");
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
					fail(err.toString() || "Failed to load Leaves List");
					return { ok: false, totalCount: 0, fetchCount: 0, list: [] };
				});
		},
		updateStatus: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "put",
					data: payload,
					url: constants.ALL_SALES_LEAVES,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to edit Leave");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to edit Leave");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		addLeave: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "post",
					data: payload,
					url: constants.SALES_LEAVES,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to add Leave Entry");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to add Leave Entry");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		editLeave: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "put",
					data: payload,
					url: constants.SALES_LEAVES,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to edit Leave entry");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to edit Leave Entry");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		deleteLeave: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "delete",
					data: payload,
					url: constants.SALES_LEAVES,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to Delete Leave");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to Delete Leave");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
	},
	getters: {
		// masterData: (state) => state.masterData,
		// masterDataCount: (state) => state.masterDataCount,
	},
};
