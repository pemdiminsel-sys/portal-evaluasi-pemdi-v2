import { useState, useEffect } from 'react';
import { Edit2, CheckCircle2, AlertTriangle, Loader2, Send, X, MessageSquare } from 'lucide-react';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';

const CatatanPerbaikan = () => {
    const [opds, setOpds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedOpd, setSelectedOpd] = useState(null);
    const [penilaians, setPenilaians] = useState([]);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [catatanForm, setCatatanForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [periode, setPeriode] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: periodeData } = await supabase.from('periodes').select('*').order('tahun', { ascending: false });
            const p = periodeData?.[0] || null;
            setPeriode(p);
            const { data: opdData } = await supabase.from('opds').select('*').order('nama');
            setOpds(opdData || []);
        } catch (err) {
            toast.error('Gagal memuat data catatan');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCatatan = async (opd) => {
        setSelectedOpd(opd);
        setShowModal(true);
        setLoadingDetail(true);
        try {
            const query = supabase.from('penilaians').select('*, indikators(nama)').eq('opd_id', opd.id);
            const { data } = periode?.id ? await query.eq('periode_id', periode.id) : await query;
            setPenilaians(data || []);
            const initialForm = {};
            (data || []).forEach(p => { initialForm[p.id] = p.catatan_asesor || ''; });
            setCatatanForm(initialForm);
        } catch (err) {
            toast.error('Gagal memuat penilaian OPD');
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleSaveCatatan = async () => {
        setSaving(true);
        try {
            const updates = Object.entries(catatanForm).map(([id, catatan]) =>
                supabase.from('penilaians').update({ catatan_asesor: catatan }).eq('id', parseInt(id))
            );
            await Promise.all(updates);
            toast.success('Catatan perbaikan berhasil disimpan!');
            setShowModal(false);
        } catch (err) {
            toast.error('Gagal menyimpan catatan');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="h-full flex flex-col items-center justify-center"><Loader2 className="animate-spin text-red-600 mb-4" size={40} /><p className="text-slate-500 font-bold animate-pulse">Memuat Data Catatan...</p></div>;

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <Edit2 className="text-red-600" size={32} /> Catatan Perbaikan
                    </h1>
                    <p className="text-slate-500 font-bold mt-1">Berikan feedback dan rekomendasi perbaikan bukti kepada OPD</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Instansi Terperiksa</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {opds.map((opd) => (
                            <tr key={opd.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-black text-xs">
                                            {opd.singkatan?.substring(0, 4) || opd.nama?.[0]}
                                        </div>
                                        <h3 className="font-bold text-slate-800">{opd.nama}</h3>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button
                                        onClick={() => handleOpenCatatan(opd)}
                                        className="bg-slate-100 hover:bg-red-600 text-slate-500 hover:text-white px-5 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ml-auto"
                                    >
                                        <Send size={16} /> Beri Catatan
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && selectedOpd && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 max-h-[90vh] flex flex-col gap-6 relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Catatan Asesor</h2>
                                <p className="text-slate-400 font-bold text-xs mt-1">{selectedOpd.nama}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all"><X size={20} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                            {loadingDetail ? (
                                <div className="py-12 flex flex-col items-center gap-3">
                                    <Loader2 className="animate-spin text-red-500" size={32} />
                                    <p className="text-slate-400 font-bold text-sm">Memuat data penilaian...</p>
                                </div>
                            ) : penilaians.length === 0 ? (
                                <div className="py-12 text-center">
                                    <MessageSquare size={40} className="mx-auto text-slate-200 mb-3" />
                                    <p className="text-slate-400 font-bold">Belum ada penilaian yang disubmit OPD ini.</p>
                                </div>
                            ) : penilaians.map(pen => (
                                <div key={pen.id} className="bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-100">
                                    <p className="font-black text-slate-700 text-sm">{pen.indikators?.nama || `Indikator #${pen.indikator_id}`}</p>
                                    <p className="text-xs text-slate-400 font-bold">Level: {pen.nilai} | Narasi: {pen.penjelasan?.substring(0, 60) || '-'}...</p>
                                    <textarea
                                        rows={2}
                                        placeholder="Tulis catatan perbaikan untuk indikator ini..."
                                        value={catatanForm[pen.id] || ''}
                                        onChange={e => setCatatanForm(prev => ({ ...prev, [pen.id]: e.target.value }))}
                                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-red-100 resize-none"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4 pt-2 border-t border-slate-50">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all">Batal</button>
                            <button onClick={handleSaveCatatan} disabled={saving} className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-100 hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                                {saving ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                Simpan Catatan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default CatatanPerbaikan;
