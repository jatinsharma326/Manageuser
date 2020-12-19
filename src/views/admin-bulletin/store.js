import constants from "@/api";
import helpers from "../../components/helpers";

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
		getAdminBulletin: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.ADMIN_BULLETIN,
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
						fail(data.message || "Failed to load All AdminBulletin List");
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
					fail(err.toString() || "Failed to All AdminBulletin List");
					return { ok: false, totalCount: 0, fetchCount: 0, list: [] };
				});
		},
		addAdminBulletin: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "post",
					data: payload,
					url: constants.ADMIN_BULLETIN,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to add AdminBulletin Entry");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to add AdminBulletin Entry");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		editAdminBulletin: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "put",
					data: payload,
					url: constants.ADMIN_BULLETIN,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to edit AdminBulletin entry");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to edit AdminBulletin Entry");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		deleteAdminBulletin: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "delete",
					data: payload,
					url: constants.ADMIN_BULLETIN,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to Delete AdminBulletin Entry");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to Delete AdminBulletin Entry");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
	},
	getters: {},
};
