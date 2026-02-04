// library
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    reauthenticateWithCredential,
    EmailAuthProvider,
    updatePassword
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { toast } from 'sonner';

// configs
import { auth, db } from "../configs/firebase";

type AuthState = {
    full_name: string
    nip: string
    email: string
    password: string
    current_password: string
    role: string
    is_loading: boolean
    is_error: boolean
    message: string
    user: {
        id: string
        email: string
        full_name: string
        nip: string
        role: string
    }
}

type AuthAction = {
    setField: <K extends keyof AuthState>(key: K, value: AuthState[K]) => void
    reset: () => void
    login: (e?: React.FormEvent) => Promise<void>
    register: (e?: React.FormEvent) => Promise<void>
    get_account: () => Promise<void>
    update_account: () => Promise<void>
    update_password: () => Promise<void>
    logout: () => Promise<void>
}

const initialState: Omit<AuthState, 'is_loading' | 'is_error' | 'message'> = {
    full_name: '',
    email: '',
    nip: '',
    password: '',
    current_password: '',
    role: 'operator',
    user: {
        id: '',
        email: '',
        full_name: '',
        nip: '',
        role: ''
    }
}

const useAuthStore = create<AuthState & AuthAction>()(
    persist(
        (set, get) => ({
            ...initialState,
            is_loading: false,
            is_error: false,
            message: '',

            setField: (key, value) => set({ [key]: value } as Partial<AuthState>),

            reset: () => set({ ...initialState, is_loading: false, is_error: false, message: '' }),

            logout: async () => {
                const toastId = toast.loading("Logging out from terminal...");
                try {
                    await signOut(auth);
                    set({ ...initialState });
                    toast.success("Terminal session ended", { id: toastId });
                    setTimeout(() => window.location.href = '/login', 1000);
                } catch (error) {
                    toast.error("Logout failed", { id: toastId });
                }
            },

            register: async (e?: React.FormEvent) => {
                e?.preventDefault();
                const { full_name, email, nip, password, role } = get();
                const toastId = toast.loading("Initializing new officer credentials...");
                set({ is_loading: true, is_error: false });

                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const uid = userCredential.user.uid;

                    await setDoc(doc(db, "officers", uid), {
                        full_name,
                        email,
                        nip,
                        role: role || 'operator',
                        createdAt: new Date()
                    });

                    toast.success("Account successfully deployed", { id: toastId });
                    setTimeout(() => window.location.href = '/', 1500);
                } catch (error: any) {
                    let errMsg = error.code === 'auth/email-already-in-use' ? 'EMAIL_ALREADY_EXISTS' : error.message;
                    set({ is_error: true, message: errMsg });
                    toast.error(errMsg, { id: toastId });
                } finally {
                    set({ is_loading: false });
                }
            },

            login: async (e?: React.FormEvent) => {
                e?.preventDefault();
                const { email, password } = get();
                const toastId = toast.loading("Verifying access keys...");
                set({ is_loading: true, is_error: false });

                try {
                    const userCredential = await signInWithEmailAndPassword(auth, email, password);
                    const uid = userCredential.user.uid;

                    const userDoc = await getDoc(doc(db, "officers", uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        set({
                            user: { id: uid, email: data.email, full_name: data.full_name, role: data.role, nip: data.nip },
                            role: data.role,
                            nip: data.nip
                        });
                        toast.success(`Access Granted: Welcome ${data.full_name}`, { id: toastId });
                        setTimeout(() => window.location.href = '/dashboard', 1500);
                    } else {
                        throw new Error("USER_NOT_FOUND_IN_DATABASE");
                    }
                } catch (error: any) {
                    let errMsg = "AUTH_ERROR";
                    if (error.code === 'auth/user-not-found') errMsg = "USER_NOT_FOUND";
                    else if (error.code === 'auth/wrong-password') errMsg = "INVALID_CREDENTIALS";
                    else errMsg = error.message;

                    set({ is_error: true, message: errMsg });
                    toast.error(errMsg, { id: toastId });
                } finally {
                    set({ is_loading: false });
                }
            },

            get_account: async () => {
                const { user, setField } = get();
                try {
                    if (!user.id) return; // Silent return if no user
                    const userDoc = await getDoc(doc(db, "officers", user.id));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setField("full_name", data.full_name || '');
                        setField("role", data.role || 'operator');
                        setField("nip", data.nip || '');
                    }
                } catch (error: any) {
                    toast.error("DATA_FETCH_FAILED: " + error.message);
                }
            },

            update_account: async (e?: React.FormEvent) => {
                e?.preventDefault();
                const { user, full_name } = get();
                const toastId = toast.loading("Syncing profile data...");

                try {
                    if (!user.id) throw new Error("UNAUTHORIZED");
                    await updateDoc(doc(db, "officers", user.id), {
                        full_name,
                        updatedAt: new Date()
                    });
                    set({ full_name });
                    toast.success("Profile sync complete", { id: toastId });
                } catch (error: any) {
                    toast.error("UPDATE_FAILED: " + error.message, { id: toastId });
                }
            },

            update_password: async (e?: React.FormEvent) => {
                e?.preventDefault();
                const { user, current_password, password } = get();
                const toastId = toast.loading("Re-encrypting access keys...");
                set({ is_loading: true });

                try {
                    if (!auth.currentUser) throw new Error("SESSION_EXPIRED");
                    const credential = EmailAuthProvider.credential(user.email, current_password);
                    await reauthenticateWithCredential(auth.currentUser, credential);
                    await updatePassword(auth.currentUser, password);

                    set({ password: '', current_password: '' });
                    toast.success("Encryption keys updated", { id: toastId });
                } catch (error: any) {
                    let errMsg = error.code === 'auth/wrong-password' ? "CURRENT_PASSWORD_INVALID" : error.message;
                    toast.error(errMsg, { id: toastId });
                } finally {
                    set({ is_loading: false });
                }
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
)

export default useAuthStore