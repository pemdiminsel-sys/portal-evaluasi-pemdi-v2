import { Activity, Star } from 'lucide-react';

const DashboardPimpinan = () => (
    <div className="p-10 space-y-10 bg-slate-50 h-full overflow-y-auto">
        <h1 className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter">Executive Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform"><Activity size={100}/></div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-red-500">I K P (Global)</h4>
                <p className="text-7xl font-black italic tracking-tighter mb-4">3.45</p>
                <div className="bg-white/10 px-4 py-2 rounded-xl inline-flex items-center gap-2">
                    <Star className="text-amber-400" size={16}/> <span className="text-xs font-bold uppercase tracking-widest">Sangat Baik</span>
                </div>
            </div>
        </div>
    </div>
);

export default DashboardPimpinan;
