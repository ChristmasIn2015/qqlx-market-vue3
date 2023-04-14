// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/market",
        redirect: "/market/schedule/card",
        component: () => import("@/layout/index.vue"),
        children: [
            {
                path: "schedule",
                name: "营销工具",
                component: () => import("@/views/schedule/index.vue"),
                children: [
                    {
                        path: "card",
                        name: "礼品卡",
                        component: () => import("@/views/schedule/card.vue"),
                        meta: { icon: "card_giftcard", color: "primary", backColorClass: "color-back-warehouse", show: true },
                    },
                ],
            },
            {
                path: "system",
                name: "系统管理",
                component: () => import("@/views/log/index.vue"),
                children: [
                    {
                        path: "log",
                        name: "系统日志",
                        component: () => import("@/views/log/log.vue"),
                        meta: { icon: "subject", color: "primary", backColorClass: "color-back-warehouse", show: true },
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
