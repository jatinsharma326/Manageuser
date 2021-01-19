const isBuildVersion = process.env.NODE_ENV === "production";

const BASE_URL = isBuildVersion ? window.location.origin + "/" : "https://gd.orderstack.xyz/";
// const BASE_URL = isBuildVersion ? "http://192.168.1.157:1401/" : "http://192.168.1.157:1401/";
// const BASE_URL = isBuildVersion ? "http://192.168.1.103:1401/" : "http://192.168.1.103:1401/";
// const BASE_URL = isBuildVersion ? "http://192.168.1.101:1401/" : "http://192.168.1.101:1401/";
// const BASE_URL = isBuildVersion ? "http://192.168.31.6:1401/" : "http://192.168.31.6:1401/";
// const BASE_URL = isBuildVersion ? "http://192.168.43.67:1401/" : "http://192.168.43.67:1401/";
// const BASE_URL = isBuildVersion ? "http://192.168.1.35:1401/" : "http://192.168.1.35:1401/";
// const BASE_URL = isBuildVersion ? "https://3128e8a0ed71.ngrok.io/" : "https://3128e8a0ed71.ngrok.io/";

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
	ACTIVE_COUNTRIES: BASE_URL + "Partners/v0.1/active-countries",
	ALL_STATES: BASE_URL + "Global/v0.1/states",
	ALL_CITIES: BASE_URL + "Global/v0.1/cities",
	ACTIVE_CURRENCIES: BASE_URL + "Global/v0.1/active-currencies",

	//API ENDPOINT FOR MANAGE USER DATA
	MANAGE_USERS: BASE_URL + "Mortals/v0.1/",

	//API ENDPOINT FOR PARTNER
	MANAGE_PARTNER: BASE_URL + "Partners/v0.1/",
	PARTNER_BIRTHDAYS: BASE_URL + "Partners/v0.1/birthday-reminder",
	MANAGE_PARTNER_EMPLOYEES: BASE_URL + "RepEmployees/v0.1/",
	PARTNER_EMPLOYEE_BIRTHDAYS: BASE_URL + "RepEmployees/v0.1/birthday-reminder",

	// GLOBAL SETTINGS END POINT
	GLOBAL_SETTINGS: BASE_URL + "Admin/v0.1/global-settings",
	GLOBAL_SETTINGS_POLICIES: BASE_URL + "Admin/v0.1/policies",
	CHECK_POLICIES_STATUS: BASE_URL + "Global/v0.1/check-policy-exists",
	UPDATE_PASSWORD: BASE_URL + "Common/v0.1/change-password",

	// MANAGE LEAVES END POINT
	ALL_SALES_LEAVES: BASE_URL + "Leaves/v0.1/all-sales-leaves",
	SALES_LEAVES: BASE_URL + "Leaves/v0.1/sales-leaves",
	PENDING_LEAVES: BASE_URL + "Leaves/v0.1/pending-leaves",

	// MANAGE TARGETS ENDPOINTS
	FINANCIAL_YEAR: BASE_URL + "FinancialYears/v0.1/",
	FINANCIAL_YEAR_TARGETS: BASE_URL + "FinancialYears/v0.1/targets",

	// TRAVEL AGENTS ENDPOINT
	TRAVEL_AGENT: BASE_URL + "Companies/v0.1/",
	TRAVEL_AGENT_ADDRESS: BASE_URL + "Address/v0.1/",
	TRAVEL_AGENT_EMPLOYEES: BASE_URL + "TravelAgentEmployees/v0.1/",
	FAM_TRIP: BASE_URL + "TravelLogs/v0.1/",
	DUPLICATE_DATA_WARNING: BASE_URL + "TravelAgentEmployees/v0.1/warning",
	BULK_UPLOAD_LOGS: BASE_URL + "BulkUpload/v0.1/all-session-logs",
	BULK_UPLOAD_INPUT_FILE: BASE_URL + "BulkUpload/v0.1/file-url",
	BULK_UPLOAD_DELETE_SPAWN: BASE_URL + "BulkUpload/v0.1/delete-process",
	BULK_UPLOAD_ERROR_FILE: BASE_URL + "ErrorFiles/v0.1/",

	// TRAVEL AGENTS SECTION CHANGELOGS
	CHANGELOGS: BASE_URL + "Changelogs/v0.1/",

	// Bulk Upload End Points for Travel Agents
	SPAWN_PROCESS: BASE_URL + "BulkUpload/v0.1/spawn-bulk-upload-travel-agents",
	UPLOAD_TRAVEL_AGENT_FILE: BASE_URL + "BulkUpload/v0.1/travel-agents",

	// SALES CALL ENDPOINT
	SALES_CALLS: BASE_URL + "SalesCalls/v0.1/",
	DUPLICATE_CALL_WARNING: BASE_URL + "SalesCalls/v0.1/warning",
	DOWNLOAD_SALES_CALLS: BASE_URL + "DownloadReports/v0.1/download-sales-calls",

	// DAILY SALES REPORT ENDPOINT
	DSR: BASE_URL + "DSR/v0.1/",

	// MONTHLY SALES REPORT ENDPOINT
	MSR: BASE_URL + "MSR/v0.1/",
	MSR_REPORT_LIST: BASE_URL + "MSR/v0.1/month-wise-dsr",
	MSR_REPORT_FILE: BASE_URL + "MSR/v0.1/download-dsr-report",
	MSR_REPORT_FILE_ALL_PRODUCT: BASE_URL + "MSR/v0.1/download-all-dsr",

	//DASHBOARD CALLS
	AGENT_BIRTHDAYS: BASE_URL + "TravelAgentEmployees/v0.1/birthday-reminder",
	EMPLOYEE_BIRTHDAYS: BASE_URL + "Mortals/v0.1/birthday-reminder",
	DSR_REMINDER: BASE_URL + "DSR/v0.1/follow-up-reminder",
	FOLLOW_UP_REMINDER: BASE_URL + "FollowUps/v0.1/follow-up-reminder",
	DSR_NOTIFICATIONS: BASE_URL + "DSR/v0.1/dsr-for-my-products",

	// FOLLOW UP ENDPOINT
	FOLLOW_UP: BASE_URL + "FollowUps/v0.1/",

	// REPORTS SECTION
	YEARLY_COMPARISON: BASE_URL + "Reports/v0.1/yearly-comparison",
	YEARLY_ZONE: BASE_URL + "Reports/v0.1/zone-wise",
	TRAVEL_AGENT_REPORT: BASE_URL + "Reports/v0.1/agency-wise",
	TARGET_REPORT: BASE_URL + "Reports/v0.1/target-revenue-comparison",

	// Download Reports
	YEARLY_REVENUE_RAW_DOWNLOAD: BASE_URL + "DownloadReports/v0.1/download-follow-up-raw-data-report",
	YEARLY_REVENUE_COMPARISON_DOWNLOAD: BASE_URL + "DownloadReports/v0.1/download-yearly-comparison-report",
	YEARLY_REVENUE_ZONE_DOWNLOAD: BASE_URL + "DownloadReports/v0.1/download-zone-wise-follow-ups",
	AGENCY_WISE_DOWNLOAD: BASE_URL + "DownloadReports/v0.1/download-agency-wise-follow-ups",

	// VIRTUAL REACH ENDPOINT
	VIRTUAL_REACH: BASE_URL + "VirtualReach/v0.1/",
	VIRTUAL_REACH_DOWNLOAD: BASE_URL + "DownloadReports/v0.1/download-virtual-reach",

	// VIRTUAL REACH ENDPOINT
	NOTICE_BOARD: BASE_URL + "Bulletins/v0.1/management-bulletins",

	// VIRTUAL REACH ENDPOINT
	ADMIN_BULLETIN: BASE_URL + "Bulletins/v0.1/admin-bulletins",
};
