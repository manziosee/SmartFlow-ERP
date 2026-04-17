import { Users, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function ClientsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Clients</h1>
          <p className="text-slate-400 mt-1">Directory of your clients and their payment intelligence.</p>
        </div>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input 
          placeholder="Search clients..." 
          className="pl-9 bg-slate-900 border-white/10 text-white placeholder:text-slate-500 rounded-xl h-11"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Acme Corp', contact: 'Sarah Jenkins', risk: 'Medium', revenue: '$84,000' },
          { name: 'Global Dynamics', contact: 'John Smith', risk: 'Low', revenue: '$250k+' },
          { name: 'Initech', contact: 'Bill Lumbergh', risk: 'High', revenue: '$1,200' },
          { name: 'Stark Ind.', contact: 'Pepper Potts', risk: 'Low', revenue: '$1.2M' },
          { name: 'Wayne Ent.', contact: 'Lucius Fox', risk: 'Low', revenue: '$900k+' },
          { name: 'Pied Piper', contact: 'Jared Dunn', risk: 'Medium', revenue: '$45,000' },
        ].map((client, i) => (
          <Card key={i} className="bg-slate-900 border-white/10 p-6 flex flex-col hover:border-white/20 transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-white/5">
                {client.name.substring(0, 2).toUpperCase()}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded border ${
                client.risk === 'Low' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' :
                client.risk === 'Medium' ? 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' :
                'text-red-400 border-red-500/20 bg-red-500/10'
              }`}>
                {client.risk} Risk
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">{client.name}</h3>
            <div className="text-sm text-slate-400 mt-1">{client.contact}</div>
            <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
              <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">LTV Revenue</span>
              <span className="text-white font-medium">{client.revenue}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
