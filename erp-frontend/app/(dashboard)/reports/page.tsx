import { BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Reports</h1>
          <p className="text-slate-400 mt-1">Financial analytics and debt recovery metrics.</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-20 border border-white/10 border-dashed rounded-2xl bg-slate-900/50">
        <BarChart3 className="w-12 h-12 text-slate-600 mb-4" />
        <h3 className="text-lg font-medium text-white">Full Analytics Engine</h3>
        <p className="text-slate-400 text-sm mt-2 text-center max-w-sm">
          Detailed visualization modules and advanced breakdowns are under construction.
        </p>
      </div>
    </div>
  );
}
