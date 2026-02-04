import { useEffect, useState } from "react";
import z from "zod";
import * as XLSX from "xlsx";
import { MdPerson, MdBadge, MdWork, MdFileUpload } from "react-icons/md";
import { FiAlertTriangle, FiFileText } from "react-icons/fi";
import { FormControl, TextField, SelectField } from "../../components";
import { useUserManagementStore } from "../../stores";

const ROLE_OPTIONS = ["operator", "customer_service", "laboratorium", "superuser"];

export default function UserForm({ type, id }: { type: "create" | "update", id?: string }) {
    const {
        full_name, nip, role,
        setField,
        get_officer_by_id,
        create_officer,
        update_officer,
        import_users_excel,
        is_loading,
        reset
    } = useUserManagementStore();

    const [activeTab, setActiveTab] = useState<"manual" | "import">("manual");

    useEffect(() => {
        if (type === "update" && id) {
            get_officer_by_id(id);
            setActiveTab("manual");
        } else {
            reset();
        }
    }, [type, id]);

    const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
            if (json.length === 0) throw new Error("EMPTY_DATASET_ERROR");
            await import_users_excel(json);
            alert(`SUCCESS: ${json.length} ENTRIES_IMPORTED`);
            e.target.value = "";
            setActiveTab("manual");
        } catch (err: any) {
            alert(err.message || "IMPORT_FAILED");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!full_name || !nip || !role) return alert("REQUIRED_FIELDS_MISSING");
        type === "create" ? await create_officer() : await update_officer(id!);
    };

    return (
        <div className="font-mono text-slate-800 p-2">
            {/* Header Status */}
            <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 bg-blue-600"></div>
                <h2 className="text-xs font-black uppercase tracking-tighter italic">
                    {type === "update" ? `patch_process // id:${id?.slice(0, 8)}` : "new_entry_initialization"}
                </h2>
            </div>

            {/* Tab System - Industrial Style */}
            <div className="flex mb-6 border-b-2 border-slate-200">
                <button
                    type="button"
                    onClick={() => setActiveTab("manual")}
                    className={`px-6 py-2 text-[10px] font-black uppercase transition-all border-t-2 border-x-2 ${
                        activeTab === "manual" 
                        ? "border-slate-800 bg-slate-800 text-white -mb-0.5" 
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                >
                    {type === "update" ? "Modify_Data" : "Manual_Input"}
                </button>
                {type === "create" && (
                    <button
                        type="button"
                        onClick={() => setActiveTab("import")}
                        className={`px-6 py-2 text-[10px] font-black uppercase transition-all border-t-2 border-x-2 ${
                            activeTab === "import" 
                            ? "border-slate-800 bg-slate-800 text-white -mb-0.5" 
                            : "border-transparent text-slate-400 hover:text-slate-600"
                        }`}
                    >
                        Bulk_Import_XLSX
                    </button>
                )}
            </div>

            {activeTab === "manual" ? (
                <div className="bg-slate-50 border-2 border-slate-800 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <FormControl onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            <TextField
                                type="text"
                                required
                                id="full_name"
                                label="OFFICER_NAME"
                                icon={<MdPerson className="text-blue-600" />}
                                loading={is_loading}
                                schema={z.string().min(3)}
                                controller={{
                                    value: full_name,
                                    onChange: (e) => setField('full_name', e.target.value)
                                }}
                            />
                            <TextField
                                type="text"
                                required
                                id="nip"
                                label="REGISTRATION_ID (NIP)"
                                icon={<MdBadge className="text-blue-600" />}
                                loading={is_loading}
                                schema={z.string().min(5)}
                                controller={{
                                    value: nip,
                                    onChange: (e) => setField('nip', e.target.value)
                                }}
                            />
                            <SelectField
                                id="role"
                                label="ACCESS_LEVEL"
                                required={true}
                                icon={<MdWork className="text-blue-600" />}
                                loading={is_loading}
                                schema={z.string()}
                                options={ROLE_OPTIONS.map(opt => ({
                                    value: opt,
                                    label: opt.toUpperCase().replace('_', ' ')
                                }))}
                                controller={{
                                    value: role,
                                    onChange: (e) => setField('role', e.target.value)
                                }}
                            />
                        </div>

                        <div className="mt-8">
                            <button
                                type="submit"
                                disabled={is_loading}
                                className={`w-full text-[11px] font-black uppercase py-4 border-2 border-slate-900 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 ${
                                    type === 'update' ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'
                                }`}
                            >
                                {is_loading ? "EXECUTING..." : type === "update" ? "EXECUTE_PATCH" : "COMMIT_ENTRY"}
                            </button>
                        </div>
                    </FormControl>
                </div>
            ) : (
                /* Import Tab */
                <div className="bg-slate-100 border-2 border-dashed border-slate-400 p-10 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-20">
                        <FiFileText size={80} />
                    </div>
                    
                    <MdFileUpload className="w-12 h-12 text-slate-400 mx-auto mb-4 group-hover:text-blue-600 transition-colors" />
                    <h3 className="text-xs font-black uppercase mb-1">Upload_Data_Stream</h3>
                    <p className="text-[10px] text-slate-500 mb-6 uppercase tracking-widest italic">Format: .XLSX / .XLS Only</p>

                    <input
                        id="excel-upload"
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleExcelUpload}
                        className="hidden"
                        disabled={is_loading}
                    />
                    <label
                        htmlFor="excel-upload"
                        className="cursor-pointer bg-white border-2 border-slate-900 px-8 py-3 text-[10px] font-black uppercase hover:bg-slate-900 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] inline-block"
                    >
                        Initialize_Upload
                    </label>

                    <div className="mt-10 text-left bg-white border border-slate-200 p-4 relative">
                        <div className="absolute -top-3 left-4 bg-white px-2 text-[9px] font-black flex items-center gap-1">
                            <FiAlertTriangle className="text-orange-500" /> DATA_SCHEMA_PROTOCOL
                        </div>
                        <div className="flex gap-2 flex-wrap mt-2">
                            {['full_name', 'nip', 'role'].map(header => (
                                <span key={header} className="text-[10px] bg-slate-100 px-2 py-1 border border-slate-300 font-bold">
                                    {header.toUpperCase()}
                                </span>
                            ))}
                        </div>
                        <p className="text-[12px] font-bold  mt-4 leading-relaxed uppercase">
                            Warning: Valid role values are restricted to {ROLE_OPTIONS.join(' | ').toUpperCase()}. 
                            Invalid entries will be rejected by system validation.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}