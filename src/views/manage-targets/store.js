import constants from "@/api";

const initialState = () => ({
	yearList: [
		2000,
		2001,
		2002,
		2003,
		2004,
		2005,
		2006,
		2007,
		2008,
		2009,
		2010,
		2011,
		2012,
		2013,
		2014,
		2015,
		2016,
		2017,
		2018,
		2019,
		2020,
		2021,
		2022,
		2023,
		2024,
		2025,
		2026,
		2027,
		2028,
		2029,
		2030,
		2031,
		2032,
		2033,
		2034,
		2035,
		2036,
		2037,
		2038,
		2039,
		2040,
		2041,
		2042,
		2043,
		2044,
		2045,
		2046,
		2047,
		2048,
		2049,
		2050,
		2051,
		2052,
		2053,
		2054,
		2055,
		2056,
		2057,
		2058,
		2059,
		2060,
		2061,
		2062,
		2063,
		2064,
		2065,
		2066,
		2067,
		2068,
		2069,
		2070,
		2071,
		2072,
		2073,
		2074,
		2075,
		2076,
		2077,
		2078,
		2079,
		2080,
		2081,
		2082,
		2083,
		2084,
		2085,
		2086,
		2087,
		2088,
		2089,
		2090,
		2091,
		2092,
		2093,
		2094,
		2095,
		2096,
		2097,
		2098,
		2099,
		2100,
	],
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
	},
	actions: {
		getTargets: ({ commit, dispatch }) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: {},
					url: constants.FINANCIAL_YEAR,
				},
				{ root: true }
			)
				.then((data) => {
					if (data.ok) {
						return {
							ok: true,
							list: data.data,
						};
					} else {
						fail(data.message || "Failed to load Targets");
						return {
							ok: false,
							list: [],
						};
					}
				})
				.catch((err) => {
					console.log("Yo ", err);
					fail(err.toString() || "Failed to load Targets");
					return {
						ok: false,
						list: [],
					};
				});
		},
		addTargetYear: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "post",
					data: payload,
					url: constants.FINANCIAL_YEAR,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to add target year");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to add target year");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		editTargetYear: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "put",
					data: payload,
					url: constants.FINANCIAL_YEAR,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to edit Target year");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to edit target year");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		deleteTargetYear: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "delete",
					data: payload,
					url: constants.FINANCIAL_YEAR,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to Delete Target Year");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to Delete Target Year");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		getActiveCountries: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.ACTIVE_COUNTRIES,
				},
				{ root: true }
			)
				.then((data) => {
					if (data.ok) {
						return {
							ok: true,
							list: data.countries,
						};
					} else {
						fail(data.message || "Failed to fetch Product List");
						return {
							ok: false,
							list: [],
						};
					}
				})
				.catch((err) => {
					console.log("Yo ", err);
					fail(err.toString() || "Failed to fetch Product List");
					return {
						ok: false,
						list: [],
					};
				});
		},
		getTargetsForYear: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "get",
					params: payload,
					url: constants.FINANCIAL_YEAR_TARGETS,
				},
				{ root: true }
			)
				.then((data) => {
					console.log(data);
					if (data.ok) {
						return {
							ok: true,
							list: data.data,
							fetchCount: data.fetchCount,
						};
					} else {
						fail(data.message || "Failed to load Targets");
						return {
							ok: false,
							list: [],
							fetchCount: 0,
						};
					}
				})
				.catch((err) => {
					console.log("Yo ", err);
					fail(err.toString() || "Failed to load Targets");
					return {
						ok: false,
						list: [],
						fetchCount: 0,
					};
				});
		},
		addTargetForYear: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "post",
					data: payload,
					url: constants.FINANCIAL_YEAR_TARGETS,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to add target");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to add target");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		editTargetForYear: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "put",
					data: payload,
					url: constants.FINANCIAL_YEAR_TARGETS,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to edit Target");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to edit Target");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
		deleteTargetForYear: ({ commit, dispatch }, payload) => {
			let fail = (msg) => commit("failure", msg);
			return dispatch(
				"apiCall",
				{
					method: "delete",
					data: payload,
					url: constants.FINANCIAL_YEAR_TARGETS,
				},
				{ root: true }
			)
				.then((data) => {
					if (!data.ok) fail(data.message || "Failed to Delete Target Row");
					return data;
				})
				.catch((err) => {
					fail(err.toString() || "Failed to Delete Target Year Row");
					return {
						ok: false,
						message: err.message,
					};
				});
		},
	},
	getters: {
		yearList: (state) => state.yearList,
	},
};
