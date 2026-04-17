import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign, 
  Clock, 
  CheckCircle2,
  BrainCircuit
} from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-slate-400 mt-1">Here is the latest financial intelligence for your business.</p>
        </div>
      </div>

      {/* AI Notification Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-4">
        <div className="bg-blue-500/20 p-2 rounded-lg mt-0.5">
          <BrainCircuit className="w-5 h-5 text-cyan-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-white font-semibold flex items-center gap-2">
            AI Assistant Insights
            <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-500 px-2 py-0.5 rounded-full">New</span>
          </h4>
          <p className="text-sm text-blue-200 mt-1">
            "We've detected a high probability of a late payment from <strong>Acme Corp</strong> based on their recent payment history. Would you like to send a preemptive friendly reminder?"
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap">
          Send Reminder
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', value: '$124,500.00', trend: '+12.5%', isUp: true, icon: DollarSign, color: 'text-emerald-400' },
          { title: 'Pending Payments', value: '$32,100.00', trend: '-2.4%', isUp: false, icon: Clock, color: 'text-amber-400' },
          { title: 'Overdue Invoices', value: '$8,400.00', trend: '+15.2%', isUp: false, icon: AlertTriangle, color: 'text-red-400' },
          { title: 'Collected this week', value: '$4,250.00', trend: '+34.1%', isUp: true, icon: CheckCircle2, color: 'text-blue-400' },
        ].map((metric, i) => (
          <Card key={i} className="bg-slate-900/60 border-white/10 p-6 shadow-xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-${metric.color.split('-')[1]}-500/10 to-transparent rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm font-medium text-slate-400">{metric.title}</div>
              <div className="bg-slate-800 p-2 rounded-lg border border-white/5">
                 <metric.icon className={`w-4 h-4 ${metric.color}`} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-white tracking-tight">{metric.value}</div>
            </div>
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${metric.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
              {metric.isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {metric.trend}
              <span className="text-slate-500 font-normal ml-1">vs last month</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 line-clamp-2">
        {/* Chart Space */}
        <Card className="col-span-2 bg-slate-900/60 border-white/10 p-6 flex flex-col min-h-[400px]">
          <h3 className="text-lg font-semibold text-white mb-6">Cashflow Analytics</h3>
          <div className="flex-1 flex items-end gap-2 border-b border-l border-white/10 pb-4 pl-4 relative">
             <div className="absolute -left-12 bottom-4 text-xs text-slate-500 font-medium">$50k</div>
             <div className="absolute -left-12 bottom-[50%] text-xs text-slate-500 font-medium">$100k</div>
             <div className="absolute -left-12 top-4 text-xs text-slate-500 font-medium">$150k</div>
              {/* Very simple visual bar chart mockup */}
              {[60, 45, 80, 55, 90, 110, 85, 120, 100, 130, 95, 140].map((val, idx) => (
                <div key={idx} className="flex-1 group flex justify-center items-end h-[100%]">
                  <div 
                    className="w-full max-w-[24px] bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-sm group-hover:from-blue-500 group-hover:to-cyan-300 transition-colors relative"
                    style={{ height: `${(val / 150) * 100}%` }}
                  >
                  </div>
                </div>
              ))}
          </div>
          <div className="flex pl-4 mt-2">
             {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => (
                <div key={idx} className="flex-1 text-center text-xs text-slate-500 font-medium">{month}</div>
             ))}
          </div>
        </Card>

        {/* Recent Invoices list */}
        <Card className="bg-slate-900/60 border-white/10 p-6">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Recent Invoices</h3>
              <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">View All</button>
           </div>
           
           <div className="space-y-4">
              {[
                { client: 'Acme Corp', amount: '$4,500.00', status: 'Pending', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                { client: 'Global Dynamics', amount: '$12,000.00', status: 'Paid', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                { client: 'Initech', amount: '$850.00', status: 'Overdue', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
                { client: 'Stark Ind.', amount: '$25,000.00', status: 'Pending', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                { client: 'Wayne Ent.', amount: '$1,200.00', status: 'Paid', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
              ].map((inv, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                  <div>
                    <div className="text-slate-200 font-medium">{inv.client}</div>
                    <div className="text-sm text-slate-500">{inv.amount}</div>
                  </div>
                  <div className={`px-2.5 py-1 text-xs font-semibold border rounded-full ${inv.color}`}>
                    {inv.status}
                  </div>
                </div>
              ))}
           </div>
        </Card>
      </div>
    </div>
  );
}
