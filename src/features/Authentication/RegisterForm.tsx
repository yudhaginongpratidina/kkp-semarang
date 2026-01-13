// dependencies
import { Link } from "react-router-dom";
import { z } from "zod"

// stores
import { useAuthStore } from "../../stores"

// components
import { FormControl, TextField, Button } from "../../components"

// icons
import { FaUser, FaLock, FaAddressCard } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

// form for login
export default function RegisterForm() {
    const { full_name, email, nip, password, setField, is_loading, register } = useAuthStore()

    return (
        <FormControl onSubmit={register}>
            <TextField
                type="text" required={true} id="full_name" label="full name" icon={<FaUser className="w-4 h-4" />} loading={is_loading}
                schema={z
                    .string()
                    .min(1, { message: "full name must be at least 1 characters long" })}
                controller={{
                    value: full_name,
                    onChange: (e) => setField('full_name', e.target.value)
                }}
            />
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
                type="text" required={true} id="nip" label="NIP" icon={<FaAddressCard className="w-4 h-4" />} loading={is_loading}
                schema={z
                    .string()
                    .min(1, { message: "nip must be at least 1 characters long" })}
                controller={{
                    value: nip,
                    onChange: (e) => setField('nip', e.target.value)
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
                    Create
                </Button>
                <Link to={"/"} className="text-sm font-semibold hover:underline text-blue-500">
                    i have an account
                </Link>
            </div>
        </FormControl>
    )
}