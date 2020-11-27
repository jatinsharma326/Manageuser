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
		getTargets: ({ commit, dispatch }) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: {},
					url: constants.FINANCIAL_YEAR,
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
		addTargetYear: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "post",
					data: payload,
					url: constants.FINANCIAL_YEAR,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to add target year");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to add target year");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		editTargetYear: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "put",
					data: payload,
					url: constants.FINANCIAL_YEAR,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to edit Target year");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to edit target year");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		deleteTargetYear: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "delete",
					data: payload,
					url: constants.FINANCIAL_YEAR,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to Delete Target Year");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to Delete Target Year");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		getActiveCountries: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.ACTIVE_COUNTRIES,
				},
				{ root: true }
			)
				.then((data) => {
					console.log(data);
					if (data.ok) {
						return {
							ok: true,
							list: data.countries,
						};
					} else {
						fail(data.message || "Failed to fetch Product List");
						return {
							ok: false,
							list: [],
						};
					}
				})
				.catch((err) => {
					console.log("Yo ", err);
					fail(err.toString() || "Failed to fetch Product List");
					return {
						ok: false,
						list: [],
					};
				});
		},
		getTargetsForYear: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.FINANCIAL_YEAR_TARGETS,
				},
				{ root: true }
			)
				.then((data) => {
					console.log(data);
					if (data.ok) {
						return {
							ok: true,
							list: data.data,
							fetchCount: data.fetchCount,
						};
					} else {
						fail(data.message || "Failed to load Targets");
						return {
							ok: false,
							list: [],
							fetchCount: 0,
						};
					}
				})
				.catch((err) => {
					console.log("Yo ", err);
					fail(err.toString() || "Failed to load Targets");
					return {
						ok: false,
						list: [],
						fetchCount: 0,
					};
				});
		},
		addTargetForYear: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "post",
					data: payload,
					url: constants.FINANCIAL_YEAR_TARGETS,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to add target");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to add target");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		editTargetForYear: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "put",
					data: payload,
					url: constants.FINANCIAL_YEAR_TARGETS,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to edit Target");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to edit Target");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		deleteTargetForYear: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "delete",
					data: payload,
					url: constants.FINANCIAL_YEAR_TARGETS,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to Delete Target Row");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to Delete Target Year Row");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
	},
	getters: {},
};
