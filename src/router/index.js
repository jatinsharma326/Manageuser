import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
	{
		path: "/manage-users",
		name: "Manage Users",
		component: () => import("../views/manage-users"),
		meta: { policy: [10, 20, 30, 40] },
	},
	{
		path: "/regions-and-partners",
		name: "Regions and Partners",
		component: () => import("../views/representing-partner"),
		meta: { policy: [10, 20, 30, 40] },
	},
	{
		path: "/settings",
		name: "Settings",
		component: () => import("../views/settings"),
		meta: { policy: [10, 20, 30, 40] },
	},
	{
		path: "/leaves",
		name: "Leave Manager",
		component: () => import("../views/leave-manager"),
		meta: { policy: [10, 20, 30, 40] },
	},
	{
		path: "/targets",
		name: "Manage Targets",
		component: () => import("../views/manage-targets"),
		meta: { policy: [10, 20] },
	},
];

const router = new VueRouter({
	routes,
});

export default router;
