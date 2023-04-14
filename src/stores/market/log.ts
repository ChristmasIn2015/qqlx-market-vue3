import { defineStore } from "pinia";
import { cloneDeep } from "lodash";

import { getMongodbBase, getPage, MongodbSort } from "qqlx-cdk";
import { ENUM_LOG, ENUM_PROJECT, PATH_LOG } from "qqlx-core";

import type { getLogDto, getLogRes, Log } from "qqlx-core";

import { request } from "@/lib";
import { useNotifyStore } from "@/stores/quasar/notify";
const NotifyStore = useNotifyStore();

function getSchema(): Log {
    return {
        type: ENUM_LOG.ALL,
        path: "",
        chain: "",
        json: "",
        ...getMongodbBase(),
    };
}
export const useLogStore = defineStore({
    id: "Log",
    state: () => ({
        list: [] as Log[],
        search: getSchema(),
        page: getPage(15),
        total: 0,
    }),
    actions: {
        /** @viewcatch */
        async get(page: number = 1) {
            try {
                if (page >= 1) this.page.page = page;

                const dto: getLogDto = {
                    search: this.search,
                    page: this.page,
                };
                const res: getLogRes = await request.get(PATH_LOG, { dto });
                this.list = res.list;
                this.total = res.total;
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        getSchema() {
            const schema: Log = getSchema();
            return schema;
        },
    },
});
