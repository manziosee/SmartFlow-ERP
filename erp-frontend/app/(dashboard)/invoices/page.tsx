import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function InvoicesPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Invoices</h1>
          <p className="text-slate-400 mt-1">Manage your outstanding bills and recent invoices.</p>
        </div>
        <Button className="bg-white text-black hover:bg-slate-200 font-semibold gap-2">
          <Plus className="w-4 h-4" /> Create Invoice
        </Button>
      </div>

      <Card className="bg-slate-900 border-white/10 p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 border-b border-white/10 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { id: 'INV-2024-001', client: 'Acme Corp', amount: '$4,500.00', status: 'Pending', date: 'Apr 20, 2024' },
                { id: 'INV-2024-002', client: 'Global Dynamics', amount: '$12,000.00', status: 'Paid', date: 'Apr 18, 2024' },
                { id: 'INV-2024-003', client: 'Initech', amount: '$850.00', status: 'Overdue', date: 'Apr 10, 2024' },
                { id: 'INV-2024-004', client: 'Stark Ind.', amount: '$25,000.00', status: 'Pending', date: 'May 01, 2024' },
              ].map((inv) => (
                <tr key={inv.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-medium text-white">{inv.id}</td>
                  <td className="px-6 py-4">{inv.client}</td>
                  <td className="px-6 py-4">{inv.amount}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 text-xs font-semibold rounded-md border ${
                       inv.status === 'Paid' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
                       inv.status === 'Overdue' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                       'border-slate-500/30 text-slate-300 bg-slate-500/10'
                     }`}>
                       {inv.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{inv.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-cyan-400 hover:text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
