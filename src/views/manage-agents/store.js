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
		getChangelogsList: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.CHANGELOGS,
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
						fail(data.message || "Failed to load ChangeLogs List");
						return {
							ok: false,
							list: [],
						};
					}
				})
				.catch((err) => {
					console.log("Yo ", err);
					fail(err.toString() || "Failed to load ChangeLogs List");
					return { ok: false, totalCount: 0, fetchCount: 0, list: [] };
				});
		},
		getStatesList: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.ALL_STATES,
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
						fail(data.message || "Failed to load States List");
						return {
							ok: false,
							list: [],
						};
					}
				})
				.catch((err) => {
					console.log("Yo ", err);
					fail(err.toString() || "Failed to load States List");
					return { ok: false, totalCount: 0, fetchCount: 0, list: [] };
				});
		},

		getCompaniesList: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.TRAVEL_AGENT,
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
						fail(data.message || "Failed to load Target Agent List");
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
					fail(err.toString() || "Failed to load Target Agent List");
					return { ok: false, totalCount: 0, fetchCount: 0, list: [] };
				});
		},
		addCompany: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "post",
					data: payload,
					url: constants.TRAVEL_AGENT,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to add Target Agent");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to add Target Agent");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		editCompany: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "put",
					data: payload,
					url: constants.TRAVEL_AGENT,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to edit Target Agent");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to edit Target Agent");
					return {
						ok: false,
						message: err.message,
					};
				});
		},

		getAddressList: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.TRAVEL_AGENT_ADDRESS,
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
						fail(data.message || "Failed to Load Address List");
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
					fail(err.toString() || "Failed to Load Address List");
					return { ok: false, totalCount: 0, fetchCount: 0, list: [] };
				});
		},
		addAddress: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "post",
					data: payload,
					url: constants.TRAVEL_AGENT_ADDRESS,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to add Address");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to add Address");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		editAddress: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "put",
					data: payload,
					url: constants.TRAVEL_AGENT_ADDRESS,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to edit Address");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to edit Address");
					return {
						ok: false,
						message: err.message,
					};
				});
		},

		getCompanyEmployeeList: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.TRAVEL_AGENT_EMPLOYEES,
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
						fail(data.message || "Failed to Load Travel Agent Employee List");
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
					fail(err.toString() || "Failed to Load Travel Agent Employee List");
					return { ok: false, totalCount: 0, fetchCount: 0, list: [] };
				});
		},
		addCompanyEmployee: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "post",
					data: payload,
					url: constants.TRAVEL_AGENT_EMPLOYEES,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to add Travel Agent Employee");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to add Travel Agent Employee");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		editCompanyEmployee: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "put",
					data: payload,
					url: constants.TRAVEL_AGENT_EMPLOYEES,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to edit Travel Agent Employee");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to edit Travel Agent Employee");
					return {
						ok: false,
						message: err.message,
					};
				});
		},

		getFamTripList: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.FAM_TRIP,
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
						fail(data.message || "Failed to Load Travel Agent Employee List");
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
					fail(err.toString() || "Failed to Load Travel Agent Employee List");
					return { ok: false, totalCount: 0, fetchCount: 0, list: [] };
				});
		},
		addFamTrip: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "post",
					data: payload,
					url: constants.FAM_TRIP,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to add Travel Agent Employee");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to add Travel Agent Employee");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		editFamTrip: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "put",
					data: payload,
					url: constants.FAM_TRIP,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to edit Travel Agent Employee");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to edit Travel Agent Employee");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		deleteFamTrip: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "delete",
					data: payload,
					url: constants.FAM_TRIP,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to Delete Fam Trip");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to Delete Fam Trip");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
	},
	getters: {},
};
