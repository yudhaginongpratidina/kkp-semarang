import { create } from "zustand";
import {
    collection,
    onSnapshot,
    query,
    updateDoc,
    doc,
    deleteDoc,
    addDoc,
    getDoc, // <-- Tambahkan import ini
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

// Opsional: Gunakan interface ini untuk form input agar konsisten
export interface TraderForm extends Omit<Trader, "id"> {}

type TraderState = {
    traders: Trader[];
    trader: Trader | null; // Untuk detail trader tunggal
    isLoading: boolean;
    error: string | null;
};

type TraderAction = {
    getTraders: () => () => void;
    getTraderById: (id: string) => Promise<void>;
    addTrader: (data: TraderForm) => Promise<void>;
    updateTrader: (id: string, data: Partial<TraderForm>) => Promise<void>;
    deleteTrader: (id: string) => Promise<void>;
    clearError: () => void;
};

// ================= Store =================
const useTraderStore = create<TraderState & TraderAction>((set) => ({
    traders: [],
    trader: null, // Inisialisasi state trader tunggal
    isLoading: false,
    error: null,

    clearError: () => set({ error: null }),

    // Ambil data realtime
    getTraders: () => {
        set({ isLoading: true, error: null });
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

    // Lihat Detail Trader
    getTraderById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const docRef = doc(db, "traders", id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                set({ 
                    trader: { id: docSnap.id, ...docSnap.data() } as Trader, 
                    isLoading: false 
                });
            } else {
                set({ error: "Trader tidak ditemukan", isLoading: false });
            }
        } catch (err) {
            console.error("Error Get Trader:", err);
            set({ error: "Gagal memuat detail trader", isLoading: false });
        }
    },

    // Tambah Trader Baru
    addTrader: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await addDoc(collection(db, "traders"), data);
            set({ isLoading: false });
        } catch (err) {
            set({ isLoading: false, error: "Gagal menambah data" });
            console.error("Error Add Trader:", err);
            throw err;
        }
    },

    // Update Data Trader
    updateTrader: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const docRef = doc(db, "traders", id);
            await updateDoc(docRef, data);
            set({ isLoading: false });
        } catch (err) {
            set({ isLoading: false, error: "Gagal memperbarui data" });
            console.error("Error Update Trader:", err);
            throw err;
        }
    },

    // Hapus Trader
    deleteTrader: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const docRef = doc(db, "traders", id);
            await deleteDoc(docRef);
            set({ isLoading: false });
        } catch (err) {
            set({ isLoading: false, error: "Gagal menghapus data" });
            console.error("Error Delete Trader:", err);
            throw err;
        }
    },
}));

export default useTraderStore;