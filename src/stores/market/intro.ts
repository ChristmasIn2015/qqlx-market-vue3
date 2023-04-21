import { defineStore } from "pinia";
import { cloneDeep } from "lodash";

import { getMongodbBase, getPage, MongodbSort } from "qqlx-cdk";
import { ENUM_INTRO, ENUM_LOG, ENUM_PROJECT, PATH_LOG } from "qqlx-core";

import type { Intro } from "qqlx-core";

import { request } from "@/lib";
import { useNotifyStore } from "@/stores/quasar/notify";
const NotifyStore = useNotifyStore();

function getSchema(): Intro {
    return {
        groupId: "",
        type: ENUM_INTRO.TITLE,
        content: "",
        ...getMongodbBase(),
    };
}
export const useIntroStore = defineStore({
    id: "Intro",
    state: () => ({
        listExcel: [] as Intro[],
    }),
    actions: {
        push() {
            const schema = this.getSchema();
            this.listExcel.push(schema);
        },
        getSchema() {
            const schema: Intro = getSchema();
            return schema;
        },
    },
});
