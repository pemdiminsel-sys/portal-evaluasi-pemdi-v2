import { useState, useEffect } from 'react';
import { Target, Plus, Edit2, Trash2, Loader2, ListChecks, ChevronRight, X, Save, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';

const ManajemenIndikator = () => {
    const [indikators, setIndikators] = useState([]);
    const [aspeks, setAspeks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCriteriaOpen, setIsCriteriaOpen] = useState(false);
    const [current, setCurrent] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        nama: '', kode: '', aspek_id: '', bobot: 0, penjelasan: '',
        kriteria_1: '', kriteria_2: '', kriteria_3: '', kriteria_4: '', kriteria_5: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: asp } = await supabase.from('aspeks').select('*').order('urutan', { ascending: true });
            setAspeks(asp || []);

            const { data: ind } = await supabase.from('indikators').select('*, aspeks(*)').order('urutan', { ascending: true });
            setIndikators(ind || []);
        } catch (err) {
            toast.error('Gagal sinkronisasi data cloud');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (ind = null) => {
        if (ind) {
            setCurrent(ind);
            setForm({ ...ind });
        } else {
            setCurrent(null);
            setForm({ nama: '', kode: '', aspek_id: aspeks[0]?.id || '', bobot: 0, penjelasan: '', kriteria_1: '', kriteria_2: '', kriteria_3: '', kriteria_4: '', kriteria_5: '' });
        }
        setIsModalOpen(true);
    };

    const handleShowCriteria = (ind) => {
        setCurrent(ind);
        setIsCriteriaOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (current) {
                const { error } = await supabase.from('indikators').update(form).eq('id', current.id);
                if (error) throw error;
                toast.success('Indikator diperbarui');
            } else {
                const { error } = await supabase.from('indikators').insert([form]);
                if (error) throw error;
                toast.success('Indikator ditambahkan');
            }
            fetchData();
            setIsModalOpen(false);
        } catch (err) {
            toast.error(`Gagal: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-red-600" size={48} />
            <p className="text-slate-400 font-bold">Sinkronisasi Data Cloud...</p>
        </div>
    );

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 flex items-center gap-4">
                        <ListChecks className="text-red-600" size={40} /> Manajemen Indikator
                    </h1>
                    <p className="text-slate-400 font-bold mt-1">Standar Evaluasi Kinerja Pemerintah Digital (Pemdi) 2026</p>
                </div>
                <button onClick={() => handleOpenModal()}
                    className="bg-slate-900 text-white font-black px-8 py-4 rounded-2xl shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                    <Plus size={20} /> Tambah Indikator
                </button>
            </div>

            {/* List by Aspect */}
            <div className="space-y-16">
                {aspeks.map(aspek => (
                    <div key={aspek.id} className="space-y-6">
                        <div className="flex items-center gap-4 border-b-2 border-slate-100 pb-4">
                            <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-red-100 italic">
                                {aspek.urutan}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{aspek.nama}</h2>
                                <div className="flex items-center gap-2">
                                    <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase">Bobot Aspek: {aspek.bobot}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {indikators.filter(i => i.aspek_id === aspek.id).map(ind => (
                                <div key={ind.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between relative overflow-hidden">
                                     <div className="absolute -top-4 -right-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform"></div>
                                     
                                     <div className="relative z-10 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="bg-red-50 text-red-600 px-4 py-1.5 rounded-xl font-black text-xs tracking-widest border border-red-100">{ind.kode}</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <Target size={12} /> Bobot: {ind.bobot}%
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-red-600 transition-colors">{ind.nama}</h3>
                                        <p className="text-sm text-slate-500 font-medium line-clamp-3 leading-relaxed">{ind.penjelasan}</p>
                                    </div>
                                    
                                    <div className="relative z-10 flex items-center justify-between mt-8 pt-6 border-t border-slate-50">
                                        <button onClick={() => handleShowCriteria(ind)}
                                            className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-600 hover:text-white flex items-center gap-2 transition-all">
                                            Lihat Kriteria <ChevronRight size={14} />
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleOpenModal(ind)} className="p-3 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"><Edit2 size={18} /></button>
                                            <button className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL: KRITERIA */}
            <AnimatePresence>
                {isCriteriaOpen && current && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                            className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                                <div>
                                    <div className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">{current.kode}</div>
                                    <h3 className="text-xl font-black leading-tight">Parameter Penilaian</h3>
                                </div>
                                <button onClick={() => setIsCriteriaOpen(false)} className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all"><X size={24} /></button>
                            </div>
                            <div className="p-8 overflow-y-auto space-y-4">
                                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex gap-4">
                                    <AlertCircle className="text-amber-600 shrink-0" />
                                    <p className="text-xs font-bold text-amber-800 leading-relaxed italic">Penilaian dilakukan berdasarkan ketersediaan dokumen pendukung dan implementasi riil di lapangan.</p>
                                </div>
                                
                                {[1,2,3,4,5].map(lvl => (
                                    <div key={lvl} className="flex gap-6 p-6 rounded-3xl border border-slate-50 hover:border-red-100 transition-colors group">
                                        <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center font-black text-xl shadow-sm ${lvl === 5 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-red-50 group-hover:text-red-600'}`}>
                                            {lvl}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tingkat {lvl}</div>
                                            <p className="text-sm font-bold text-slate-700 leading-relaxed">{current[`kriteria_${lvl}`] || 'Kriteria belum didefinisikan.'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL: FORM ADD/EDIT */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl p-8 space-y-8 overflow-y-auto max-h-[90vh] scrollbar-hide">
                            <div className="flex justify-between items-center">
                                <h3 className="text-3xl font-black text-slate-800">{current ? 'Edit Indikator' : 'Tambah Indikator Baru'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-600"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Informasi Dasar</label>
                                        <div className="grid grid-cols-4 gap-4">
                                            <input required placeholder="Kode (IK-01)" value={form.kode} onChange={e => setForm({ ...form, kode: e.target.value })} className="col-span-1 bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold" />
                                            <input required placeholder="Nama Indikator" value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} className="col-span-3 bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aspek</label>
                                            <select value={form.aspek_id} onChange={e => setForm({ ...form, aspek_id: e.target.value })} className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold">
                                                {aspeks.map(a => <option key={a.id} value={a.id}>{a.nama}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bobot (%)</label>
                                            <input type="number" value={form.bobot} onChange={e => setForm({ ...form, bobot: e.target.value })} className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deskripsi Indikator</label>
                                        <textarea value={form.penjelasan} onChange={e => setForm({ ...form, penjelasan: e.target.value })} className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold h-32 resize-none" />
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">5 Tingkat Kematangan (Kriteria)</label>
                                    {[1,2,3,4,5].map(lvl => (
                                        <div key={lvl} className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400 group-focus-within:border-red-500 group-focus-within:text-red-500">{lvl}</div>
                                            <input placeholder={`Kriteria Level ${lvl}`} value={form[`kriteria_${lvl}`]} onChange={e => setForm({ ...form, [`kriteria_${lvl}`]: e.target.value })} 
                                                className="w-full bg-slate-50 border border-slate-100 pl-14 pr-5 py-3 rounded-xl outline-none focus:ring-2 focus:ring-red-100 font-medium text-sm" />
                                        </div>
                                    ))}
                                    <div className="flex gap-4 pt-6">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 font-black text-slate-400 py-4 hover:bg-slate-50 rounded-2xl">Batal</button>
                                        <button type="submit" disabled={saving} className="flex-2 bg-red-600 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-red-100 flex items-center justify-center gap-2">
                                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                            Simpan Data
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default ManajemenIndikator;
