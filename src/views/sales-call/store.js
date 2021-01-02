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
		getSalesCall: ({ commit, dispatch }, payload) => {
			let URLparam = payload.callType;
			delete payload.callType;
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.SALES_CALLS + "sales-calls/" + URLparam + "/",
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
		downloadSalesCall: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);

			let fileName =
				"Sales from " +
				helpers.getFormattedDate(payload.filter.date_from, "YYYY-MM-DD") +
				" to " +
				helpers.getFormattedDate(payload.filter.date_to, "YYYY-MM-DD");
			let URLparam = payload.callType;

			delete payload.callType;
			// delete payload.date_from;
			// delete payload.date_to;

			return dispatch(
				"fileDownload_API_Call",
				{
					method: "get",
					params: payload,
					url: constants.DOWNLOAD_SALES_CALLS + "/" + URLparam + "/",
					responseType: "blob",
				},
				{ root: true }
			)
				.then(({ data, response }) => {
					if (response.status === 200) {
						commit("openSnackbar", { text: "Starting Download" }, { root: true });
						const url = window.URL.createObjectURL(new Blob([data]));
						const link = document.createElement("a");
						link.href = url;
						link.setAttribute("download", fileName + ".xlsx");
						document.body.appendChild(link);
						link.click();
						return;
					} else {
						commit("openSnackbar", { text: "Could not start download" }, { root: true });
						fail(data.message || "Failed to start download");
						return;
					}
				})
				.catch((err) => {
					console.log("Yo ", err);
					commit("openSnackbar", { text: "Could not start download" }, { root: true });
					fail(err.toString() || "Failed to Download Sales Call File");
				});
		},
	},
	getters: {},
};
