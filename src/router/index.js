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
		path: "/regions-and-partners",
		name: "Regions and Partners",
		component: () => import("../views/representing-partner"),
		meta: { policy: [10, 20, 30, 40] },
	},
	{
		path: "/sales-call",
		name: "Sales Call",
		component: () => import("../views/sales-call"),
		meta: { policy: [10, 20, 30, 40] },
	},
	{
		path: "/dsr",
		name: "Daily Sales Report",
		component: () => import("../views/daily-sales-report"),
		meta: { policy: [10, 20, 30, 40] },
	},
	{
		path: "/msr",
		name: "Monthly Sales Report",
		component: () => import("../views/monthly-sales-report"),
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
