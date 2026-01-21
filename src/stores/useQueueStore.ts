import { create } from "zustand";
import {
    collection,
    onSnapshot,
    query,
    updateDoc,
    where,
    doc,
    getDoc,
    setDoc,
} from "firebase/firestore";
import { db } from "../configs/firebase";

// ================= Types =================
export type Data = {
    token: string;
    type: string;
    userName: string;
    nomorHp: string;
    status: string;
    subStatus: string;
    queueNo: number;
};

type SMKHPDetail = {
    queueNo: number;
    userName: string;
    token: string;
    npwp: string;
};

type LaboratoriumDetail = {
    queueNo: number;
    userName: string;
    token: string;
    npwp: string;
    jenis: string;
    upi: string;
    wa: string;
}

type CustomerServiceDetail = {
    queueNo: number;
    userName: string;
    token: string;
    npwp: string;
    keluhan: string;
};

type Petugas = {
    nama: string;
    nip: string;
    catatan_petugas: string;
};

type QueueState = {
    smkhp: Data[];
    smkhp_detail: SMKHPDetail | null;
    laboratorium: Data[];
    laboratorium_detail: LaboratoriumDetail | null;
    customer_service: Data[];
    customer_service_detail: CustomerServiceDetail | null;
    petugas: Petugas;
    isLoading: boolean;
    error: string | null;
};

type QueueAction = {
    getSMKHP: () => () => void;
    getLaboratorium: () => () => void;
    getCustomerService: () => () => void;

    getSMKHPByToken: (token: string) => Promise<void>;
    getLaboratoriumByToken: (token: string) => Promise<void>;
    getCustomerServiceByToken: (token: string) => Promise<void>;

    updateSMKHPHandle: (token: string, catatan?: string) => Promise<void>;
    updateSMKHPStatus: (token: string, status: string) => Promise<void>;

    updateLaboratoriumHandle: (token: string, catatan?: string) => Promise<void>;
    updateLaboratoriumStatus: (token: string, status: string) => Promise<void>;

    updateCustomerServiceHandle: (token: string, catatan?: string) => Promise<void>;
    updateCustomerServiceStatus: (token: string, status: string) => Promise<void>;

    setPetugas: (nama: string, nip: string) => void;
    setField: <K extends keyof QueueState>(key: K, value: QueueState[K]) => void;
};

const initialState: QueueState = {
    smkhp: [],
    smkhp_detail: null,
    laboratorium: [],
    laboratorium_detail: null,
    customer_service: [],
    customer_service_detail: null,
    petugas: { nama: "", nip: "", catatan_petugas: "" },
    isLoading: false,
    error: null
};

// ================= Store =================
const useQueueStore = create<QueueState & QueueAction>((set, get) => ({
    ...initialState,

    setField: (key, value) => set((state) => ({ ...state, [key]: value })),

    setPetugas: (nama, nip) => {
        set((state) => ({
            petugas: { ...state.petugas, nama, nip }
        }));
    },

    // ================= SMKHP Actions =================
    getSMKHP: () => {
        // Hanya filter berdasarkan status "active"
        const q = query(
            collection(db, "SMKHP"),
            where("status", "==", "active")
        );

        return onSnapshot(q, (snap) => {
            const data = snap.docs.map(doc => {
                const d = doc.data();
                return {
                    token: doc.id,
                    type: "SMKHP",
                    userName: d.userNama || d.userName,
                    nomorHp: d.nomorHp,
                    status: d.status,
                    subStatus: d.subStatus,
                    queueNo: d.queueNo
                };
            });
            set({ smkhp: data });
        }, (err) => {
            console.error(err);
            set({ error: "Gagal memuat daftar SMKHP" });
        });
    },

    getSMKHPByToken: async (token: string) => {
        set({ isLoading: true, error: null, smkhp_detail: null });
        try {
            const docRef = doc(db, "SMKHP", token);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const d = docSnap.data();
                set({
                    smkhp_detail: {
                        queueNo: d.queueNo,
                        userName: d.userNama || d.userName,
                        token: token,
                        npwp: d.npwp || "-"
                    }
                });
            } else {
                set({ error: "Data SMKHP tidak ditemukan" });
            }
        } catch (err: any) {
            set({ error: "Gagal mengambil detail SMKHP" });
        } finally {
            set({ isLoading: false });
        }
    },

    updateSMKHPHandle: async (token, catatan) => {
        const { petugas } = get();
        set({ isLoading: true });

        try {
            const docRef = doc(db, "SMKHP", token);
            const historyRef = doc(db, "history", token);

            const petugasPayload = {
                nama: petugas.nama,
                nip: petugas.nip,
                catatan_petugas: catatan || ''
            };

            // 1. Update di koleksi asal (SMKHP)
            await updateDoc(docRef, {
                petugas: petugasPayload,
                subStatus: "Selesai"
            });

            // 2. Ambil data terbaru untuk history
            const updatedSnap = await getDoc(docRef);

            if (updatedSnap.exists()) {
                const fullData = updatedSnap.data();

                // 3. Simpan ke koleksi history dengan ID yang sama (token)
                await setDoc(historyRef, {
                    ...fullData,
                    petugas: petugasPayload, // Memastikan data petugas ikut masuk
                    subStatus: "Selesai",
                    completedAt: Date.now()
                });
            }
        } catch (error) {
            console.error("Error processing SMKHP to History:", error);
            set({ error: "Gagal memproses data ke history" });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateSMKHPStatus: async (token, status) => {
        await updateDoc(doc(db, "SMKHP", token), { subStatus: status });
    },

    // ================= LAB & CS Actions =================
    getLaboratorium: () => {
        // Hanya filter berdasarkan status "active"
        const q = query(
            collection(db, "LAB"),
            where("status", "==", "active")
        );
        return onSnapshot(q, (snap) => {
            const data = snap.docs.map(doc => ({
                token: doc.id,
                type: "Laboratorium",
                userName: doc.data().userNama || doc.data().userName,
                nomorHp: doc.data().nomorHp,
                status: doc.data().status,
                subStatus: doc.data().subStatus,
                queueNo: doc.data().queueNo
            }));
            set({ laboratorium: data });
        });
    },

    updateLaboratoriumStatus: async (token, status) => {
        await updateDoc(doc(db, "LAB", token), { subStatus: status });
    },

    getLaboratoriumByToken: async (token: string) => {
        set({ isLoading: true, error: null, laboratorium_detail: null });
        try {
            const docRef = doc(db, "LAB", token);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const d = docSnap.data();
                // Mengambil data dari dalam map 'details' sesuai struktur JSON Anda
                const details = d.details || {};

                set({
                    laboratorium_detail: {
                        token: token,
                        userName: d.userNama || d.userName || "No Name",
                        queueNo: d.queueNo || 0,
                        npwp: d.npwp || "-",
                        // Field khusus Laboratorium dari dalam map details
                        jenis: details.jenis || "-",
                        upi: details.upi || "-",
                        wa: details.wa || d.nomorHp || "-"
                    }
                });
            } else {
                set({ error: "Data Laboratorium tidak ditemukan" });
            }
        } catch (err: any) {
            console.error("Error fetching LAB detail:", err);
            set({ error: "Gagal mengambil detail Laboratorium" });
        } finally {
            set({ isLoading: false });
        }
    },

    updateLaboratoriumHandle: async (token, catatan) => {
        const { petugas } = get();
        set({ isLoading: true, error: null });

        try {
            const docRef = doc(db, "LAB", token);
            const historyRef = doc(db, "history", token);

            const petugasPayload = {
                nama: petugas.nama,
                nip: petugas.nip,
                catatan_petugas: catatan || ''
            };

            // 1. Update di koleksi LAB
            await updateDoc(docRef, {
                petugas: petugasPayload,
                subStatus: "Selesai",
                status: "inactive"
            });

            // 2. Ambil data terbaru untuk dipindah ke history
            const updatedSnap = await getDoc(docRef);

            if (updatedSnap.exists()) {
                const fullData = updatedSnap.data();

                // 3. Simpan ke koleksi history
                await setDoc(historyRef, {
                    ...fullData,
                    petugas: petugasPayload,
                    subStatus: "Selesai",
                    completedAt: Date.now()
                });
            }
        } catch (error) {
            console.error("Error processing LAB to History:", error);
            set({ error: "Gagal memproses data LAB ke history" });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    getCustomerService: () => {
        // Hanya filter berdasarkan status "active"
        const q = query(
            collection(db, "CustomerService"),
            where("status", "==", "active")
        );
        return onSnapshot(q, (snap) => {
            const data = snap.docs.map(doc => ({
                token: doc.id,
                type: "Customer Service",
                userName: doc.data().userNama || doc.data().userName,
                nomorHp: doc.data().nomorHp,
                status: doc.data().status,
                subStatus: doc.data().subStatus,
                queueNo: doc.data().queueNo
            }));
            set({ customer_service: data });
        });
    },

    // ================= Customer Service Handle =================
    updateCustomerServiceHandle: async (token, catatan) => {
        const { petugas } = get();
        set({ isLoading: true, error: null });

        try {
            const docRef = doc(db, "CustomerService", token);
            const historyRef = doc(db, "history", token);

            const petugasPayload = {
                nama: petugas.nama,
                nip: petugas.nip,
                catatan_petugas: catatan || ''
            };

            // 1. Update status dan data petugas di koleksi CustomerService
            await updateDoc(docRef, {
                petugas: petugasPayload,
                subStatus: "Selesai",
                status: "inactive" // Biasanya diubah ke inactive agar hilang dari antrean aktif
            });

            // 2. Ambil snapshot data terbaru setelah update
            const updatedSnap = await getDoc(docRef);

            if (updatedSnap.exists()) {
                const fullData = updatedSnap.data();

                // 3. Simpan ke koleksi history dengan ID dokumen yang sama (token)
                await setDoc(historyRef, {
                    ...fullData,
                    petugas: petugasPayload,
                    subStatus: "Selesai",
                    completedAt: Date.now()
                });
            }
        } catch (error) {
            console.error("Error processing Customer Service to History:", error);
            set({ error: "Gagal memproses data CS ke history" });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateCustomerServiceStatus: async (token, status) => {
        await updateDoc(doc(db, "CustomerService", token), { subStatus: status });
    },

    getCustomerServiceByToken: async (token: string) => {
        set({ isLoading: true, error: null, customer_service_detail: null });
        try {
            const docRef = doc(db, "CustomerService", token);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const d = docSnap.data();
                // Mengambil data dari dalam map 'details' sesuai struktur JSON Anda
                const details = d.details || {};

                set({
                    customer_service_detail: {
                        token: token,
                        userName: d.userNama || d.userName || "No Name",
                        queueNo: d.queueNo || 0,
                        npwp: d.npwp || "-",
                        keluhan: details.keluhan || "-"
                    }
                });
            } else {
                set({ error: "Data Customer Service tidak ditemukan" });
            }
        } catch (err: any) {
            console.error("Error fetching CS detail:", err);
            set({ error: "Gagal mengambil detail Customer Service" });
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default useQueueStore;