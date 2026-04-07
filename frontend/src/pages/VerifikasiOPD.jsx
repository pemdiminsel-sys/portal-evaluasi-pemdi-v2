import { useState, useEffect } from 'react';
import { 
  CheckCircle, ShieldCheck, Search, Building2, User, 
  ChevronRight, ArrowLeft, Loader2, FileText, ExternalLink, 
  CheckSquare, XCircle, AlertCircle, MessageSquare, Percent
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';

const VerifikasiOPD = () => {
    const [opds, setOpds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOpd, setSelectedOpd] = useState(null);
    const [aspeks, setAspeks] = useState([]);
    const [penilaians, setPenilaians] = useState([]);
    const [buktis, setBuktis] = useState([]);
    const [periode, setPeriode] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const { data: pData } = await supabase.from('periodes').select('*').eq('status', 'active').single();
            setPeriode(pData);

            const { data: opdData } = await supabase.from('opds').select('*').order('nama');
            setOpds(opdData || []);

            const { data: asData } = await supabase.from('aspeks').select('*').order('urutan');
            setAspeks(asData || []);
        } catch (err) {
            toast.error('Gagal memuat data verifikasi');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectOpd = async (opd) => {
        try {
            setLoading(true);
            const [penRes, bukRes] = await Promise.all([
                supabase.from('penilaians').select('*, indikators(*)').eq('opd_id', opd.id).eq('periode_id', periode.id),
                supabase.from('buktis').select('*').eq('opd_id', opd.id).eq('periode_id', periode.id)
            ]);
            setPenilaians(penRes.data || []);
            setBuktis(bukRes.data || []);
            setSelectedOpd(opd);
        } catch (err) {
            toast.error('Gagal memuat detail penilaian OPD');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (penilaianId, newStatus) => {
        try {
            const { error } = await supabase.from('penilaians').update({ status: newStatus }).eq('id', penilaianId);
            if (error) throw error;
            toast.success('Status verifikasi diperbarui');
            handleSelectOpd(selectedOpd);
        } catch (err) {
            toast.error('Gagal memperbarui status');
        }
    };

    const filteredOpds = opds.filter(o => o.nama.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading && !selectedOpd) return (
        <div className="h-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-emerald-600" size={48} />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Audit Engine Syncing...</p>
        </div>
    );

    return (
        <div className="h-full bg-slate-50 overflow-hidden relative font-sans">
            {!selectedOpd ? (
                <div className="p-12 space-y-10 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
                    {/* Header Listing */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-slate-800 flex items-center gap-4 italic uppercase tracking-tighter">
                                <ShieldCheck className="text-emerald-500" size={40} /> Verification Hub
                            </h1>
                            <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-widest italic">Audit Dokumen Bukti & Kematangan Digital OPD</p>
                        </div>
                        <div className="relative group">
                            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                placeholder="Search OPD..." 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="bg-white border border-slate-200 pl-14 pr-6 py-4 rounded-3xl w-80 focus:ring-4 focus:ring-emerald-50 outline-none font-bold shadow-sm transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredOpds.map(opd => (
                            <button 
                                key={opd.id}
                                onClick={() => handleSelectOpd(opd)}
                                className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group text-left relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                                    <Building2 size={120} />
                                </div>
                                <div className="relative z-10 space-y-6">
                                    <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-xl font-black text-[10px] tracking-widest uppercase inline-block">
                                        {opd.singkatan || 'OPD'}
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 leading-tight pr-6">{opd.nama}</h3>
                                    
                                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-tighter">
                                            <CheckSquare size={14} className="text-emerald-400" /> 
                                            Verifikasi Dokumen
                                        </div>
                                        <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex h-full">
                    {/* Detail Sidebar */}
                    <div className="w-[450px] border-r border-slate-200 bg-white p-10 space-y-10 overflow-y-auto scrollbar-hide">
                        <button onClick={() => setSelectedOpd(null)} className="flex items-center gap-2 text-slate-400 font-black hover:text-emerald-600 transition-colors uppercase text-[10px] tracking-widest mb-6 border border-slate-100 px-4 py-2 rounded-xl">
                            <ArrowLeft size={16} /> Back to List
                        </button>

                        <div className="space-y-4">
                             <div className="bg-emerald-600 text-white p-4 rounded-3xl shadow-xl shadow-emerald-100 w-16 h-16 flex items-center justify-center font-black text-2xl italic rotate-3">
                                {selectedOpd.nama[0]}
                             </div>
                             <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none uppercase">{selectedOpd.nama}</h2>
                             <p className="text-xs font-bold text-slate-400 italic">"Pemeriksaan kelengkapan administrasi dan validitas bukti dukung Tahun {periode?.tahun}"</p>
                        </div>

                        <div className="space-y-4 pt-10 border-t border-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                             <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                                <span>Progres Verifikasi</span>
                                <span className="text-emerald-600">65%</span>
                             </div>
                             <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                                <span>Indikator Approved</span>
                                <span className="text-indigo-600">12 / 20</span>
                             </div>
                        </div>

                        <button className="w-full bg-slate-900 text-white font-black py-5 rounded-[2.5rem] shadow-2xl flex items-center justify-center gap-3 hover:bg-emerald-600 hover:scale-[1.02] active:scale-95 transition-all group">
                             <CheckCircle size={20} className="group-hover:rotate-12 transition-transform" />
                             FINALIZE ASSESSMENT
                        </button>
                    </div>

                    {/* Indicators Audit List */}
                    <div className="flex-1 p-12 overflow-y-auto scrollbar-hide space-y-10">
                        {aspeks.map(aspek => (
                            <div key={aspek.id} className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-sm italic shadow-md shadow-emerald-50">{aspek.urutan}</div>
                                    <h4 className="text-sm font-black text-slate-300 uppercase tracking-[0.25em] italic">{aspek.nama}</h4>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {penilaians.filter(p => p.indikators?.aspek_id === aspek.id).map(pen => (
                                        <div key={pen.id} className="bg-white rounded-[3.5rem] border border-slate-100 p-10 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                                           <div className="flex items-start justify-between gap-8">
                                                <div className="flex-1 space-y-4">
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-full italic tracking-tighter">I{pen.indikator_id}</span>
                                                        <h5 className="text-xl font-black text-slate-800 tracking-tight">{pen.indikators?.nama}</h5>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                                        <div className="bg-slate-50 p-6 rounded-[2rem] border border-white space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Capaian OPD</span>
                                                                <span className="px-3 py-1 bg-white text-indigo-600 rounded-full font-black text-xs shadow-sm border border-slate-100">Level {pen.nilai}</span>
                                                            </div>
                                                            <p className="text-xs font-bold text-slate-500 leading-relaxed italic line-clamp-3">"{pen.penjelasan || 'Tidak ada narasi.'}"</p>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Evidence List</span>
                                                            <div className="flex flex-wrap gap-2">
                                                                {buktis.filter(b => b.indikator_id === pen.indikator_id).map(buk => (
                                                                    <a key={buk.id} href={buk.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                                                        <ExternalLink size={12} /> {buk.nama_file.substring(0, 15)}...
                                                                    </a>
                                                                ))}
                                                                {buktis.filter(b => b.indikator_id === pen.indikator_id).length === 0 && <p className="text-[10px] font-bold text-slate-300 italic">No files attached</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="w-64 space-y-3 bg-slate-50 p-6 rounded-[2.5rem] border border-white h-fit">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic block mb-2">Audit Decision</span>
                                                    <button onClick={() => handleUpdateStatus(pen.id, 2)} className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${pen.status === 2 ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-100'}`}>
                                                        <CheckSquare size={14} /> Approved
                                                    </button>
                                                    <button onClick={() => handleUpdateStatus(pen.id, 3)} className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${pen.status === 3 ? 'bg-amber-500 text-white shadow-lg' : 'bg-white text-amber-500 hover:bg-amber-50 border border-amber-100'}`}>
                                                        <AlertCircle size={14} /> Revision
                                                    </button>
                                                    <button onClick={() => handleUpdateStatus(pen.id, 4)} className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${pen.status === 4 ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-red-500 hover:bg-red-50 border border-red-100'}`}>
                                                        <XCircle size={14} /> Rejected
                                                    </button>
                                                </div>
                                           </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerifikasiOPD;
