// dependencies
import { z } from "zod"

// components
import { FormControl, TextField, Button } from "../../components"

// stores
import { useAccountStore } from "../../stores"

// icons
import { FaLock, FaUser } from "react-icons/fa"

export default function AccountForm() {
    const { username, password, role, setField, is_loading, is_edit, update } = useAccountStore()

    return (
        <div className="w-full p-4">
            <div className="w-full max-w-xl p-4 bg-white">
                <FormControl onSubmit={update}>
                    <TextField
                        type="text" required={true} id="username" label="username" icon={<FaUser className="w-4 h-4" />} loading={is_loading}
                        placeholder="your username" disabled={!is_edit}
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
                        placeholder="*********" disabled={!is_edit}
                        schema={z
                            .string()
                            .min(3, { message: "password must be at least 3 characters long" })}
                        controller={{
                            value: password,
                            onChange: (e) => setField('password', e.target.value)
                        }}
                    />
                    <TextField
                        type="text" required={true} id="role" label="role" icon={<FaUser className="w-4 h-4" />} loading={is_loading}
                        placeholder="your role" disabled
                        schema={z
                            .enum(['op-admin', 'op-customer-service', 'op-laboratory', 'op-smkhp'])}
                        controller={{
                            value: role,
                            onChange: (e) => {
                                const value = e.target.value as 'op-admin' | 'op-customer-service' | 'op-laboratory' | 'op-smkhp'
                                setField('role', value)
                            }
                        }}
                    />
                    {is_edit && (
                        <div className="w-full flex items-center gap-2">
                            <Button type="submit" is_loading={is_loading} className="bg-blue-500 hover:bg-blue-600 text-white">
                                Update
                            </Button>
                            <Button type="button" onClick={() => setField('is_edit', false)} is_loading={is_loading} className="bg-red-500 hover:bg-red-600 text-white">
                                Cancel
                            </Button>
                        </div>
                    )}
                    {!is_edit && (
                        <div className="w-full flex items-center gap-2">
                            <Button type="button" onClick={() => setField('is_edit', true)} is_loading={is_loading} className="bg-blue-500 hover:bg-blue-600 text-white">
                                Edit Account
                            </Button>
                            <Button type="button" onClick={() => setField('is_edit', true)} is_loading={is_loading} className="bg-red-500 hover:bg-red-600 text-white">
                                Exit
                            </Button>
                        </div>
                    )}
                </FormControl>
            </div>
        </div>
    )
}