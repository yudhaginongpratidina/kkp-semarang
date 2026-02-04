import { useState } from "react";
import { ZodType } from "zod";

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

    // Logika styling yang sama dengan TextField kamu
    const borderClass = !touched
        ? "border-slate-300"
        : error
            ? "border-red-500 focus:border-red-500"
            : "border-blue-500 focus:border-blue-500";

    const iconClass = icon ? "pl-10" : "";

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
                    <div className="w-10 h-10 absolute top-0 left-0 flex justify-center items-center text-slate-400 pointer-events-none z-10">
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
                    className={`w-full h-10 px-2 border rounded-sm outline-none transition appearance-none ${iconClass} ${borderClass} ${
                        isBlocked ? "bg-slate-200 cursor-not-allowed text-slate-400" : "bg-slate-100"
                    }`}
                >
                    <option value="" disabled>-- Pilih {label} --</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                </div>
            </div>

            {error && touched && (
                <span className="text-xs text-red-500">{error}</span>
            )}
        </div>
    );
}