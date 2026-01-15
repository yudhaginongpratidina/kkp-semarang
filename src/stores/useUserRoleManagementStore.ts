import { doc, updateDoc, collection, getDocs } from "firebase/firestore";
import { create } from 'zustand';
import { db } from "../configs/firebase";

type Officer = {
    id: string;
    full_name: string;
    nip: string;
    role: string;
};

type RoleManagementState = {
    officers: Officer[];
    is_loading: boolean;
    is_error: boolean;
    message: string;
};

type RoleManagementAction = {
    setField: <K extends keyof RoleManagementState>(key: K, value: RoleManagementState[K]) => void;
    reset: () => void;
    get_officers: () => Promise<void>;
    update_officer: (id: string, newRole: string) => Promise<void>;
};

const initialState: Omit<RoleManagementState, 'is_loading' | 'is_error' | 'message'> = {
    officers: [],
};

const useUserRoleManagementStore = create<RoleManagementState & RoleManagementAction>()(
    (set, get) => ({
        ...initialState,
        is_loading: false,
        is_error: false,
        message: '',

        // Set field dinamis
        setField: (key, value) => set({ [key]: value } as Partial<RoleManagementState>),

        // Reset ke state awal
        reset: () => set({ ...initialState, is_loading: false, is_error: false, message: '' }),

        // Ambil semua officers
        get_officers: async () => {
            set({ is_loading: true, is_error: false, message: '' });
            try {
                const snapshot = await getDocs(collection(db, 'officers'));
                const officersData: Officer[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    full_name: doc.data().full_name,
                    nip: doc.data().nip,
                    role: doc.data().role
                }));
                set({ officers: officersData, is_loading: false });
            } catch (error: any) {
                set({ is_loading: false, is_error: true, message: error.message || 'Failed to fetch officers' });
            }
        },

        // Update role officer berdasarkan id
        update_officer: async (id, newRole) => {
            set({ is_loading: true, is_error: false, message: '' });
            try {
                const officerRef = doc(db, 'officers', id);
                await updateDoc(officerRef, { role: newRole });

                // Update state lokal setelah update
                const updatedOfficers = get().officers.map(off =>
                    off.id === id ? { ...off, role: newRole } : off
                );
                set({ officers: updatedOfficers, is_loading: false, message: 'Role updated successfully' });
            } catch (error: any) {
                set({ is_loading: false, is_error: true, message: error.message || 'Failed to update role' });
            }
        }
    })
);

export default useUserRoleManagementStore
