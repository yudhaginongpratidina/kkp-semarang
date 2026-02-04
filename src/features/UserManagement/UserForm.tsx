import { useEffect, useState } from "react";
import z from "zod";
import * as XLSX from "xlsx";
import { MdPerson, MdBadge, MdWork, MdFileUpload } from "react-icons/md";
import { FormControl, TextField, SelectField, Button } from "../../components";
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

            // Konversi ke JSON
            const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

            if (json.length === 0) {
                throw new Error("File Excel kosong atau tidak terbaca");
            }

            await import_users_excel(json);

            alert(`Berhasil mengimport ${json.length} data petugas.`);
            e.target.value = "";
            setActiveTab("manual");
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Gagal mengimport data. Pastikan format header benar.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!full_name || !nip || !role) {
            alert("Semua field wajib diisi!");
            return;
        }

        if (type === "create") {
            await create_officer();
        } else if (type === "update" && id) {
            await update_officer(id);
        }
    };

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-4 border-b border-gray-200">
                <button
                    type="button"
                    onClick={() => setActiveTab("manual")}
                    className={`pb-2 px-2 text-sm font-bold transition-all ${activeTab === "manual" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-400"}`}
                >
                    {type === "update" ? "Edit Data Petugas" : "Input Manual"}
                </button>
                {type === "create" && (
                    <button
                        type="button"
                        onClick={() => setActiveTab("import")}
                        className={`pb-2 px-2 text-sm font-bold transition-all ${activeTab === "import" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-400"}`}
                    >
                        Import via Excel
                    </button>
                )}
            </div>

            {activeTab === "manual" ? (
                <FormControl onSubmit={handleSubmit}>
                    <TextField
                        type="text"
                        required
                        id="full_name"
                        label="Nama Lengkap"
                        icon={<MdPerson className="w-4 h-4" />}
                        loading={is_loading}
                        schema={z.string().min(3, "Nama terlalu pendek")}
                        controller={{
                            value: full_name,
                            onChange: (e) => setField('full_name', e.target.value)
                        }}
                    />
                    <TextField
                        type="text"
                        required
                        id="nip"
                        label="NIP"
                        icon={<MdBadge className="w-4 h-4" />}
                        loading={is_loading}
                        schema={z.string().min(5, "NIP minimal 5 karakter")}
                        controller={{
                            value: nip,
                            onChange: (e) => setField('nip', e.target.value)
                        }}
                    />
                    <SelectField
                        id="role"
                        label="Jabatan"
                        required={true}
                        icon={<MdWork className="w-4 h-4" />}
                        loading={is_loading}
                        schema={z.string().min(1, "Harap pilih jabatan")}
                        options={ROLE_OPTIONS.map(opt => ({
                            value: opt,
                            label: opt.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                        }))}
                        controller={{
                            value: role,
                            onChange: (e) => setField('role', e.target.value)
                        }}
                    />
                    <div className="mt-4">
                        <Button
                            type="submit"
                            is_loading={is_loading}
                            className={`w-full text-white font-semibold py-2.5 rounded-lg transition-all ${type === 'update'
                                ? 'bg-orange-500 hover:bg-orange-600 shadow-md'
                                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
                                }`}
                        >
                            {type === "update" ? "Perbarui Data Petugas" : "Daftarkan Petugas Baru"}
                        </Button>
                    </div>
                </FormControl>
            ) : (
                <div className="p-10 border-2 border-dashed border-gray-200 rounded-xl text-center bg-gray-50/50">
                    <div className="bg-indigo-100 w-16 h-16 rounded-full flex justify-center items-center mx-auto mb-4">
                        <MdFileUpload className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h3 className="text-base font-bold text-gray-800">Massal Upload Petugas</h3>
                    <p className="text-sm text-gray-500 mb-6">Seret file Excel ke sini atau klik tombol di bawah</p>

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
                        className="cursor-pointer bg-white border border-gray-300 px-6 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm inline-block"
                    >
                        Pilih File Excel
                    </label>

                    <div className="mt-8 text-left p-4 bg-amber-50 rounded-lg border border-amber-100">
                        <p className="text-xs font-bold text-amber-800 uppercase mb-2">Panduan Header Excel:</p>
                        <div className="flex gap-2 flex-wrap">
                            {['full_name', 'nip', 'role'].map(header => (
                                <code key={header} className="text-[11px] bg-white px-2 py-1 rounded border border-amber-200 text-amber-700 font-mono font-bold">
                                    {header}
                                </code>
                            ))}
                        </div>
                        <p className="text-[10px] text-amber-600 mt-3 italic">*Pastikan role diisi dengan: {ROLE_OPTIONS.join(', ')}</p>
                    </div>
                </div>
            )}
        </div>
    );
}