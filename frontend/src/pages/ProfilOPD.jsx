import { useState } from 'react';
import { Building2, Mail, Phone, MapPin, User, Edit2, Save, X, Camera, CheckCircle2, Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';

const ProfilOPD = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profil, setProfil] = useState({
    nama: user?.opds?.nama || 'Dinas Komunikasi dan Informatika',
    singkatan: user?.opds?.singkatan || 'KOMINFO',
    alamat: user?.opds?.alamat || 'Jl. Raya Amurang No. 1, Amurang, Minahasa Selatan',
    telepon: '(0430) 21234',
    email: 'kominfo@minahasaselatan.go.id',
    website: 'www.kominfo.minahasaselatan.go.id',
    kepala_dinas: 'Dr. John Doe, S.Kom., M.T.',
    nip_kepala: '198001012005011001',
    visi: 'Terwujudnya tata kelola pemerintahan digital yang transparan, efisien, dan inovatif di Kabupaten Minahasa Selatan.',
    misi: 'Meningkatkan kualitas layanan digital pemerintah yang terintegrasi dan aman bagi seluruh masyarakat.',
  });

  const [form, setForm] = useState({ ...profil });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setProfil({ ...form });
      setSaving(false);
      setIsEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto h-full overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <Building2 className="text-red-600" size={32} /> Profil Instansi
          </h1>
          <p className="text-slate-500 font-bold mt-1">Informasi resmi organisasi perangkat daerah Anda.</p>
        </div>
        {!isEditing ? (
          <button onClick={() => { setIsEditing(true); setForm({ ...profil }); }}
            className="bg-red-600 text-white font-black px-6 py-3.5 rounded-2xl shadow-xl shadow-red-100 flex items-center gap-2 hover:scale-105 transition-all">
            <Edit2 size={18} /> Edit Profil
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => setIsEditing(false)}
              className="border border-slate-200 text-slate-500 font-black px-5 py-3.5 rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2">
              <X size={18} /> Batal
            </button>
            <button onClick={handleSave} disabled={saving}
              className="bg-emerald-600 text-white font-black px-6 py-3.5 rounded-2xl shadow-lg shadow-emerald-100 flex items-center gap-2 hover:scale-105 transition-all">
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Simpan
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      {saved && (
        <div className="fixed bottom-8 right-8 bg-emerald-600 text-white font-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-2">
          <CheckCircle2 size={18} /> Profil berhasil disimpan!
        </div>
      )}

      {/* Logo & Identity Card */}
      <div className="bg-gradient-to-br from-red-600 to-rose-500 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-red-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
        <div className="relative z-10 flex items-center gap-8">
          <div className="w-24 h-24 bg-white/20 rounded-[2rem] flex items-center justify-center backdrop-blur-sm border border-white/30 shrink-0">
            <img src="/logo-minsel.png" alt="Logo" className="w-16 h-auto" />
          </div>
          <div>
            <p className="text-red-200 font-bold text-sm uppercase tracking-widest mb-1">Kabupaten Minahasa Selatan</p>
            <h2 className="text-3xl font-black leading-tight">{profil.nama}</h2>
            <p className="text-red-100 font-bold mt-1">{profil.singkatan}</p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Kontak */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
          <h3 className="text-lg font-black text-slate-800">Informasi Kontak</h3>
          {[
            { icon: MapPin, label: 'Alamat', field: 'alamat', type: 'textarea' },
            { icon: Phone, label: 'Telepon', field: 'telepon', type: 'text' },
            { icon: Mail, label: 'Email', field: 'email', type: 'email' },
          ].map(f => (
            <div key={f.field} className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <f.icon size={11} /> {f.label}
              </label>
              {isEditing ? (
                f.type === 'textarea' ? (
                  <textarea value={form[f.field]} onChange={e => setForm({ ...form, [f.field]: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-red-100 resize-none h-20 text-sm" />
                ) : (
                  <input type={f.type} value={form[f.field]} onChange={e => setForm({ ...form, [f.field]: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-red-100 text-sm" />
                )
              ) : (
                <p className="font-bold text-slate-700 text-sm">{profil[f.field]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Pimpinan */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
          <h3 className="text-lg font-black text-slate-800">Kepala Dinas</h3>
          {[
            { icon: User, label: 'Nama', field: 'kepala_dinas', type: 'text' },
            { icon: User, label: 'NIP', field: 'nip_kepala', type: 'text' },
          ].map(f => (
            <div key={f.field} className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{f.label}</label>
              {isEditing ? (
                <input value={form[f.field]} onChange={e => setForm({ ...form, [f.field]: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-red-100 text-sm" />
              ) : (
                <p className="font-bold text-slate-700 text-sm">{profil[f.field]}</p>
              )}
            </div>
          ))}

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-4">Visi & Misi</h3>
            <div className="space-y-3">
              {[{ label: 'Visi', field: 'visi' }, { label: 'Misi', field: 'misi' }].map(f => (
                <div key={f.field} className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{f.label}</label>
                  {isEditing ? (
                    <textarea value={form[f.field]} onChange={e => setForm({ ...form, [f.field]: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-red-100 resize-none h-24 text-sm" />
                  ) : (
                    <p className="font-bold text-slate-700 text-sm leading-relaxed">{profil[f.field]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilOPD;
