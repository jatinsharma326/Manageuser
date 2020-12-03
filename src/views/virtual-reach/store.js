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
		getActiveCurrencies: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.ACTIVE_CURRENCIES,
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
						fail(data.message || "Failed to load All FollowUp List");
						return {
							ok: false,
							list: [],
						};
					}
				})
				.catch((err) => {
					console.log("Yo ", err);
					fail(err.toString() || "Failed to All FollowUp List");
					return { ok: false, list: [] };
				});
		},
		getCitiesList: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.ALL_CITIES,
				},
				{ root: true }
			)
				.then((data) => {
					if (data.ok) {
						return {
							ok: true,
							list: data.data,
							fetchCount: data.fetchCount,
							totalCount: data.totalCount,
						};
					} else {
						fail(data.message || "Failed to load Cities List");
						return {
							ok: false,
							list: [],
						};
					}
				})
				.catch((err) => {
					console.log("Yo ", err);
					fail(err.toString() || "Failed to load Cities List");
					return { ok: false, totalCount: 0, fetchCount: 0, list: [] };
				});
		},
		getFollowUp: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.FOLLOW_UP,
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
						fail(data.message || "Failed to load All FollowUp List");
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
					fail(err.toString() || "Failed to All FollowUp List");
					return { ok: false, totalCount: 0, fetchCount: 0, list: [] };
				});
		},
		addFollowUp: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "post",
					data: payload,
					url: constants.FOLLOW_UP,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to add FollowUp Entry");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to add FollowUp Entry");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		editFollowUp: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "put",
					data: payload,
					url: constants.FOLLOW_UP,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to edit FollowUp entry");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to edit FollowUp Entry");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		deleteFollowUp: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "delete",
					data: payload,
					url: constants.FOLLOW_UP,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to Delete FollowUp Entry");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to Delete FollowUp Entry");
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
