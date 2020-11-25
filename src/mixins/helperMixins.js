import helpers from "../components/helpers";

const helperMixins = {
	components: {},
	data: () => ({}),
	computed: {},
	methods: {
		getFormattedDate(date, format = "DD/MM/YYYY") {
			return helpers.getFormattedDate(date, format);
		},
		daysUntil(dateToCheckAgainst, todayMessage) {
			return helpers.daysUntil(dateToCheckAgainst, todayMessage);
		},
	},
};

export default helperMixins;
