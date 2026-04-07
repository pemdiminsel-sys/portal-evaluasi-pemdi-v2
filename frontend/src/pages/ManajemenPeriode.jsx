import { CalendarDays, Plus } from 'lucide-react';

const ManajemenPeriode = () => {
    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <CalendarDays className="text-red-600" size={32} /> Manajemen Periode
                    </h1>
                    <p className="text-slate-500 font-bold mt-1">Atur tahun ajaran/periode evaluasi dan *deadline* pengumpulan bukti.</p>
                </div>
                <button className="bg-red-600 text-white font-black px-6 py-4 rounded-2xl shadow-xl shadow-red-100 flex items-center gap-2 hover:scale-105 transition-all">
                    <Plus size={20} /> Buka Periode Baru
                </button>
            </div>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 text-center shadow-sm">
                <CalendarDays className="mx-auto text-slate-200 mb-4" size={64} />
                <h3 className="text-2xl font-black text-slate-800">Modul Segera Hadir</h3>
                <p className="text-slate-500 font-bold mt-2">Daftar periode akan dimuat dari tabel Supabase: `periodes`.</p>
            </div>
        </div>
    );
};
export default ManajemenPeriode;
