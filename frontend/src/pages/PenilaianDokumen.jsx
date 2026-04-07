import { useState, useEffect } from 'react';
import { FileText, Loader2, FileCheck2, ChevronRight } from 'lucide-react';
import api from '../services/api';

const PenilaianDokumen = () => {
    const [opds, setOpds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setOpds([
                { id: 1, nama: 'Dinas Komunikasi dan Informatika', singkatan: 'KOMINFO', progres: 100 },
                { id: 2, nama: 'Dinas Kesehatan', singkatan: 'DINKES', progres: 45 },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-red-600" size={40} /></div>;

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
            <div>
                <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <FileCheck2 className="text-red-600" size={32} /> Penilaian Dokumen
                </h1>
                <p className="text-slate-500 font-bold mt-1">Review substansi dari dokumen bukti yang diunggah oleh OPD</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {opds.map(opd => (
                    <div key={opd.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-black mb-6">
                            {opd.singkatan}
                        </div>
                        <h3 className="text-lg font-black text-slate-800 leading-tight mb-4">{opd.nama}</h3>
                        
                        <div className="mb-6 space-y-2">
                             <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                 <span className="text-slate-400">Progres Unggahan</span>
                                 <span className={opd.progres === 100 ? 'text-emerald-500' : 'text-amber-500'}>{opd.progres}%</span>
                             </div>
                             <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                 <div className={`h-full ${opd.progres === 100 ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${opd.progres}%` }}></div>
                             </div>
                        </div>

                        <button className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-600 font-black py-4 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-colors">
                            Buka Berkas <ChevronRight size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default PenilaianDokumen;
