import { create } from "zustand";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../configs/firebase";
import { toast } from 'sonner';

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
                // Info jika user baru/data kosong
                toast.info("Database Empty", { description: "Belum ada No Aju yang terdaftar untuk user ini." });
            }
        } catch (err: any) {
            set({ error: err.message });
            toast.error("Fetch Failed", { description: "Gagal menyinkronkan data No Aju." });
        } finally {
            set({ loading: false });
        }
    },

    upsert_no_aju: async (uid, items) => {
        set({ loading: true, error: null });
        
        // Filter item kosong agar tidak mengotori database
        const cleanedItems = items.filter(item => item.noAju.trim() !== "");

        const promise = async () => {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("uid", "==", uid));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) throw new Error("USER_NOT_FOUND");

            const userDocRef = doc(db, "users", querySnapshot.docs[0].id);
            await updateDoc(userDocRef, {
                noAjuList: cleanedItems,
                updatedAt: new Date().toISOString()
            });

            set({ noAjuItems: cleanedItems.length > 0 ? cleanedItems : [{ noAju: "", expiredAju: "" }] });
            return cleanedItems;
        };

        toast.promise(promise(), {
            loading: 'Synchronizing No Aju Registry...',
            success: (data: any) => {
                return `Update Success: ${data.length} items commited.`;
            },
            error: (err) => {
                if (err.message === "USER_NOT_FOUND") return "Identity Error: User tidak ditemukan.";
                return "Write Error: Gagal memperbarui database.";
            }
        });

        // Kita tidak perlu set loading false di sini karena ditangani oleh status promise, 
        // tapi untuk konsistensi state lokal:
        try {
            await promise;
        } catch {
            // Error ditangani toast.promise
        } finally {
            set({ loading: false });
        }
    }
}));