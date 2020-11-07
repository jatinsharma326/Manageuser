import constants from "@/api";

const initialState = () => ({
	addressList: [],
	employeesList: [],
});
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
		setAddressList(state, data) {
			state.addressList = data;
		},
		setEmployeeList(state, data) {
			state.employeesList = data;
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

		getUploadLogs: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.BULK_UPLOAD_LOGS,
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
						fail(data.message || "Failed to load upload Logs List");
						return {
							ok: false,
							totalCount: 0,
							fetchCount: 0,
							list: [],
						};
					}
				})
				.catch((err) => {
					console.log("Yo ", err);
					fail(err.toString() || "Failed to load upload Logs List");
					return { ok: false, totalCount: 0, fetchCount: 0, list: [] };
				});
		},
		getInputFileURL: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.BULK_UPLOAD_INPUT_FILE,
				},
				{ root: true }
			)
				.then((data) => {
					if (data.ok) {
						return {
							ok: true,
							url: data.url,
						};
					} else {
						fail(data.message || "Failed to load upload Logs List");
						return {
							ok: false,
							url: "",
						};
					}
				})
				.catch((err) => {
					console.log("Yo ", err);
					fail(err.toString() || "Failed to load upload Logs List");
					return { ok: false, url: "" };
				});
		},

		uploadTravelAgents: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCallWithHeaderConfig",
				{
					partConfig: {
						method: "post",
						data: payload,
						url: constants.UPLOAD_TRAVEL_AGENT_FILE,
					},
					headerConfig: {
						"Content-Type": "multipart/form-data",
					},
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to upload travel agent file");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to upload travel agent file");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		spawnProcess: ({ commit, dispatch }) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					data: {},
					url: constants.SPAWN_PROCESS,
				},
				{ root: true }
			)
				.then((data) => {
					if (data.ok) {
						return data;
					} else {
						fail(data.message || "Failed spawn process");
						return { ok: false };
					}
				})
				.catch((err) => {
					console.log("Yo ", err);
					fail(err.toString() || "Failed spawn process");
					return { ok: false };
				});
		},
		deleteSpawnProcess: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "post",
					data: payload,
					url: constants.BULK_UPLOAD_DELETE_SPAWN,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to delete Spawn Process");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to delete Spawn Process");
					return {
						ok: false,
						message: err.message,
					};
				});
		},

		// change URL for the below API call
		downloadErrorFile: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"fileDownload_API_Call",
				{
					method: "get",
					params: {},
					params: payload,
					url: constants.BULK_UPLOAD_ERROR_FILE,
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
						link.setAttribute("download", "Errors.xlsx"); //or any other extension
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
					fail(err.toString() || "Failed to Download Core Data File");
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

		checkEmployeeDetail: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.DUPLICATE_DATA_WARNING,
				},
				{ root: true }
			)
				.then((data) => {
					console.log("Test Console Warning Main API", data);
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
	getters: {
		storeAddressList: (state) => state.addressList,
		storeEmployeesList: (state) => state.employeesList,
	},
};
