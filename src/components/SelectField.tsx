import { useState } from "react";
import { ZodType } from "zod";
import { FaChevronDown } from "react-icons/fa"; // Gunakan icon yang konsisten

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    id: string;
    label: string;
    required: boolean;
    options: { value: string; label: string }[];
    controller: {
        value: string;
        onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    };
    schema: ZodType<string>;
    icon?: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
}

export default function SelectField({ 
    id, label, required, options, controller, schema, icon, disabled, loading, ...props 
}: SelectFieldProps) {
    const [error, setError] = useState<string | null>(null);
    const [touched, setTouched] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!touched) setTouched(true);
        const val = e.target.value;
        controller.onChange(e);

        if (schema) {
            const result = schema.safeParse(val);
            if (!result.success) {
                setError(result.error.issues[0].message);
            } else {
                setError(null);
            }
        }
    };

    const isBlocked = disabled || loading;

    // Styling Logic - Industrial Gray (Sesuai TextField)
    const borderClass = !touched
        ? "border-slate-300 focus-within:border-slate-800"
        : error
            ? "border-red-500"
            : "border-slate-800 focus-within:ring-1 focus-within:ring-slate-800";

    return (
        <div className="w-full flex flex-col gap-1 font-mono">
            {/* Technical Header Label */}
            <div className="flex justify-between items-end px-1">
                <label htmlFor={id} className="text-[10px] uppercase tracking-widest font-bold text-slate-500 flex items-center gap-1">
                    <span className={error && touched ? "text-red-500" : ""}>{label}</span>
                    {required && <span className="text-red-500 text-[8px]">●</span>}
                </label>
                {error && touched && (
                    <span className="text-[9px] text-red-500 font-bold animate-pulse uppercase">Invalid_Selection</span>
                )}
            </div>

            <div className={`relative flex items-center transition-all duration-200 border rounded-sm overflow-hidden ${borderClass} ${isBlocked ? "bg-slate-200" : "bg-white"}`}>
                
                {/* Prefix Icon Section */}
                {icon && (
                    <div className="w-10 h-10 flex justify-center items-center border-r border-slate-200 text-slate-400 bg-slate-50">
                        {icon}
                    </div>
                )}

                <select
                    id={id}
                    name={id}
                    {...props}
                    value={controller.value}
                    onChange={handleChange}
                    disabled={isBlocked}
                    required={required}
                    className={`
                        w-full h-10 px-3 text-sm font-bold bg-transparent outline-none text-slate-800 
                        appearance-none cursor-pointer
                        ${isBlocked ? "cursor-not-allowed text-slate-400" : ""}
                    `}
                >
                    <option value="" disabled className="text-slate-400">-- SELECT_{label.toUpperCase()} --</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="text-slate-800 font-sans">
                            {opt.label}
                        </option>
                    ))}
                </select>

                {/* Custom Chevron - Tech Style */}
                <div className="absolute right-0 top-0 h-full w-10 flex justify-center items-center pointer-events-none border-l border-slate-100 bg-slate-50/50">
                    <FaChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-300 ${isBlocked ? "opacity-30" : ""}`} />
                </div>

                {/* Decorative Tech Bar (Sisi Kanan) */}
                <div className={`absolute right-0 top-0 h-full w-1 transition-all ${error && touched ? "bg-red-500" : "bg-transparent"}`}></div>
            </div>

            {/* Error Message - CLI Style */}
            {error && touched && (
                <span className="text-[10px] text-red-600 bg-red-50 px-2 py-0.5 rounded-sm font-bold mt-1">
                    {`>> SELECT_ERR: ${error.toUpperCase()}`}
                </span>
            )}
        </div>
    );
}