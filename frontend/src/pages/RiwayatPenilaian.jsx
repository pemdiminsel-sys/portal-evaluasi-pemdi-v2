import { useState, useEffect } from 'react';
import { History, TrendingUp, TrendingDown, Minus, FileText, Calendar, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import api from '../services/api';

// Dummy riwayat per periode
const RIWAYAT_DUMMY = [
  {
    id: 1,
    periode: 'Evaluasi SPBE 2024',
    tahun: 2024,
    status: 'selesai',
    nilai_akhir: 3.42,
    nilai_sebelumnya: null,
    detail: [
      { aspek: 'Tata Kelola & Manajemen', nilai: 3.5, bobot: 10 },
      { aspek: 'Penyelenggara', nilai: 3.2, bobot: 10 },
      { aspek: 'Data', nilai: 3.8, bobot: 15 },
      { aspek: 'Keamanan Pemerintah Digital', nilai: 3.1, bobot: 15 },
      { aspek: 'Teknologi Pemerintah Digital', nilai: 3.3, bobot: 10 },
      { aspek: 'Keterpaduan Layanan Digital', nilai: 3.6, bobot: 15 },
      { aspek: 'Kepuasan Pengguna', nilai: 3.5, bobot: 25 },
    ],
  },
  {
    id: 2,
    periode: 'Evaluasi SPBE 2025',
    tahun: 2025,
    status: 'berjalan',
    nilai_akhir: null,
    nilai_sebelumnya: 3.42,
    detail: [],
  },
];

const nilaiBadge = (nilai) => {
  if (!nilai) return { label: 'Belum Selesai', color: 'bg-slate-100 text-slate-500' };
  if (nilai >= 4.5) return { label: 'Sangat Baik', color: 'bg-emerald-50 text-emerald-700' };
  if (nilai >= 3.5) return { label: 'Baik', color: 'bg-blue-50 text-blue-700' };
  if (nilai >= 2.5) return { label: 'Cukup', color: 'bg-amber-50 text-amber-700' };
  return { label: 'Perlu Peningkatan', color: 'bg-red-50 text-red-700' };
};

const RiwayatPenilaian = () => {
  const { user } = useAuthStore();
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto h-full overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
          <History className="text-red-600" size={32} /> Riwayat Penilaian
        </h1>
        <p className="text-slate-500 font-bold mt-1">Rekam jejak nilai SPBE dari periode ke periode untuk instansi Anda.</p>
      </div>

      {/* Trend Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nilai Terkini</p>
          <h2 className="text-5xl font-black text-slate-800">3.42</h2>
          <p className="text-slate-500 font-bold text-sm mt-1">Evaluasi 2024</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Trend</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="text-emerald-500" size={32} />
            <h2 className="text-5xl font-black text-emerald-600">+0.18</h2>
          </div>
          <p className="text-slate-500 font-bold text-sm mt-1">Dari periode sebelumnya</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Kategori</p>
          <h2 className="text-2xl font-black text-blue-600 mt-2">BAIK</h2>
          <p className="text-slate-500 font-bold text-sm mt-1">Indeks ≥ 3.5 = Sangat Baik</p>
        </div>
      </div>

      {/* Riwayat List */}
      <div className="space-y-4">
        {RIWAYAT_DUMMY.map(r => {
          const badge = nilaiBadge(r.nilai_akhir);
          const isOpen = expanded === r.id;
          return (
            <div key={r.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <button
                className="w-full flex items-center gap-5 px-8 py-6 hover:bg-slate-50/50 transition-colors text-left"
                onClick={() => setExpanded(isOpen ? null : r.id)}
              >
                {/* Year badge */}
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 font-black text-sm shrink-0">
                  {r.tahun}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800">{r.periode}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl ${r.status === 'berjalan' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                      {r.status}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-4xl font-black ${r.nilai_akhir ? 'text-slate-800' : 'text-slate-300'}`}>
                    {r.nilai_akhir ?? '—'}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Nilai Akhir</p>
                </div>
                {isOpen ? <ChevronUp size={20} className="text-slate-400 shrink-0" /> : <ChevronDown size={20} className="text-slate-400 shrink-0" />}
              </button>

              {isOpen && r.detail.length > 0 && (
                <div className="px-8 pb-8 border-t border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-5 mb-4">Detail per Aspek</p>
                  <div className="space-y-3">
                    {r.detail.map((d, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <p className="text-sm font-bold text-slate-700 flex-1 min-w-0 truncate">{d.aspek}</p>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: `${(d.nilai / 5) * 100}%` }}></div>
                          </div>
                          <span className="font-black text-slate-800 w-8 text-right">{d.nilai}</span>
                          <span className="text-[10px] font-bold text-slate-400 w-10 text-right">{d.bobot}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isOpen && r.detail.length === 0 && (
                <div className="px-8 pb-8 pt-4 border-t border-slate-100 text-center text-slate-400 font-bold text-sm">
                  Periode ini masih berjalan. Detail nilai akan tampil setelah evaluasi selesai.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RiwayatPenilaian;
