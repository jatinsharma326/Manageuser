// 8))) This Helper Mixin is used to get the formatted Date The date came from the helpers which is inside the
// helper component in component section
import helpers from "../components/helpers";

const helperMixins = {
	components: {},
	data: () => ({}),
	computed: {},
	methods: {
		// 1c))) if getformatted is a function which is created in the helpersmixin then what is the use of helpers component getFormatted Date
		getFormattedDate(date, format = "DD/MM/YYYY") {
			return helpers.getFormattedDate(date, format);
		},
		daysUntil(dateToCheckAgainst, todayMessage) {
			return helpers.daysUntil(dateToCheckAgainst, todayMessage);
		},
		isSelectedDateCurrentDate(date) {
			return helpers.isSelectedDateCurrentDate(date);
		},
	},
};

export default helperMixins;
