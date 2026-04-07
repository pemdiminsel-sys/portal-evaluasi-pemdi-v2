import { useState, useEffect } from 'react';
import { CalendarDays, Plus, Edit2, Trash2, X, Loader2, Save, CheckCircle2, Clock, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';

const statusConfig = {
  berjalan: { label: 'Sedang Berjalan', color: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
  selesai:  { label: 'Selesai', color: 'bg-slate-100 text-slate-500', icon: Lock },
  draft:    { label: 'Draft / Belum Mulai', color: 'bg-amber-50 text-amber-700', icon: Clock },
};

const ManajemenPeriode = () => {
  const [periodes, setPeriodes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nama: '', tahun: new Date().getFullYear(), status: 'draft', mulai: '', selesai: '', keterangan: '' });

  useEffect(() => {
    fetchPeriodes();
  }, []);

  const fetchPeriodes = async () => {
    try {
      const { data, error } = await supabase
        .from('periodes')
        .select('*')
        .order('tahun', { ascending: false });

      if (error) throw error;

      const formatted = data.map(p => ({
        ...p,
        mulai: p.start_date,
        selesai: p.end_date
      }));
      setPeriodes(formatted);
    } catch (err) {
      toast.error('Gagal mengambil data periode');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (periode = null) => {
    if (periode) {
      setCurrent(periode);
      setForm({ nama: periode.nama, tahun: periode.tahun, status: periode.status, mulai: periode.mulai, selesai: periode.selesai, keterangan: periode.keterangan || '' });
    } else {
      setCurrent(null);
      setForm({ nama: '', tahun: new Date().getFullYear(), status: 'draft', mulai: '', selesai: '', keterangan: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        nama: form.nama,
        tahun: Number(form.tahun),
        start_date: form.mulai,
        end_date: form.selesai,
        status: form.status,
        keterangan: form.keterangan
      };

      if (current) {
        const { error } = await supabase
          .from('periodes')
          .update(payload)
          .eq('id', current.id);
        if (error) throw error;
        toast.success('Periode berhasil diperbarui');
      } else {
        const { error } = await supabase
          .from('periodes')
          .insert([payload]);
        if (error) throw error;
        toast.success('Periode berhasil ditambahkan');
      }
      fetchPeriodes();
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Gagal menyimpan periode');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus periode ini?')) return;
    try {
      const { error } = await supabase
        .from('periodes')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Periode berhasil dihapus');
      fetchPeriodes();
    } catch (err) {
      toast.error('Gagal menghapus periode');
      console.error(err);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <CalendarDays className="text-red-600" size={32} /> Manajemen Periode
          </h1>
          <p className="text-slate-500 font-bold mt-1">Atur tahun ajaran dan rentang waktu pelaksanaan evaluasi SPBE.</p>
        </div>
        <button onClick={() => handleOpen()}
          className="bg-red-600 text-white font-black px-6 py-4 rounded-2xl shadow-xl shadow-red-100 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
          <Plus size={20} /> Buka Periode Baru
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 size={48} className="text-red-600 animate-spin" />
          <p className="text-slate-400 font-bold">Memuat data periode...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {periodes.map(periode => {
            const cfg = statusConfig[periode.status];
            const Icon = cfg.icon;
            return (
              <div key={periode.id} className={`bg-white p-8 rounded-[2.5rem] border shadow-sm hover:shadow-md transition-all relative overflow-hidden ${periode.status === 'berjalan' ? 'border-emerald-200 ring-2 ring-emerald-100' : 'border-slate-100'}`}>
                {periode.status === 'berjalan' && (
                  <div className="absolute top-4 right-4 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                )}
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest mb-5 ${cfg.color}`}>
                  <Icon size={12} /> {cfg.label}
                </div>
                <h3 className="text-xl font-black text-slate-800 leading-tight mb-2">{periode.nama}</h3>
                <p className="text-slate-400 font-bold text-sm mb-6">{periode.keterangan}</p>
                <div className="space-y-2 text-xs font-bold text-slate-500 mb-6">
                  <div className="flex justify-between"><span>Mulai</span><span className="text-slate-800">{periode.mulai}</span></div>
                  <div className="flex justify-between"><span>Selesai</span><span className="text-slate-800">{periode.selesai}</span></div>
                </div>
                <div className="flex gap-2 pt-4 border-t border-slate-100">
                  <button onClick={() => handleOpen(periode)} className="flex-1 flex items-center justify-center gap-1 py-3 bg-slate-100 text-slate-600 hover:bg-red-600 hover:text-white font-black rounded-xl transition-all text-sm">
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(periode.id)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}

          {periodes.length === 0 && (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
               <CalendarDays size={48} className="mx-auto text-slate-200 mb-4" />
               <p className="text-slate-400 font-bold text-lg">Belum ada periode evaluasi yang dibuka.</p>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-800">{current ? 'Edit Periode' : 'Buka Periode Baru'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Periode</label>
                  <input required value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })}
                    placeholder="Contoh: Evaluasi SPBE 2026"
                    className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal Mulai</label>
                    <input required type="date" value={form.mulai} onChange={e => setForm({ ...form, mulai: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal Selesai</label>
                    <input required type="date" value={form.selesai} onChange={e => setForm({ ...form, selesai: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold">
                    <option value="draft">Draft (Belum Mulai)</option>
                    <option value="berjalan">Sedang Berjalan</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Keterangan</label>
                  <textarea value={form.keterangan} onChange={e => setForm({ ...form, keterangan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold h-20 resize-none" />
                </div>
                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 font-black text-slate-400 py-4 hover:bg-slate-50 rounded-2xl">Batal</button>
                  <button type="submit" disabled={saving} className="flex-1 bg-red-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-100 flex items-center justify-center gap-2">
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Simpan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManajemenPeriode;
