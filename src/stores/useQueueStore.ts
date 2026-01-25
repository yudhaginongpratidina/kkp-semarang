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
};

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
        const q = query(collection(db, "SMKHP"), where("status", "==", "active"));
        return onSnapshot(q, (snap) => {
            const data = snap.docs.map(doc => ({
                token: doc.id,
                type: "SMKHP",
                userName: doc.data().userNama || doc.data().userName,
                nomorHp: doc.data().nomorHp,
                status: doc.data().status,
                subStatus: doc.data().subStatus,
                queueNo: doc.data().queueNo
            }));
            set({ smkhp: data });
        });
    },

    getSMKHPByToken: async (token: string) => {
        set({ isLoading: true, error: null, smkhp_detail: null });
        try {
            const docSnap = await getDoc(doc(db, "SMKHP", token));
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
            }
        } catch (err) { set({ error: "Gagal ambil detail" }); }
        finally { set({ isLoading: false }); }
    },

    updateSMKHPHandle: async (token, catatan) => {
        const { petugas } = get();
        set({ isLoading: true });
        try {
            // 1. Update Status di collection SMKHP
            await updateDoc(doc(db, "SMKHP", token), {
                subStatus: "Selesai",
                status: "active", 
                updatedAt: Date.now()
            });

            // 2. Simpan catatan petugas ke collection 'officer_notes'
            await setDoc(doc(db, "officer_notes", token), {
                nama_petugas: petugas.nama,
                nip_petugas: petugas.nip,
                catatan: catatan || "",
                layanan: "SMKHP",
                timestamp: Date.now()
            });
        } catch (err) {
            set({ error: "Gagal memproses data" });
        } finally { set({ isLoading: false }); }
    },

    updateSMKHPStatus: async (token, status) => {
        await updateDoc(doc(db, "SMKHP", token), { subStatus: status });
    },

    // ================= Laboratorium Actions =================
    getLaboratorium: () => {
        const q = query(collection(db, "LAB"), where("status", "==", "active"));
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

    getLaboratoriumByToken: async (token: string) => {
        set({ isLoading: true, error: null, laboratorium_detail: null });
        try {
            const docSnap = await getDoc(doc(db, "LAB", token));
            if (docSnap.exists()) {
                const d = docSnap.data();
                const details = d.details || {};
                set({
                    laboratorium_detail: {
                        token,
                        userName: d.userNama || d.userName,
                        queueNo: d.queueNo,
                        npwp: d.npwp || "-",
                        jenis: details.jenis || "-",
                        upi: details.upi || "-",
                        wa: details.wa || d.nomorHp || "-"
                    }
                });
            }
        } finally { set({ isLoading: false }); }
    },

    updateLaboratoriumHandle: async (token, catatan) => {
        const { petugas } = get();
        set({ isLoading: true });
        try {
            await updateDoc(doc(db, "LAB", token), {
                subStatus: "Selesai",
                status: "active",
                updatedAt: Date.now()
            });

            await setDoc(doc(db, "officer_notes", token), {
                nama_petugas: petugas.nama,
                nip_petugas: petugas.nip,
                catatan: catatan || "",
                layanan: "Laboratorium",
                timestamp: Date.now()
            });
        } catch (err) {
            set({ error: "Gagal memproses data" });
        } finally { set({ isLoading: false }); }
    },

    updateLaboratoriumStatus: async (token, status) => {
        await updateDoc(doc(db, "LAB", token), { subStatus: status });
    },

    // ================= Customer Service Actions =================
    getCustomerService: () => {
        const q = query(collection(db, "CustomerService"), where("status", "==", "active"));
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

    getCustomerServiceByToken: async (token: string) => {
        set({ isLoading: true, error: null, customer_service_detail: null });
        try {
            const docSnap = await getDoc(doc(db, "CustomerService", token));
            if (docSnap.exists()) {
                const d = docSnap.data();
                const details = d.details || {};
                set({
                    customer_service_detail: {
                        token,
                        userName: d.userNama || d.userName,
                        queueNo: d.queueNo,
                        npwp: d.npwp || "-",
                        keluhan: details.keluhan || "-"
                    }
                });
            }
        } finally { set({ isLoading: false }); }
    },

    updateCustomerServiceHandle: async (token, catatan) => {
        const { petugas } = get();
        set({ isLoading: true });
        try {
            await updateDoc(doc(db, "CustomerService", token), {
                subStatus: "Selesai",
                status: "active",
                updatedAt: Date.now()
            });

            await setDoc(doc(db, "officer_notes", token), {
                nama_petugas: petugas.nama,
                nip_petugas: petugas.nip,
                catatan: catatan || "",
                layanan: "Customer Service",
                timestamp: Date.now()
            });
        } catch (err) {
            set({ error: "Gagal memproses data" });
        } finally { set({ isLoading: false }); }
    },

    updateCustomerServiceStatus: async (token, status) => {
        await updateDoc(doc(db, "CustomerService", token), { subStatus: status });
    },
}));

export default useQueueStore;