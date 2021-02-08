import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		themes: {
			light: {
				primary: "#37b6c9", // Primary Blue
				primaryFontColor: "#2B4266", // font navy blue
				secondary: "#77a6f7", // light purple
				secondaryFontColor: "#112d32", // dark green
				tertiary: "#355280", // light navy blue
				tertiaryFontColor: "#ececec", // light gray
				accent: "#f3d250", // yellow
				error: "#940000", // red
			},
		},
	},
});
