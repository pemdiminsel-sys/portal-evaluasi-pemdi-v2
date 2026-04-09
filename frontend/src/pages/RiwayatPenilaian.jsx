/* eslint-disable */
import { useState, useEffect } from 'react';
import { History, FileText, ChevronRight, CheckCircle, CheckCircle2, AlertCircle, Loader2, Clock, Award } from 'lucide-react';
import { supabase } from '../services/supabase';
import useAuthStore from '../store/authStore';

const RiwayatPenilaian = () => {
    const { user } = useAuthStore();
    const [histories, setHistories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRiwayat();
    }, []);

    const fetchRiwayat = async () => {
        try {
            setLoading(true);
            setError(null);

            // Ambil semua periode (Cek yang selesai atau berjalan di JS agar case-insensitive)
            const { data: periodesAll, error: pError } = await supabase
                .from('periodes')
                .select('*')
                .order('tahun', { ascending: false });

            if (pError) throw pError;

            // Filter periode yang 'selesai' atau 'berjalan'
            const validPeriodes = (periodesAll || []).filter(p => 
                ['selesai', 'berjalan', 'aktif', 'active'].includes(p.status?.toLowerCase())
            );

            if (validPeriodes.length === 0) {
                setHistories([]);
                return;
            }

            // Ambil penilaian OPD ini untuk semua periode yang valid
            const periodeIds = validPeriodes.map(p => p.id);
            const { data: penilaians, error: penError } = await supabase
                .from('penilaians')
                .select('*')
                .eq('opd_id', user?.opd_id)
                .in('periode_id', periodeIds)
                .eq('jenis', 1); // Mandiri

            if (penError) throw penError;

            // Gabungkan data periode dengan penilaian
            const result = validPeriodes.map(periode => {
                const pensPeriode = (penilaians || []).filter(p => p.periode_id === periode.id);
                const totalNilai = pensPeriode.reduce((sum, p) => sum + (p.nilai || 0), 0);
                const avgNilai = pensPeriode.length > 0 ? totalNilai / pensPeriode.length : 0;
                const submitted = pensPeriode.filter(p => p.status === 1).length;

                return {
                    ...periode,
                    total_indikator_diisi: pensPeriode.length,
                    total_submitted: submitted,
                    nilai_rata: avgNilai,
                    predikat: getPredikat(avgNilai)
                };
            });

            setHistories(result);
        } catch (err) {
            console.error('fetchRiwayat error:', err);
            setError(err.message || 'Gagal memuat riwayat penilaian');
        } finally {
            setLoading(false);
        }
    };

    const getPredikat = (nilai) => {
        if (nilai >= 4.5) return { label: 'Memuaskan', color: 'emerald' };
        if (nilai >= 3.5) return { label: 'Sangat Baik', color: 'blue' };
        if (nilai >= 2.5) return { label: 'Baik', color: 'indigo' };
        if (nilai >= 1.5) return { label: 'Cukup', color: 'amber' };
        if (nilai > 0) return { label: 'Kurang', color: 'red' };
        return { label: 'Belum Dinilai', color: 'slate' };
    };

    const getStatusBadge = (status) => {
        if (status === 'selesai') return { label: 'Selesai', icon: CheckCircle2, color: 'emerald' };
        if (status === 'berjalan') return { label: 'Sedang Berjalan', icon: Clock, color: 'blue' };
        return { label: status, icon: Clock, color: 'slate' };
    };

    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-red-600" size={48} />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">Memuat Riwayat...</p>
        </div>
    );

    if (error) return (
        <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="bg-white rounded-[3rem] p-12 max-w-lg w-full text-center border border-red-100 shadow-sm">
                <AlertCircle size={56} className="mx-auto text-red-400 mb-4" />
                <h2 className="text-xl font-black text-slate-800 mb-2">Gagal Memuat Data</h2>
                <p className="text-sm font-bold text-slate-400 mb-6">{error}</p>
                <button
                    onClick={fetchRiwayat}
                    className="bg-red-600 text-white font-black px-8 py-3 rounded-2xl text-sm uppercase tracking-widest hover:bg-red-700 transition-all"
                >
                    Coba Lagi
                </button>
            </div>
        </div>
    );

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
            <div>
                <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <History className="text-red-600" size={32} /> Riwayat Penilaian
                </h1>
                <p className="text-slate-500 font-bold mt-1">Arsip rekam jejak evaluasi SPBE instansi Anda dari tahun ke tahun.</p>
            </div>

            {histories.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-16 text-center border-2 border-dashed border-slate-100">
                    <History size={56} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-xl font-black text-slate-400 uppercase tracking-tighter">Belum Ada Riwayat</h3>
                    <p className="text-sm font-bold text-slate-300 mt-2">Riwayat penilaian akan muncul setelah periode evaluasi selesai.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {histories.map((item, index) => {
                        const status = getStatusBadge(item.status);
                        const StatusIcon = status.icon;
                        const predikat = item.predikat;
                        return (
                            <div
                                key={item.id}
                                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all duration-300 group"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-black text-xl shrink-0">
                                        {item.tahun}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800 mb-1">{item.nama || `Evaluasi SPBE ${item.tahun}`}</h3>
                                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 flex-wrap">
                                            <span className="flex items-center gap-1">
                                                <FileText size={14} /> {item.total_indikator_diisi} indikator diisi
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <CheckCircle size={14} /> {item.total_submitted} submitted
                                            </span>
                                            <span className={`flex items-center gap-1 text-${status.color}-500`}>
                                                <StatusIcon size={14} /> {status.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-8 bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-2xl">
                                    <div className="text-center md:text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nilai Rata-rata</p>
                                        <p className="text-2xl font-black text-slate-800">
                                            {item.total_indikator_diisi > 0 ? item.nilai_rata.toFixed(2) : '-'}
                                        </p>
                                    </div>
                                    <div className="text-center md:text-right border-l border-slate-200 pl-8">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Predikat</p>
                                        <p className={`text-lg font-black text-${predikat.color}-600`}>
                                            {predikat.label}
                                        </p>
                                    </div>
                                    <button className="hidden md:flex w-10 h-10 bg-white border border-slate-200 rounded-xl items-center justify-center text-slate-400 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all shrink-0">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-6 flex gap-4 mt-8">
                <AlertCircle className="text-blue-600 shrink-0" size={24} />
                <div>
                    <h4 className="font-black text-blue-800 mb-1">Butuh Laporan Fisik?</h4>
                    <p className="text-sm font-bold text-blue-600/80">Jika Anda membutuhkan Berita Acara atau salinan fisik dari evaluasi tahun sebelumnya, silakan hubungi Administrator SPBE Kabupaten.</p>
                </div>
            </div>
        </div>
    );
};

export default RiwayatPenilaian;
