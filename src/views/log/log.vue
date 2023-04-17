<template>
    <div class="q-pl-xs q-mb-md">
        <div class="text-h5 text-primary text-weight-bold row items-center">
            <span>系统日志</span>
            <q-space></q-space>
        </div>
        <div class="text-option text-primary q-my-sm row items-center">
            <span>您可以在此看到订单的操作记录</span>
            <q-space></q-space>

            <picker-range
                @change="
                    ($event) => {
                        LogStore.page.startTime = $event.startTime;
                        LogStore.page.endTime = $event.endTime;
                        LogStore.get(1);
                        LogAnalysisStore.page.startTime = $event.startTime;
                        LogAnalysisStore.page.endTime = $event.endTime;
                        LogAnalysisStore.get(1);
                    }
                "
            />
            <q-btn
                class="q-ml-sm"
                color="negative"
                square
                @click="
                    () => {
                        LogAnalysisStore.setEditor();
                        logAnalysisDialog = true;
                    }
                "
                >新增分析</q-btn
            >
        </div>
    </div>

    <div class="row">
        <div class="w-255 q-pr-sm q-pb-sm" v-for="ana in LogAnalysisStore.result?.list">
            <q-card>
                <q-card-section class="text-h5">
                    <div class="row">
                        {{ ana.title }}

                        <q-space></q-space>
                        <q-btn padding="xs" icon="more_horiz" flat style="margin-right: -8px">
                            <q-menu>
                                <q-item
                                    clickable
                                    v-close-popup
                                    @click="
                                        async () => {
                                            await LogAnalysisStore.delete(ana._id);
                                            await LogAnalysisStore.get();
                                        }
                                    "
                                >
                                    <q-item-section>删除</q-item-section>
                                </q-item>
                            </q-menu>
                        </q-btn>
                    </div>
                    <div class="text-caption">{{ ana.desc }}</div>
                </q-card-section>
                <q-card-section class="section text-caption">
                    <div class="row" v-for="cal in ana.classes">
                        <div class="col-10">
                            <q-badge rounded :color="logColor[cal.type]" class="shadow-5 q-mr-sm"></q-badge>
                            <span>{{ MAP_ENUM_LOG.get(cal.type)?.text }}</span>
                        </div>
                        <div class="col text-right">{{ cal.count }}</div>
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </div>

    <q-card square>
        <q-table
            style="min-height: 630px"
            separator="cell"
            row-key="_id"
            dense
            :rows="LogStore.list"
            :rows-per-page-options="[0]"
            :columns="[
                { name: 'timeCreateString', field: 'timeCreateString', label: '创建时间', align: 'left' },
                { name: 'path', field: 'path', label: '路径', align: 'left' },
                { name: 'type', field: 'type', label: '类型', align: 'left' },
                { name: 'json', field: 'json', label: '内容', align: 'left' },
                { name: 'chain', field: 'chain', label: '识别码', align: 'left' },
            ]"
        >
            <template v-slot:header="props">
                <q-tr :props="props">
                    <q-th :props="props" key="timeCreateString">时间</q-th>
                    <q-th :props="props" key="path">
                        <q-input square filled dense clearable placeholder="路径" v-model="LogStore.search.path" @blur="LogStore.get(1)" />
                    </q-th>
                    <q-th :props="props" key="type">
                        <q-select
                            dense
                            square
                            filled
                            emit-value
                            map-options
                            placeholder="请选择类型"
                            clearable
                            option-label="text"
                            :options="[...MAP_ENUM_LOG].map((e) => e[1])"
                            v-model="LogStore.search.type"
                            @update:model-value="LogStore.get(1)"
                        />
                    </q-th>
                    <q-th :props="props" key="json">
                        <q-input square filled dense clearable placeholder="内容" v-model="LogStore.search.json" @blur="LogStore.get(1)" />
                    </q-th>
                    <q-th :props="props" key="chain">
                        <q-input square filled dense clearable placeholder="识别码" v-model="LogStore.search.chain" @blur="LogStore.get(1)" />
                    </q-th>
                </q-tr>
            </template>
            <template v-slot:body="props">
                <q-tr>
                    <q-td key="timeCreateString" :props="props">{{ props.row.timeCreateString }}</q-td>
                    <q-td key="path" :props="props">{{ props.row.path }}</q-td>
                    <q-td key="type" :props="props">
                        <q-chip square dense text-color="white" :color="logColor[props.row.type]">{{ MAP_ENUM_LOG.get(props.row.type)?.text }}</q-chip>
                    </q-td>
                    <q-td key="json" :props="props">{{ props.row.json }}</q-td>
                    <q-td key="chain" :props="props">{{ props.row.chain }}</q-td>
                </q-tr>
            </template>
            <template v-slot:bottom="props">
                <q-pagination
                    square
                    size="16px"
                    color="white"
                    class="q-my-sm"
                    text-color="black"
                    active-color="primary"
                    active-text-color="white"
                    v-model="LogStore.page.page"
                    :max-pages="10"
                    :max="Math.ceil(LogStore.total / LogStore.page.pageSize)"
                    @update:model-value="(value) => LogStore.get(value)"
                />
                <q-space></q-space>
                <span>共 {{ LogStore.total }} 项</span>
            </template>
        </q-table>

        <q-inner-loading :showing="LogAnalysisStore.loading">
            <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
    </q-card>

    <q-dialog v-model="logAnalysisDialog" persistent>
        <q-card class="w-400">
            <q-toolbar>
                <q-toolbar-title>日志分析</q-toolbar-title>

                <q-btn flat dense icon="close" v-close-popup />
            </q-toolbar>

            <q-separator />

            <q-card-section>
                <q-input filled label="名称" class="q-mb-sm" v-model="LogAnalysisStore.editor.title" />
                <q-input filled label="描述" class="q-mb-sm" v-model="LogAnalysisStore.editor.desc" />
                <q-input filled label="路径" class="q-mb-sm" v-model="LogAnalysisStore.editor.path" />
            </q-card-section>

            <q-card-actions>
                <q-space></q-space>
                <q-btn color="primary" square v-close-popup @click="LogAnalysisStore.post()">保存</q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script lang="ts" setup>
import { MongodbSort } from "qqlx-cdk";
import { cloneDeep, debounce } from "lodash";
import { onMounted, watch, ref, computed } from "vue";
import { MAP_ENUM_LOG } from "qqlx-core";

import pickerRange from "@/components/picker-range.vue";
import { useNotifyStore } from "@/stores/quasar/notify";
import { useLogStore } from "@/stores/market/log";
import { useLogAnalysisStore } from "@/stores/market/analysis";

const NotifyStore = useNotifyStore();
const LogStore = useLogStore();

const LogAnalysisStore = useLogAnalysisStore();
const logAnalysisDialog = ref(false);
const logColor = ref(["negative", "negative", "negative", "amber", "cyan", "cyan", "grey", "positive"]);

onMounted(async () => {
    await LogStore.get(1);
    await LogAnalysisStore.get();
});
</script>

<style lang="sass"></style>
