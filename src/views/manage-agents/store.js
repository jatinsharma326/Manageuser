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

		getPartnerEmployeesList: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.MANAGE_PARTNER_EMPLOYEES,
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
						fail(data.message || "Failed to Load Partner Employees List");
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
					fail(err.toString() || "Failed to Load Partner Employees List");
					return { ok: false, totalCount: 0, fetchCount: 0, list: [] };
				});
		},
		addPartnerEmployees: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "post",
					data: payload,
					url: constants.MANAGE_PARTNER_EMPLOYEES,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to add Partner Employees");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to add Partner Employees");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		editPartnerEmployees: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "put",
					data: payload,
					url: constants.MANAGE_PARTNER_EMPLOYEES,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to edit Partner Employee");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to edit Partner Employee");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		deletePartnerEmployees: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "delete",
					data: payload,
					url: constants.MANAGE_PARTNER_EMPLOYEES,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to Delete Partner Employee");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to edit Partner Employee");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
	},
	getters: {},
};
