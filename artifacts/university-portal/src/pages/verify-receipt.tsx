import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Shield, XCircle, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
const fmt = (n: number) => `₦${n.toLocaleString()}`;

export default function VerifyReceipt() {
  const [, params] = useRoute("/verify/receipt/:reference");
  const reference = params?.reference ?? "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["verify-receipt", reference],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/receipts/verify/${encodeURIComponent(reference)}`);
      return data;
    },
    enabled: !!reference,
    retry: false,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">MAAUN Receipt Verification</h1>
          <p className="text-sm text-gray-500 mt-1">Maryam Abacha American University of Nigeria</p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            {isLoading && (
              <div className="text-center py-8">
                <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
                <p className="text-muted-foreground">Verifying receipt...</p>
                <p className="text-sm font-mono text-muted-foreground mt-1">{reference}</p>
              </div>
            )}

            {isError && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-9 h-9 text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-red-700 mb-2">Receipt Not Found</h2>
                <p className="text-sm text-gray-500 mb-3">No receipt with this reference exists in our system.</p>
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 inline-block">
                  <span className="font-mono text-sm text-red-700">{reference}</span>
                </div>
                <p className="text-xs text-gray-400 mt-4">Contact accounts@maaun.edu.ng for assistance.</p>
              </div>
            )}

            {data && !isLoading && (
              <div>
                <div className="text-center mb-5">
                  {data.isReversed ? (
                    <>
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-9 h-9 text-red-600" />
                      </div>
                      <h2 className="text-lg font-bold text-red-700 mb-1">Receipt Reversed</h2>
                      <p className="text-sm text-gray-500">This payment has been reversed. It is no longer valid.</p>
                    </>
                  ) : data.isConfirmed ? (
                    <>
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-9 h-9 text-green-600" />
                      </div>
                      <h2 className="text-lg font-bold text-green-700 mb-1">✓ Verified Official Receipt</h2>
                      <p className="text-sm text-gray-500">This payment has been confirmed by MAAUN Financial Services.</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-9 h-9 text-yellow-600" />
                      </div>
                      <h2 className="text-lg font-bold text-yellow-700 mb-1">Receipt Pending Confirmation</h2>
                      <p className="text-sm text-gray-500">This payment exists but is awaiting confirmation by the accounts office.</p>
                    </>
                  )}
                </div>

                {data.valid && (
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-xl border divide-y">
                      <div className="flex justify-between px-4 py-3">
                        <span className="text-sm text-gray-500">Student Name</span>
                        <span className="text-sm font-semibold">{data.studentName}</span>
                      </div>
                      <div className="flex justify-between px-4 py-3">
                        <span className="text-sm text-gray-500">Fee / Purpose</span>
                        <span className="text-sm font-medium">{data.feeName}</span>
                      </div>
                      <div className="flex justify-between px-4 py-3">
                        <span className="text-sm text-gray-500">Amount Paid</span>
                        <span className="text-sm font-bold text-green-700">{fmt(data.amount)}</span>
                      </div>
                      <div className="flex justify-between px-4 py-3">
                        <span className="text-sm text-gray-500">Status</span>
                        <Badge className={
                          data.isReversed ? "bg-red-100 text-red-700" :
                          data.isConfirmed ? "bg-green-100 text-green-700" :
                          "bg-yellow-100 text-yellow-700"
                        }>
                          {data.status?.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between px-4 py-3">
                        <span className="text-sm text-gray-500">Payment Date</span>
                        <span className="text-sm">{new Date(data.paymentDate).toLocaleDateString("en-NG", { day: "2-digit", month: "long", year: "numeric" })}</span>
                      </div>
                      {data.reversedAt && (
                        <div className="flex justify-between px-4 py-3">
                          <span className="text-sm text-gray-500">Reversed On</span>
                          <span className="text-sm text-red-600">{new Date(data.reversedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between px-4 py-3">
                        <span className="text-sm text-gray-500">Receipt Number</span>
                        <span className="text-xs font-mono text-primary">{data.referenceNumber}</span>
                      </div>
                    </div>

                    {data.isConfirmed && (
                      <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg text-xs text-green-700">
                        <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>Verified in real-time against MAAUN's official financial records database.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Maryam Abacha American University of Nigeria · Financial Services<br />
          accounts@maaun.edu.ng · +234 800 MAAUN-NG
        </p>
      </div>
    </div>
  );
}
