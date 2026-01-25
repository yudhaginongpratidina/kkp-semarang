import { create } from "zustand";
import {
    collection,
    onSnapshot,
    query,
    updateDoc,
    doc,
    deleteDoc,
    addDoc,
} from "firebase/firestore";
import { db } from "../configs/firebase";

// ================= Types =================
export interface Trader {
    id: string;
    nama_trader: string;
    kode_trader: string;
    npwp: string;
    alamat_trader: string;
}

type TraderState = {
    traders: Trader[];
    isLoading: boolean;
    error: string | null;
};

type TraderAction = {
    getTraders: () => () => void;
    addTrader: (data: Omit<Trader, "id">) => Promise<void>;
    updateTrader: (id: string, data: Partial<Trader>) => Promise<void>;
    deleteTrader: (id: string) => Promise<void>;
};

// ================= Store =================
const useTraderStore = create<TraderState & TraderAction>((set) => ({
    traders: [],
    isLoading: false,
    error: null,

    // Ambil data realtime
    getTraders: () => {
        set({ isLoading: true });
        const q = query(collection(db, "traders"));
        
        const unsubscribe = onSnapshot(
            q,
            (snap) => {
                const data = snap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Trader[];
                set({ traders: data, isLoading: false });
            },
            (err) => {
                console.error("Error Fetching Traders:", err);
                set({ error: "Gagal mengambil data trader", isLoading: false });
            }
        );

        return unsubscribe;
    },

    // Tambah Trader Baru
    addTrader: async (data) => {
        try {
            await addDoc(collection(db, "traders"), data);
        } catch (err) {
            console.error("Error Add Trader:", err);
            throw err;
        }
    },

    // Update Data Trader
    updateTrader: async (id, data) => {
        try {
            const docRef = doc(db, "traders", id);
            await updateDoc(docRef, data);
        } catch (err) {
            console.error("Error Update Trader:", err);
            throw err;
        }
    },

    // Hapus Trader
    deleteTrader: async (id) => {
        try {
            const docRef = doc(db, "traders", id);
            await deleteDoc(docRef);
        } catch (err) {
            console.error("Error Delete Trader:", err);
            throw err;
        }
    },
}));

export default useTraderStore