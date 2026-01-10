import { AiOutlineLoading } from "react-icons/ai";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    type: "button" | "submit" | "reset"
    children: React.ReactNode
    is_loading?: boolean
    className?: string
}

export default function Button({ type, children, className, is_loading, ...props }: ButtonProps) {
    return (
        <button type={type} {...props} disabled={is_loading} className={`w-full md:w-fit md:min-w-32 h-10 px-2 rounded-sm flex justify-center items-center gap-2 hover:cursor-pointer ${is_loading ? "opacity-50 hover:cursor-not-allowed" : ""} ${className}`}>
            {children}
            {is_loading && <AiOutlineLoading className="animate-spin" />}
        </button>
    )
}