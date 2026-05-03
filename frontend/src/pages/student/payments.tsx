import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, CheckCircle, Clock, AlertCircle, ExternalLink, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  success: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

const statusIcons: Record<string, any> = {
  pending: Clock,
  success: CheckCircle,
  failed: AlertCircle,
};

function authHeaders() {
  const token = localStorage.getItem("maaun_token") || "";
  return { Authorization: `Bearer ${token}` };
}

export default function StudentPayments() {
  const { toast } = useToast();
  const [fees, setFees] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<number | null>(null);
  const [verifying, setVerifying] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [feesRes, paymentsRes] = await Promise.all([
        axios.get(`${BASE()}/api/fees`, { headers: authHeaders() }),
        axios.get(`${BASE()}/api/payments`, { headers: authHeaders() }),
      ]);
      setFees(feesRes.data);
      setPayments(paymentsRes.data);
    } catch { toast({ title: "Failed to load payment data", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    load();
    // Check for payment verification return
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) verifyPayment(ref);
  }, []);

  const verifyPayment = async (reference: string) => {
    setVerifying(reference);
    try {
      await axios.get(`${BASE()}/api/payments/verify/${reference}`, { headers: authHeaders() });
      toast({ title: "Payment verified successfully!" });
      await load();
    } catch {
      toast({ title: "Could not verify payment. Try refreshing.", variant: "destructive" });
    } finally {
      setVerifying(null);
      window.history.replaceState({}, "", window.location.pathname);
    }
  };

  const initializePayment = async (feeId: number) => {
    setPaying(feeId);
    try {
      const res = await axios.post(`${BASE()}/api/payments/initialize`, { feeId }, { headers: authHeaders() });
      const { authorizationUrl, testMode } = res.data;
      if (testMode || !authorizationUrl) {
        toast({ title: "Test Mode: Payment initialized but no redirect (no live Paystack key).", description: `Ref: ${res.data.reference}` });
        await load();
      } else {
        window.location.href = authorizationUrl;
      }
    } catch (err: any) {
      toast({ title: err?.response?.data?.message || "Payment initialization failed", variant: "destructive" });
    } finally {
      setPaying(null);
    }
  };

  const isPaid = (feeId: number) => payments.some(p => p.feeId === feeId && p.status === "success");

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40" />)}</div>
      </div>
    );
  }

  const totalPaid = payments.filter(p => p.status === "success").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fee Payments</h1>
          <p className="text-muted-foreground mt-1">Pay your university fees securely via Paystack</p>
        </div>
        <Button variant="outline" onClick={load}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-600" /></div>
            <div><p className="text-sm text-muted-foreground">Total Paid</p><p className="text-2xl font-bold text-green-600">₦{totalPaid.toLocaleString()}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><CreditCard className="w-6 h-6 text-blue-600" /></div>
            <div><p className="text-sm text-muted-foreground">Available Fees</p><p className="text-2xl font-bold">{fees.length}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center"><Clock className="w-6 h-6 text-yellow-600" /></div>
            <div><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-yellow-600">{payments.filter(p => p.status === "pending").length}</p></div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Available Fees</h2>
        {fees.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl">No fees configured yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fees.map(fee => {
              const paid = isPaid(fee.id);
              return (
                <Card key={fee.id} className={paid ? "border-green-200 bg-green-50/30" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{fee.name}</h3>
                        {fee.description && <p className="text-sm text-muted-foreground mt-0.5">{fee.description}</p>}
                        <div className="flex gap-2 mt-2">
                          {fee.department && <Badge variant="secondary" className="text-xs">{fee.department}</Badge>}
                          {fee.level && <Badge variant="secondary" className="text-xs">Level {fee.level}</Badge>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">₦{fee.amount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      {paid ? (
                        <Badge className="bg-green-100 text-green-700 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Paid</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-700">Unpaid</Badge>
                      )}
                      {!paid && (
                        <Button onClick={() => initializePayment(fee.id)} disabled={paying === fee.id} size="sm">
                          {paying === fee.id ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Processing...</> : <><CreditCard className="w-4 h-4 mr-2" />Pay Now</>}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Payment History</CardTitle></CardHeader>
        <CardContent className="p-0">
          {payments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No payments yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-6 py-3 font-semibold text-muted-foreground">Fee</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Reference</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Amount</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Status</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Date</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(payment => {
                    const StatusIcon = statusIcons[payment.status] || Clock;
                    return (
                      <tr key={payment.id} className="border-b hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 font-medium">{payment.feeName || `Fee #${payment.feeId}`}</td>
                        <td className="px-4 py-4 text-muted-foreground text-xs hidden sm:table-cell font-mono">{payment.reference}</td>
                        <td className="px-4 py-4 text-center font-semibold">₦{payment.amount.toLocaleString()}</td>
                        <td className="px-4 py-4 text-center">
                          <Badge className={statusColors[payment.status]} variant="secondary">
                            <StatusIcon className="w-3 h-3 mr-1 inline" />{payment.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-center text-muted-foreground text-xs">{payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : new Date(payment.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-4 text-center">
                          {payment.status === "pending" && (
                            <Button size="sm" variant="ghost" onClick={() => verifyPayment(payment.reference)} disabled={verifying === payment.reference}>
                              {verifying === payment.reference ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
