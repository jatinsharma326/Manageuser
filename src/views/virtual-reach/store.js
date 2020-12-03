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
		getVirtualReach: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.VIRTUAL_REACH,
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
						fail(data.message || "Failed to load All VirtualReach List");
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
					fail(err.toString() || "Failed to All VirtualReach List");
					return { ok: false, totalCount: 0, fetchCount: 0, list: [] };
				});
		},
		addVirtualReach: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "post",
					data: payload,
					url: constants.VIRTUAL_REACH,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to add VirtualReach Entry");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to add VirtualReach Entry");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		editVirtualReach: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "put",
					data: payload,
					url: constants.VIRTUAL_REACH,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to edit VirtualReach entry");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to edit VirtualReach Entry");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		deleteVirtualReach: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "delete",
					data: payload,
					url: constants.VIRTUAL_REACH,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to Delete VirtualReach Entry");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to Delete VirtualReach Entry");
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
