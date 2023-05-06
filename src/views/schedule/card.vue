<template>
    <div class="q-pl-xs q-mb-sm">
        <div class="text-h5 text-primary text-weight-bold">时长卡</div>
        <div class="text-option text-primary row items-center">
            仅超级管理员可以操作。
            <q-space></q-space>
            <q-btn
                push
                square
                color="negative"
                @click="
                    () => {
                        ScheduleCardStore.setEditor();
                        dialogScheduleCard = true;
                    }
                "
            >
                添加
            </q-btn>
        </div>
    </div>

    <div class="row">
        <q-card v-for="card in ScheduleCardStore.list.filter((e) => e.isDisabled === false)" class="w-325 q-mr-md q-mb-md shadow-15">
            <q-card-section>
                <div class="text-h6 ellipsis">{{ card.title }}</div>
                <div class="text-grey ellipsis">{{ card.desc || "-" }}</div>
                <q-separator class="q-my-sm"></q-separator>
                <div class="text-grey">
                    <div class="row">
                        <div class="col">时长</div>
                        <div class="col text-right">{{ card.schedule / 86400000 }} 天</div>
                    </div>
                    <div class="row">
                        <div class="col">金额</div>
                        <div class="col text-right">{{ card.amount }} 元</div>
                    </div>
                    <div class="row">
                        <div class="col">创建时间</div>
                        <div class="col text-right">{{ card.timeCreateString }}</div>
                    </div>
                </div>
            </q-card-section>
            <q-card-actions>
                <q-space></q-space>
                <q-btn icon="more_horiz" flat>
                    <q-menu>
                        <q-list>
                            <q-item
                                clickable
                                v-close-popup
                                @click="
                                    () => {
                                        ScheduleCardStore.setEditor(card);
                                        dialogScheduleCard = true;
                                    }
                                "
                            >
                                <q-item-section>修改</q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup>
                                <q-item-section class="text-negative" @click="ScheduleCardStore.delete(card._id)"> 删除 </q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
            </q-card-actions>
        </q-card>
    </div>

    <div class="q-pl-xs q-my-md">
        <div class="text-h5 text-primary text-weight-bold">最近删除</div>
    </div>
    <div class="row">
        <q-card v-for="card in ScheduleCardStore.list.filter((e) => e.isDisabled === true)" class="w-325 q-mr-md q-mb-md shadow-15 bg-grey-4">
            <q-card-section>
                <div class="text-h6 ellipsis">{{ card.title }}</div>
                <div class="text-grey ellipsis">{{ card.desc || "-" }}</div>
                <q-separator class="q-my-sm"></q-separator>
                <div class="text-grey">
                    <div class="row">
                        <div class="col">时长</div>
                        <div class="col text-right">{{ card.schedule / 86400000 }} 天</div>
                    </div>
                    <div class="row">
                        <div class="col">金额</div>
                        <div class="col text-right">{{ card.amount }} 元</div>
                    </div>
                    <div class="row">
                        <div class="col">创建时间</div>
                        <div class="col text-right">{{ card.timeCreateString }}</div>
                    </div>
                </div>
            </q-card-section>
            <q-card-actions>
                <q-space></q-space>
                <q-btn icon="more_horiz" flat>
                    <q-menu>
                        <q-list>
                            <q-item clickable v-close-popup>
                                <q-item-section class="text-negative" @click="ScheduleCardStore.delete(card._id)"> 恢复 </q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
            </q-card-actions>
        </q-card>
    </div>

    <q-dialog v-model="dialogScheduleCard" persistent>
        <q-card class="w-400">
            <q-toolbar>
                <q-toolbar-title>会员卡</q-toolbar-title>
                <q-btn dense flat icon="close" v-close-popup></q-btn>
            </q-toolbar>
            <q-separator />

            <q-card-section>
                <q-input filled label="卡片名称" class="q-mb-sm" v-model="ScheduleCardStore.editor.title">
                    <template v-slot:before>
                        <q-icon name="credit_card" />
                    </template>
                </q-input>

                <q-input filled label="描述" class="q-mb-sm" v-model="ScheduleCardStore.editor.desc">
                    <template v-slot:before>
                        <q-icon name="" />
                    </template>
                </q-input>
                <q-input filled label="时长/毫秒" class="q-mb-sm" :disable="!!ScheduleCardStore.editor._id" v-model="ScheduleCardStore.editor.schedule">
                    <template v-slot:before>
                        <q-icon name="" />
                    </template>
                </q-input>

                <q-input filled label="金额" class="q-mb-sm" :disable="!!ScheduleCardStore.editor._id" v-model="ScheduleCardStore.editor.amount">
                    <template v-slot:before>
                        <q-icon name="" />
                    </template>
                </q-input>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn
                    color="primary"
                    push
                    square
                    v-close-popup
                    @click="
                        async () => {
                            if (ScheduleCardStore.editor._id) await ScheduleCardStore.patch();
                            else await ScheduleCardStore.post();
                        }
                    "
                >
                    {{ ScheduleCardStore.editor._id ? "保存" : "新增" }}
                </q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";

import { useScheduleCardStore } from "@/stores/market/scheduleCard";

const ScheduleCardStore = useScheduleCardStore();
const dialogScheduleCard = ref(false);

onMounted(() => ScheduleCardStore.get());
</script>

<style scoped lang="scss"></style>
