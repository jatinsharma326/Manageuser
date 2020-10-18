import Vue from "vue";
import Vuex from "vuex";

import axios from "axios";
import constants from "@/api";

import UserManagement from "../views/manage-users/store";
import PartnerManagement from "../views/representing-partner/store";

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
  countries: [
    {
      text: "Afghanistan",
      value: "Afghanistan",
    },
    {
      text: "Åland Islands",
      value: "Åland Islands",
    },
    {
      text: "Albania",
      value: "Albania",
    },
    {
      text: "Algeria",
      value: "Algeria",
    },
    {
      text: "American Samoa",
      value: "American Samoa",
    },
    {
      text: "AndorrA",
      value: "AndorrA",
    },
    {
      text: "Angola",
      value: "Angola",
    },
    {
      text: "Anguilla",
      value: "Anguilla",
    },
    {
      text: "Antarctica",
      value: "Antarctica",
    },
    {
      text: "Antigua and Barbuda",
      value: "Antigua and Barbuda",
    },
    {
      text: "Argentina",
      value: "Argentina",
    },
    {
      text: "Armenia",
      value: "Armenia",
    },
    {
      text: "Aruba",
      value: "Aruba",
    },
    {
      text: "Australia",
      value: "Australia",
    },
    {
      text: "Austria",
      value: "Austria",
    },
    {
      text: "Azerbaijan",
      value: "Azerbaijan",
    },
    {
      text: "Bahamas",
      value: "Bahamas",
    },
    {
      text: "Bahrain",
      value: "Bahrain",
    },
    {
      text: "Bangladesh",
      value: "Bangladesh",
    },
    {
      text: "Barbados",
      value: "Barbados",
    },
    {
      text: "Belarus",
      value: "Belarus",
    },
    {
      text: "Belgium",
      value: "Belgium",
    },
    {
      text: "Belize",
      value: "Belize",
    },
    {
      text: "Benin",
      value: "Benin",
    },
    {
      text: "Bermuda",
      value: "Bermuda",
    },
    {
      text: "Bhutan",
      value: "Bhutan",
    },
    {
      text: "Bolivia",
      value: "Bolivia",
    },
    {
      text: "Bosnia and Herzegovina",
      value: "Bosnia and Herzegovina",
    },
    {
      text: "Botswana",
      value: "Botswana",
    },
    {
      text: "Bouvet Island",
      value: "Bouvet Island",
    },
    {
      text: "Brazil",
      value: "Brazil",
    },
    {
      text: "British Indian Ocean Territory",
      value: "British Indian Ocean Territory",
    },
    {
      text: "Brunei Darussalam",
      value: "Brunei Darussalam",
    },
    {
      text: "Bulgaria",
      value: "Bulgaria",
    },
    {
      text: "Burkina Faso",
      value: "Burkina Faso",
    },
    {
      text: "Burundi",
      value: "Burundi",
    },
    {
      text: "Cambodia",
      value: "Cambodia",
    },
    {
      text: "Cameroon",
      value: "Cameroon",
    },
    {
      text: "Canada",
      value: "Canada",
    },
    {
      text: "Cape Verde",
      value: "Cape Verde",
    },
    {
      text: "Cayman Islands",
      value: "Cayman Islands",
    },
    {
      text: "Central African Republic",
      value: "Central African Republic",
    },
    {
      text: "Chad",
      value: "Chad",
    },
    {
      text: "Chile",
      value: "Chile",
    },
    {
      text: "China",
      value: "China",
    },
    {
      text: "Christmas Island",
      value: "Christmas Island",
    },
    {
      text: "Cocos (Keeling) Islands",
      value: "Cocos (Keeling) Islands",
    },
    {
      text: "Colombia",
      value: "Colombia",
    },
    {
      text: "Comoros",
      value: "Comoros",
    },
    {
      text: "Congo",
      value: "Congo",
    },
    {
      text: "Congo, The Democratic Republic of the",
      value: "Congo, The Democratic Republic of the",
    },
    {
      text: "Cook Islands",
      value: "Cook Islands",
    },
    {
      text: "Costa Rica",
      value: "Costa Rica",
    },
    {
      text: "Cote D'Ivoire",
      value: "Cote D'Ivoire",
    },
    {
      text: "Croatia",
      value: "Croatia",
    },
    {
      text: "Cuba",
      value: "Cuba",
    },
    {
      text: "Cyprus",
      value: "Cyprus",
    },
    {
      text: "Czech Republic",
      value: "Czech Republic",
    },
    {
      text: "Denmark",
      value: "Denmark",
    },
    {
      text: "Djibouti",
      value: "Djibouti",
    },
    {
      text: "Dominica",
      value: "Dominica",
    },
    {
      text: "Dominican Republic",
      value: "Dominican Republic",
    },
    {
      text: "Ecuador",
      value: "Ecuador",
    },
    {
      text: "Egypt",
      value: "Egypt",
    },
    {
      text: "El Salvador",
      value: "El Salvador",
    },
    {
      text: "Equatorial Guinea",
      value: "Equatorial Guinea",
    },
    {
      text: "Eritrea",
      value: "Eritrea",
    },
    {
      text: "Estonia",
      value: "Estonia",
    },
    {
      text: "Ethiopia",
      value: "Ethiopia",
    },
    {
      text: "Falkland Islands (Malvinas)",
      value: "Falkland Islands (Malvinas)",
    },
    {
      text: "Faroe Islands",
      value: "Faroe Islands",
    },
    {
      text: "Fiji",
      value: "Fiji",
    },
    {
      text: "Finland",
      value: "Finland",
    },
    {
      text: "France",
      value: "France",
    },
    {
      text: "French Guiana",
      value: "French Guiana",
    },
    {
      text: "French Polynesia",
      value: "French Polynesia",
    },
    {
      text: "French Southern Territories",
      value: "French Southern Territories",
    },
    {
      text: "Gabon",
      value: "Gabon",
    },
    {
      text: "Gambia",
      value: "Gambia",
    },
    {
      text: "Georgia",
      value: "Georgia",
    },
    {
      text: "Germany",
      value: "Germany",
    },
    {
      text: "Ghana",
      value: "Ghana",
    },
    {
      text: "Gibraltar",
      value: "Gibraltar",
    },
    {
      text: "Greece",
      value: "Greece",
    },
    {
      text: "Greenland",
      value: "Greenland",
    },
    {
      text: "Grenada",
      value: "Grenada",
    },
    {
      text: "Guadeloupe",
      value: "Guadeloupe",
    },
    {
      text: "Guam",
      value: "Guam",
    },
    {
      text: "Guatemala",
      value: "Guatemala",
    },
    {
      text: "Guernsey",
      value: "Guernsey",
    },
    {
      text: "Guinea",
      value: "Guinea",
    },
    {
      text: "Guinea-Bissau",
      value: "Guinea-Bissau",
    },
    {
      text: "Guyana",
      value: "Guyana",
    },
    {
      text: "Haiti",
      value: "Haiti",
    },
    {
      text: "Heard Island and Mcdonald Islands",
      value: "Heard Island and Mcdonald Islands",
    },
    {
      text: "Holy See (Vatican City State)",
      value: "Holy See (Vatican City State)",
    },
    {
      text: "Honduras",
      value: "Honduras",
    },
    {
      text: "Hong Kong",
      value: "Hong Kong",
    },
    {
      text: "Hungary",
      value: "Hungary",
    },
    {
      text: "Iceland",
      value: "Iceland",
    },
    {
      text: "India",
      value: "India",
    },
    {
      text: "Indonesia",
      value: "Indonesia",
    },
    {
      text: "Iran, Islamic Republic Of",
      value: "Iran, Islamic Republic Of",
    },
    {
      text: "Iraq",
      value: "Iraq",
    },
    {
      text: "Ireland",
      value: "Ireland",
    },
    {
      text: "Isle of Man",
      value: "Isle of Man",
    },
    {
      text: "Israel",
      value: "Israel",
    },
    {
      text: "Italy",
      value: "Italy",
    },
    {
      text: "Jamaica",
      value: "Jamaica",
    },
    {
      text: "Japan",
      value: "Japan",
    },
    {
      text: "Jersey",
      value: "Jersey",
    },
    {
      text: "Jordan",
      value: "Jordan",
    },
    {
      text: "Kazakhstan",
      value: "Kazakhstan",
    },
    {
      text: "Kenya",
      value: "Kenya",
    },
    {
      text: "Kiribati",
      value: "Kiribati",
    },
    {
      text: "Korea, Democratic People'S Republic of",
      value: "Korea, Democratic People'S Republic of",
    },
    {
      text: "Korea, Republic of",
      value: "Korea, Republic of",
    },
    {
      text: "Kuwait",
      value: "Kuwait",
    },
    {
      text: "Kyrgyzstan",
      value: "Kyrgyzstan",
    },
    {
      text: "Lao People'S Democratic Republic",
      value: "Lao People'S Democratic Republic",
    },
    {
      text: "Latvia",
      value: "Latvia",
    },
    {
      text: "Lebanon",
      value: "Lebanon",
    },
    {
      text: "Lesotho",
      value: "Lesotho",
    },
    {
      text: "Liberia",
      value: "Liberia",
    },
    {
      text: "Libyan Arab Jamahiriya",
      value: "Libyan Arab Jamahiriya",
    },
    {
      text: "Liechtenstein",
      value: "Liechtenstein",
    },
    {
      text: "Lithuania",
      value: "Lithuania",
    },
    {
      text: "Luxembourg",
      value: "Luxembourg",
    },
    {
      text: "Macao",
      value: "Macao",
    },
    {
      text: "Macedonia, The Former Yugoslav Republic of",
      value: "Macedonia, The Former Yugoslav Republic of",
    },
    {
      text: "Madagascar",
      value: "Madagascar",
    },
    {
      text: "Malawi",
      value: "Malawi",
    },
    {
      text: "Malaysia",
      value: "Malaysia",
    },
    {
      text: "Maldives",
      value: "Maldives",
    },
    {
      text: "Mali",
      value: "Mali",
    },
    {
      text: "Malta",
      value: "Malta",
    },
    {
      text: "Marshall Islands",
      value: "Marshall Islands",
    },
    {
      text: "Martinique",
      value: "Martinique",
    },
    {
      text: "Mauritania",
      value: "Mauritania",
    },
    {
      text: "Mauritius",
      value: "Mauritius",
    },
    {
      text: "Mayotte",
      value: "Mayotte",
    },
    {
      text: "Mexico",
      value: "Mexico",
    },
    {
      text: "Micronesia, Federated States of",
      value: "Micronesia, Federated States of",
    },
    {
      text: "Moldova, Republic of",
      value: "Moldova, Republic of",
    },
    {
      text: "Monaco",
      value: "Monaco",
    },
    {
      text: "Mongolia",
      value: "Mongolia",
    },
    {
      text: "Montserrat",
      value: "Montserrat",
    },
    {
      text: "Morocco",
      value: "Morocco",
    },
    {
      text: "Mozambique",
      value: "Mozambique",
    },
    {
      text: "Myanmar",
      value: "Myanmar",
    },
    {
      text: "Namibia",
      value: "Namibia",
    },
    {
      text: "Nauru",
      value: "Nauru",
    },
    {
      text: "Nepal",
      value: "Nepal",
    },
    {
      text: "Netherlands",
      value: "Netherlands",
    },
    {
      text: "Netherlands Antilles",
      value: "Netherlands Antilles",
    },
    {
      text: "New Caledonia",
      value: "New Caledonia",
    },
    {
      text: "New Zealand",
      value: "New Zealand",
    },
    {
      text: "Nicaragua",
      value: "Nicaragua",
    },
    {
      text: "Niger",
      value: "Niger",
    },
    {
      text: "Nigeria",
      value: "Nigeria",
    },
    {
      text: "Niue",
      value: "Niue",
    },
    {
      text: "Norfolk Island",
      value: "Norfolk Island",
    },
    {
      text: "Northern Mariana Islands",
      value: "Northern Mariana Islands",
    },
    {
      text: "Norway",
      value: "Norway",
    },
    {
      text: "Oman",
      value: "Oman",
    },
    {
      text: "Pakistan",
      value: "Pakistan",
    },
    {
      text: "Palau",
      value: "Palau",
    },
    {
      text: "Palestinian Territory, Occupied",
      value: "Palestinian Territory, Occupied",
    },
    {
      text: "Panama",
      value: "Panama",
    },
    {
      text: "Papua New Guinea",
      value: "Papua New Guinea",
    },
    {
      text: "Paraguay",
      value: "Paraguay",
    },
    {
      text: "Peru",
      value: "Peru",
    },
    {
      text: "Philippines",
      value: "Philippines",
    },
    {
      text: "Pitcairn",
      value: "Pitcairn",
    },
    {
      text: "Poland",
      value: "Poland",
    },
    {
      text: "Portugal",
      value: "Portugal",
    },
    {
      text: "Puerto Rico",
      value: "Puerto Rico",
    },
    {
      text: "Qatar",
      value: "Qatar",
    },
    {
      text: "Reunion",
      value: "Reunion",
    },
    {
      text: "Romania",
      value: "Romania",
    },
    {
      text: "Russian Federation",
      value: "Russian Federation",
    },
    {
      text: "RWANDA",
      value: "RWANDA",
    },
    {
      text: "Saint Helena",
      value: "Saint Helena",
    },
    {
      text: "Saint Kitts and Nevis",
      value: "Saint Kitts and Nevis",
    },
    {
      text: "Saint Lucia",
      value: "Saint Lucia",
    },
    {
      text: "Saint Pierre and Miquelon",
      value: "Saint Pierre and Miquelon",
    },
    {
      text: "Saint Vincent and the Grenadines",
      value: "Saint Vincent and the Grenadines",
    },
    {
      text: "Samoa",
      value: "Samoa",
    },
    {
      text: "San Marino",
      value: "San Marino",
    },
    {
      text: "Sao Tome and Principe",
      value: "Sao Tome and Principe",
    },
    {
      text: "Saudi Arabia",
      value: "Saudi Arabia",
    },
    {
      text: "Senegal",
      value: "Senegal",
    },
    {
      text: "Serbia and Montenegro",
      value: "Serbia and Montenegro",
    },
    {
      text: "Seychelles",
      value: "Seychelles",
    },
    {
      text: "Sierra Leone",
      value: "Sierra Leone",
    },
    {
      text: "Singapore",
      value: "Singapore",
    },
    {
      text: "Slovakia",
      value: "Slovakia",
    },
    {
      text: "Slovenia",
      value: "Slovenia",
    },
    {
      text: "Solomon Islands",
      value: "Solomon Islands",
    },
    {
      text: "Somalia",
      value: "Somalia",
    },
    {
      text: "South Africa",
      value: "South Africa",
    },
    {
      text: "South Georgia and the South Sandwich Islands",
      value: "South Georgia and the South Sandwich Islands",
    },
    {
      text: "Spain",
      value: "Spain",
    },
    {
      text: "Sri Lanka",
      value: "Sri Lanka",
    },
    {
      text: "Sudan",
      value: "Sudan",
    },
    {
      text: "Suriname",
      value: "Suriname",
    },
    {
      text: "Svalbard and Jan Mayen",
      value: "Svalbard and Jan Mayen",
    },
    {
      text: "Swaziland",
      value: "Swaziland",
    },
    {
      text: "Sweden",
      value: "Sweden",
    },
    {
      text: "Switzerland",
      value: "Switzerland",
    },
    {
      text: "Syrian Arab Republic",
      value: "Syrian Arab Republic",
    },
    {
      text: "Taiwan, Province of China",
      value: "Taiwan, Province of China",
    },
    {
      text: "Tajikistan",
      value: "Tajikistan",
    },
    {
      text: "Tanzania, United Republic of",
      value: "Tanzania, United Republic of",
    },
    {
      text: "Thailand",
      value: "Thailand",
    },
    {
      text: "Timor-Leste",
      value: "Timor-Leste",
    },
    {
      text: "Togo",
      value: "Togo",
    },
    {
      text: "Tokelau",
      value: "Tokelau",
    },
    {
      text: "Tonga",
      value: "Tonga",
    },
    {
      text: "Trinidad and Tobago",
      value: "Trinidad and Tobago",
    },
    {
      text: "Tunisia",
      value: "Tunisia",
    },
    {
      text: "Turkey",
      value: "Turkey",
    },
    {
      text: "Turkmenistan",
      value: "Turkmenistan",
    },
    {
      text: "Turks and Caicos Islands",
      value: "Turks and Caicos Islands",
    },
    {
      text: "Tuvalu",
      value: "Tuvalu",
    },
    {
      text: "Uganda",
      value: "Uganda",
    },
    {
      text: "Ukraine",
      value: "Ukraine",
    },
    {
      text: "United Arab Emirates",
      value: "United Arab Emirates",
    },
    {
      text: "United Kingdom",
      value: "United Kingdom",
    },
    {
      text: "United States",
      value: "United States",
    },
    {
      text: "United States Minor Outlying Islands",
      value: "United States Minor Outlying Islands",
    },
    {
      text: "Uruguay",
      value: "Uruguay",
    },
    {
      text: "Uzbekistan",
      value: "Uzbekistan",
    },
    {
      text: "Vanuatu",
      value: "Vanuatu",
    },
    {
      text: "Venezuela",
      value: "Venezuela",
    },
    {
      text: "Viet Nam",
      value: "Viet Nam",
    },
    {
      text: "Virgin Islands, British",
      value: "Virgin Islands, British",
    },
    {
      text: "Virgin Islands, U.S.",
      value: "Virgin Islands, U.S.",
    },
    {
      text: "Wallis and Futuna",
      value: "Wallis and Futuna",
    },
    {
      text: "Western Sahara",
      value: "Western Sahara",
    },
    {
      text: "Yemen",
      value: "Yemen",
    },
    {
      text: "Zambia",
      value: "Zambia",
    },
    {
      text: "Zimbabwe",
      value: "Zimbabwe",
    },
  ],
  partners: [
    {
      text: "Allied Partners",
      value: "5f8579099618e43f60826225",
    },
    {
      text: "Allied Partneras",
      value: "5f857a9ad8a96c2e4ca6e7c5",
    },
    {
      text: "Allied P",
      value: "5f8582dc382e8941905682c8",
    },
  ],
  zone: [
    {
      text: "EAST",
      value: "EAST",
    },
    {
      text: "WEST (Gujarat)",
      value: "WEST (Gujarat)",
    },
    {
      text: "WEST",
      value: "WEST",
    },
    {
      text: "NORTH",
      value: "NORTH",
    },
    {
      text: "SOUTH",
      value: "SOUTH",
    },
  ],
  businessType: [
    {
      text: "FIT",
      value: "FIT",
    },
    {
      text: "GIT",
      value: "GIT",
    },
    {
      text: "ADHOC",
      value: "ADHOC",
    },
    {
      text: "MICE",
      value: "MICE",
    },
    {
      text: "LUXURY",
      value: "LUXURY",
    },
  ],
});

export default new Vuex.Store({
  modules: {
    UserManagement,
    PartnerManagement,
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
    countries: (state) => state.countries,
    partners: (state) => state.partners,
    zone: (state) => state.zone,
    businessType: (state) => state.businessType,
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
