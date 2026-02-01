import { create } from "zustand";
import {
    collection,
    onSnapshot,
    query,
    doc,
    deleteDoc,
    setDoc,
    getDoc,
    writeBatch,
} from "firebase/firestore";
import { db } from "../configs/firebase";

// ================= Types =================
export interface Trader {
    id: string; // Akan berisi NPWP format asli (e.g., 00.219.282.9-650.3000)
    nama_trader: string;
    kode_trader: string;
    npwp: string;
    alamat_trader: string;
}

export interface TraderForm extends Omit<Trader, "id"> {}

type TraderState = {
    traders: Trader[];
    trader: Trader | null;
    isLoading: boolean;
    loadingImport: boolean;
    error: string | null;
};

type TraderAction = {
    getTraders: () => () => void;
    getTraderById: (id: string) => Promise<void>;
    addTrader: (data: TraderForm) => Promise<void>;
    updateTrader: (oldId: string, data: TraderForm) => Promise<void>;
    deleteTrader: (id: string) => Promise<void>;
    importTradersFromExcel: (data: any[]) => Promise<void>;
    clearError: () => void;
};

// ================= Store =================
const useTraderStore = create<TraderState & TraderAction>((set) => ({
    traders: [],
    trader: null,
    isLoading: false,
    loadingImport: false,
    error: null,

    clearError: () => set({ error: null }),

    getTraders: () => {
        set({ isLoading: true, error: null });
        const q = query(collection(db, "traders"));
        const unsubscribe = onSnapshot(q, (snap) => {
            const data = snap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Trader[];
            set({ traders: data, isLoading: false });
        }, () => {
            set({ error: "Gagal mengambil data", isLoading: false });
        });
        return unsubscribe;
    },

    getTraderById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const docRef = doc(db, "traders", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                set({ trader: { id: docSnap.id, ...docSnap.data() } as Trader, isLoading: false });
            } else {
                set({ error: "Trader tidak ditemukan", isLoading: false });
            }
        } catch (err) {
            set({ error: "Gagal memuat detail", isLoading: false });
        }
    },

    addTrader: async (data) => {
        set({ isLoading: true, error: null });
        try {
            // Gunakan NPWP mentah dari form sebagai ID (misal: 00.219.282.9-650.3000)
            const rawNPWP = String(data.npwp).trim();
            if (!rawNPWP) throw new Error("NPWP tidak boleh kosong!");
            
            const docRef = doc(db, "traders", rawNPWP);
            const checkDoc = await getDoc(docRef);
            if (checkDoc.exists()) throw new Error("Trader dengan NPWP ini sudah terdaftar!");

            await setDoc(docRef, { ...data, npwp: rawNPWP, id: rawNPWP });
            set({ isLoading: false });
        } catch (err: any) {
            set({ isLoading: false, error: err.message });
            throw err;
        }
    },

    updateTrader: async (oldId, data) => {
        set({ isLoading: true, error: null });
        try {
            const newId = String(data.npwp).trim();
            
            // Jika ID (NPWP) berubah, kita migrasi datanya
            if (oldId !== newId) {
                const batch = writeBatch(db);
                const oldDocRef = doc(db, "traders", oldId);
                const newDocRef = doc(db, "traders", newId);

                const checkNew = await getDoc(newDocRef);
                if (checkNew.exists()) throw new Error("NPWP baru sudah terdaftar!");

                batch.set(newDocRef, { ...data, npwp: newId, id: newId });
                batch.delete(oldDocRef);
                await batch.commit();
            } else {
                // Jika NPWP tetap, cukup update doc lama
                const docRef = doc(db, "traders", oldId);
                await setDoc(docRef, { ...data, npwp: newId }, { merge: true });
            }
            set({ isLoading: false });
        } catch (err: any) {
            set({ isLoading: false, error: err.message });
            throw err;
        }
    },

    deleteTrader: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await deleteDoc(doc(db, "traders", id));
            set({ isLoading: false });
        } catch (err) {
            set({ isLoading: false, error: "Gagal menghapus" });
            throw err;
        }
    },

    importTradersFromExcel: async (data: any[]) => {
        set({ loadingImport: true, error: null });
        try {
            // Filter baris yang minimal punya nama dan npwp
            const validData = data.filter(item => item.nama_trader && item.npwp);
            if (validData.length === 0) throw new Error("Format file tidak sesuai atau data kosong.");

            // Chunking per 500 data (Firestore Batch Limit)
            for (let i = 0; i < validData.length; i += 500) {
                const chunk = validData.slice(i, i + 500);
                const batch = writeBatch(db);

                chunk.forEach((item) => {
                    // Pakai format asli dari Excel (e.g. 00.219.282.9-650.3000)
                    const rawNPWP = String(item.npwp).trim();
                    const docRef = doc(db, "traders", rawNPWP);
                    
                    batch.set(docRef, {
                        id: rawNPWP,
                        npwp: rawNPWP,
                        nama_trader: String(item.nama_trader).trim(),
                        kode_trader: String(item.kode_trader || "").trim(),
                        alamat_trader: String(item.alamat_trader || "").trim(),
                        updatedAt: new Date().getTime()
                    }, { merge: true });
                });

                await batch.commit();
            }
            set({ loadingImport: false });
        } catch (err: any) {
            set({ loadingImport: false, error: err.message });
            throw err;
        }
    }
}));

export default useTraderStore;