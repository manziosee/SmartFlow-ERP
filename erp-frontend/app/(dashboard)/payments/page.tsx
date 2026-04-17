import { CreditCard, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PaymentsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Payment Ledger</h1>
          <p className="text-slate-400 mt-1">Review all inbound transactions and their statuses.</p>
        </div>
        <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 gap-2">
           <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <Card className="bg-slate-900 border-white/10 p-0 overflow-hidden">
        <ul className="divide-y divide-white/5">
          {[
            { id: 'TXN-00192', client: 'Global Dynamics', amount: '+$12,000.00', date: 'Today, 2:45 PM', method: 'Bank Transfer' },
            { id: 'TXN-00191', client: 'Wayne Ent.', amount: '+$1,200.00', date: 'Yesterday, 9:00 AM', method: 'Credit Card' },
            { id: 'TXN-00190', client: 'Stark Ind.', amount: '+$5,500.00', date: 'Apr 14, 2024', method: 'Bank Transfer' },
            { id: 'TXN-00189', client: 'Acme Corp', amount: '+$2,100.00', date: 'Apr 12, 2024', method: 'Stripe' },
          ].map((tx) => (
            <li key={tx.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="font-semibold text-white">{tx.client}</div>
                  <div className="text-xs text-slate-500">{tx.id} • {tx.method}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-emerald-400">{tx.amount}</div>
                <div className="text-xs text-slate-500">{tx.date}</div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
