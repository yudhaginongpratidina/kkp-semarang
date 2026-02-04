// library
import z from "zod"

// components
import { FormControl, TextField } from "../../components"

// stores
import { useAuthStore } from "../../stores"

// icons
import { RiLockPasswordFill, RiShieldKeyholeFill } from "react-icons/ri";
import { FiAlertCircle, FiLock, FiRefreshCw } from "react-icons/fi";

export default function AccountPasswordForm() {
    const { current_password, password, is_loading, setField, update_password } = useAuthStore()

    return (
        <>
            {/* SECURITY HEADER */}
            <div className="bg-red-600 text-white p-4 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 mb-1">
                <RiShieldKeyholeFill size={24} className="animate-pulse" />
                <div>
                    <h2 className="text-sm font-black uppercase tracking-tighter">Security_Credential_Override</h2>
                    <p className="text-[9px] font-bold opacity-80 uppercase">Warning: Changes will terminate existing session tokens</p>
                </div>
            </div>

            {/* FORM BODY */}
            <div className="bg-white border-2 border-slate-900 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <FormControl onSubmit={update_password}>
                    <div className="space-y-8">

                        {/* CURRENT PASSWORD SECTION */}
                        <div className="relative">
                            <div className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-black text-slate-400 uppercase z-10">
                                Identity_Verification
                            </div>
                            <div className="p-4 border-2 border-slate-100 rounded-sm">
                                <TextField
                                    type="password" // WAJIB PASSWORD
                                    required={true}
                                    id="current_password"
                                    label="CURRENT_PASSWORD"
                                    icon={<RiLockPasswordFill className="w-4 h-4 text-slate-400" />}
                                    loading={is_loading}
                                    schema={z.string().min(3, { message: "Min 3 characters" })}
                                    controller={{
                                        value: current_password,
                                        onChange: (e) => setField('current_password', e.target.value)
                                    }}
                                />
                            </div>
                        </div>

                        {/* NEW PASSWORD SECTION */}
                        <div className="relative">
                            <div className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-black text-blue-600 uppercase z-10">
                                New_Access_Key
                            </div>
                            <div className="p-4 border-2 border-blue-100 bg-blue-50/30 rounded-sm">
                                <TextField
                                    type="password" // WAJIB PASSWORD
                                    required={true}
                                    id="password"
                                    label="NEW_ENCRYPTED_PASSWORD"
                                    icon={<FiLock className="w-4 h-4 text-blue-600" />}
                                    loading={is_loading}
                                    schema={z.string().min(3, { message: "Min 3 characters" })}
                                    controller={{
                                        value: password,
                                        onChange: (e) => setField('password', e.target.value)
                                    }}
                                />
                                <div className="mt-2 flex items-center gap-2 text-[9px] text-blue-500 font-bold uppercase">
                                    <FiAlertCircle /> Use a combination of alphanumeric characters
                                </div>
                            </div>
                        </div>

                        {/* SUBMIT ACTION */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={is_loading}
                                className="w-full bg-slate-900 hover:bg-blue-600 text-white py-4 font-black uppercase text-xs tracking-[0.3em] border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(191,219,254,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3"
                            >
                                {is_loading ? (
                                    <FiRefreshCw className="animate-spin" />
                                ) : (
                                    <RiShieldKeyholeFill size={18} />
                                )}
                                {is_loading ? "ENCRYPTING_NEW_KEY..." : "REWRITE_CREDENTIALS"}
                            </button>
                        </div>
                    </div>
                </FormControl>
            </div>
        </>
    )
}