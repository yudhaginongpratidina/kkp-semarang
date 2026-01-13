// library
import z from "zod"

// components
import { FormControl, TextField, Button } from "../../components"

// stores
import { useAuthStore } from "../../stores"

// icons
import { RiLockPasswordFill } from "react-icons/ri";

export default function AccountPasswordForm() {
    const { current_password, password, is_loading, setField, update_password } = useAuthStore()
    return (
        <div className="w-full p-4">
            <div className="w-full max-w-xl p-4 bg-white">
                <FormControl onSubmit={update_password}>
                    <TextField
                        type="text" required={true} id="current_password" label="current password" icon={<RiLockPasswordFill className="w-4 h-4" />} loading={is_loading}
                        schema={z
                            .string()
                            .min(3, { message: "password must be at least 3 characters long" })}
                        controller={{
                            value: current_password,
                            onChange: (e) => setField('current_password', e.target.value)
                        }}
                    />
                    <TextField
                        type="text" required={true} id="password" label="new password" icon={<RiLockPasswordFill className="w-4 h-4" />} loading={is_loading}
                        schema={z
                            .string()
                            .min(3, { message: "password must be at least 3 characters long" })}
                        controller={{
                            value: password,
                            onChange: (e) => setField('password', e.target.value)
                        }}
                    />
                    <Button type="submit" is_loading={is_loading} className="bg-blue-500 hover:bg-blue-600 text-white">
                        Update
                    </Button>
                </FormControl>
            </div>
        </div>
    )
}