<template>
	<q-layout container view="lHh Lpr lff">
		<q-drawer side="left" :width="180" show-if-above class="select-none hide-scrollbar bg-blue-grey-1">
			<div class="q-pt-sm q-pl-md text-weight-bold text-h5" :class="`text-${route.meta?.color}`">市场管理</div>

			<!-- 导航 -->
			<!-- 导航 -->
			<q-list v-for="(container, index) in routes">
				<div class="text-grey-13 q-px-md q-pt-md q-pb-sm">{{ container.name }}</div>
				<router-link
					v-for="route in container.children?.filter((e) => e.meta?.show)"
					:to="`/market/${container.path}/${route.path}`"
					v-slot="{ isActive }"
				>
					<q-item clickable :active="isActive" class="text-grey" :class.text-primary="isActive">
						<q-item-section side class="q-pr-sm">
							<q-icon :name="(route.meta?.icon as string)" :class="isActive ? `text-${route.meta?.color}` : 'text-grey'"> </q-icon>
						</q-item-section>
						<q-item-section class="text-weight-bold text-body1" :class="isActive ? `text-${route.meta?.color}` : 'text-grey'">
							{{ route.name }}
						</q-item-section>
					</q-item>
				</router-link>
			</q-list>

			<!-- 个人中心 -->
			<!-- 个人中心 -->
			<div style="height: 200px"></div>
			<q-list class="absolute-bottom bg-white">
				<q-item clickable @click="userDialog = true" class="q-pr-xs">
					<q-item-section avatar>
						<q-avatar rounded>
							<img :src="UserStore.userEditor?.avator || UserStore.wxAvatorDefault" />
						</q-avatar>
					</q-item-section>
					<q-item-section>
						<q-item-label class="text-weight-bold ellipsis">{{ UserStore.userEditor?.nickname }}</q-item-label>
						<q-item-label caption>欢迎使用</q-item-label>
					</q-item-section>
					<q-item-section side>
						<q-icon name="unfold_more" />
					</q-item-section>
				</q-item>
			</q-list>
			<q-dialog v-model="userDialog" persistent>
				<q-card class="w-400">
					<q-toolbar>
						<q-toolbar-title>个人信息</q-toolbar-title>

						<q-btn flat dense icon="close" v-close-popup />
					</q-toolbar>

					<q-separator />

					<q-card-section>
						<q-input filled label="用户昵称" class="q-mb-sm" v-model="UserStore.userEditor.nickname">
							<template v-slot:before>
								<q-icon name="person" />
							</template>
						</q-input>

						<q-input filled disable label="创建日期" class="q-mb-sm" v-model="UserStore.userEditor.timeCreateString">
							<template v-slot:before>
								<q-icon name="event" />
							</template>
						</q-input>
					</q-card-section>

					<q-card-actions>
						<q-btn color="negative" flat v-close-popup @click="router.push('/market/login')">
							<q-icon name="logout"></q-icon>
							<span class="q-ml-xs">退出</span>
						</q-btn>
						<q-space></q-space>
						<q-btn color="primary" v-close-popup @click="UserStore.patch()"> 应用 </q-btn>
					</q-card-actions>
				</q-card>
			</q-dialog>
		</q-drawer>

		<q-page-container>
			<q-page class="bg-blue-grey-1">
				<div class="app-background bg-dark">
					<q-img
						style="width: 200px; float: right; top: 20px; right: 20px"
						class="cursor-pointer select-none"
						src="@/assets/index.png"
						fit="cover"
						@click="openWebTab()"
					></q-img>
				</div>
				<div class="q-px-lg q-py-md" style="margin-top: -210px">
					<router-view />
				</div>
			</q-page>
		</q-page-container>
	</q-layout>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

import { useNotifyStore } from "@/stores/notify";
import { useUserStore } from "@/stores/user";
import { useScheduleCardStore } from "@/stores/scheduleCard";

const route = useRoute();
const router = useRouter();
const routes = router.options.routes[0].children;

const NotifyStore = useNotifyStore();
const UserStore = useUserStore();
const ScheduleCardStore = useScheduleCardStore();

const userDialog = ref(false);
const openWebTab = () => window.open("https://qqlx.tech");

// vue
onMounted(async () => {
	try {
		await UserStore.setNowUser();
	} catch (error) {
		NotifyStore.fail((error as Error).message);
	}
});
</script>

<style scoped lang="scss"></style>
