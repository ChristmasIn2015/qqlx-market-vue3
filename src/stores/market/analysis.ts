import { defineStore } from "pinia";
import { cloneDeep } from "lodash";

import { getMongodbBase, getPage, MongodbSort } from "qqlx-cdk";
import { ENUM_LOG, ENUM_PROJECT, PATH_LOG_ANALYSIS } from "qqlx-core";

import type {
    postLogAnalysisDto,
    postLogAnalysisRes,
    getLogAnalysisDto,
    getLogAnalysisRes,
    deleteLogAnalysisDto,
    deleteLogAnalysisRes,
    LogAnalysis,
} from "qqlx-core";

import { request } from "@/lib";
import { useNotifyStore } from "@/stores/quasar/notify";
const NotifyStore = useNotifyStore();

function getSchema(): LogAnalysis {
    return {
        title: "",
        desc: "",
        path: "",
        ...getMongodbBase(),
    };
}
export const useLogAnalysisStore = defineStore({
    id: "LogAnalysis",
    state: () => ({
        result: { list: [] } as getLogAnalysisRes,
        search: getSchema(),
        editor: getSchema(),
        page: getPage(),
        loading: false,
    }),
    actions: {
        /** @viewcatch */
        async post() {
            try {
                this.loading = true;
                const dto: postLogAnalysisDto = this.editor;
                await request.post(PATH_LOG_ANALYSIS, { dto });

                this.setEditor();
                await this.get();
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            } finally {
                this.loading = false;
            }
        },
        /** @viewcatch */
        async get() {
            try {
                this.loading = true;
                const dto: getLogAnalysisDto = {
                    page: this.page,
                };
                const result: getLogAnalysisRes = await request.get(PATH_LOG_ANALYSIS, { dto });
                this.result = result;
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            } finally {
                this.loading = false;
            }
        },
        /** @viewcatch */
        async delete(entityId: string) {
            try {
                const dto: deleteLogAnalysisDto = { entityId };
                await request.delete(PATH_LOG_ANALYSIS, { dto });

                await this.get();
                NotifyStore.success("删除成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        getSchema() {
            const schema: LogAnalysis = getSchema();
            return schema;
        },
        setEditor(entity?: LogAnalysis) {
            const schema = entity ? cloneDeep(entity) : this.getSchema();
            this.editor = schema;
        },
    },
});
