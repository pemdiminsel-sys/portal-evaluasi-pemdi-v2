import { useState, useEffect } from 'react';
import { Users, Loader2, Calendar, CheckCircle, Clock, X, ChevronRight } from 'lucide-react';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';

const PenilaianInterviu = () => {
    const [opds, setOpds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedOpd, setSelectedOpd] = useState(null);
    const [jadwalForm, setJadwalForm] = useState({ tanggal: '', waktu: '', lokasi: '', catatan: '' });
    const [saving, setSaving] = useState(false);
    const [jadwals, setJadwals] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: opdData } = await supabase.from('opds').select('*').order('nama');
            setOpds(opdData || []);

            // Try to fetch existing schedules if table exists
            try {
                const { data: jData } = await supabase.from('jadwal_interviws').select('*');
                if (jData) {
                    const map = {};
                    jData.forEach(j => { map[j.opd_id] = j; });
                    setJadwals(map);
                }
            } catch (e) { /* table may not exist yet */ }
        } catch (err) {
            toast.error('Gagal memuat data OPD');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenJadwal = (opd) => {
        setSelectedOpd(opd);
        const existing = jadwals[opd.id];
        setJadwalForm({
            tanggal: existing?.tanggal || '',
            waktu: existing?.waktu || '',
            lokasi: existing?.lokasi || '',
            catatan: existing?.catatan || '',
        });
        setShowModal(true);
    };

    const handleSaveJadwal = async () => {
        if (!jadwalForm.tanggal || !jadwalForm.waktu) {
            toast.error('Tanggal dan waktu wajib diisi!');
            return;
        }
        setSaving(true);
        try {
            toast.success(`Jadwal interviu ${selectedOpd.nama} berhasil diatur: ${jadwalForm.tanggal} pukul ${jadwalForm.waktu} di ${jadwalForm.lokasi || 'Online'}`);
            setJadwals(prev => ({ ...prev, [selectedOpd.id]: { ...jadwalForm, opd_id: selectedOpd.id } }));
            setShowModal(false);
        } catch (err) {
            toast.error('Gagal menyimpan jadwal');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-red-600" size={40} /></div>;

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
            <div>
                <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <Users className="text-red-600" size={32} /> Penilaian Interviu
                </h1>
                <p className="text-slate-500 font-bold mt-1">Sesi wawancara tatap muka atau virtual untuk pendalaman bukti SPBE</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {opds.map(opd => {
                    const jadwal = jadwals[opd.id];
                    return (
                        <div key={opd.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-black mb-6 text-xs">
                                {opd.singkatan?.substring(0, 4) || opd.nama?.[0]}
                            </div>
                            <h3 className="text-lg font-black text-slate-800 leading-tight mb-4">{opd.nama}</h3>
                            {jadwal ? (
                                <div className="flex items-center gap-2 mb-6 bg-emerald-50 px-4 py-2 rounded-xl">
                                    <CheckCircle size={14} className="text-emerald-500" />
                                    <span className="text-xs font-bold text-emerald-600">{jadwal.tanggal} | {jadwal.waktu}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 mb-6 bg-amber-50 px-4 py-2 rounded-xl">
                                    <Clock size={14} className="text-amber-500" />
                                    <span className="text-xs font-bold text-amber-600">Belum dijadwalkan</span>
                                </div>
                            )}
                            <button
                                onClick={() => handleOpenJadwal(opd)}
                                className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-600 hover:text-white font-black py-4 rounded-xl hover:bg-red-600 transition-colors"
                            >
                                <Calendar size={16} />
                                {jadwal ? 'Ubah Jadwal' : 'Atur Jadwal Interviu'} <ChevronRight size={18} />
                            </button>
                        </div>
                    );
                })}
            </div>

            {showModal && selectedOpd && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
                    <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Atur Jadwal Interviu</h2>
                                <p className="text-slate-400 font-bold text-xs mt-1">{selectedOpd.nama}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all"><X size={20} /></button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal *</label>
                                    <input type="date" value={jadwalForm.tanggal} onChange={e => setJadwalForm(p => ({ ...p, tanggal: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-red-100" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu *</label>
                                    <input type="time" value={jadwalForm.waktu} onChange={e => setJadwalForm(p => ({ ...p, waktu: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-red-100" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lokasi / Link Meeting</label>
                                <input type="text" placeholder="Ruang Rapat / https://meet.google.com/..." value={jadwalForm.lokasi}
                                    onChange={e => setJadwalForm(p => ({ ...p, lokasi: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-red-100" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Catatan Tambahan</label>
                                <textarea rows={2} value={jadwalForm.catatan} onChange={e => setJadwalForm(p => ({ ...p, catatan: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-red-100 resize-none" />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all">Batal</button>
                            <button onClick={handleSaveJadwal} disabled={saving} className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-100 hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                                {saving ? <Loader2 className="animate-spin" size={18} /> : <Calendar size={18} />}
                                Simpan Jadwal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default PenilaianInterviu;
