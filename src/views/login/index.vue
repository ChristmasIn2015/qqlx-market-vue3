<template>
	<div class="full-height color-back-main row justify-center items-center">
		<div class="text-white column q-mr-xl q-pt-xs" style="max-width: 600px; height: 430px">
			<div class="text-h2 text-weight-bold">欢迎使用，市场管理</div>
			<div class="q-pt-sm"></div>
			<div class="text-h5">QingQuan Market Management System</div>

			<div class="text-body1 q-mt-lg">
				<!-- <div>本产品主要用于钢材贸易、加工型企业</div>
				<div>* 可统计客户回款、开票信息</div>
				<div>* 销售时可快速挑选产品进行开单、打印</div>
				<div>* 支持原材料领料、加工，及其之后的库存自动计算</div>
				<div>* 支持办公室中多人多角色分配，以确保有效的工作流程和高效的团队合作</div> -->
			</div>

			<div class="text-body1 q-mt-lg">
				<div>@清泉流响 网络工作室</div>
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

import { useUserStore } from "@/stores/user";
import { useNotifyStore } from "@/stores/notify";

const time = ref("");
const route = useRoute();
const NotifyStore = useNotifyStore();
const UserStore = useUserStore();

onMounted(async () => {
	const code = route.query.code as string;
	const state = route.query.state as string;

	try {
		// 登录
		if (state === "LOGIN" && code) {
			const res = await UserStore.post(code);
			// 登录成功后会自动刷新页面

			if (res) {
				window.location.assign("/market");
			}
		}
	} catch (error) {
		NotifyStore.fail((error as Error).message);
		console.log((error as Error).message);
	}
	// 游客
	setTimeout(() => {
		const WxLogin = window.WxLogin as any;
		WxLogin &&
			document.getElementById("wx-login") &&
			new WxLogin({
				id: "wx-login",
				appid: "wxd0e6ee13822ccb7f",
				scope: "snsapi_login",
				redirect_uri: "http://qqlx.tech/market/login",
				state: "LOGIN",
			});
		console.log(WxLogin, document.getElementById("wx-login"));
	}, 500);

	const start = new Date(`2021/06/01 08:35:26`).getTime();

	if (window.loginTimer) clearInterval(window.loginTimer);
	window.loginTimer = setInterval(() => {
		const gap = Date.now() - start;

		const hour = ~~(gap / 1000 / 60 / 60) % 24;
		const _hour = hour < 10 ? `0${hour}` : hour.toString();

		const min = ~~(gap / 1000 / 60) % 60;
		const _min = min < 10 ? `0${min}` : min.toString();

		const sec = ~~(gap / 1000) % 60;
		const _sec = sec < 10 ? `0${sec}` : sec.toString();

		const day = ~~(gap / 1000 / 60 / 60 / 24);
		time.value = `${day}天 ${_hour}:${_min}:${_sec}`;
	}, 1000);
});
</script>

<style lang="scss"></style>
