// dependencies
import { Link } from "react-router-dom";
import { z } from "zod"

// stores
import { useAuthStore } from "../../stores"

// components
import { FormControl, TextField, Button } from "../../components"

// icons
import { FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

// form for login
export default function LoginForm() {
    const { email, password, setField, is_loading, login } = useAuthStore()

    return (
        <FormControl onSubmit={login}>
            <TextField
                type="text" required={true} id="email" label="e-mail" icon={<MdEmail className="w-4 h-4" />} loading={is_loading}
                schema={z
                    .email()}
                controller={{
                    value: email,
                    onChange: (e) => setField('email', e.target.value)
                }}
            />
            <TextField
                type="password" required={true} id="password" label="password" icon={<FaLock className="w-4 h-4" />} loading={is_loading}
                schema={z
                    .string()
                    .min(3, { message: "password must be at least 3 characters long" })}
                controller={{
                    value: password,
                    onChange: (e) => setField('password', e.target.value)
                }}
            />
            <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
                <Button type="submit" is_loading={is_loading} className="bg-slate-800 hover:bg-slate-900 text-white border-slate-950">
                    Login
                </Button>
            </div>
        </FormControl>
    )
}