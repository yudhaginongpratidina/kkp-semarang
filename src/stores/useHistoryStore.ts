import { create } from "zustand";
import {
    collection,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { db } from "../configs/firebase";

export type User = {
    uid: string;
    nama: string;
    nomorHp: string;
    npwp: string;
    alamatTrader?: string;
    email?: string;
};

export type History = {
    id: string;
    timestamp: number;
    type: string;
    subStatus: string;
    token: string;
    uid: string;
    rating: number;
    queueNo: number;
    comment: string;
    details?: {
        keluhan?: string; // Khusus Customer Service
        jenis?: string;   // Khusus Laboratorium
        upi?: string;     // Khusus Laboratorium
        noAju?: string;   // Khusus SMKHP
        tanggal?: string;
        jam?: string;
    };
};

// Fungsi Utility untuk merubah format timestamp milidetik ke Tanggal Lengkap
export const formatTanggalLengkap = (dateInput: any) => {
    if (!dateInput) return "-";
    const d = new Date(Number(dateInput));
    if (isNaN(d.getTime())) return "-";

    const hari = String(d.getDate()).padStart(2, '0');
    const bulanDaftar = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const bulan = bulanDaftar[d.getMonth()];
    const tahun = d.getFullYear();
    const jam = String(d.getHours()).padStart(2, '0');
    const menit = String(d.getMinutes()).padStart(2, '0');

    return `${hari} ${bulan} ${tahun}, ${jam}:${menit}`;
};

type HistoryState = {
    users: User[];
    user: User | null;
    histories: History[];
    loadingUser: boolean;
    loadingHistory: boolean;
    error: string | null;
    getAllUsers: () => Promise<void>;
    getUserById: (uid: string) => Promise<void>;
    getHistoryByUid: (uid: string) => Promise<void>;
};

const useHistoryStore = create<HistoryState>((set) => ({
    users: [],
    user: null,
    histories: [],
    loadingUser: false,
    loadingHistory: false,
    error: null,

    async getAllUsers() {
        set({ loadingUser: true, error: null });
        try {
            const usersRef = collection(db, "users");
            const snap = await getDocs(usersRef);
            const data = snap.docs.map(doc => ({
                uid: doc.id,
                ...doc.data()
            })) as User[];
            set({ users: data });
        } catch (err: any) {
            set({ error: "Gagal mengambil daftar pengguna" });
        } finally {
            set({ loadingUser: false });
        }
    },

    async getUserById(uid: string) {
        set({ loadingUser: true, error: null, user: null });
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("uid", "==", uid));
            const snap = await getDocs(q);
            if (!snap.empty) {
                const docData = snap.docs[0];
                set({ user: { uid: docData.id, ...docData.data() } as User });
            } else {
                set({ error: "Pengguna tidak ditemukan" });
            }
        } catch (err: any) {
            set({ error: "Gagal mengambil profil" });
        } finally {
            set({ loadingUser: false });
        }
    },

    async getHistoryByUid(uid: string) {
        set({ loadingHistory: true, error: null, histories: [] });
        try {
            const historyRef = collection(db, "history");
            const q = query(historyRef, where("uid", "==", uid));
            const snap = await getDocs(q);
            const data = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as History[];

            // Urutkan berdasarkan timestamp terbaru
            data.sort((a, b) => (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0));
            set({ histories: data });
        } catch (err: any) {
            set({ error: "Gagal mengambil riwayat" });
        } finally {
            set({ loadingHistory: false });
        }
    }
}));

export default useHistoryStore;