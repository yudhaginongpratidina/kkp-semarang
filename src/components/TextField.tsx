import { useState } from "react"
import { ZodType } from "zod"
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Tambah EyeSlash

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string
    label: string
    required: boolean
    type: "text" | "email" | "password" | "date" | "time" | "datetime-local";
    controller: {
        value: string
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    }
    schema: ZodType<string>
    icon?: React.ReactNode
    disabled?: boolean
    loading?: boolean
}

export default function TextField({ id, label, required, type, controller, schema, icon, disabled, loading, ...props }: TextFieldProps) {
    const [error, setError] = useState<string | null>(null)
    const [touched, setTouched] = useState(false)
    const [showPassword, setShowPassword] = useState(false) // Gunakan state, jangan DOM manual

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!touched) setTouched(true)
        const val = e.target.value
        controller.onChange(e)

        if (schema) {
            const result = schema.safeParse(val)
            if (!result.success) {
                setError(result.error.issues[0].message)
            } else {
                setError(null)
            }
        }
    }

    // Penentuan Tipe Input secara dinamis
    const inputType = type === "password" ? (showPassword ? "text" : "password") : type

    // Styling Logic - Industrial Gray Palette
    const borderClass = !touched
        ? "border-slate-300 focus-within:border-slate-800"
        : error
            ? "border-red-500"
            : "border-slate-800 focus-within:ring-1 focus-within:ring-slate-800"

    const isBlocked = disabled || loading

    return (
        <div className="w-full flex flex-col gap-1 font-mono">
            {/* Label dengan gaya Technical Header */}
            <div className="flex justify-between items-end px-1">
                <label htmlFor={id} className="text-[10px] uppercase tracking-widest font-bold text-slate-500 flex items-center gap-1">
                    <span className={error && touched ? "text-red-500" : ""}>{label}</span>
                    {required && <span className="text-red-500 text-[8px]">●</span>}
                </label>
                {error && touched && (
                    <span className="text-[9px] text-red-500 font-bold animate-pulse uppercase">Error_Detected</span>
                )}
            </div>

            <div className={`relative flex items-center transition-all duration-200 border rounded-sm overflow-hidden ${borderClass} ${isBlocked ? "bg-slate-200" : "bg-white"}`}>
                
                {/* Icon Section - Data Prefix */}
                {icon && (
                    <div className="w-10 h-10 flex justify-center items-center border-r border-slate-200 text-slate-400 bg-slate-50">
                        {icon}
                    </div>
                )}

                <input
                    id={id}
                    name={id}
                    type={inputType}
                    autoComplete="off"
                    {...props}
                    value={controller.value}
                    onChange={handleChange}
                    disabled={isBlocked}
                    className={`w-full h-10 px-3 text-sm font-bold bg-transparent outline-none text-slate-800 placeholder:text-slate-300 placeholder:font-normal ${isBlocked ? "cursor-not-allowed" : ""}`}
                />

                {/* Password Toggle - Tech Button */}
                {type === "password" && (
                    <button 
                        onClick={() => setShowPassword(!showPassword)} 
                        type="button" 
                        className="w-10 h-10 flex justify-center items-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors border-l border-slate-100"
                    >
                        {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                    </button>
                )}

                {/* Decorative Tech Bar (Kanan) */}
                <div className={`absolute right-0 top-0 h-full w-1 transition-all ${error && touched ? "bg-red-500" : "bg-transparent"}`}></div>
            </div>

            {/* Error Message - CLI Style */}
            {error && touched && (
                <span className="text-[10px] text-red-600 bg-red-50 px-2 py-0.5 rounded-sm font-bold mt-1">
                    {`>> FIELD_ERR: ${error.toUpperCase()}`}
                </span>
            )}
        </div>
    )
}