import { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, X, Loader2, Save, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

// Static SPBE Aspek data (seeded via SupabaseSeedCommand)
const ASPEK_STATIC = [
  { id: 1, nama: 'TATA KELOLA DAN MANAJEMEN', bobot: 10, urutan: 1, jumlah_indikator: 2 },
  { id: 2, nama: 'PENYELENGGARA', bobot: 10, urutan: 2, jumlah_indikator: 2 },
  { id: 3, nama: 'DATA', bobot: 15, urutan: 3, jumlah_indikator: 3 },
  { id: 4, nama: 'KEAMANAN PEMERINTAH DIGITAL', bobot: 15, urutan: 4, jumlah_indikator: 3 },
  { id: 5, nama: 'TEKNOLOGI PEMERINTAH DIGITAL', bobot: 10, urutan: 5, jumlah_indikator: 4 },
  { id: 6, nama: 'KETERPADUAN LAYANAN DIGITAL', bobot: 15, urutan: 6, jumlah_indikator: 4 },
  { id: 7, nama: 'KEPUASAN PENGGUNA', bobot: 25, urutan: 7, jumlah_indikator: 2 },
];

const ManajemenAspek = () => {
  const [aspeks, setAspeks] = useState(ASPEK_STATIC);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({ nama: '', bobot: '', urutan: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpen = (aspek = null) => {
    if (aspek) {
      setCurrent(aspek);
      setForm({ nama: aspek.nama, bobot: aspek.bobot, urutan: aspek.urutan });
    } else {
      setCurrent(null);
      setForm({ nama: '', bobot: '', urutan: aspeks.length + 1 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      if (current) {
        setAspeks(prev => prev.map(a => a.id === current.id ? { ...a, ...form, bobot: Number(form.bobot), urutan: Number(form.urutan) } : a));
        showToast('Aspek berhasil diperbarui!');
      } else {
        setAspeks(prev => [...prev, { id: Date.now(), ...form, bobot: Number(form.bobot), urutan: Number(form.urutan), jumlah_indikator: 0 }]);
        showToast('Aspek baru ditambahkan!');
      }
      setIsModalOpen(false);
      setSaving(false);
    }, 600);
  };

  const totalBobot = aspeks.reduce((sum, a) => sum + Number(a.bobot), 0);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <Layers className="text-red-600" size={32} /> Manajemen Aspek
          </h1>
          <p className="text-slate-500 font-bold mt-1">Kelola 7 Domain Makro Evaluasi SPBE. Total bobot harus 100%.</p>
        </div>
        <button
          onClick={() => handleOpen()}
          className="bg-red-600 text-white font-black px-6 py-4 rounded-2xl shadow-xl shadow-red-100 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={20} /> Tambah Aspek
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Aspek</p>
          <h2 className="text-4xl font-black text-slate-800">{aspeks.length}</h2>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Indikator</p>
          <h2 className="text-4xl font-black text-slate-800">{aspeks.reduce((s, a) => s + a.jumlah_indikator, 0)}</h2>
        </div>
        <div className={`bg-white p-6 rounded-[2rem] border shadow-sm ${totalBobot === 100 ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-200 bg-red-50/30'}`}>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Bobot</p>
          <h2 className={`text-4xl font-black ${totalBobot === 100 ? 'text-emerald-600' : 'text-red-600'}`}>{totalBobot}%</h2>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">No</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Domain Aspek</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Indikator</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Bobot</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {aspeks.sort((a, b) => a.urutan - b.urutan).map(aspek => (
              <tr key={aspek.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <span className="w-8 h-8 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-black text-sm">{aspek.urutan}</span>
                </td>
                <td className="px-8 py-5">
                  <p className="font-black text-slate-800">{aspek.nama}</p>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className="bg-slate-100 text-slate-600 font-black px-3 py-1 rounded-lg text-sm">{aspek.jumlah_indikator} IK</span>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className="bg-red-50 text-red-600 font-black px-3 py-1 rounded-lg text-sm">{aspek.bobot}%</span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleOpen(aspek)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-800">{current ? 'Edit Aspek' : 'Tambah Aspek'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Aspek</label>
                  <input required value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold" placeholder="Contoh: TATA KELOLA DAN MANAJEMEN" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bobot (%)</label>
                    <input required type="number" min="1" max="100" value={form.bobot} onChange={e => setForm({ ...form, bobot: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Urutan</label>
                    <input required type="number" min="1" value={form.urutan} onChange={e => setForm({ ...form, urutan: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold" />
                  </div>
                </div>
                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 font-black text-slate-400 py-4 hover:bg-slate-50 rounded-2xl transition-all">Batal</button>
                  <button type="submit" disabled={saving} className="flex-1 bg-red-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-100 flex items-center justify-center gap-2">
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {current ? 'Simpan' : 'Tambah'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default ManajemenAspek;
