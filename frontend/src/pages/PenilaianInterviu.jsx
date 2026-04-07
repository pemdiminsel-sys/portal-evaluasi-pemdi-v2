import { useState, useEffect } from 'react';
import { Target, Users, Loader2, CheckCircle, ChevronRight } from 'lucide-react';
import api from '../services/api';

const PenilaianInterviu = () => {
    const [opds, setOpds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setOpds([
                { id: 1, nama: 'Dinas Komunikasi dan Informatika', singkatan: 'KOMINFO', skor: 4.8 },
                { id: 2, nama: 'Badan Perencanaan Pembangunan Daerah', singkatan: 'BAPPEDA', skor: 4.2 },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-red-600" size={40} /></div>;

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
            <div>
                <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <Users className="text-red-600" size={32} /> Penilaian Interviu
                </h1>
                <p className="text-slate-500 font-bold mt-1">Sesi wawancara tatap muka atau virtual untuk pendalaman bukti SPBE</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {opds.map(opd => (
                    <div key={opd.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-black mb-6">
                            {opd.singkatan}
                        </div>
                        <h3 className="text-lg font-black text-slate-800 leading-tight mb-2">{opd.nama}</h3>
                        <div className="flex items-center gap-2 mb-6">
                            <Target size={16} className="text-emerald-500" />
                            <span className="text-sm font-bold text-slate-500">Skor Sementara: <span className="text-emerald-600">{opd.skor}</span></span>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-600 hover:text-white font-black py-4 rounded-xl hover:bg-red-600 transition-colors">
                            Atur Jadwal Interviu <ChevronRight size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default PenilaianInterviu;
