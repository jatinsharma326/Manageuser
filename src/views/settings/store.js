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
    uploadPolicies: ({ commit, dispatch }, payload) => {
      let fail = (msg) => commit("failure", msg);
      return dispatch(
        "apiCallWithHeaderConfig",
        {
          partConfig: {
            method: "post",
            data: payload,
            url: constants.GLOBAL_SETTINGS_POLICIES,
          },
          headerConfig: {
            "Content-Type": "multipart/form-data",
          },
        },
        { root: true }
      )
        .then((data) => {
          if (!data.ok) fail(data.message || "Failed to add Partner");
          return data;
        })
        .catch((err) => {
          fail(err.toString() || "Failed to add Partner");
          return {
            ok: false,
            message: err.message,
          };
        });
    },
    downloadPolicies: ({ commit, dispatch }) => {
      let fail = (msg) => commit("failure", msg);
      return dispatch(
        "fileDownload_API_Call",
        {
          method: "get",
          params: {},
          url: constants.GLOBAL_SETTINGS_POLICIES,
          responseType: "blob",
        },
        { root: true }
      )
        .then(({ data, response }) => {
          if (response.status === 200) {
            commit(
              "openSnackbar",
              { text: "Starting Download" },
              { root: true }
            );
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "policies.pdf"); //or any other extension
            document.body.appendChild(link);
            link.click();
            return;
          } else {
            commit(
              "openSnackbar",
              { text: "Could not start download" },
              { root: true }
            );
            fail(data.message || "Failed to start download");
            return;
          }
        })
        .catch((err) => {
          console.log("Yo ", err);
          commit(
            "openSnackbar",
            { text: "Could not start download" },
            { root: true }
          );
          fail(err.toString() || "Failed to Download Core Data File");
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
