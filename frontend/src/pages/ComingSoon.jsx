import { Construction, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ComingSoon = ({ title }) => {
  const location = useLocation();
  const pageTitle = title || "Modul Dalam Pengembangan";

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-slate-50/50">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-10 text-center border border-slate-100 shadow-xl shadow-slate-100/50 relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500 rounded-full blur-[80px] opacity-20 -z-0"></div>

        <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 mb-8 bg-gradient-to-br from-red-50 to-rose-100 rounded-[2rem] flex items-center justify-center shadow-inner relative">
              <div className="absolute top-0 right-0 -mr-2 -mt-2">
                <Sparkles className="text-amber-400 w-6 h-6 animate-pulse" />
              </div>
              <Construction className="text-red-500 w-12 h-12" strokeWidth={1.5} />
            </div>

            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-tight mb-3">
              {pageTitle}
            </h1>
            
            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
              Kami sedang menyiapkan antarmuka khusus untuk modul ini. Nantikan pembaruan sistem berikutnya dari tim IT Executive.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
              PATH: {location.pathname}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
