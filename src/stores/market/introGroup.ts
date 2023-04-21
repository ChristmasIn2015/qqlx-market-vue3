import { defineStore } from "pinia";
import { cloneDeep } from "lodash";

import { getMongodbBase, getPage, MongodbSort } from "qqlx-cdk";
import { ENUM_INTRO, PATH_INTRO_GROUP, ENUM_PROJECT, PATH_LOG, type Intro } from "qqlx-core";

import type {
    IntroGroup,
    IntroGroupJoined,
    getIntroGroupDto,
    getIntroGroupRes,
    postIntroGroupDto,
    postIntroGroupRes,
    putIntroGroupDto,
    putIntroGroupRes,
    deleteIntroGroupDto,
    deleteIntroGroupRes,
} from "qqlx-core";

import { request } from "@/lib";
import { useNotifyStore } from "@/stores/quasar/notify";
const NotifyStore = useNotifyStore();

function getSchema(): IntroGroup {
    return {
        scope: ENUM_PROJECT.KDBGS,
        path: "",
        actions: "",
        ...getMongodbBase(),
    };
}
export const useIntroGroupStore = defineStore({
    id: "IntroGroup",
    state: () => ({
        search: getSchema(),
        editor: getSchema(),
        list: [] as IntroGroupJoined[],
    }),
    actions: {
        /** @view catch */
        async get() {
            try {
                const dto: getIntroGroupDto = { search: this.search };
                const res: getIntroGroupRes = await request.get(PATH_INTRO_GROUP, { dto });
                this.list = res;
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        /** @view catch */
        async post(intros: Intro[]) {
            try {
                const dto: postIntroGroupDto = { group: this.editor, intros };
                const res: postIntroGroupRes = await request.post(PATH_INTRO_GROUP, { dto });
                this.get();
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        /** @view catch */
        async put(intros: Intro[]) {
            try {
                const dto: putIntroGroupDto = { group: this.editor, intros };
                const res: putIntroGroupRes = await request.put(PATH_INTRO_GROUP, { dto });
                this.get();
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        /** @view catch */
        async delete(group: IntroGroup) {
            try {
                const dto: deleteIntroGroupDto = { groupId: group._id };
                const res: deleteIntroGroupRes = await request.delete(PATH_INTRO_GROUP, { dto });
                this.get();
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        getSchema() {
            const schema: IntroGroup = getSchema();
            return schema;
        },
        setEditor(entity?: IntroGroupJoined) {
            const schema = entity || getSchema();
            this.editor = cloneDeep(schema);
        },
    },
});
