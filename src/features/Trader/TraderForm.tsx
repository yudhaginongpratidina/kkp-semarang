// dependencies
import { z } from "zod";
import { useEffect, useState } from "react";
import { MdBusiness, MdBadge, MdDescription, MdLocationOn } from "react-icons/md";

// stores
import useTraderStore from "../../stores/useTraderStore";

// components
import { FormControl, TextField, Button } from "../../components";

// Schema validasi Zod sesuai interface Trader
const traderSchema = z.object({
    nama_trader: z.string().min(3, "Nama minimal 3 karakter"),
    kode_trader: z.string().min(2, "Kode minimal 2 karakter"),
    npwp: z.string().min(15, "NPWP minimal 15 digit"),
    alamat_trader: z.string().min(5, "Alamat minimal 5 karakter"),
});

export default function TraderForm({ type, id }: { type: "create" | "update", id?: string }) {
    const { getTraderById, updateTrader, addTrader, trader, isLoading } = useTraderStore();

    // State lokal untuk form
    const [formData, setFormData] = useState({
        nama_trader: "",
        kode_trader: "",
        npwp: "",
        alamat_trader: "",
    });

    // 1. Ambil data jika mode update
    useEffect(() => {
        if (type === "update" && id) {
            getTraderById(id);
        }
    }, [type, id, getTraderById]);

    // 2. Sync data dari store ke state lokal saat data trader berhasil dimuat
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Validasi data sebelum kirim
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
                const firstErrorMessage = err.issues[0]?.message || "Input tidak valid";
                alert(firstErrorMessage);
            } else {
                alert("Terjadi kesalahan pada server");
            }
        }
    };

    return (
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
    );
}