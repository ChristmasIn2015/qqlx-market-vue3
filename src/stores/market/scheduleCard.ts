import { defineStore } from "pinia";
import { cloneDeep } from "lodash";

import { getMongodbBase, getPage, MongodbSort } from "qqlx-cdk";
import { ENUM_PROJECT, PATH_MARKET_CARD } from "qqlx-core";

import type {
    getScheduleCardDto,
    getScheduleCardRes,
    postScheduleCardDto,
    postScheduleCardRes,
    patchScheduleCardDto,
    patchScheduleCardRes,
    deleteScheduleCardDto,
    deleteScheduleCardRes,
    ScheduleCard,
} from "qqlx-core";

import { request } from "@/lib";
import { useNotifyStore } from "@/stores/quasar/notify";
const NotifyStore = useNotifyStore();

function getSchema(): ScheduleCard {
    return {
        title: "",
        desc: "",
        scope: ENUM_PROJECT.KDBGS,
        schedule: 0,
        amount: 0,
        isDisabled: false,
        ...getMongodbBase(),
    };
}
export const useScheduleCardStore = defineStore({
    id: "ScheduleCard",
    state: () => ({
        editor: getSchema() as ScheduleCard,
        list: [] as ScheduleCard[],
    }),
    actions: {
        /** @viewcatch */
        async get() {
            try {
                const dto: getScheduleCardDto = { scope: ENUM_PROJECT.KDBGS };
                const res: getScheduleCardRes = await request.get(PATH_MARKET_CARD, { dto });
                this.list = res;
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        /** @viewcatch */
        async post() {
            try {
                const dto: postScheduleCardDto = { schema: this.editor };
                await request.post(PATH_MARKET_CARD, { dto });

                await this.get();
                NotifyStore.success("添加成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        /** @viewcatch */
        async patch() {
            try {
                const dto: patchScheduleCardDto = { schema: this.editor };
                await request.patch(PATH_MARKET_CARD, { dto });

                await this.get();
                NotifyStore.success("修改成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        /** @viewcatch */
        async delete(cardId: string) {
            try {
                const dto: deleteScheduleCardDto = { cardId };
                await request.delete(PATH_MARKET_CARD, { dto });

                await this.get();
                NotifyStore.success("删除成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        getSchema() {
            const schema: ScheduleCard = getSchema();
            return schema;
        },
        setEditor(entity?: ScheduleCard) {
            const schema = entity ? cloneDeep(entity) : this.getSchema();
            this.editor = schema;
        },
    },
});
