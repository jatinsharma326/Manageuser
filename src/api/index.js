const isBuildVersion = process.env.NODE_ENV === "production";

// const BASE_URL = isBuildVersion ? "https://gd.orderstack.xyz/" : "https://gd.orderstack.xyz/";
const BASE_URL = isBuildVersion ? "http://192.168.1.157:1401/" : "http://192.168.1.157:1401/";
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
	ALL_CURRENCIES: BASE_URL + "Global/v0.1/currencies",

	//API ENDPOINT FOR MANAGE USER DATA
	MANAGE_USERS: BASE_URL + "Mortals/v0.1/",
	MANAGE_PARTNER: BASE_URL + "Partners/v0.1/",
	MANAGE_PARTNER_EMPLOYEES: BASE_URL + "RepEmployees/v0.1/",

	// GLOBAL SETTINGS END POINT
	GLOBAL_SETTINGS: BASE_URL + "Admin/v0.1/global-settings",
	GLOBAL_SETTINGS_POLICIES: BASE_URL + "Admin/v0.1/policies",

	// MANAGE LEAVES END POINT
	ALL_SALES_LEAVES: BASE_URL + "Leaves/v0.1/all-sales-leaves",
	SALES_LEAVES: BASE_URL + "Leaves/v0.1/sales-leaves",

	// GET CURRENT PENDING LEAVES
	PENDING_LEAVES: BASE_URL + "Leaves/v0.1/pending-leaves",

	// MANAGE TARGETS ENDPOINTS
	FINANCIAL_YEAR: BASE_URL + "FinancialYears/v0.1/",
	FINANCIAL_YEAR_TARGETS: BASE_URL + "FinancialYears/v0.1/targets",

	// GET ACTIVE PRODUCTS LIST
	ACTIVE_COUNTRIES: BASE_URL + "Partners/v0.1/active-countries",

	// GET STATES LIST
	ALL_STATES: BASE_URL + "Global/v0.1/states",

	// TRAVEL AGENTS ENDPOINT
	TRAVEL_AGENT: BASE_URL + "Companies/v0.1/",

	// TRAVEL AGENTS ADDRESS
	TRAVEL_AGENT_ADDRESS: BASE_URL + "Address/v0.1/",

	// TRAVEL AGENTS EMPLOYEES
	TRAVEL_AGENT_EMPLOYEES: BASE_URL + "TravelAgentEmployees/v0.1/",

	// TRAVEL AGENTS EMPLOYEES
	FAM_TRIP: BASE_URL + "TravelLogs/v0.1/",

	// TRAVEL AGENTS ADDRESS
	CHANGELOGS: BASE_URL + "Changelogs/v0.1/",

	// Bulk Upload End Points for Travel Agents
	SPAWN_PROCESS: BASE_URL + "BulkUpload/v0.1/spawn-bulk-upload-travel-agents",
	UPLOAD_TRAVEL_AGENT_FILE: BASE_URL + "BulkUpload/v0.1/travel-agents",

	// TRAVEL AGENTS ENDPOINT
	SALES_CALLS: BASE_URL + "SalesCalls/v0.1/",
};
