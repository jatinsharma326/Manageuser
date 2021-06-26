import Vue from "vue";
import Provider from "./Provider.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
// import "material-design-icons-iconfont/dist/material-design-icons.css";

//Import Global SCSS
import "./styles/main.scss";
import Vuelidate from "vuelidate";
Vue.use(Vuelidate);

Vue.config.productionTip = true;

router.beforeEach((to, from, next) => {
	let userType = store.getters.userType || Number(localStorage.userType);
	if ((to.meta.policy && to.meta.policy.includes(userType)) || to.path == "/") {
		next();
	} else {
		router.push({ path: "/" });
	}
});

new Vue({
	router,
	store,
	vuetify,
	render: (h) => h(Provider),
}).$mount("#app");
