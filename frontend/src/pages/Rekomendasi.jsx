import { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Clock, ChevronRight, FileText, ArrowUpRight } from 'lucide-react';

const REKOMENDASI_DUMMY = [
  {
    id: 1,
    indikator: 'IK-04',
    nama_indikator: 'Tingkat Kematangan Kolaborasi Pemerintah Digital',
    aspek: 'Penyelenggara',
    prioritas: 'tinggi',
    catatan_asesor: 'OPD belum memiliki MoU kerjasama digital dengan instansi lain. Diperlukan minimal 2 MoU aktif dengan instansi Pusat atau OPD lain dalam 1 tahun terakhir.',
    aksi_yang_disarankan: 'Segera susun draft MoU dengan KOMINFO Pusat dan minimal 1 OPD lain. Lampirkan dokumen MoU yang ditandatangani pada sesi evaluasi berikutnya.',
    status: 'belum_ditindak',
    tenggat: '2025-09-30',
  },
  {
    id: 2,
    indikator: 'IK-08',
    nama_indikator: 'Tingkat Kematangan Pelindungan Data Pribadi',
    aspek: 'Keamanan Pemerintah Digital',
    prioritas: 'tinggi',
    catatan_asesor: 'Belum ada kebijakan tertulis perlindungan data pribadi (PDP) di lingkup instansi. Regulasi Perpres No. 95/2018 mewajibkan adanya SP PDP.',
    aksi_yang_disarankan: 'Buat SK Kepala Dinas terkait PDP, sosialisasikan ke seluruh ASN, dan dokumentasikan.',
    status: 'sedang_dikerjakan',
    tenggat: '2025-08-15',
  },
  {
    id: 3,
    indikator: 'IK-17',
    nama_indikator: 'Portal Layanan Digital Pemerintah',
    aspek: 'Keterpaduan Layanan Digital',
    prioritas: 'sedang',
    catatan_asesor: 'Portal layanan sudah ada namun belum terintegrasi dengan Portal LAPOR! atau SIPPD. Tampilan tidak responsif di perangkat mobile.',
    aksi_yang_disarankan: 'Tambahkan integrasi API dengan Portal Nasional dan perbaiki tampilan responsive. Deadline: sebelum evaluasi visitasi.',
    status: 'selesai',
    tenggat: '2025-06-30',
  },
];

const prioritasConfig = {
  tinggi: { color: 'bg-red-50 text-red-700 border-red-200', icon: AlertTriangle, dot: 'bg-red-500' },
  sedang: { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock, dot: 'bg-amber-500' },
  rendah: { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: ArrowUpRight, dot: 'bg-blue-400' },
};

const statusConfig = {
  belum_ditindak:   { label: 'Belum Ditindak', color: 'bg-slate-100 text-slate-500' },
  sedang_dikerjakan: { label: 'Sedang Dikerjakan', color: 'bg-amber-50 text-amber-700' },
  selesai:          { label: 'Selesai ✓', color: 'bg-emerald-50 text-emerald-700' },
};

const Rekomendasi = () => {
  const [filter, setFilter] = useState('semua');

  const filtered = REKOMENDASI_DUMMY.filter(r =>
    filter === 'semua' ? true : r.status === filter
  );

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto h-full overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
          <ShieldCheck className="text-red-600" size={32} /> Rekomendasi Asesor
        </h1>
        <p className="text-slate-500 font-bold mt-1">Catatan perbaikan dari Asesor SPBE untuk ditindaklanjuti instansi Anda.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Rekomendasi', val: REKOMENDASI_DUMMY.length, color: 'text-slate-800' },
          { label: 'Belum Ditindak', val: REKOMENDASI_DUMMY.filter(r => r.status === 'belum_ditindak').length, color: 'text-red-600' },
          { label: 'Selesai', val: REKOMENDASI_DUMMY.filter(r => r.status === 'selesai').length, color: 'text-emerald-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{s.label}</p>
            <h2 className={`text-4xl font-black ${s.color}`}>{s.val}</h2>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { val: 'semua', label: 'Semua' },
          { val: 'belum_ditindak', label: 'Belum Ditindak' },
          { val: 'sedang_dikerjakan', label: 'Sedang Dikerjakan' },
          { val: 'selesai', label: 'Selesai' },
        ].map(tab => (
          <button key={tab.val} onClick={() => setFilter(tab.val)}
            className={`px-5 py-2.5 rounded-2xl font-black text-sm transition-all ${filter === tab.val ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-5">
        {filtered.map(rek => {
          const pCfg = prioritasConfig[rek.prioritas];
          const sCfg = statusConfig[rek.status];
          const PIcon = pCfg.icon;
          return (
            <div key={rek.id} className={`bg-white rounded-[2.5rem] border shadow-sm overflow-hidden ${rek.status === 'selesai' ? 'opacity-70' : ''}`}>
              {/* Top strip */}
              <div className={`h-1.5 ${pCfg.dot}`}></div>
              <div className="p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="bg-slate-800 text-white px-3 py-1 rounded-lg font-black text-xs">{rek.indikator}</span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase border ${pCfg.color}`}>
                    <PIcon size={12} /> Prioritas {rek.prioritas}
                  </span>
                  <span className={`px-3 py-1 rounded-xl text-xs font-black ${sCfg.color}`}>{sCfg.label}</span>
                  <span className="text-xs font-bold text-slate-400 ml-auto">Tenggat: {rek.tenggat}</span>
                </div>

                <h3 className="text-lg font-black text-slate-800 leading-snug mb-2">{rek.nama_indikator}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Aspek: {rek.aspek}</p>

                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Catatan Asesor:</p>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">{rek.catatan_asesor}</p>
                  </div>
                  <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">Aksi yang Disarankan:</p>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">{rek.aksi_yang_disarankan}</p>
                  </div>
                </div>

                {rek.status !== 'selesai' && (
                  <div className="flex gap-3 mt-6">
                    <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-3 rounded-2xl text-sm transition-all">
                      Tandai Sedang Dikerjakan
                    </button>
                    <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-2xl text-sm shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} /> Tandai Selesai
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Rekomendasi;
