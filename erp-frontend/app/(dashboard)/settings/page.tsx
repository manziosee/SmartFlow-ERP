import { Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-slate-400 mt-1">Manage your account preferences and system parameters.</p>
        </div>
      </div>

      <Card className="bg-slate-900 border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-6 border-b border-white/10 pb-4">Profile Settings</h3>
        
        <div className="space-y-5">
           <div className="space-y-2">
             <Label className="text-slate-300">Workspace Name</Label>
             <Input defaultValue="Apex Technologies" className="bg-slate-950 border-white/10 text-white" />
           </div>
           <div className="space-y-2">
             <Label className="text-slate-300">Admin Email</Label>
             <Input defaultValue="admin@smartflow.com" disabled className="bg-slate-950 border-white/10 text-slate-500 cursor-not-allowed" />
           </div>
           <div className="space-y-2">
             <Label className="text-slate-300">Notification Threshold (Overdue Risk)</Label>
             <Input defaultValue="70%" className="bg-slate-950 border-white/10 text-white" />
             <p className="text-xs text-slate-500 mt-1">Triggers auto-recovery logic when client risk hits this percentage.</p>
           </div>

           <Button className="bg-white text-black hover:bg-slate-200 mt-4 font-semibold">
             Save Changes
           </Button>
        </div>
      </Card>
    </div>
  );
}
