import { doc, updateDoc, collection, getDocs, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { create } from 'zustand';
import { auth, db } from "../configs/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export type Officer = {
    id: string;
    full_name: string;
    nip: string;
    role: string;
};

type UserManagementState = {
    officers: Officer[];
    id: string;
    full_name: string;
    nip: string;
    role: string;
    is_loading: boolean;
    is_error: boolean;
    message: string;
};

type RoleManagementAction = {
    setField: <K extends keyof UserManagementState>(key: K, value: UserManagementState[K]) => void;
    reset: () => void;
    get_officers: () => Promise<void>;
    update_role_officer: (id: string, newRole: string) => Promise<void>;
    update_officer: (id: string) => Promise<void>;
    create_officer: () => Promise<void>;
    get_officer_by_id: (id: string) => Promise<void>;
    import_users_excel: (data: any[]) => Promise<void>;
    delete_officer: (id: string) => Promise<void>;
};

const initialState: Omit<UserManagementState, 'is_loading' | 'is_error' | 'message'> = {
    officers: [],
    id: '',
    full_name: '',
    nip: '',
    role: '',
};

const generateEmail = (name: string) => {
    const firstName = name.trim().split(" ")[0].toLowerCase();
    return `${firstName}@company.com`;
}

const useUserManagementStore = create<UserManagementState & RoleManagementAction>()((set, get) => ({
    ...initialState,
    is_loading: false,
    is_error: false,
    message: '',


    setField: (key, value) => set({ [key]: value } as Partial<UserManagementState>),

    reset: () => set({ ...initialState, is_loading: false, is_error: false, message: '' }),

    get_officers: async () => {
        set({ is_loading: true, is_error: false });
        try {
            const snapshot = await getDocs(collection(db, 'officers'));
            const officersData: Officer[] = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    full_name: data.full_name ?? '',
                    nip: data.nip ?? '',
                    role: data.role ?? ''
                };
            });
            set({ officers: officersData, is_loading: false });
        } catch (error: any) {
            set({ is_loading: false, is_error: true, message: error.message });
        }
    },

    update_role_officer: async (id, newRole) => {
        set({ is_loading: true });
        try {
            await updateDoc(doc(db, 'officers', id), { role: newRole });
            set((state) => ({
                officers: state.officers.map(off => off.id === id ? { ...off, role: newRole } : off),
                is_loading: false
            }));
        } catch (error: any) {
            set({ is_loading: false, is_error: true });
        }
    },

    update_officer: async (id) => {
        const { full_name, nip, role } = get();
        set({ is_loading: true });
        try {
            await updateDoc(doc(db, 'officers', id), { full_name, nip, role });
            set({ is_loading: false });
            get().get_officers(); // Refresh list
        } catch (error: any) {
            set({ is_loading: false, is_error: true });
        }
    },

    create_officer: async () => {
        const { full_name, nip, role } = get();
        set({ is_loading: true, is_error: false });
        try {
            const email = generateEmail(full_name);

            // 1. Daftarkan ke Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, nip);
            const uid = userCredential.user.uid;

            // 2. Simpan profil lengkap ke Firestore menggunakan UID yang sama
            await setDoc(doc(db, 'officers', uid), {
                full_name,
                nip,
                role,
                email,
                created_at: new Date().toISOString()
            });

            set({ is_loading: false });
            get().reset();
            get().get_officers();
        } catch (error: any) {
            set({ is_loading: false, is_error: true, message: error.message });
            alert("Gagal daftar: " + error.message);
        }
    },

    get_officer_by_id: async (id) => {
        set({ is_loading: true });
        try {
            const snapshot = await getDoc(doc(db, 'officers', id));
            if (snapshot.exists()) {
                const data = snapshot.data();
                set({ id: snapshot.id, full_name: data.full_name, nip: data.nip, role: data.role, is_loading: false });
            }
        } catch (error: any) {
            set({ is_loading: false, is_error: true });
        }
    },

    delete_officer: async (id: string) => {
        set({ is_loading: true, is_error: false });
        try {
            // Hapus data di Firestore
            await deleteDoc(doc(db, 'officers', id));

            // Berikan notifikasi karena keterbatasan Client SDK
            console.warn("Data Firestore dihapus. Akun Authentication harus dihapus via Admin SDK atau Firebase Console.");

            // Update state local agar UI langsung sinkron
            set((state) => ({
                officers: state.officers.filter(off => off.id !== id),
                is_loading: false
            }));

        } catch (error: any) {
            set({ is_loading: false, is_error: true, message: error.message });
            alert("Gagal menghapus data: " + error.message);
        }
    },
    import_users_excel: async (data: any[]) => {
        set({ is_loading: true, is_error: false });
        const VALID_ROLES = ["operator", "customer_service", "laboratorium", "superuser"];

        try {
            // Karena Firebase Auth tidak mendukung batch, kita gunakan loop async
            for (const row of data) {
                const name = row.full_name || "Tanpa Nama";
                const nip = String(row.nip || "0000000000");
                const email = `${name.trim().split(" ")[0].toLowerCase()}@company.com`;

                let role = String(row.role).toLowerCase().trim();
                if (!VALID_ROLES.includes(role)) role = "operator";

                // 1. Create Auth User
                const userCred = await createUserWithEmailAndPassword(auth, email, nip);

                // 2. Create Firestore Doc
                await setDoc(doc(db, 'officers', userCred.user.uid), {
                    full_name: name,
                    nip,
                    role,
                    email,
                    created_at: new Date().toISOString()
                });
            }

            set({ is_loading: false });
            get().get_officers();
        } catch (error: any) {
            set({ is_loading: false, is_error: true, message: error.message });
            throw error;
        }
    },
}));

export default useUserManagementStore