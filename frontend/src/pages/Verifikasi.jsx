import { useState, useEffect } from 'react';
import { ShieldCheck, Search, CheckCircle2, ChevronRight, Loader2, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const VerifikasiAsesor = () => {
    const [opds, setOpds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOpds();
    }, []);

    const fetchOpds = async () => {
        try {
            const res = await api.get('/opd');
            setOpds(res.data.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-red-600" /></div>;

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
            <div>
                <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <ShieldCheck className="text-red-600" size={32} /> Verifikasi Dokumen
                </h1>
                <p className="text-slate-500 font-bold mt-1">Lakukan validasi bukti dukung yang diunggah OPD (Bab 5.1)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {opds.map(opd => (
                    <div key={opd.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-black">
                                {opd.singkatan}
                            </div>
                            <span className="text-[10px] font-black bg-amber-100 text-amber-600 px-3 py-1 rounded-lg uppercase tracking-widest">
                                Perlu Review
                            </span>
                        </div>
                        <h3 className="text-lg font-black text-slate-800 leading-tight mb-2">{opd.nama}</h3>
                        <p className="text-xs font-bold text-slate-400 mb-6 flex items-center gap-2">
                             <AlertTriangle size={14} className="text-amber-500" /> 12 Indikator Belum Diverifikasi
                        </p>
                        <button className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-black py-4 rounded-2xl group-hover:bg-red-600 transition-colors">
                            Mulai Verifikasi <ChevronRight size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VerifikasiAsesor;
