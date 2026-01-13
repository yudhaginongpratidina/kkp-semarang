// library
import { useEffect } from "react"
import z from "zod"

// components
import { FormControl, TextField, Button } from "../../components"

// stores
import { useAuthStore } from "../../stores"

// icons
import { FaAddressCard, FaUser } from "react-icons/fa"

export default function AccountInfoForm() {
    const { full_name, nip, is_loading, setField, get_account } = useAuthStore()

    useEffect(() => {
        get_account()
    }, [])

    return (
        <div className="w-full p-4">
            <div className="w-full max-w-xl p-4 bg-white">
                <FormControl>
                    <TextField
                        type="text" required={true} id="full_name" label="full name" icon={<FaUser className="w-4 h-4" />} loading={is_loading}
                        schema={z
                            .string()
                            .min(3, { message: "full name must be at least 3 characters long" })}
                        controller={{
                            value: full_name,
                            onChange: (e) => setField('full_name', e.target.value)
                        }}
                    />
                    <TextField
                        type="text" required={true} id="nip" label="NIP" icon={<FaAddressCard className="w-4 h-4" />} loading={is_loading} disabled
                        schema={z
                            .string()
                            .min(3, { message: "nip must be at least 3 characters long" })}
                        controller={{
                            value: nip,
                            onChange: (e) => setField('nip', e.target.value)
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