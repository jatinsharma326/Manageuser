const isBuildVersion = process.env.NODE_ENV === "production";

const BASE_URL = isBuildVersion
  ? "https://globaldestinations.tk/"
  : "https://globaldestinations.tk/";
// : // : "https://4fe85f9c.ngrok.io";

export default {
  LOGIN: BASE_URL + "Common/v0.1/login",
  LOGOUT: BASE_URL + "Common/v0.1/logout",
  BASE_URL,

  EXTEND_USER_SESSION: BASE_URL + "Session/v0.1/extend-session",
  // // Auth End Points
  // VERIFY_AND__UPDATE_USER_PASSWORD: BASE_URL + "/Mortal/v0.1/verify-mortal",

  RESET_PASSWORD: BASE_URL + "Admin/v0.1/reset-password",
  ALL_COUNTRIES: BASE_URL + "Global/v0.1/countries",
  ALL_PARTNERS: BASE_URL + "Global/v0.1/representing-partners",
  ALL_ZONE: BASE_URL + "Global/v0.1/zones",
  ALL_BUSINESS_TYPE: BASE_URL + "Global/v0.1/business-types",

  //API ENDPOINT FOR MANAGE USER DATA
  MANAGE_USERS: BASE_URL + "Mortals/v0.1/",
  MANAGE_PARTNER: BASE_URL + "Partners/v0.1/",
  MANAGE_PARTNER_EMPLOYEES: BASE_URL + "RepEmployees/v0.1/",
};
