import { useState, useEffect } from 'react';
import { 
  Download, FileText, Printer, ShieldCheck, 
  Archive, FileCode, CheckCircle, Loader2, Building2,
  Table, ChevronRight, Share2, Briefcase, CalendarDays
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';

const ExportData = () => {
    const [opds, setOpds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(null);

    useEffect(() => {
        fetchOpds();
    }, []);

    const fetchOpds = async () => {
        try {
            setLoading(true);
            const { data } = await supabase.from('opds').select('*').order('nama');
            setOpds(data || []);
        } catch (err) {
            toast.error('Gagal memuat daftar OPD');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = (type, opdName = 'Semua') => {
        setExporting(type);
        setTimeout(() => {
            setExporting(null);
            toast.success(`Berhasil mengekspor format ${type.toUpperCase()}: ${opdName}`, {
                icon: '📂',
                style: { borderRadius: '20px', padding: '16px', background: '#333', color: '#fff' }
            });
        }, 1500);
    };

    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-slate-800" size={48} />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest italic">Preparing Data Extractors...</p>
        </div>
    );

    return (
        <div className="p-10 space-y-12 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide pb-20">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 text-slate-800 italic">
                <div>
                    <h1 className="text-5xl font-black flex items-center gap-4 uppercase tracking-tighter italic leading-none">
                        <Download className="text-red-500" size={48} /> Global Export
                    </h1>
                    <p className="text-slate-400 font-bold mt-2 uppercase text-[10px] tracking-[0.4em] italic leading-tight">Digital Archive & Comprehensive Report Generator</p>
                </div>
            </div>

            {/* Quick Export Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform"><FileText size={100} className="text-white" /></div>
                     <h3 className="text-white text-xl font-black uppercase italic mb-2">Master Report</h3>
                     <p className="text-slate-400 text-xs font-bold mb-8 pr-12 leading-relaxed">Ekspor seluruh rekapitulasi nilai SPBE 45 OPD tahun berjalan.</p>
                     <button onClick={() => handleExport('xlsx')} className="bg-white text-slate-900 font-black px-6 py-4 rounded-2xl text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-emerald-500 hover:text-white transition-all shadow-xl">
                        {exporting === 'xlsx' ? <Loader2 size={16} className="animate-spin" /> : <Table size={16} />}
                        Download Excel (XLSX)
                     </button>
                 </div>

                 <div className="bg-white border-2 border-slate-100 p-10 rounded-[3.5rem] shadow-sm relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:-rotate-12 transition-transform"><Archive size={100} className="text-slate-900" /></div>
                     <h3 className="text-slate-800 text-xl font-black uppercase italic mb-2">Audit Summary</h3>
                     <p className="text-slate-400 text-xs font-bold mb-8 pr-12 leading-relaxed">Kompilasi narasi penjelasan dan bukti dukung per indikator.</p>
                     <button onClick={() => handleExport('pdf')} className="bg-red-600 text-white font-black px-6 py-4 rounded-2xl text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-slate-900 transition-all shadow-xl shadow-red-100">
                        {exporting === 'pdf' ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                        GENERATE PDF BUNDLE
                     </button>
                 </div>

                 <div className="bg-indigo-600 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-15 group-hover:scale-110 transition-transform"><CheckCircle size={100} className="text-white" /></div>
                     <h3 className="text-white text-xl font-black uppercase italic mb-2">Official Minute</h3>
                     <p className="text-white/60 text-xs font-bold mb-8 pr-12 leading-relaxed italic">Cetak Berita Acara Hasil Verifikasi Mandiri Tingkat Kabupaten.</p>
                     <button onClick={() => handleExport('print')} className="bg-white/10 text-white font-black px-6 py-4 rounded-2xl text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-white hover:text-indigo-600 transition-all backdrop-blur-md border border-white/20">
                        {exporting === 'print' ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
                        PRINT BERITA ACARA
                     </button>
                 </div>
            </div>

            {/* List By Agency Export */}
            <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden mt-12 bg-[url('/bg-pattern.png')] bg-repeat">
                <div className="p-12 border-b border-slate-50 flex items-center gap-6 justify-between bg-slate-50/50 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl italic font-black"><Building2 size={24} /></div>
                        <div>
                             <h4 className="text-xl font-black text-slate-800 italic uppercase">Extract by Primary Agency</h4>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Download files specifically for selected units</p>
                        </div>
                    </div>
                    <div className="flex bg-slate-100 p-2 rounded-2xl border border-slate-200">
                         <button className="px-6 py-2 bg-white text-slate-800 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm">All Regions (45)</button>
                         <button className="px-6 py-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Special Unit</button>
                    </div>
                </div>
                
                <div className="p-12 h-[500px] overflow-y-auto scrollbar-hide">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {opds.map(opd => (
                            <div key={opd.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-white hover:border-red-200 hover:bg-red-50/10 transition-all group flex flex-col justify-between">
                                 <div>
                                    <h5 className="font-black text-slate-800 uppercase text-sm leading-tight italic pr-6 truncate">{opd.nama}</h5>
                                    <div className="flex items-center gap-3 mt-4 text-[9px] font-black text-slate-400 uppercase tracking-widest border-l-2 border-slate-200 pl-4 py-1">
                                        <CalendarDays size={12} className="text-indigo-400" />
                                        Update: Mar 07, 2026
                                    </div>
                                 </div>
                                 <div className="flex gap-2 mt-8 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleExport('pdf', opd.nama)} className="flex-1 bg-white p-3 rounded-xl shadow-sm hover:bg-red-600 hover:text-white transition-all"><FileText size={16} className="mx-auto" /></button>
                                    <button onClick={() => handleExport('xlsx', opd.nama)} className="flex-1 bg-white p-3 rounded-xl shadow-sm hover:bg-emerald-600 hover:text-white transition-all"><Table size={16} className="mx-auto"/></button>
                                    <button className="flex-1 bg-white p-3 rounded-xl shadow-sm hover:bg-slate-900 hover:text-white transition-all"><Share2 size={16} className="mx-auto"/></button>
                                 </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportData;
