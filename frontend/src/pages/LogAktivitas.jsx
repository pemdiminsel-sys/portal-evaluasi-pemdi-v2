import { Activity, Search } from 'lucide-react';

const LogAktivitas = () => {
    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
            <div>
                <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <Activity className="text-red-600" size={32} /> Log Aktivitas
                </h1>
                <p className="text-slate-500 font-bold mt-1">Rekam jejak seluruh tindakan krusial oleh masing-masing Role.</p>
            </div>
            
            <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Cari berdasarkan User / Aktivitas (Contoh: Menghapus OPD)..." className="w-full bg-slate-50 border-none outline-none pl-12 pr-4 py-3 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-red-100" />
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 text-center shadow-sm">
                <Activity className="mx-auto text-slate-200 mb-4" size={64} />
                <h3 className="text-2xl font-black text-slate-800">Modul Segera Hadir</h3>
                <p className="text-slate-500 font-bold mt-2">Menunggu integrasi logger service di Laravel Backend.</p>
            </div>
        </div>
    );
};
export default LogAktivitas;
