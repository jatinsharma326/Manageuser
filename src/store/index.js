import Vue from "vue";
import Vuex from "vuex";

import axios from "axios";
import constants from "@/api";

import UserManagement from "../views/manage-users/store";

Vue.use(Vuex);

let apiErrorFunction = ({ err, commit, reject }) => {
  // console.log("[HTTP API Request Error]", err);
  if (err.message == "Network Error") {
    commit("openSnackbar", { text: "Network Error" });
    console.error("Network Error");
  } else if (err.response.status == 401) {
    localStorage.clear();
    commit("resetState");
  } else if (err.response.status == 400) {
    commit("openSnackbar", {
      text: err.response.data.message || "Request Failed, please try again",
    });
  } else if (err.response.status == 500) {
    console.error("Internal SERVER ERROR");
  } else {
    commit("openSnackbar", {
      text: "Request Failed, please try again",
    });
  }
  reject({
    ok: false,
    err,
    message: err.response.data.message || "Request Failed, please try again",
  });
};

const initialState = () => ({
  loaderDialog: false,
  snackbarState: false,
  snackbarText: "",
  snackbarTime: 2000,
  // userType: false,
  userType: 10,
  authToken: "",
  refreshToken: "",
  currentState: {},
  auth: false,
  userData: {},
  messages: {
    loginFailed: "",
    failure: "",
  },
  uploadPercentage: 0,
  REMOTE_SALES_AGENT: 40,
  SALES_AGENT: 30,
  MANAGEMENT: 20,
  ADMIN: 10,
});

export default new Vuex.Store({
  modules: {
    UserManagement,
  },

  state: initialState(),

  mutations: {
    openLoaderDialog(s) {
      s.loaderDialog = true;
    },
    closeLoaderDialog(s) {
      s.loaderDialog = false;
    },
    openSnackbar(s, { text = "", time = 3000 } = {}) {
      s.snackbarTime = time;
      s.snackbarText = text;
      s.snackbarState = true;
    },
    closeSnackbar(s) {
      s.snackbarState = false;
    },
    clearUploadPercentage(s) {
      s.uploadPercentage = 0;
    },
    setUploadPercentage(s, { uploadStatus }) {
      s.uploadPercentage = uploadStatus;
    },
    failure: (s, p) => {
      s.messages.failure = p;
    },
    // Super Admin
    typeTenLogin: (state, data) => {
      state.authToken = data.token ? data.token : true;
      state.refreshToken = data.dataObj.refreshToken;
      state.auth = !!data.token;
      state.userType = state.ADMIN;
      state.userData = data.userData;
      state.currentState = data.dataObj;
      localStorage.setItem("userType", state.ADMIN);
      localStorage.setItem("auth", data.token);
      localStorage.setItem("userState", JSON.stringify(data.dataObj));
    },
    // MANAGEMENT
    typeTwentyLogin: (state, data) => {
      state.authToken = data.token ? data.token : true;
      state.refreshToken = data.dataObj.refreshToken;
      state.auth = !!data.token;
      state.userType = state.MANAGEMENT;
      state.userData = data.userData;
      state.currentState = data.dataObj;
      localStorage.setItem("userType", state.MANAGEMENT);
      localStorage.setItem("auth", data.token);
      localStorage.setItem("userState", JSON.stringify(data.dataObj));
    },
    // SALES_AGENT
    typeThirtyLogin: (state, data) => {
      state.authToken = data.token ? data.token : true;
      state.refreshToken = data.dataObj.refreshToken;
      state.auth = !!data.token;
      state.userType = state.SALES_AGENT;
      state.userData = data.userData;
      state.currentState = data.dataObj;
      localStorage.setItem("userType", state.SALES_AGENT);
      localStorage.setItem("auth", data.token);
      localStorage.setItem("userState", JSON.stringify(data.dataObj));
    },
    // REMOTE_SALES_AGENT
    typeFourtyLogin: (state, data) => {
      state.authToken = data.token ? data.token : true;
      state.refreshToken = data.dataObj.refreshToken;
      state.auth = !!data.token;
      state.userType = state.REMOTE_SALES_AGENT;
      state.userData = data.userData;
      state.currentState = data.dataObj;
      localStorage.setItem("userType", state.REMOTE_SALES_AGENT);
      localStorage.setItem("auth", data.token);
      localStorage.setItem("userState", JSON.stringify(data.dataObj));
    },
    loginFail: (s, p) => {
      s.messages.loginFailed = p;
    },
    resetState(state) {
      const initial = initialState();
      Object.keys(initial).forEach((key) => {
        state[key] = initial[key];
      });
    },
  },

  actions: {
    apiCallWithHeaderConfig({ commit, state }, { partConfig, headerConfig }) {
      return new Promise((resolve, reject) => {
        if (!state.auth) {
          throw "no auth token found";
        }
        axios({
          ...partConfig,
          headers: {
            ...headerConfig,
            Authorization: state.authToken,
          },
          onUploadProgress: function(progressEvent) {
            commit("setUploadPercentage", {
              uploadStatus: parseInt(
                Math.round((progressEvent.loaded / progressEvent.total) * 100)
              ),
            });
          },
        })
          .then((response) => {
            let data = response.data;
            resolve(data);
            commit("clearUploadPercentage");
          })
          .catch((err) => {
            commit("clearUploadPercentage");
            apiErrorFunction({ err, commit, reject });
          });
      });
    },
    apiCall({ commit, state }, partConfig) {
      return new Promise((resolve, reject) => {
        if (!state.auth) {
          throw "no auth token found";
        }
        axios({
          ...partConfig,
          headers: {
            Authorization: state.authToken,
          },
        })
          .then((response) => {
            // console.log(response)
            let data = response.data;
            resolve(data);
          })
          .catch((err) => apiErrorFunction({ err, commit, reject }));
      });
    },
    fileDownload_API_Call({ state, commit }, partConfig) {
      return new Promise((resolve, reject) => {
        if (!state.auth) {
          throw "no auth token found";
        }
        axios({
          ...partConfig,
          headers: {
            Authorization: state.authToken,
          },
          onDownloadProgress: (progressEvent) => {
            console.log(progressEvent);
            // console.log((progressEvent.loaded * 100)/progressEvent.total);
          },
        })
          .then((response) => {
            let data = response.data;
            resolve({ data, response });
          })
          .catch((err) => apiErrorFunction({ err, commit, reject }));
      });
    },
    extendUserSession: ({ commit, state }, { refreshToken, currentState }) => {
      let fail = (msg) => commit("loginFail", msg);
      return axios
        .get(constants.EXTEND_USER_SESSION, {
          headers: { refresh_token: refreshToken },
        })
        .then((response) => {
          let data = response.data;
          if (data.ok) {
            if (data.mortal.type === state.ADMIN) {
              commit("typeTenLogin", {
                token: data.token,
                userData: data.mortal.userData,
                dataObj: currentState,
              });
            } else if (data.mortal.type === state.MANAGEMENT) {
              commit("typeTwentyLogin", {
                token: data.token,
                userData: data.mortal.userData,
                dataObj: currentState,
              });
            } else if (data.mortal.type === state.SALES_AGENT) {
              commit("typeThirtyLogin", {
                token: data.token,
                userData: data.mortal.userData,
                dataObj: currentState,
              });
            } else if (data.mortal.type === state.REMOTE_SALES_AGENT) {
              commit("typeFourtyLogin", {
                token: data.token,
                userData: data.mortal.userData,
                dataObj: currentState,
              });
            }
            return { ok: true };
          } else {
            return { ok: false };
          }
        })
        .catch((err) => {
          console.log("Yo ", err);
          fail(err.toString() || "Failed to auto extend user session");
          return { ok: false };
        });
    },
    login: ({ commit, state }, payload) => {
      let fail = (msg) => commit("loginFail", msg);
      if (!payload.username || !payload.password) {
        fail("No username/pw provided");
        return;
      }
      let { username, password } = payload;
      return axios
        .post(constants.LOGIN, { username, password })
        .then((response) => {
          let data = response.data;
          if (!data.ok) {
            fail(data.message || "Login Failed");
            return { ok: false };
          } else if (data.mortal.type === state.ADMIN) {
            commit("typeTenLogin", {
              token: data.token,
              userData: data.mortal.userData,
              dataObj: data,
            });
          } else if (data.mortal.type === state.MANAGEMENT) {
            commit("typeTwentyLogin", {
              token: data.token,
              userData: data.mortal.userData,
              dataObj: data,
            });
          } else if (data.mortal.type === state.SALES_AGENT) {
            commit("typeThirtyLogin", {
              token: data.token,
              userData: data.mortal.userData,
              dataObj: data,
            });
          } else if (data.mortal.type === state.SALES_AGENT) {
            commit("typeFourtyLogin", {
              token: data.token,
              userData: data.mortal.userData,
              dataObj: data,
            });
          } else {
            /* logical error */
            fail("Not valid usertype");
            return { ok: false };
          }
          return { ok: true };
        })
        .catch((err) => {
          console.log("[Error] login", err);
          if (err.message == "Network Error") {
            fail("Network Error");
          } else {
            fail("Login Failed");
          }
          return { ok: false };
        });
    },
    logout: ({ commit, state }, payload) => {
      let fail = (msg) => commit("logoutFail", msg);
      let { username, password } = payload;
      return axios
        .post(constants.LOGOUT, {
          headers: {
            Authorization: state.authToken,
          },
        })
        .then((response) => {
          let data = response.data;
          if (!data.ok) {
            fail(data.message || "Logout Failed");
            return { ok: false };
          } else {
            /* logical error */
            fail("Not valid usertype");
            return { ok: false };
          }
        })
        .catch((err) => {
          console.log("[Error] login", err);
          if (err.message == "Network Error") {
            fail("Network Error");
          } else {
            fail("Login Failed");
          }
          return { ok: false };
        });
    },
  },

  getters: {
    loaderDialog: (state) => state.loaderDialog,
    snackbarState: (state) => state.snackbarState,
    snackbarText: (state) => state.snackbarText,
    snackbarTime: (state) => state.snackbarTime,
    userType: (state) => state.userType,
    auth: (state) => state.auth,
    authToken: (state) => state.authToken,
    refreshToken: (state) => state.refreshToken,
    userData: (state) => state.userData,
    uploadPercentage: (state) => state.uploadPercentage,
    currentState: (state) => state.currentState,
    ADMIN: (state) => state.ADMIN,
    MANAGEMENT: (state) => state.MANAGEMENT,
    SALES_AGENT: (state) => state.SALES_AGENT,
    REMOTE_SALES_AGENT: (state) => state.REMOTE_SALES_AGENT,
  },
});

/*
{
        _id: "5f817d95fbe37d1388361067",
        record: {
          created_on: "2020-10-10T09:23:33.491Z",
          updated_on: "2020-10-10T11:51:04.863Z",
          active: false,
        },
        credentials: {
          username: "pocketwala.a@gmail.com",
        },
        type: 30,
        owner: "5f758a8d90d2426336f37c44",
        usr_data: {
          name: "Aliasgar Pocketwala",
          dob: "2020-09-30T18:30:00.000Z",
          address: "Mazgaon",
          phone_number: ["9768835921", "9768835921"],
          email: "pocketwala.a@gmail.com",
          designation: "SS",
          doj: "2020-09-30T18:30:00.000Z",
          doe: "2020-09-30T18:30:00.000Z",
          no_of_leaves: 26,
          countries: ["Mexico", "Brazil"],
          representing_partner_names: ["Taher", "Rohan"],
        },
      },
      {
        _id: "5f817d95fbe37d1388361027",
        record: {
          created_on: "2020-10-10T09:23:33.491Z",
          updated_on: "2020-10-10T11:51:04.863Z",
          active: false,
        },
        credentials: {
          username: "pocketwala.a@gmail.com",
        },
        type: 40,
        owner: "5f758a8d90d2426336f37c44",
        usr_data: {
          name: "Aliasgar Pocketwala",
          dob: "2020-09-30T18:30:00.000Z",
          address: "Mazgaon",
          phone_number: ["9768835921"],
          email: "pocketwala.a@gmail.com",
          designation: "SS",
          doj: "2020-09-30T18:30:00.000Z",
          doe: "2020-09-30T18:30:00.000Z",
          zone: "EAST",
          no_of_leaves: 26,
        },
      },
      {
        _id: "5f817d95fbe37d1388361077",
        record: {
          created_on: "2020-10-10T09:23:33.491Z",
          updated_on: "2020-10-10T11:51:04.863Z",
          active: false,
        },
        credentials: {
          username: "pocketwala.a@gmail.com",
        },
        type: 20,
        owner: "5f758a8d90d2426336f37c44",
        usr_data: {
          name: "Aliasgar Pocketwala",
          dob: "2020-09-30T18:30:00.000Z",
          address: "Mazgaon",
          phone_number: ["9768835921"],
          email: "pocketwala.a@gmail.com",
          designation: "SS",
          doj: "2020-09-30T18:30:00.000Z",
          doe: "2020-09-30T18:30:00.000Z",
        },
      },
*/
