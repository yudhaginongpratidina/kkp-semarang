import { doc, updateDoc, collection, getDocs, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { create } from 'zustand';
import { auth, db } from "../configs/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from 'sonner';

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
            const officersData: Officer[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Officer[];
            set({ officers: officersData, is_loading: false });
        } catch (error: any) {
            set({ is_loading: false, is_error: true, message: error.message });
            toast.error("Gagal memuat daftar petugas");
        }
    },

    update_role_officer: async (id, newRole) => {
        set({ is_loading: true });
        const promise = updateDoc(doc(db, 'officers', id), { role: newRole });

        toast.promise(promise, {
            loading: 'Memperbarui role...',
            success: () => {
                set((state) => ({
                    officers: state.officers.map(off => off.id === id ? { ...off, role: newRole } : off),
                    is_loading: false
                }));
                return `Role berhasil diubah ke ${newRole}`;
            },
            error: () => {
                set({ is_loading: false, is_error: true });
                return "Gagal memperbarui role";
            }
        });
    },

    update_officer: async (id) => {
        const { full_name, nip, role } = get();
        set({ is_loading: true });

        const promise = async () => {
            await updateDoc(doc(db, 'officers', id), { full_name, nip, role });
            await get().get_officers();
        };

        toast.promise(promise(), {
            loading: 'Menyimpan perubahan...',
            success: 'Data petugas berhasil diperbarui',
            error: () => {
                set({ is_loading: false, is_error: true });
                return "Gagal memperbarui data petugas";
            }
        });
    },

    create_officer: async (): Promise<void> => { // Tambahkan tipe return eksplisit
        const { full_name, nip, role } = get();
        if (!full_name || !nip || !role) {
            toast.error("Semua field harus diisi!");
            return;
        }

        set({ is_loading: true, is_error: false });

        const promise = async () => {
            const email = generateEmail(full_name);
            const userCredential = await createUserWithEmailAndPassword(auth, email, nip);
            const uid = userCredential.user.uid;

            await setDoc(doc(db, 'officers', uid), {
                full_name, nip, role, email,
                created_at: new Date().toISOString()
            });

            get().reset();
            await get().get_officers();
        };

        // Tambahkan 'await' dan pastikan tidak ada data yang di-return ke store
        await toast.promise(promise(), {
            loading: 'Mendaftarkan petugas baru...',
            success: 'Petugas berhasil didaftarkan',
            error: (err) => {
                set({ is_loading: false, is_error: true, message: err.message });
                return `Pendaftaran gagal: ${err.message}`;
            }
        });
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
            toast.error("Gagal mengambil data petugas");
        }
    },

    delete_officer: async (id: string) => {
        set({ is_loading: true, is_error: false });

        const promise = async () => {
            await deleteDoc(doc(db, 'officers', id));
            set((state) => ({
                officers: state.officers.filter(off => off.id !== id),
                is_loading: false
            }));
        };

        toast.promise(promise(), {
            loading: 'Menghapus data petugas...',
            success: 'Data Firestore dihapus. Ingat hapus akun di Firebase Console!',
            error: (err) => {
                set({ is_loading: false, is_error: true, message: err.message });
                return "Gagal menghapus data";
            }
        });
    },

    import_users_excel: async (data: any[]): Promise<void> => { // Tambahkan tipe return eksplisit
        set({ is_loading: true, is_error: false });
        const VALID_ROLES = ["operator", "customer_service", "laboratorium", "superuser"];

        const promise = async () => {
            let count = 0;
            for (const row of data) {
                const name = row.full_name || "Tanpa Nama";
                const nip = String(row.nip || "0000000000");
                const email = `${name.trim().split(" ")[0].toLowerCase()}@company.com`;
                let role = String(row.role).toLowerCase().trim();
                if (!VALID_ROLES.includes(role)) role = "operator";

                const userCred = await createUserWithEmailAndPassword(auth, email, nip);
                await setDoc(doc(db, 'officers', userCred.user.uid), {
                    full_name: name, nip, role, email,
                    created_at: new Date().toISOString()
                });
                count++;
            }
            await get().get_officers();
            return count; // Nilai ini hanya untuk success message toast
        };

        // Bungkus dengan await agar return type fungsi luar tetap void
        await toast.promise(promise(), {
            loading: 'Mengimpor petugas masal...',
            success: (count) => `${count} petugas berhasil diimpor`,
            error: (err) => {
                set({ is_loading: false, is_error: true, message: err.message });
                return `Import gagal: ${err.message}`;
            }
        });
    },
}));

export default useUserManagementStore;