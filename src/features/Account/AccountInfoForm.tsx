// library
import { useEffect } from "react"
import z from "zod"

// components
import { FormControl, TextField } from "../../components"

// stores
import { useAuthStore } from "../../stores"

// icons
import { FaAddressCard, FaUser, FaShieldAlt, FaIdBadge } from "react-icons/fa"
import { FiCpu, FiUserCheck } from "react-icons/fi"

export default function AccountInfoForm() {
    const { full_name, nip, role, is_loading, setField, get_account, update_account } = useAuthStore()

    useEffect(() => {
        get_account()
    }, [get_account])

    return (
        <>
            {/* HEADER IDENTITAS */}
            <div className="bg-slate-900 text-white p-6 border-x-2 border-t-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black uppercase italic tracking-tighter">Personnel_Profile</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                        <FiCpu className="animate-pulse text-blue-500" /> <span>Online</span>
                    </p>
                </div>
                <div className="bg-blue-600 p-3 border-2 border-white/20 shadow-inner">
                    <FaIdBadge size={24} />
                </div>
            </div>
            {/* MAIN FORM CONTAINER */}
            <div className="bg-white border-2 border-slate-900 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                {/* Watermark Estetik */}
                <div className="absolute -right-4 -bottom-4 opacity-[0.03] pointer-events-none">
                    <FaUser size={200} />
                </div>

                <FormControl onSubmit={update_account}>
                    <div className="space-y-6 relative z-10">

                        {/* Editable Field dengan Penekanan */}
                        <div className="p-4 bg-blue-50/50 border-l-4 border-blue-600 mb-8">
                            <span className="text-[10px] font-black text-blue-600 uppercase block mb-3 tracking-widest">Modified_Parameters</span>
                            <TextField
                                type="text"
                                required={true}
                                id="full_name"
                                label="FULL_NAME_IDENTIFIER"
                                icon={<FaUser className="w-4 h-4 text-blue-600" />}
                                loading={is_loading}
                                schema={z.string().min(3, { message: "Minimal 3 karakter" })}
                                controller={{
                                    value: full_name,
                                    onChange: (e) => setField('full_name', e.target.value)
                                }}
                            />
                        </div>

                        {/* Read-Only Fields Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="opacity-70 grayscale transition-all hover:grayscale-0">
                                <TextField
                                    type="text" required={true} id="nip" label="PERSONNEL_ID (NIP)"
                                    icon={<FaAddressCard className="w-4 h-4 text-slate-500" />}
                                    loading={is_loading}
                                    disabled
                                    schema={z.string().min(3)}
                                    controller={{
                                        value: nip,
                                        onChange: (e) => setField('nip', e.target.value)
                                    }}
                                />
                            </div>
                            <div className="opacity-70 grayscale transition-all hover:grayscale-0">
                                <TextField
                                    type="text" required={true} id="role" label="ACCESS_ROLE"
                                    icon={<FaShieldAlt className="w-4 h-4 text-slate-500" />}
                                    loading={is_loading}
                                    disabled
                                    schema={z.string().min(3)}
                                    controller={{
                                        value: role,
                                        onChange: (e) => setField('role', e.target.value)
                                    }}
                                />
                            </div>
                        </div>

                        {/* Info Warning untuk Disabled Fields */}
                        <p className="text-[9px] text-slate-400 italic flex items-center gap-2">
                            * Personnel_ID and Access_Role are locked by administrative protocol.
                        </p>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={is_loading}
                                className="w-full bg-blue-600 hover:bg-slate-900 text-white py-4 font-black uppercase text-xs tracking-[0.3em] border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3"
                            >
                                {is_loading ? (
                                    <span className="animate-pulse">SYNCHRONIZING...</span>
                                ) : (
                                    <>
                                        <FiUserCheck size={18} strokeWidth={3} />
                                        UPDATE_PROFILE_BUFFER
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </FormControl>
            </div>
        </>
    )
}