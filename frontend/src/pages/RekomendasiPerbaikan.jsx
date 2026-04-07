import { Target, ArrowRight, Lightbulb, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const DUMMY_REKOMENDASI = [
    {
        id: 1,
        indikator: 'IK-05: Tata Kelola Data',
        isi: 'OPD perlu menyusun Standar Operasional Prosedur (SOP) turunan mengenai klasifikasi data sektoral yang mengacu pada Perbup Satu Data.',
        status: 'pending',
        prioritas: 'Tinggi'
    },
    {
        id: 2,
        indikator: 'IK-08: Pelindungan Data Pribadi',
        isi: 'Segera lakukan audit sistem informasi pelayanan publik yang dikelola untuk memastikan ada fitur persetujuan (consent) dari masyarakat terkait penggunaan data.',
        status: 'pending',
        prioritas: 'Sangat Tinggi'
    },
    {
        id: 3,
        indikator: 'IK-15: Layanan Pengaduan Publik',
        isi: 'Integrasi laporan SP4N-LAPOR dengan dashboard internal OPD sudah baik, pertahankan dan tingkatkan SLA tindak lanjut.',
        status: 'completed',
        prioritas: 'Rendah'
    }
];

const prioritasColor = {
    'Sangat Tinggi': 'bg-red-50 text-red-600 border-red-200',
    'Tinggi': 'bg-orange-50 text-orange-600 border-orange-200',
    'Sedang': 'bg-amber-50 text-amber-600 border-amber-200',
    'Rendah': 'bg-slate-50 text-slate-500 border-slate-200',
};

const RekomendasiPerbaikan = () => {
    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
            <div>
                <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <Lightbulb className="text-red-600" size={32} /> Rekomendasi Asesor
                </h1>
                <p className="text-slate-500 font-bold mt-1">Langkah strategis perbaikan dari tim penilai untuk menaikkan indeks SPBE ke depan.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {DUMMY_REKOMENDASI.map((rek, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        key={rek.id} 
                        className={`bg-white p-8 rounded-[2.5rem] border shadow-sm relative overflow-hidden group ${rek.status === 'completed' ? 'border-emerald-100 opacity-60' : 'border-slate-100 hover:shadow-md'}`}
                    >
                        {rek.status === 'completed' && (
                            <div className="absolute top-0 right-0 bg-emerald-500 text-white p-2 rounded-bl-3xl">
                                <CheckCircle2 size={24} />
                            </div>
                        )}
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-lg">
                                {rek.indikator}
                            </span>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${prioritasColor[rek.prioritas]}`}>
                                {rek.prioritas}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 leading-snug mb-8">
                            "{rek.isi}"
                        </h3>
                        <div className="pt-6 border-t border-slate-100">
                            {rek.status === 'completed' ? (
                                <p className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 mt-2">
                                    <CheckCircle2 size={16} /> Telah Ditindaklanjuti
                                </p>
                            ) : (
                                <button className="w-full bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 font-black py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm group-hover:border-red-100 border border-transparent">
                                    Tandai Selesai <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RekomendasiPerbaikan;
