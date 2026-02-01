import { z } from "zod";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { MdBusiness, MdBadge, MdDescription, MdLocationOn, MdFileUpload } from "react-icons/md";

// stores
import useTraderStore from "../../stores/useTraderStore";

// components
import { FormControl, TextField, Button } from "../../components";

const traderSchema = z.object({
    nama_trader: z.string().min(3, "Nama minimal 3 karakter"),
    kode_trader: z.string().min(2, "Kode minimal 2 karakter"),
    npwp: z.string().min(15, "NPWP minimal 15 digit"),
    alamat_trader: z.string().min(5, "Alamat minimal 5 karakter"),
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
        if (type === "update" && id) {
            getTraderById(id);
        }
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
            alert("Import Excel sukses!");
            e.target.value = "";
        } catch (err: any) {
            alert(err.message || "Gagal import data");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            traderSchema.parse(formData);
            if (type === "update" && id) {
                await updateTrader(id, formData);
                alert("Data berhasil diperbarui!");
            } else {
                await addTrader(formData);
                alert("Trader berhasil ditambahkan!");
                setFormData({ nama_trader: "", kode_trader: "", npwp: "", alamat_trader: "" });
            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                alert(err.issues[0]?.message || "Input tidak valid");
            } else {
                alert("Terjadi kesalahan pada server");
            }
        }
    };

    return (
        <div className="space-y-4">
            {/* Navigasi Tab Sederhana */}
            <div className="flex gap-2 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab("manual")}
                    className={`pb-2 px-4 text-sm font-bold transition-all ${activeTab === "manual" ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-400"}`}
                >
                    {type === "update" ? "Edit Data" : "Input Manual"}
                </button>
                {type === "create" && (
                    <button
                        onClick={() => setActiveTab("import")}
                        className={`pb-2 px-4 text-sm font-bold transition-all ${activeTab === "import" ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-400"}`}
                    >
                        Import Excel
                    </button>
                )}
            </div>

            {activeTab === "manual" ? (
                <FormControl onSubmit={handleSubmit}>
                    <TextField
                        type="text"
                        required={true}
                        id="nama_trader"
                        label="Nama Trader"
                        icon={<MdBusiness className="w-4 h-4" />}
                        loading={isLoading}
                        schema={z.string().min(3)}
                        controller={{
                            value: formData.nama_trader,
                            onChange: (e) => handleChange('nama_trader', e.target.value)
                        }}
                    />

                    <TextField
                        type="text"
                        required={true}
                        id="kode_trader"
                        label="Kode Trader"
                        icon={<MdBadge className="w-4 h-4" />}
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
                        icon={<MdDescription className="w-4 h-4" />}
                        loading={isLoading}
                        schema={z.string().min(15)}
                        controller={{
                            value: formData.npwp,
                            onChange: (e) => handleChange('npwp', e.target.value)
                        }}
                    />

                    <TextField
                        type="text"
                        required={true}
                        id="alamat_trader"
                        label="Alamat"
                        icon={<MdLocationOn className="w-4 h-4" />}
                        loading={isLoading}
                        schema={z.string().min(5)}
                        controller={{
                            value: formData.alamat_trader,
                            onChange: (e) => handleChange('alamat_trader', e.target.value)
                        }}
                    />

                    <Button
                        type="submit"
                        is_loading={isLoading}
                        className={`w-full text-white ${type === 'update' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                        {type === "update" ? "Perbarui Trader" : "Simpan Trader"}
                    </Button>
                </FormControl>
            ) : (
                <div className="p-8 border-2 border-dashed border-slate-200 rounded-lg text-center bg-slate-50">
                    <MdFileUpload className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                    <h3 className="text-sm font-bold text-slate-700">Upload File Trader</h3>
                    <p className="text-xs text-slate-500 mb-4">Format: .xlsx atau .xls</p>

                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleExcelUpload}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        disabled={loadingImport}
                    />

                    {loadingImport && <p className="mt-4 text-blue-600 text-xs font-bold animate-pulse">Sedang mengimport data...</p>}

                    <div className="mt-6 text-left p-3 bg-blue-50 rounded border border-blue-100">
                        <p className="text-[10px] font-bold text-blue-800 uppercase">Header Excel Wajib:</p>
                        <p className="text-[10px] font-mono text-blue-600 italic">nama_trader, kode_trader, npwp, alamat_trader</p>
                    </div>
                </div>
            )}
        </div>
    );
}