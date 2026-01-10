// dependencies
import { Link } from "react-router-dom";
import { z } from "zod"

// stores
import { useAuthStore } from "../../stores"

// components
import { FormControl, TextField, Button } from "../../components"

// icons
import { FaUser, FaLock } from "react-icons/fa";

// form for login
export default function LoginForm() {
    const { username, password, setField, is_loading, login } = useAuthStore()

    return (
        <FormControl onSubmit={login}>
            <TextField
                type="text" required={true} id="username" label="username" icon={<FaUser className="w-4 h-4" />} loading={is_loading}
                schema={z
                    .string()
                    .min(3, { message: "username must be at least 3 characters long" })}
                controller={{
                    value: username,
                    onChange: (e) => setField('username', e.target.value)
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
                <Button type="submit" is_loading={is_loading} className="bg-blue-500 hover:bg-blue-600 text-white">
                    Login
                </Button>
                <Link to={"/create-account"} className="text-sm font-semibold hover:underline text-blue-500">
                    i don&apos;t have an account
                </Link>
            </div>
        </FormControl>
    )
}