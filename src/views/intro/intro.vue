<template>
    <div class="q-pl-xs q-mb-sm">
        <div class="text-h5 text-primary text-weight-bold row">说明书</div>
        <div class="text-option text-primary row items-center">
            说明书将会在项目中帮助用户更好地使用系统
            <q-space></q-space>
            <q-btn
                push
                square
                color="negative"
                @click="
                    () => {
                        IntroGroupStore.setEditor();
                        IntroStore.listExcel = [];
                        IntroStore.push();
                        dialogIntroGroup = true;
                    }
                "
            >
                添加说明书
            </q-btn>
        </div>
    </div>

    <div class="row">
        <q-card v-for="group in IntroGroupStore.list" class="w-325 q-mr-md q-mb-md shadow-15 column">
            <q-card-section>
                <div class="text-h6 ellipsis">{{ group.path }}</div>
                <div class="text-grey ellipsis">{{ group.actions || "-" }}</div>
                <q-separator class="q-my-sm"></q-separator>
                <div class="text-grey">
                    <div class="row" v-for="intro of group.joinIntros">
                        <div class="col-9 ellipsis-2-lines">{{ intro.content }}</div>
                        <div class="col-3 text-right">{{ MAP_ENUM_INTRO.get(intro.type)?.text }}</div>
                    </div>
                </div>
            </q-card-section>
            <q-space></q-space>
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
                                        IntroGroupStore.setEditor(group);
                                        IntroStore.listExcel = cloneDeep(group.joinIntros);
                                        dialogIntroGroup = true;
                                    }
                                "
                            >
                                <q-item-section>修改</q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup>
                                <q-item-section class="text-negative" @click="IntroGroupStore.delete(group)"> 删除 </q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
            </q-card-actions>
        </q-card>
    </div>

    <q-dialog v-model="dialogIntroGroup" persistent>
        <q-card class="w-400 q-mr-sm">
            <q-toolbar>
                <q-toolbar-title>说明手册</q-toolbar-title>
                <q-btn dense flat icon="close" v-close-popup></q-btn>
            </q-toolbar>
            <q-separator />

            <q-card-section>
                <q-input filled label="路径" class="q-mb-sm" v-model="IntroGroupStore.editor.path" />
                <q-input filled label="点击事件" class="q-mb-sm" v-model="IntroGroupStore.editor.actions" />
            </q-card-section>

            <q-card-actions>
                <q-btn
                    flat
                    color="primary"
                    v-close-popup
                    @click="
                        async () => {
                            if (IntroGroupStore.editor._id) await IntroGroupStore.put(IntroStore.listExcel);
                            else await IntroGroupStore.post(IntroStore.listExcel);
                            IntroStore.listExcel = [];
                        }
                    "
                >
                    {{ IntroGroupStore.editor._id ? "保存" : "确定" }}
                </q-btn>
                <q-space></q-space>
                <q-btn flat color="primary" @click="IntroStore.push()">+ 添加说明：{{ IntroStore.listExcel.length }} </q-btn>
            </q-card-actions>
        </q-card>

        <div class="w-600">
            <q-card v-for="(intro, index) of IntroStore.listExcel" class="q-mb-sm">
                <q-card-section class="row">
                    <div class="col-3">
                        <q-select
                            filled
                            map-options
                            emit-value
                            option-value="value"
                            :options="[...MAP_ENUM_INTRO].map((e) => ({ label: e[1].text, value: e[1].value }))"
                            v-model="intro.type"
                        />
                    </div>
                    <div class="col-9 q-pl-md">
                        <q-input filled label="内容" v-model="intro.content" />
                    </div>
                </q-card-section>
                <q-card-section v-if="intro.type === ENUM_INTRO.IMAGE">
                    <q-img class="shadow-5" :src="intro.content"></q-img>
                </q-card-section>
                <q-card-actions>
                    <q-btn flat disable>第 {{ index + 1 }} 项</q-btn>
                    <q-space></q-space>
                    <q-btn color="negative" flat @click="IntroStore.listExcel.splice(index, 1)">删除</q-btn>
                </q-card-actions>
            </q-card>
        </div>
    </q-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { MAP_ENUM_INTRO, ENUM_INTRO } from "qqlx-core";

import { useScheduleCardStore } from "@/stores/market/scheduleCard";
import { useIntroStore } from "@/stores/market/intro";
import { useIntroGroupStore } from "@/stores/market/introGroup";
import { cloneDeep } from "lodash";

const IntroStore = useIntroStore();
const IntroGroupStore = useIntroGroupStore();
const ScheduleCardStore = useScheduleCardStore();
const dialogIntroGroup = ref(false);

onMounted(() => IntroGroupStore.get());
</script>

<style scoped lang="scss"></style>
