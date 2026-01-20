import { create } from "zustand";
import type { ReactNode } from "react";

type ModalSize = "sm" | "md" | "lg";

type ModalState = {
    isOpen: boolean;
    title?: string;
    content?: ReactNode;
    size: ModalSize;
};

type ModalAction = {
    open: (payload: {
        title?: string;
        content: ReactNode;
        size?: ModalSize;
    }) => void;
    close: () => void;
};

const initialState: ModalState = {
    isOpen: false,
    title: undefined,
    content: undefined,
    size: "md",
};

const useModalStore = create<ModalState & ModalAction>((set) => ({
    ...initialState,

    open: ({ title, content, size = "md" }) =>
        set({
            isOpen: true,
            title,
            content,
            size,
        }),

    close: () => set(initialState),
}));

export default useModalStore;