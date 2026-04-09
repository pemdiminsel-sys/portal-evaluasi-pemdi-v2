import { useState, useEffect } from 'react';
import { FileSignature, Download, Printer, Loader2, Building2 } from 'lucide-react';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';

const BeritaAcara = () => {
    const [loading, setLoading] = useState(true);
    const [opds, setOpds] = useState([]);
    const [periode, setPeriode] = useState(null);
    const [printing, setPrinting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: periodeData } = await supabase.from('periodes').select('*').order('tahun', { ascending: false });
            const p = periodeData?.[0] || null;
            setPeriode(p);

            const { data: opdData } = await supabase.from('opds').select('*').order('nama');
            setOpds(opdData || []);
        } catch (err) {
            toast.error('Gagal memuat data berita acara');
        } finally {
            setLoading(false);
        }
    };

    const handleCetakKolektif = () => {
        setPrinting(true);
        const printContent = `
            <html>
            <head>
                <title>Berita Acara Evaluasi SPBE ${periode?.tahun || ''}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; color: #1e293b; }
                    h1 { font-size: 18px; font-weight: bold; text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
                    h2 { font-size: 14px; margin-top: 20px; }
                    p { font-size: 12px; line-height: 1.8; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 12px; }
                    th { background: #f1f5f9; font-weight: bold; }
                    .ttd { margin-top: 60px; display: flex; justify-content: space-between; }
                    .ttd div { text-align: center; width: 200px; }
                    @media print { button { display: none; } }
                </style>
            </head>
            <body>
                <h1>BERITA ACARA EVALUASI SPBE</h1>
                <h2>Tahun Penilaian: ${periode?.tahun || '-'}</h2>
                <p>Pada hari ini, telah dilakukan evaluasi Sistem Pemerintahan Berbasis Elektronik (SPBE) 
                terhadap seluruh OPD di lingkungan Pemerintah Kabupaten Minahasa Selatan.</p>
                <h2>Daftar OPD yang Dievaluasi:</h2>
                <table>
                    <thead><tr><th>No</th><th>Nama OPD</th><th>Status</th></tr></thead>
                    <tbody>
                        ${opds.map((opd, i) => `<tr><td>${i + 1}</td><td>${opd.nama}</td><td>Selesai Dinilai</td></tr>`).join('')}
                    </tbody>
                </table>
                <div class="ttd">
                    <div><p>Ketua Tim Asesor</p><br/><br/><br/><p>_________________________</p></div>
                    <div><p>Pimpinan Pemkab Minsel</p><br/><br/><br/><p>_________________________</p></div>
                </div>
            </body>
            </html>
        `;
        const win = window.open('', '_blank');
        win.document.write(printContent);
        win.document.close();
        win.print();
        setPrinting(false);
        toast.success('Dokumen Berita Acara berhasil dibuka untuk dicetak!');
    };

    const handleUnduhPdf = () => {
        toast.success('Mengunduh PDF... (Gunakan Ctrl+P → Simpan sebagai PDF di jendela cetak)');
        handleCetakKolektif();
    };

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-red-600" size={40} /></div>;

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <FileSignature className="text-red-600" size={32} /> Berita Acara Evaluasi
                    </h1>
                    <p className="text-slate-500 font-bold mt-1">
                        Dokumen resmi hasil akhir penilaian SPBE {periode?.tahun || ''} — {opds.length} OPD
                    </p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleCetakKolektif}
                        disabled={printing}
                        className="bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 font-black px-6 py-3.5 rounded-2xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <Printer size={18} /> Cetak Kolektif
                    </button>
                    <button
                        onClick={handleUnduhPdf}
                        disabled={printing}
                        className="bg-red-600 hover:bg-red-700 text-white font-black px-6 py-3.5 rounded-2xl shadow-xl shadow-red-100 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <Download size={18} /> Unduh PDF
                    </button>
                </div>
            </div>

            {opds.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                    <div className="w-full text-center py-20">
                        <FileSignature size={48} className="mx-auto text-slate-200 mb-4" />
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Belum Ada Berita Acara Draft</h2>
                        <p className="text-slate-500 font-bold max-w-md mx-auto">Sistem akan meng-generate Berita Acara setelah seluruh rangkaian evaluasi OPD rampung.</p>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">No</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">OPD</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {opds.map((opd, i) => (
                                <tr key={opd.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5 text-slate-400 font-black text-sm">{i + 1}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-black text-xs">
                                                {opd.singkatan?.substring(0, 3) || <Building2 size={14} />}
                                            </div>
                                            <span className="font-bold text-slate-800">{opd.nama}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                            Selesai Dinilai
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
export default BeritaAcara;
