import { useState } from "react"
import { ZodType } from "zod"

import { FaEye } from "react-icons/fa";

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

    const borderClass = !touched
        ? "border-slate-300"
        : error
            ? "border-red-500 focus:border-red-500"
            : "border-blue-500 focus:border-blue-500"

    const iconClass = icon ? "pl-10" : ""
    const isBlocked = disabled || loading

    const handleShowPassword = () => {
        const input = document.getElementById(id) as HTMLInputElement
        input.type = input.type === "password" ? "text" : "password"
    }

    return (
        <div className="w-full flex flex-col gap-1">
            <label htmlFor={id} className="capitalize flex items-center gap-1 font-semibold text-sm">
                <span className={error && touched ? "text-red-500" : "text-black"}>
                    {label}
                </span>
                {required && <span className="text-red-500">*</span>}
            </label>

            <div className="w-full relative">
                {icon && (
                    <div className="w-10 h-10 absolute top-0 left-0 flex justify-center items-center text-slate-400">
                        {icon}
                    </div>
                )}
                <input
                    id={id} name={id} type={type} autoComplete="off" {...props}
                    value={controller.value} onChange={handleChange}
                    disabled={isBlocked} required={required} 
                    className={`w-full h-10 px-2 border rounded-sm outline-none transition ${iconClass} ${borderClass} ${isBlocked ? "bg-slate-200 cursor-not-allowed text-slate-400" : "bg-slate-100"}`}
                />
                {type === "password" && (
                    <button onClick={handleShowPassword} type="button" className="w-10 h-10 absolute top-0 right-0 flex justify-center items-center hover:cursor-pointer text-slate-400">
                        <FaEye className="w-4 h-4" />
                    </button>
                )}
            </div>

            {error && touched && (
                <span className="text-xs text-red-500">{error}</span>
            )}
        </div>
    )
}