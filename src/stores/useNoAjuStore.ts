import { create } from "zustand";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    Timestamp
} from "firebase/firestore";
import { db } from "../configs/firebase";

// Definisi tipe data untuk state NoAju
export type NoAjuData = {
    noAju: string;
    expiredAju: any;
};

export type NoAjuState = {
    noAju: ""
    currentNoAju: NoAjuData | null;
    loading: boolean;
    error: string | null;
};

type NoAjuAction = {
    setField: <K extends keyof NoAjuData>(key: K, value: NoAjuData[K]) => void
    upsert_no_aju: (uid: string, noAju: string) => Promise<void>;
    get_no_aju_by_uid: (uid: string) => Promise<void>;
};

export const useNoAjuStore = create<NoAjuState & NoAjuAction>((set) => ({
    noAju: "",
    currentNoAju: null,
    loading: false,
    error: null,

    // Set field dinamis
    setField: (key, value) => set({ [key]: value } as Partial<NoAjuState>),

    // Fungsi untuk mengambil data NoAju berdasarkan UID
    get_no_aju_by_uid: async (uid: string) => {
        set({ loading: true, error: null });
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("uid", "==", uid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                if (userData.noAju) {
                    set({
                        currentNoAju: {
                            noAju: userData.noAju,
                            expiredAju: userData.expiredAju
                        }
                    });
                } else {
                    set({ currentNoAju: null });
                }
            } else {
                set({ currentNoAju: null });
            }
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },

    // Fungsi untuk create/update No Aju dengan expired 6 bulan
    upsert_no_aju: async (uid, noAju) => {
        set({ loading: true, error: null });
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("uid", "==", uid));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) throw new Error("User tidak ditemukan.");

            const userDoc = querySnapshot.docs[0];
            const userDocRef = doc(db, "users", userDoc.id);

            // Hitung expired 6 bulan
            const today = new Date();
            const expiredDate = new Date(today.setMonth(today.getMonth() + 6));
            const expiredTimestamp = Timestamp.fromDate(expiredDate);

            await updateDoc(userDocRef, {
                noAju: noAju,
                expiredAju: expiredTimestamp
            });

            // Update state lokal agar UI langsung berubah
            set({ currentNoAju: { noAju, expiredAju: expiredTimestamp } });

        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    }
}));