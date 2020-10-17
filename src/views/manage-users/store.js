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
    getUserList: ({ commit, dispatch }, payload) => {
      let fail = (msg) => commit("failure", msg);
      return dispatch(
        "apiCall",
        {
          method: "get",
          params: payload,
          url: constants.MANAGE_USERS,
        },
        { root: true }
      )
        .then((data) => {
          if (data.ok) {
            return {
              ok: true,
              totalCount: data.totalCount,
              fetchCount: data.fetchCount,
              userList: data.data,
            };
          } else {
            fail(data.message || "Failed to load User List");
            return {
              ok: false,
              totalCount: data.totalCount,
              fetchCount: 0,
              userList: [],
            };
          }
        })
        .catch((err) => {
          console.log("Yo ", err);
          fail(err.toString() || "Failed to load User List");
          return { ok: false, totalCount: 0, fetchCount: 0, userList: [] };
        });
    },
    addUser: ({ commit, dispatch }, payload) => {
      let fail = (msg) => commit("failure", msg);
      return dispatch(
        "apiCall",
        {
          method: "post",
          data: payload,
          url: constants.MANAGE_USERS,
        },
        { root: true }
      )
        .then((data) => {
          if (!data.ok) fail(data.message || "Failed to add master data rows");
          return data;
        })
        .catch((err) => {
          fail(err.toString() || "Failed to add master data rows");
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
