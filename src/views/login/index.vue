<template>
    <div class="full-height color-back-main row justify-center items-center">
        <div class="text-white column q-mr-xl q-pt-xs" style="max-width: 600px; height: 430px">
            <div class="text-h2 text-weight-bold">欢迎使用，营销中心</div>
            <div class="q-pt-sm"></div>
            <div class="text-h5">QingQuan Market Management System</div>

            <div class="text-body1 q-mt-lg"></div>

            <div class="text-body1 q-mt-lg">
                <div>@清泉流响·软件信息有限责任公司</div>
                <div>系统已运行 {{ time }}</div>
            </div>
        </div>

        <div>
            <q-card class="q-pt-lg text-center w-400">
                <div id="wx-login"></div>
            </q-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getTimeGap } from "qqlx-cdk";

import { useUserStore } from "@/stores/user/user";
import { useNotifyStore } from "@/stores/quasar/notify";

const time = ref("");
const route = useRoute();
const NotifyStore = useNotifyStore();
const UserStore = useUserStore();

onMounted(async () => {
    const code = route.query.code as string;
    const state = route.query.state as string;

    // 登录
    try {
        if (state === "LOGIN" && code) {
            await UserStore.post(code);
            window.location.assign("/market");
        }
    } catch (error) {
        NotifyStore.fail((error as Error).message);
        console.log((error as Error).message);
    }

    // 微信登录二维码
    setTimeout(() => {
        const WxLogin = window.WxLogin as any;
        WxLogin &&
            document.getElementById("wx-login") &&
            new WxLogin({
                id: "wx-login",
                appid: "wxd0e6ee13822ccb7f",
                scope: "snsapi_login",
                redirect_uri: "http://qqlx.tech/",
                state: "LOGIN",
            });
        console.log(WxLogin, document.getElementById("wx-login"));
    }, 500);

    // 广告
    const start = new Date(`2021/06/01 08:35:26`).getTime();
    if (window.loginTimer) clearInterval(window.loginTimer);
    window.loginTimer = setInterval(() => {
        time.value = getTimeGap(Date.now(), start);
    }, 1000);
});
</script>

<style lang="scss"></style>
