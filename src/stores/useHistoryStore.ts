import { create } from "zustand";
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    getDoc
} from "firebase/firestore";
import { db } from "../configs/firebase";
import { toast } from 'sonner';

// --- UTILITY FUNCTION ---
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

// --- TYPES ---
export type User = {
    uid: string;
    nama: string;
    nomorHp: string;
    npwp: string;
    namaTrader?: string;
    alamatTrader?: string;
    email?: string;
    noAjuList?: string;
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
    comment: {
        feedback: string;
        stars: number;
        timestamp: string;
    } | null;
    details?: {
        keluhan?: string;
        jenis?: string;
        upi?: string;
        noAju?: string;
        tanggal?: string;
        jam?: string;
    };
    officer?: {
        nama_petugas: string;
        nip_petugas: string;
        catatan: string;
    }
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

// --- STORE ---
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
            
            // Opsional: Notifikasi jumlah user (berguna jika data banyak)
            // toast.info(`Terdeteksi ${data.length} pengguna dalam sistem`);
        } catch (err: any) {
            const msg = "Gagal sinkronisasi daftar pengguna";
            set({ error: msg });
            toast.error(msg, { description: "Periksa hak akses database Anda." });
        } finally {
            set({ loadingUser: false });
        }
    },

    async getUserById(uid: string) {
        set({ loadingUser: true, error: null, user: null });
        const promise = async () => {
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = { uid: userSnap.id, ...userSnap.data() } as User;
                set({ user: userData });
                return userData;
            } else {
                // Fallback query jika ID dokumen bukan UID
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("uid", "==", uid));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    const docData = snap.docs[0];
                    const userData = { uid: docData.id, ...docData.data() } as User;
                    set({ user: userData });
                    return userData;
                }
                throw new Error("ENTITY_NOT_FOUND");
            }
        };

        try {
            await promise();
        } catch (err: any) {
            const isNotFound = err.message === "ENTITY_NOT_FOUND";
            const msg = isNotFound ? "Pengguna tidak terdaftar" : "Gagal memuat profil";
            set({ error: msg });
            toast.error(msg);
        } finally {
            set({ loadingUser: false });
        }
    },

    async getHistoryByUid(uid: string) {
        set({ loadingHistory: true, error: null, histories: [] });
        
        // Menggunakan toast.promise untuk UX yang lebih 'industrial'
        const fetchAction = async () => {
            // 1. Ambil data dari collection history
            const historyRef = collection(db, "history");
            const q = query(historyRef, where("uid", "==", uid));
            const snap = await getDocs(q);

            if (snap.empty) return [];

            const historyData = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as History[];

            // 2. Ambil data catatan petugas secara paralel
            const historiesWithOfficer = await Promise.all(
                historyData.map(async (item) => {
                    if (item.token) {
                        const officerDocRef = doc(db, "officer_notes", item.token);
                        const officerSnap = await getDoc(officerDocRef);

                        if (officerSnap.exists()) {
                            const oData = officerSnap.data();
                            return {
                                ...item,
                                officer: {
                                    nama_petugas: oData.nama_petugas || "-",
                                    nip_petugas: oData.nip_petugas || "-",
                                    catatan: oData.catatan || ""
                                }
                            };
                        }
                    }
                    return item;
                })
            );

            // 3. Urutkan
            historiesWithOfficer.sort((a, b) => (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0));
            set({ histories: historiesWithOfficer });
            return historiesWithOfficer;
        };

        toast.promise(fetchAction(), {
            loading: 'Fetching interaction history...',
            success: (data: any) => `Ditemukan ${data.length} riwayat layanan`,
            error: 'Gagal mengambil riwayat transaksi',
        });

        set({ loadingHistory: false });
    }
}));

export default useHistoryStore;