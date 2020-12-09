import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		themes: {
			light: {
				// primary: "#00887a", // Primary Green (Mainly for header and navbar)
				primary: "#37b6c9", // Primary Green (Mainly for header and navbar)
				primaryFontColor: "#2B4266", // font navy blue, font color on the overview screen
				secondary: "#77a6f7", // light purple,
				secondaryFontColor: "#112d32", // font gray, font color on the master screen for the muted text
				tertiary: "#355280", // light navy blue, this is for the expanded state of the menu item
				tertiaryFontColor: "#ececec", // light gray,
				accent: "#f3d250", // yellow , this is the selected state of the link
				error: "#FF5D5D", // red
			},
			// light: {
			// 	primary: '#2B4266', // navy blue
			// 	primaryFontColor: '#2B4266', // font navy blue, font color on the overview screen
			// 	secondary: '#20324D', // dark navy blue, this is the selected state of the link
			// 	secondaryFontColor: '#aaacb2', // font gray, font color on the master screen for the muted text
			// 	tertiary: '#355280', // light navy blue, this is for the expanded state of the menu item
			// 	tertiaryFontColor: '#333333', // Gaurav modi black
			// 	accent: '#3DFFE5', // neon blue
			// 	error: '#FF5D5D', // red
			// },
		},
	},
});
