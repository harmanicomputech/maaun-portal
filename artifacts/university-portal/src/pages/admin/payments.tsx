import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Plus, Pencil, Trash2, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
function authHeaders() { return { Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` }; }

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  success: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

export default function AdminPayments() {
  const { toast } = useToast();
  const [fees, setFees] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", amount: "", department: "", level: "", description: "" });

  const load = async () => {
    setLoading(true);
    try {
      const [fr, pr] = await Promise.all([
        axios.get(`${BASE()}/api/fees`, { headers: authHeaders() }),
        axios.get(`${BASE()}/api/payments`, { headers: authHeaders() }),
      ]);
      setFees(fr.data);
      setPayments(pr.data);
    } catch { toast({ title: "Failed to load", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditingFee(null); setForm({ name: "", amount: "", department: "", level: "", description: "" }); setDialogOpen(true); };
  const openEdit = (fee: any) => { setEditingFee(fee); setForm({ name: fee.name, amount: String(fee.amount), department: fee.department || "", level: fee.level || "", description: fee.description || "" }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.name || !form.amount) return toast({ title: "Name and amount are required", variant: "destructive" });
    setSaving(true);
    try {
      if (editingFee) await axios.put(`${BASE()}/api/fees/${editingFee.id}`, form, { headers: authHeaders() });
      else await axios.post(`${BASE()}/api/fees`, form, { headers: authHeaders() });
      toast({ title: editingFee ? "Fee updated" : "Fee created" });
      setDialogOpen(false);
      await load();
    } catch { toast({ title: "Failed to save", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      await axios.delete(`${BASE()}/api/fees/${id}`, { headers: authHeaders() });
      toast({ title: "Fee deleted" });
      await load();
    } catch { toast({ title: "Failed to delete", variant: "destructive" }); }
    finally { setDeleting(null); }
  };

  const totalRevenue = payments.filter(p => p.status === "success").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payments & Fees</h1>
          <p className="text-muted-foreground mt-1">Manage fees and track payments</p>
        </div>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />Add Fee</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"><DollarSign className="w-6 h-6 text-green-600" /></div>
          <div><p className="text-sm text-muted-foreground">Total Revenue</p><p className="text-2xl font-bold text-green-600">₦{totalRevenue.toLocaleString()}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><CheckCircle className="w-6 h-6 text-blue-600" /></div>
          <div><p className="text-sm text-muted-foreground">Successful Payments</p><p className="text-2xl font-bold">{payments.filter(p => p.status === "success").length}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center"><Clock className="w-6 h-6 text-yellow-600" /></div>
          <div><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-yellow-600">{payments.filter(p => p.status === "pending").length}</p></div>
        </CardContent></Card>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : (
        <>
          <Card>
            <CardHeader><CardTitle className="text-base">Fee Schedule</CardTitle></CardHeader>
            <CardContent className="p-0">
              {fees.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">No fees configured. Add one above.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b bg-muted/40">
                      <th className="text-left px-6 py-3 font-semibold text-muted-foreground">Name</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Target</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Amount</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Actions</th>
                    </tr></thead>
                    <tbody>
                      {fees.map(fee => (
                        <tr key={fee.id} className="border-b hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium">{fee.name}</p>
                            {fee.description && <p className="text-xs text-muted-foreground">{fee.description}</p>}
                          </td>
                          <td className="px-4 py-4 hidden sm:table-cell">
                            <div className="flex gap-1">
                              {fee.department && <Badge variant="secondary" className="text-xs">{fee.department}</Badge>}
                              {fee.level && <Badge variant="secondary" className="text-xs">L{fee.level}</Badge>}
                              {!fee.department && !fee.level && <span className="text-muted-foreground text-xs">All students</span>}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center font-bold text-primary">₦{fee.amount.toLocaleString()}</td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button size="sm" variant="ghost" onClick={() => openEdit(fee)}><Pencil className="w-3.5 h-3.5" /></Button>
                              <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(fee.id)} disabled={deleting === fee.id}>
                                {deleting === fee.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">All Payments</CardTitle></CardHeader>
            <CardContent className="p-0">
              {payments.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">No payments recorded yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b bg-muted/40">
                      <th className="text-left px-6 py-3 font-semibold text-muted-foreground">Student</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Fee</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Reference</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Amount</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Status</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Date</th>
                    </tr></thead>
                    <tbody>
                      {payments.map(p => (
                        <tr key={p.id} className="border-b hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium">{p.userName || `User #${p.userId}`}</p>
                            <p className="text-xs text-muted-foreground">{p.userEmail}</p>
                          </td>
                          <td className="px-4 py-4">{p.feeName || `Fee #${p.feeId}`}</td>
                          <td className="px-4 py-4 text-xs font-mono text-muted-foreground hidden md:table-cell">{p.reference}</td>
                          <td className="px-4 py-4 text-center font-bold">₦{p.amount.toLocaleString()}</td>
                          <td className="px-4 py-4 text-center"><Badge className={statusColors[p.status]} variant="secondary">{p.status}</Badge></td>
                          <td className="px-4 py-4 text-center text-muted-foreground text-xs hidden sm:table-cell">{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : new Date(p.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingFee ? "Edit Fee" : "Add New Fee"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Fee Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. School Fees 2024/2025" /></div>
            <div><Label>Amount (₦) *</Label><Input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="e.g. 150000" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Department (optional)</Label><Input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} placeholder="e.g. Computer Science" /></div>
              <div><Label>Level (optional)</Label><Input value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} placeholder="e.g. 100" /></div>
            </div>
            <div><Label>Description (optional)</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Save Fee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
