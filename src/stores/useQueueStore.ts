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

type Petugas = {
    nama: string;
    nip: string;
    catatan_petugas: string;
};

type QueueState = {
    smkhp: Data[];
    smkhp_detail: SMKHPDetail | null;
    laboratorium: Data[];
    customer_service: Data[];
    petugas: Petugas;
    isLoading: boolean;
    error: string | null;
};

type QueueAction = {
    getSMKHP: () => () => void;
    getLaboratorium: () => () => void;
    getCustomerService: () => () => void;
    getSMKHPByToken: (token: string) => Promise<void>;
    updateSMKHPHandle: (token: string, catatan?: string) => Promise<void>;
    updateSMKHPStatus: (token: string, status: string) => Promise<void>;
    updateLaboratoriumStatus: (token: string, status: string) => Promise<void>;
    updateCustomerServiceStatus: (token: string, status: string) => Promise<void>;
    setPetugas: (nama: string, nip: string) => void;
    setField: <K extends keyof QueueState>(key: K, value: QueueState[K]) => void;
};

const initialState: QueueState = {
    smkhp: [],
    smkhp_detail: null,
    laboratorium: [],
    customer_service: [],
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

    updateCustomerServiceStatus: async (token, status) => {
        await updateDoc(doc(db, "CustomerService", token), { subStatus: status });
    }
}));

export default useQueueStore;