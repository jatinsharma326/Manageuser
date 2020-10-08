const isBuildVersion = process.env.NODE_ENV === "production";

const BASE_URL = isBuildVersion
	? "https://dev-finbazaar-admin.tk"
	: "https://dev-finbazaar-admin.tk";
// : // : "https://4fe85f9c.ngrok.io";

export default {
	LOGIN: BASE_URL + "/common/v0.1/login",
	LOGOUT: BASE_URL + "/Session/v0.1/logout",

	BASE_URL,

	// // Auth End Points
	// EXTENT_USER_SESSION: BASE_URL + "/Session/v0.1/extend-session",
	// VERIFY_AND__UPDATE_USER_PASSWORD: BASE_URL + "/Mortal/v0.1/verify-mortal",

};
