import { useState, useEffect } from 'react';
import { FileSignature, Download, Printer, Loader2 } from 'lucide-react';

const BeritaAcara = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => { setTimeout(() => setLoading(false), 800) }, []);

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-red-600" size={40} /></div>;

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <FileSignature className="text-red-600" size={32} /> Berita Acara Evaluasi
                    </h1>
                    <p className="text-slate-500 font-bold mt-1">Dokumen resmi hasil akhir penilaian SPBE instansi</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-white border border-slate-200 text-slate-600 hover:text-red-600 font-black px-6 py-3.5 rounded-2xl shadow-sm transition-all flex items-center gap-2">
                        <Printer size={18} /> Cetak Kolektif
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-black px-6 py-3.5 rounded-2xl shadow-xl shadow-red-100 transition-all flex items-center gap-2">
                        <Download size={18} /> Unduh PDF
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                <div className="w-full text-center py-20">
                    <h2 className="text-2xl font-black text-slate-800 mb-2">Belum Ada Berita Acara Draft</h2>
                    <p className="text-slate-500 font-bold max-w-md mx-auto">Sistem akan meng-generate Berita Acara setelah seluruh rangkaian evaluasi OPD (Dokumen, Interviu, Visitasi) rampung.</p>
                </div>
            </div>
        </div>
    );
};
export default BeritaAcara;
