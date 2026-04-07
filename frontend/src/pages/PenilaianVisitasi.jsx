import { useState, useEffect } from 'react';
import { MapPin, Target, Loader2, ChevronRight } from 'lucide-react';

const PenilaianVisitasi = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => { setTimeout(() => setLoading(false), 800) }, []);

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-red-600" size={40} /></div>;

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
            <div>
                <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <MapPin className="text-red-600" size={32} /> Penilaian Visitasi
                </h1>
                <p className="text-slate-500 font-bold mt-1">Pemantauan dan kunjungan langsung ke instansi terkait</p>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPin size={48} className="text-slate-300" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">Belum Ada Jadwal Visitasi</h2>
                <p className="text-slate-500 font-bold mb-8 max-w-md mx-auto">Selesaikan Penilaian Dokumen dan Interviu terlebih dahulu sebelum menetapkan daftar instansi yang divisitasi.</p>
                <button className="bg-red-600 hover:bg-red-700 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-red-100 transition-all">
                    Buat Jadwal Visitasi
                </button>
            </div>
        </div>
    );
};
export default PenilaianVisitasi;
