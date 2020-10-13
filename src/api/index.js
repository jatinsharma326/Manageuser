const isBuildVersion = process.env.NODE_ENV === "production";

const BASE_URL = isBuildVersion
	? "http://192.168.43.67:1401"
	: "http://192.168.43.67:1401";
// : // : "https://4fe85f9c.ngrok.io";

export default {
	LOGIN: BASE_URL + "/Common/v0.1/login",
	LOGOUT: BASE_URL + "/Common/v0.1/logout",

	BASE_URL,

	// // Auth End Points
	// EXTEND_USER_SESSION: BASE_URL + "/Session/v0.1/extend-session",
	// VERIFY_AND__UPDATE_USER_PASSWORD: BASE_URL + "/Mortal/v0.1/verify-mortal",

};
