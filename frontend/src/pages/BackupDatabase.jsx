import { Database, DownloadCloud } from 'lucide-react';

const BackupDatabase = () => {
    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
            <div>
                <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <Database className="text-red-600" size={32} /> Backup Database
                </h1>
                <p className="text-slate-500 font-bold mt-1">Unduh cadangan data Supabase Cloud secara berkala.</p>
            </div>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 text-center shadow-sm">
                <div className="w-24 h-24 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <DownloadCloud size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-4">Manual Backup Dump (.sql)</h3>
                <button className="bg-red-600 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-red-100 flex items-center justify-center gap-2 hover:scale-105 transition-all mx-auto">
                    <DownloadCloud size={20} /> Generate & Download Backup
                </button>
            </div>
        </div>
    );
};
export default BackupDatabase;
