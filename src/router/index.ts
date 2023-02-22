// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
	{
		path: "/market",
		redirect: "/market/schedule/card",
		component: () => import("@/components/layout.vue"),
		children: [
			{
				path: "schedule",
				name: "会员卡",
				component: () => import("@/views/schedule/index.vue"),
				children: [
					{
						path: "card",
						name: "时长卡",
						component: () => import("@/views/schedule/card.vue"),
						meta: { icon: "credit_card", color: "primary", backColorClass: "color-back-warehouse", show: true },
					},
				],
			},
		],
	},
	{
		path: "/market/login",
		component: () => import("@/views/login/index.vue"),
	},
	{
		path: "/:catchAll(.*)",
		component: () => import("@/views/error/404.vue"),
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
