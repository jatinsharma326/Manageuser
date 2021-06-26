import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [

	{
		path: "/",
		name: "Dashoard",
		component: () => import("../views/dashboard"),
		meta: { policy: [10, 20, 30, 40] },
	},
	{
		path: "/manage-users",
		name: "Manage Users",
		component: () => import("../views/manage-users"),
		meta: { policy: [10, 20, 30, 40] },
	},
	{
		path: "/manage-agents",
		name: "Manage Agents",
		component: () => import("../views/manage-agents"),
		meta: { policy: [10, 20, 30, 40] },
	},
	
	{
		path: "/follow-up",
		name: "Follow Up",
		component: () => import("../views/follow-up"),
		meta: { policy: [10, 20, 30, 40] },
	},
	{
		path: "/reports",
		name: "Reports",
		component: () => import("../views/reports"),
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
		path: "/virtual-reach",
		name: "Virtual Reach",
		component: () => import("../views/virtual-reach"),
		meta: { policy: [10, 20, 30] },
	},
	{
		path: "/admin-bulletin",
		name: "Admin bulletin",
		component: () => import("../views/admin-bulletin"),
		meta: { policy: [10, 20] },
	},

];

const router = new VueRouter({
	mode:'history',
	routes,
});

export default router;
