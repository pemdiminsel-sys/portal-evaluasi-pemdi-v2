import { useState, useEffect } from 'react';
import { 
  Save, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  ChevronRight,
  Info,
  File,
  Upload,
  Trash2
} from 'lucide-react';
import api from '../services/api';
import useAuthStore from '../store/authStore';

const Evaluasi = () => {
  const { user } = useAuthStore();
  const [aspeks, setAspeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAspek, setSelectedAspek] = useState(null);
  const [penilaians, setPenilaians] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [indikatorRes, penilaianRes] = await Promise.all([
        api.get('/indikator'),
        api.get(`/penilaian?opd_id=${user.opd_id}`)
      ]);
      
      setAspeks(indikatorRes.data.data);
      if (indikatorRes.data.data.length > 0) {
        setSelectedAspek(indikatorRes.data.data[0]);
      }

      // Map existing penilaian to state
      const initialPenilaian = {};
      penilaianRes.data.data.penilaian.forEach(p => {
        initialPenilaian[p.indikator_id] = {
          id: p.id,
          nilai: p.nilai,
          penjelasan: p.penjelasan,
          buktis: p.buktis || []
        };
      });
      setPenilaians(initialPenilaian);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (indikatorId, file) => {
    const assessment = penilaians[indikatorId];
    if (!assessment?.id) {
        showToast('Simpan nilai/catatan terlebih dahulu sebelum unggah bukti.', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('penilaian_id', assessment.id);

    setSaving(true);
    try {
        const res = await api.post('/bukti', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        // Refresh local data to show the new file
        await fetchData(); 
        showToast('File bukti berhasil diunggah!');
    } catch (error) {
        showToast('Gagal mengunggah file.', 'error');
    } finally {
        setSaving(false);
    }
  };

  const deleteBukti = async (buktiId) => {
    if (!confirm('Hapus file ini?')) return;
    
    setSaving(true);
    try {
        await api.delete(`/bukti/${buktiId}`);
        await fetchData();
        showToast('File berhasil dihapus.');
    } catch (error) {
        showToast('Gagal menghapus file.', 'error');
    } finally {
        setSaving(false);
    }
  };

  const handleUpdate = (indikatorId, field, value) => {
    setPenilaians(prev => ({
      ...prev,
      [indikatorId]: {
        ...(prev[indikatorId] || { nilai: 0, penjelasan: '' }),
        [field]: value
      }
    }));
  };

  const savePenilaian = async (indikatorId) => {
    const data = penilaians[indikatorId];
    if (!data) return;

    setSaving(true);
    try {
      await api.post('/penilaian', {
        indikator_id: indikatorId,
        opd_id: user.opd_id,
        nilai: data.nilai,
        penjelasan: data.penjelasan,
        jenis: 1 // Self-Assessment
      });
      showToast('Penilaian berhasil disimpan!');
    } catch (error) {
      showToast('Gagal menyimpan penilaian.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-10 space-y-10 overflow-y-auto h-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                <HelpCircle size={24} />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Evaluasi Mandiri SPBE</h1>
                <p className="text-slate-500 font-medium">Isi penilaian dan unggah bukti pendukung untuk setiap indikator.</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Aspect Navigation */}
        <div className="lg:col-span-1 space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2 mb-4">Pilih Aspek</p>
            {aspeks.map(aspek => (
                <button
                    key={aspek.id}
                    onClick={() => setSelectedAspek(aspek)}
                    className={`w-full text-left p-4 rounded-2xl transition-all font-bold text-sm flex items-center justify-between group ${
                        selectedAspek?.id === aspek.id 
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
                    }`}
                >
                    <span className="truncate">{aspek.nama}</span>
                    <ChevronRight size={16} className={selectedAspek?.id === aspek.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
                </button>
            ))}
        </div>

        {/* Indicators Section */}
        <div className="lg:col-span-3 space-y-6">
            {selectedAspek?.indikators.map((ind, index) => (
                <div key={ind.id} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-slate-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold border border-slate-100">
                                {index + 1}
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-slate-800 text-lg leading-tight">{ind.nama}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Indikator {ind.id}</span>
                                    <span className="text-xs text-slate-400 font-medium">• Bobot: 2.5%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex items-start gap-3">
                        <Info size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-indigo-700/80 font-medium leading-relaxed">
                            {ind.deskripsi || 'Silakan unggah dokumen yang membuktikan penerapan kebijakan, standar, atau pedoman terkait indikator ini.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Level Nilai (0 - 5)</label>
                            <input 
                                type="number" 
                                min="0" 
                                max="5" 
                                value={penilaians[ind.id]?.nilai || 0}
                                onChange={(e) => handleUpdate(ind.id, 'nilai', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-bold text-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Catatan / Penjelasan</label>
                             <textarea 
                                value={penilaians[ind.id]?.penjelasan || ''}
                                onChange={(e) => handleUpdate(ind.id, 'penjelasan', e.target.value)}
                                placeholder="Jelaskan dasar penilaian ini..."
                                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-medium h-12 resize-none"
                             />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex flex-col gap-3 w-2/3">
                             <div className="flex items-center gap-2">
                                <File size={16} className="text-slate-400" />
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Dokumen Bukti ({penilaians[ind.id]?.buktis?.length || 0})</span>
                             </div>
                             
                             <div className="flex flex-wrap gap-2">
                                {penilaians[ind.id]?.buktis?.map(bukti => (
                                    <div key={bukti.id} className="group relative bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-white hover:shadow-sm transition-all">
                                        <File size={14} className="text-indigo-500" />
                                        <span className="text-[11px] font-bold text-slate-600 truncate max-w-[120px]">{bukti.nama_file}</span>
                                        <button 
                                            onClick={() => deleteBukti(bukti.id)}
                                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                                
                                <label className="cursor-pointer bg-white border-2 border-dashed border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group">
                                    <Upload size={14} className="text-slate-400 group-hover:text-indigo-500" />
                                    <span className="text-[11px] font-bold text-slate-400 group-hover:text-indigo-600">Tambah Bukti</span>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        onChange={(e) => handleFileUpload(ind.id, e.target.files[0])}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                </label>
                             </div>
                        </div>
                        <button 
                            onClick={() => savePenilaian(ind.id)}
                            disabled={saving}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold px-8 py-4 rounded-2xl flex items-center gap-2 text-sm shadow-lg shadow-indigo-200 transition-all active:scale-95 self-end"
                        >
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Simpan Penilaian
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-10 right-10 p-5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 transition-all duration-300 border ${
            toast.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
        }`}>
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default Evaluasi;
