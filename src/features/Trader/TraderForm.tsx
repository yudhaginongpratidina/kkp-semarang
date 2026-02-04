import { z } from "zod";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { MdBusiness, MdBadge, MdDescription, MdLocationOn, MdFileUpload } from "react-icons/md";
import { FiTerminal, FiDatabase, FiAlertTriangle } from "react-icons/fi";

// stores
import useTraderStore from "../../stores/useTraderStore";

// components
import { FormControl, TextField } from "../../components";

const traderSchema = z.object({
    nama_trader: z.string().min(3, "Minimal 3 karakter"),
    kode_trader: z.string().min(2, "Minimal 2 karakter"),
    npwp: z.string().min(15, "Minimal 15 digit"),
    alamat_trader: z.string().min(5, "Minimal 5 karakter"),
});

export default function TraderForm({ type, id }: { type: "create" | "update", id?: string }) {
    const { getTraderById, updateTrader, addTrader, importTradersFromExcel, loadingImport, trader, isLoading } = useTraderStore();

    const [activeTab, setActiveTab] = useState<"manual" | "import">("manual");
    const [formData, setFormData] = useState({
        nama_trader: "",
        kode_trader: "",
        npwp: "",
        alamat_trader: "",
    });

    useEffect(() => {
        if (type === "update" && id) getTraderById(id);
    }, [type, id, getTraderById]);

    useEffect(() => {
        if (type === "update" && trader) {
            setFormData({
                nama_trader: trader.nama_trader,
                kode_trader: trader.kode_trader,
                npwp: trader.npwp,
                alamat_trader: trader.alamat_trader,
            });
        }
    }, [trader, type]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
            await importTradersFromExcel(json);
            alert("IMPORT_SUCCESS");
            e.target.value = "";
            setActiveTab("manual");
        } catch (err: any) {
            alert("IMPORT_FAILED");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            traderSchema.parse(formData);
            if (type === "update" && id) {
                await updateTrader(id, formData);
            } else {
                await addTrader(formData);
                setFormData({ nama_trader: "", kode_trader: "", npwp: "", alamat_trader: "" });
            }
        } catch (err) {
            if (err instanceof z.ZodError) alert(err.issues[0].message);
        }
    };

    return (
        <div className="font-mono text-slate-900">
            {/* TAB SYSTEM - BRUTALIST */}
            <div className="flex border-b-4 border-slate-900 mb-6">
                <button
                    onClick={() => setActiveTab("manual")}
                    className={`px-6 py-2 text-[10px] font-black uppercase transition-all border-t-2 border-x-2 border-transparent ${activeTab === "manual"
                            ? "bg-slate-900 text-white border-slate-900"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                >
                    Manual_Entry
                </button>
                {type === "create" && (
                    <button
                        onClick={() => setActiveTab("import")}
                        className={`px-6 py-2 text-[10px] font-black uppercase transition-all border-t-2 border-x-2 border-transparent ${activeTab === "import"
                                ? "bg-slate-900 text-white border-slate-900"
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        Bulk_Import_XLSX
                    </button>
                )}
            </div>

            {activeTab === "manual" ? (
                <div className="p-2">
                    <div className="flex items-center gap-2 mb-6 text-blue-600">
                        <FiTerminal strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            Terminal_Status: {type === 'update' ? 'PATCHING_DATA' : 'AWAITING_INPUT'}
                        </span>
                    </div>

                    <FormControl onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* TextField tetap dipertahankan strukturnya */}
                            <TextField
                                type="text"
                                required={true}
                                id="nama_trader"
                                label="ENTITY_NAME"
                                icon={<MdBusiness className="text-blue-600 w-4 h-4" />}
                                loading={isLoading}
                                schema={z.string().min(3)}
                                controller={{
                                    value: formData.nama_trader,
                                    onChange: (e) => handleChange('nama_trader', e.target.value)
                                }}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextField
                                    type="text"
                                    required={true}
                                    id="kode_trader"
                                    label="TRADER_CODE"
                                    icon={<MdBadge className="text-blue-600 w-4 h-4" />}
                                    loading={isLoading}
                                    schema={z.string().min(2)}
                                    controller={{
                                        value: formData.kode_trader,
                                        onChange: (e) => handleChange('kode_trader', e.target.value)
                                    }}
                                />
                                <TextField
                                    type="text"
                                    required={true}
                                    id="npwp"
                                    label="NPWP"
                                    icon={<MdDescription className="text-blue-600 w-4 h-4" />}
                                    loading={isLoading}
                                    schema={z.string().min(15)}
                                    controller={{
                                        value: formData.npwp,
                                        onChange: (e) => handleChange('npwp', e.target.value)
                                    }}
                                />
                            </div>

                            <TextField
                                type="text"
                                required={true}
                                id="alamat_trader"
                                label="OFFICIAL_LOCATION"
                                icon={<MdLocationOn className="text-blue-600 w-4 h-4" />}
                                loading={isLoading}
                                schema={z.string().min(5)}
                                controller={{
                                    value: formData.alamat_trader,
                                    onChange: (e) => handleChange('alamat_trader', e.target.value)
                                }}
                            />
                        </div>

                        <div className="mt-8">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-4 text-[11px] font-black uppercase tracking-widest border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 ${type === 'update' ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'
                                    }`}
                            >
                                <FiDatabase />
                                {isLoading ? "PROCESSING..." : type === "update" ? "EXECUTE_UPDATE" : "COMMIT_REGISTRY"}
                            </button>
                        </div>
                    </FormControl>
                </div>
            ) : (
                /* IMPORT SECTION */
                <div className="border-2 border-slate-900 bg-slate-100 p-8 text-center relative overflow-hidden group">
                    <MdFileUpload className="w-12 h-12 text-slate-300 mx-auto mb-4 group-hover:text-blue-600 transition-colors" />
                    <h3 className="text-xs font-black uppercase mb-1 text-slate-700">Stream_Import_Protocol</h3>
                    <p className="text-[10px] text-slate-400 mb-6 font-mono italic">Expected_Format: .XLSX / .XLS</p>

                    <input
                        id="excel-upload-trader"
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleExcelUpload}
                        className="hidden"
                        disabled={loadingImport}
                    />

                    <label
                        htmlFor="excel-upload-trader"
                        className="cursor-pointer bg-white border-2 border-slate-900 px-8 py-3 text-[10px] font-black uppercase hover:bg-slate-900 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block"
                    >
                        {loadingImport ? "IMPORTING_DATA..." : "LOAD_EXTERNAL_SOURCE"}
                    </label>

                    <div className="mt-8 text-left bg-blue-50 border border-blue-200 p-4">
                        <div className="flex items-center gap-2 text-blue-800 text-[10px] font-black uppercase mb-2">
                            <FiAlertTriangle /> Mandatory_Header_Schema:
                        </div>
                        <code className="text-[9px] text-blue-600 font-bold block bg-white p-2 border border-blue-100 italic">
                            nama_trader, kode_trader, npwp, alamat_trader
                        </code>
                    </div>
                </div>
            )}
        </div>
    );
}