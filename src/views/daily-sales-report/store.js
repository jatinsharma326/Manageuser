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
		getDSR: ({ commit, dispatch }, payload) => {
			let URLparam = payload.reportType;
			delete payload.reportType;
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.DSR + "dsr/" + URLparam + "/",
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
						fail(data.message || "Failed to load All DSR List");
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
					fail(err.toString() || "Failed to All DSR List");
					return { ok: false, totalCount: 0, fetchCount: 0, list: [] };
				});
		},
		addDSR: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "post",
					data: payload,
					url: constants.DSR,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to add DSR Entry");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to add DSR Entry");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		editDSR: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "put",
					data: payload,
					url: constants.DSR,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to edit DSR entry");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to edit DSR Entry");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		deleteDSR: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "delete",
					data: payload,
					url: constants.DSR,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to Delete DSR Entry");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to Delete DSR Entry");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
	},
	getters: {},
};
