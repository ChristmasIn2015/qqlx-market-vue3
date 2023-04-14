import { defineStore } from "pinia";
import { Notify, useQuasar } from "quasar";

export const useNotifyStore = defineStore("Notify", {
    state: () => ({
        cellStyle: `font-size: 16px; width: 188px`,
    }),
    actions: {
        success(message: string) {
            Notify.create({
                group: false,
                progress: true,
                // position: "top-left",
                type: "positive",
                message,
                timeout: 1000,
            });
        },
        fail(message: string, caption?: string) {
            Notify.create({
                group: false,
                progress: true,
                position: "top",
                type: "negative",
                message,
                caption,
            });
        },
        getQuasarStore() {
            const $q = useQuasar();
            return $q;
        },
    },
});
