import { create } from "zustand";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../configs/firebase";

export interface NoAjuItem {
    noAju: string;
    expiredAju: string;
}

export type NoAjuState = {
    noAjuItems: NoAjuItem[];
    loading: boolean;
    error: string | null;
};

type NoAjuAction = {
    setNoAjuItems: (items: NoAjuItem[]) => void;
    upsert_no_aju: (uid: string, items: NoAjuItem[]) => Promise<void>;
    get_no_aju_by_uid: (uid: string) => Promise<void>;
    resetStore: () => void;
};

export const useNoAjuStore = create<NoAjuState & NoAjuAction>((set) => ({
    noAjuItems: [],
    loading: false,
    error: null,

    setNoAjuItems: (items) => set({ noAjuItems: items }),

    resetStore: () => set({ noAjuItems: [], error: null, loading: false }),

    get_no_aju_by_uid: async (uid: string) => {
        set({ loading: true, error: null });
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("uid", "==", uid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                const list = userData.noAjuList || [];
                set({
                    noAjuItems: list.length > 0 ? list : [{ noAju: "", expiredAju: "" }]
                });
            } else {
                set({ noAjuItems: [{ noAju: "", expiredAju: "" }] });
            }
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },

    upsert_no_aju: async (uid, items) => {
        set({ loading: true, error: null });
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("uid", "==", uid));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) throw new Error("User tidak ditemukan.");

            const userDocRef = doc(db, "users", querySnapshot.docs[0].id);
            await updateDoc(userDocRef, {
                noAjuList: items,
                updatedAt: new Date().toISOString()
            });

            set({ noAjuItems: items });
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        } finally {
            set({ loading: false });
        }
    }
}));