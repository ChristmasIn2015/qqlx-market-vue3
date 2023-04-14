<template>
    <q-layout container view="lHh Lpr lff">
        <q-drawer side="left" :width="180" show-if-above class="select-none hide-scrollbar shadow-15">
            <div class="text-weight-bold text-h5 q-pl-md q-py-md text-primary">
                <div>营销中心</div>
                <div class="text-caption">清泉流响@Copyright</div>
            </div>

            <!-- 个人中心 -->
            <!-- 个人中心 -->
            <q-item clickable class="q-px-sm q-mb-sm bg-primary text-white" @click="userDialog = true">
                <q-item-section avatar>
                    <q-avatar size="40">
                        <img :src="UserStore.userEditor?.avator || UserStore.wxAvatorDefault" />
                        <!-- <q-badge color="negative" floating v-if="scheduleString.isOver">已过期</q-badge> -->
                    </q-avatar>
                </q-item-section>
                <q-item-section>
                    <q-item-label class="text-weight-bold ellipsis">{{ UserStore.userEditor?.nickname }}</q-item-label>
                    <q-item-label class="text-caption ellipsis">-</q-item-label>
                </q-item-section>
                <q-item-section side top>
                    <q-icon name="arrow_drop_down" color="white" />
                </q-item-section>
            </q-item>

            <q-dialog v-model="userDialog" persistent>
                <q-card class="w-400">
                    <q-toolbar>
                        <q-toolbar-title>个人信息</q-toolbar-title>

                        <q-btn flat dense icon="close" v-close-popup />
                    </q-toolbar>

                    <q-separator />

                    <q-card-section>
                        <q-input readonly filled label="用户昵称" class="q-mb-sm" v-model="UserStore.userEditor.nickname">
                            <template v-slot:append>
                                <q-btn fab flat icon="save" color="primary">
                                    <q-tooltip class="text-body1"> 保存 </q-tooltip>
                                </q-btn>
                            </template>
                        </q-input>
                    </q-card-section>

                    <q-card-actions>
                        <q-btn color="negative" flat v-close-popup @click="router.push('/market/login')">
                            <q-icon name="logout"></q-icon>
                            <span class="q-ml-xs">退出</span>
                        </q-btn>
                        <q-space></q-space>
                    </q-card-actions>
                </q-card>
            </q-dialog>

            <!-- 导航 -->
            <!-- 导航 -->
            <q-list v-for="(container, index) in routes">
                <div v-if="container.name" class="text-caption text-grey-13 q-pa-md">{{ container.name }}</div>
                <router-link
                    v-for="route in container.children?.filter((e) => e.meta?.show)"
                    :to="`/market/${container.path}/${route.path}`"
                    v-slot="{ isActive }"
                >
                    <q-item clickable :active="isActive" class="text-primary q-pa-none q-pl-md" :class="{ 'bg-primary': isActive, 'text-white': isActive }">
                        <q-item-section side :class="{ 'text-primary': !isActive, 'text-white': isActive }">
                            <q-icon :name="(route.meta?.icon as string)"> </q-icon>
                        </q-item-section>
                        <q-item-section class="text-weight-bold text-body1" :class="{ 'text-primary': !isActive, 'text-white': isActive }">
                            <q-item-label style="position: relative">
                                <span>
                                    {{ route.name }}
                                    <!-- <q-badge style="transform: translateY(-2px)" color="negative" v-if="skuNotConfirmedAll > 0 && route.path === 'sku-list'">
                                        {{ skuNotConfirmedAll }}
                                    </q-badge> -->
                                </span>
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                </router-link>
            </q-list>
        </q-drawer>

        <q-page-container>
            <q-page class="bg-blue-grey-1">
                <!-- 主页面 -->
                <div class="q-px-lg q-pt-lg">
                    <router-view />
                </div>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

import { useNotifyStore } from "@/stores/quasar/notify";
import { useUserStore } from "@/stores/user/user";

const router = useRouter();
const routes = router.options.routes[0].children;

const NotifyStore = useNotifyStore();
const UserStore = useUserStore();

const userDialog = ref(false);
const openWebTab = () => window.open("https://qqlx.tech");

onMounted(async () => {
    try {
        await UserStore.transformAuthorization();
    } catch (error) {
        NotifyStore.fail((error as Error).message);
    }
});
</script>

<style scoped lang="scss"></style>
