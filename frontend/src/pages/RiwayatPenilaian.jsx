import { useState } from 'react';
import { History, Search, FileText, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const DUMMY_HISTORY = [
    { id: 1, tahun: 2024, tanggal: '30 Jun 2024', status: 'completed', nilai_akhir: 3.85, predikat: 'Sangat Baik' },
    { id: 2, tahun: 2023, tanggal: '28 Jun 2023', status: 'completed', nilai_akhir: 3.42, predikat: 'Baik' },
    { id: 3, tahun: 2022, tanggal: '15 Jul 2022', status: 'completed', nilai_akhir: 2.80, predikat: 'Cukup' },
];

const RiwayatPenilaian = () => {
    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
            <div>
                <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <History className="text-red-600" size={32} /> Riwayat Penilaian
                </h1>
                <p className="text-slate-500 font-bold mt-1">Arsip rekam jejak evaluasi SPBE instansi Anda dari tahun ke tahun.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {DUMMY_HISTORY.map((item, index) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={item.id} 
                        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-black text-xl shrink-0">
                                {item.tahun}
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800 mb-1">Evaluasi SPBE {item.tahun}</h3>
                                <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                    <span className="flex items-center gap-1"><FileText size={14} /> Ditetapkan: {item.tanggal}</span>
                                    <span className="flex items-center gap-1 text-emerald-500"><CheckCircle2 size={14} /> Selesai</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-8 bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-2xl">
                            <div className="text-center md:text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nilai Akhir</p>
                                <p className="text-2xl font-black text-slate-800">{item.nilai_akhir.toFixed(2)}</p>
                            </div>
                            <div className="text-center md:text-right border-l border-slate-200 pl-8">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Predikat</p>
                                <p className={`text-lg font-black ${item.predikat === 'Sangat Baik' ? 'text-emerald-600' : 'text-blue-600'}`}>
                                    {item.predikat}
                                </p>
                            </div>
                            <button className="hidden md:flex w-10 h-10 bg-white border border-slate-200 rounded-xl items-center justify-center text-slate-400 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all shrink-0">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-6 flex gap-4 mt-8">
                <AlertCircle className="text-blue-600 shrink-0" size={24} />
                <div>
                    <h4 className="font-black text-blue-800 mb-1">Butuh Laporan Fisik?</h4>
                    <p className="text-sm font-bold text-blue-600/80">Jika Anda membutuhkan Berita Acara atau salinan fisik dari evaluasi tahun sebelumnya, silakan hubungi Administrator SPBE Kabupaten.</p>
                </div>
            </div>
        </div>
    );
};

export default RiwayatPenilaian;
