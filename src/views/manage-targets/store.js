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
		getGlobalSettings: ({ commit, dispatch }) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: {},
					url: constants.GLOBAL_SETTINGS,
				},
				{ root: true }
			)
				.then((data) => {
					if (data.ok) {
						return {
							ok: true,
							totalPaidLeaves: data.data.total_paid_leaves,
							activeCurrencies: data.data.active_currencies,
							policies: data.data.policies,
						};
					} else {
						fail(data.message || "Failed to load Admin Settings");
						return {
							ok: false,
							totalPaidLeaves: 0,
							activeCurrecies: [],
							policies: false,
						};
					}
				})
				.catch((err) => {
					console.log("Yo ", err);
					fail(err.toString() || "Failed to load Admin Settings");
					return {
						ok: false,
						totalPaidLeaves: 0,
						activeCurrecies: [],
						policies: false,
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
		updateGlobalSettings: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "put",
					data: payload,
					url: constants.GLOBAL_SETTINGS,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to edit Settings");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to edit Settings");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
	},
	getters: {},
};
