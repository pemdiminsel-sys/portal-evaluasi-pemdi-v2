import { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle, ChevronRight, Loader2, Target, 
  Info, AlertCircle, Save, Upload, Trash2, ExternalLink,
  Layers, ListChecks, ArrowLeft, Send
} from 'lucide-react';
import { supabase } from '../services/supabase';
import useAuthStore from '../store/authStore';
import { toast } from 'react-hot-toast';

const EvaluasiMandiri = () => {
    const { user } = useAuthStore();
    const [aspeks, setAspeks] = useState([]);
    const [indikators, setIndikators] = useState([]);
    const [penilaians, setPenilaians] = useState([]);
    const [buktis, setBuktis] = useState([]);
    const [selectedIndikator, setSelectedIndikator] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [periode, setPeriode] = useState(null);

    // Form State
    const [evalForm, setEvalForm] = useState({
        nilai: 1, penjelasan: '', files: []
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            
            // 1. Ambil Semua Periode (Cek yang aktif di JS agar case-insensitive)
            const { data: pDataAll, error: pError } = await supabase
                .from('periodes')
                .select('*')
                .order('tahun', { ascending: false });
            
            if (pError) {
                 console.error('Error fetching periodes:', pError);
                 toast.error('❌ Error memuat periode: ' + pError.message);
                 setPeriode(null);
                 setLoading(false);
                 return;
            }
            
            // Cari yang statusnya berjalan/aktif/active secara case-insensitive
            const allP = pDataAll || [];
            const activeP = allP.find(p => {
                const s = String(p.status || '').toLowerCase();
                return s === 'berjalan' || s === 'aktif' || s === 'active';
            });

            if (!activeP) {
                 console.warn('EvaluasiMandiri: No active period found in', allP);
                 setPeriode(null);
                 setLoading(false);
                 return;
            }

            console.log('EvaluasiMandiri: Active period found:', activeP);
            setPeriode(activeP);

            // 2. Ambil Aspek & Indikator
            const [asRes, inRes, penRes, bukRes] = await Promise.all([
                supabase.from('aspeks').select('*').order('urutan'),
                supabase.from('indikators').select('*').order('id'),
                supabase.from('penilaians')
                    .select('*')
                    .eq('opd_id', user?.opd_id)
                    .eq('periode_id', activeP.id)
                    .eq('jenis', 1), // 1 = Mandiri
                supabase.from('buktis')
                    .select('*')
                    .eq('opd_id', user?.opd_id)
                    .eq('periode_id', activeP.id)
            ]);

            setAspeks(asRes.data || []);
            setIndikators(inRes.data || []);
            setPenilaians(penRes.data || []);
            setBuktis(bukRes.data || []);

        } catch (err) {
            console.error('fetchInitialData error:', err);
            toast.error('Gagal memuat data evaluasi: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectIndikator = (ind) => {
        const existing = penilaians.find(p => p.indikator_id === ind.id);
        const indBuktis = buktis.filter(b => b.indikator_id === ind.id);
        
        setSelectedIndikator(ind);
        setEvalForm({
            nilai: existing?.nilai || 1,
            penjelasan: existing?.penjelasan || '',
            files: indBuktis
        });
    };

    const handleSave = async (isSubmit = false) => {
        if (!selectedIndikator || !periode) return;
        setSaving(true);
        try {
            const payload = {
                indikator_id: selectedIndikator.id,
                opd_id: user?.opd_id,
                periode_id: periode.id,
                jenis: 1, // Mandiri
                nilai: evalForm.nilai,
                penjelasan: evalForm.penjelasan,
                status: isSubmit ? 1 : 0 // 1=Submitted, 0=Draft
            };

            const existing = penilaians.find(p => p.indikator_id === selectedIndikator.id);

            if (existing) {
                const { error } = await supabase.from('penilaians').update(payload).eq('id', existing.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('penilaians').insert([payload]);
                if (error) throw error;
            }

            toast.success(isSubmit ? 'Evaluasi berhasil dikirim!' : 'Draft disimpan');
            fetchInitialData();
            if (isSubmit) setSelectedIndikator(null);
        } catch (err) {
            toast.error('Gagal menyimpan evaluasi');
        } finally {
            setSaving(false);
        }
    };

    const handleUploadBukti = async (e) => {
        const file = e.target.files[0];
        if (!file || !selectedIndikator) return;

        try {
            toast.loading('Uploading evidence...');
            const fileExt = file.name.split('.').pop();
            const fileName = `${user?.opd_id}_${selectedIndikator.id}_${Date.now()}.${fileExt}`;
            
            const { data, error } = await supabase.storage
                .from('bukti-dukung')
                .upload(`${periode.tahun}/${fileName}`, file);

            if (error) throw error;

            const publicUrl = supabase.storage.from('bukti-dukung').getPublicUrl(data.path).data.publicUrl;

            await supabase.from('buktis').insert([{
                indikator_id: selectedIndikator.id,
                opd_id: user?.opd_id,
                periode_id: periode.id,
                nama_file: file.name,
                ukuran: file.size,
                tipe: file.type,
                link: publicUrl
            }]);

            toast.dismiss();
            toast.success('Bukti dukung ditambahkan');
            fetchInitialData();
            // Refresh files in form
            const newBuktis = await supabase.from('buktis').select('*').eq('indikator_id', selectedIndikator.id).eq('opd_id', user.opd_id);
            setEvalForm(prev => ({...prev, files: newBuktis.data}));

        } catch (err) {
            toast.dismiss();
            toast.error('Upload gagal');
        }
    };

    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">Evaluation Engine Booting...</p>
        </div>
    );

    if (!periode) return (
        <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-8">
            <div className="bg-white rounded-[3rem] p-16 max-w-2xl w-full text-center border-2 border-dashed border-amber-200">
                <AlertCircle size={64} className="mx-auto text-amber-500 mb-6" />
                <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tighter">Periode Evaluasi Belum Aktif</h2>
                <p className="text-slate-500 font-bold text-lg mb-6">Saat ini belum ada periode evaluasi SPBE yang aktif. Hubungi Administrator untuk membuka periode evaluasi.</p>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left">
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Info:</p>
                    <ul className="text-sm font-bold text-amber-600 space-y-2">
                        <li>✓ Admin perlu membuat Periode Evaluasi terlebih dahulu</li>
                        <li>✓ Periode harus di-set dengan status "active"</li>
                        <li>✓ Setelah itu OPD bisa mulai input penilaian</li>
                    </ul>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-full bg-slate-50 overflow-hidden relative">
            {/* Sidebar Indikator */}
            <div className={`flex flex-col border-r border-slate-200 bg-white transition-all duration-500 overflow-hidden ${selectedIndikator ? 'w-0' : 'w-[400px]'}`}>
                <div className="p-8 border-b border-slate-50">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">Indikator SPBE</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Periode Evaluasi {periode?.tahun || 'N/A'}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                    {aspeks.map(aspek => (
                        <div key={aspek.id} className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs italic">{aspek.urutan}</div>
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{aspek.nama}</h3>
                            </div>
                            <div className="space-y-2 pl-2 border-l-2 border-slate-50">
                                {indikators.filter(i => i.aspek_id === aspek.id).map(ind => {
                                    const pen = penilaians.find(p => p.indikator_id === ind.id);
                                    const hasBukti = buktis.some(b => b.indikator_id === ind.id);
                                    return (
                                        <button 
                                            key={ind.id}
                                            onClick={() => handleSelectIndikator(ind)}
                                            className={`w-full p-4 rounded-2xl flex items-center justify-between text-left transition-all ${pen?.status === 1 ? 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100' : 'bg-white hover:bg-slate-50 border border-slate-100'}`}
                                        >
                                            <div className="flex-1 min-w-0 pr-4">
                                                <p className={`text-[11px] font-black leading-tight truncate ${pen?.status === 1 ? 'text-emerald-700' : 'text-slate-700'}`}>{ind.id}. {ind.nama}</p>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <span className={`text-[9px] font-black uppercase tracking-tighter ${pen?.nilai ? 'text-indigo-500' : 'text-slate-300'}`}>Level {pen?.nilai || '-'}</span>
                                                    {hasBukti && <div className="w-1 h-1 bg-slate-300 rounded-full"></div>}
                                                    {hasBukti && <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">Bukti OK</span>}
                                                </div>
                                            </div>
                                            <ChevronRight size={14} className="text-slate-300" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Evaluation View */}
            <div className="flex-1 h-full overflow-y-auto scrollbar-hide p-10">
                {!selectedIndikator ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-slate-200">
                            <ListChecks size={48} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 italic uppercase">Pilih Indikator</h3>
                            <p className="text-sm font-bold text-slate-400 mt-2">Pilih indikator dari daftar samping untuk memulai penilaian mandiri.</p>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
                        <button onClick={() => setSelectedIndikator(null)} className="flex items-center gap-3 text-slate-400 font-black hover:text-red-500 transition-colors uppercase text-[10px] tracking-[0.2em] mb-4">
                             <ArrowLeft size={16}/> Kembali ke Daftar
                        </button>

                        <div className="space-y-4">
                             <div className="bg-slate-900 p-1 rounded-full text-white inline-flex items-center gap-4 pr-6 pl-2">
                                <div className="bg-red-600 w-10 h-10 rounded-full flex items-center justify-center font-black text-lg italic">I{selectedIndikator.id}</div>
                                <span className="font-black text-xs uppercase tracking-widest">{selectedIndikator.nama}</span>
                             </div>
                             <h2 className="text-4xl font-black text-slate-800 leading-[1.1] tracking-tight">{selectedIndikator.nama}</h2>
                             <div className="flex items-center gap-4">
                                <div className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">Bobot: {selectedIndikator.bobot || 'N/A'}%</div>
                                <div className="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest italic tracking-tighter">Mandatory Verification</div>
                             </div>
                        </div>

                        {/* Level Selection */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                <Target size={14} className="text-indigo-500" /> Pilih Level Kematangan
                            </h4>
                            <div className="grid grid-cols-5 gap-3">
                                {[1,2,3,4,5].map(lvl => (
                                    <button 
                                        key={lvl}
                                        onClick={() => setEvalForm({...evalForm, nilai: lvl})}
                                        className={`p-6 rounded-[2.5rem] border-2 transition-all group flex flex-col items-center gap-3 ${evalForm.nilai === lvl ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-105' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                                    >
                                        <span className={`text-4xl font-black italic tracking-tighter transition-all ${evalForm.nilai === lvl ? 'scale-110' : 'group-hover:text-slate-800'}`}>{lvl}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Level</span>
                                    </button>
                                ))}
                            </div>
                            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Info size={120} className="text-slate-900" />
                                </div>
                                <h5 className="font-black text-indigo-500 text-[10px] uppercase tracking-widest mb-4">Kriteria Level {evalForm.nilai}:</h5>
                                <p className="text-slate-700 font-bold leading-relaxed text-sm italic pr-12">
                                    {selectedIndikator[`level${evalForm.nilai}`] || 'Belum ada definisi kriteria spesifik untuk level ini.'}
                                </p>
                            </div>
                        </div>

                        {/* Penjelasan */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                <FileText size={14} className="text-red-500" /> Narasi Penjelasan Capaian
                            </h4>
                            <textarea 
                                value={evalForm.penjelasan}
                                onChange={e => setEvalForm({...evalForm, penjelasan: e.target.value})}
                                placeholder="Jelaskan bagaimana OPD Anda mencapai level kematangan tersebut..."
                                className="w-full h-48 bg-white border border-slate-100 rounded-[3rem] p-10 focus:ring-8 focus:ring-red-50 outline-none font-bold text-slate-800 leading-relaxed shadow-sm transition-all"
                            />
                        </div>

                        {/* Bukti Dukung */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                    <Layers size={14} className="text-emerald-500" /> Bukti Dukung (Evidence)
                                </h4>
                                <label className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                    <input type="file" className="hidden" onChange={handleUploadBukti} />
                                    + Add New File
                                </label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {evalForm.files.map(file => (
                                    <div key={file.id} className="bg-white p-6 rounded-[2rem] border border-slate-50 flex items-center justify-between group shadow-sm">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-red-500">
                                                <FileText size={20} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-black text-slate-800 truncate">{file.nama_file}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">Size: {(file.ukuran / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                            <a href={file.link} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all"><ExternalLink size={16}/></a>
                                            <button className="p-3 bg-red-50 text-red-400 hover:text-red-700 rounded-xl transition-all"><Trash2 size={16}/></button>
                                        </div>
                                    </div>
                                ))}
                                {evalForm.files.length === 0 && (
                                    <div className="col-span-full py-12 bg-slate-50 border-2 border-dashed border-slate-100 rounded-[2.5rem] text-center">
                                        <Upload size={32} className="mx-auto text-slate-200 mb-3" />
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No evidence uploaded yet</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-10 border-t border-slate-100 flex items-center gap-4">
                            <button 
                                onClick={() => handleSave(false)}
                                disabled={saving}
                                className="flex-1 bg-white border border-slate-200 text-slate-400 font-black py-5 rounded-[2.5rem] shadow-xl shadow-slate-100 flex items-center justify-center gap-3 hover:text-slate-800 hover:shadow-2xl transition-all disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                SAVE AS DRAFT
                            </button>
                            <button 
                                onClick={() => handleSave(true)}
                                disabled={saving}
                                className="flex-[2] bg-slate-900 text-white font-black py-5 rounded-[2.5rem] shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 hover:bg-emerald-600 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 group"
                            >
                                {saving ? <Loader2 className="animate-spin" /> : <Send size={20} className="group-hover:translate-x-2 transition-transform" />}
                                SUBMIT FINAL EVALUATION
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EvaluasiMandiri;
