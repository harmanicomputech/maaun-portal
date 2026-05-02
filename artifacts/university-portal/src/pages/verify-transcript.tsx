import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Shield, XCircle, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");

export default function VerifyTranscript() {
  const [, params] = useRoute("/verify/transcript/:reference");
  const reference = params?.reference ?? "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["verify-transcript", reference],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/transcripts/verify/${encodeURIComponent(reference)}`);
      return data;
    },
    enabled: !!reference,
    retry: false,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* University header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">MAAUN Transcript Verification</h1>
          <p className="text-sm text-gray-500 mt-1">Maryam Abacha American University of Nigeria</p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            {isLoading && (
              <div className="text-center py-8">
                <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
                <p className="text-muted-foreground">Verifying transcript reference...</p>
                <p className="text-sm text-muted-foreground mt-1 font-mono">{reference}</p>
              </div>
            )}

            {isError && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-9 h-9 text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-red-700 mb-2">Reference Not Found</h2>
                <p className="text-sm text-gray-500 mb-3">The reference number you provided does not exist in our system.</p>
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 inline-block">
                  <span className="font-mono text-sm text-red-700">{reference}</span>
                </div>
                <p className="text-xs text-gray-400 mt-4">If you believe this is an error, contact registry@maaun.edu.ng</p>
              </div>
            )}

            {data && !isLoading && (
              <div>
                {data.valid ? (
                  <div className="text-center mb-5">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${data.isOfficial ? "bg-green-100" : "bg-yellow-100"}`}>
                      {data.isOfficial
                        ? <Shield className="w-9 h-9 text-green-600" />
                        : <AlertTriangle className="w-9 h-9 text-yellow-600" />}
                    </div>
                    <h2 className={`text-lg font-bold mb-1 ${data.isOfficial ? "text-green-700" : "text-yellow-700"}`}>
                      {data.isOfficial ? "✓ Valid Official Transcript" : "⚠ Transcript Exists (Not Yet Official)"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {data.isOfficial
                        ? "This transcript has been officially verified and issued by MAAUN Registry."
                        : "This transcript is in the system but has not been finalized as official."}
                    </p>
                  </div>
                ) : (
                  <div className="text-center mb-5">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <XCircle className="w-9 h-9 text-red-600" />
                    </div>
                    <h2 className="text-lg font-bold text-red-700 mb-1">Invalid Transcript</h2>
                    <p className="text-sm text-gray-500">This reference could not be verified.</p>
                  </div>
                )}

                {data.valid && (
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-xl border divide-y">
                      <div className="flex justify-between px-4 py-3">
                        <span className="text-sm text-gray-500">Student Name</span>
                        <span className="text-sm font-semibold">{data.studentName}</span>
                      </div>
                      <div className="flex justify-between px-4 py-3">
                        <span className="text-sm text-gray-500">Matric Number</span>
                        <span className="text-sm font-mono">{data.matricNumber}</span>
                      </div>
                      <div className="flex justify-between px-4 py-3">
                        <span className="text-sm text-gray-500">Department</span>
                        <span className="text-sm font-medium">{data.department}</span>
                      </div>
                      {data.cgpa !== null && (
                        <div className="flex justify-between px-4 py-3">
                          <span className="text-sm text-gray-500">CGPA</span>
                          <span className="text-sm font-bold text-primary">{data.cgpa?.toFixed(2)} / 5.00</span>
                        </div>
                      )}
                      {data.classification && (
                        <div className="flex justify-between px-4 py-3">
                          <span className="text-sm text-gray-500">Classification</span>
                          <span className="text-sm font-medium">{data.classification}</span>
                        </div>
                      )}
                      <div className="flex justify-between px-4 py-3">
                        <span className="text-sm text-gray-500">Document Status</span>
                        <Badge className={data.isOfficial ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                          {data.isOfficial ? "OFFICIAL" : data.status?.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between px-4 py-3">
                        <span className="text-sm text-gray-500">Issue Date</span>
                        <span className="text-sm">{new Date(data.issuedAt).toLocaleDateString("en-NG", { day: "2-digit", month: "long", year: "numeric" })}</span>
                      </div>
                      <div className="flex justify-between px-4 py-3">
                        <span className="text-sm text-gray-500">Reference No</span>
                        <span className="text-xs font-mono text-primary">{data.referenceNumber}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>This verification was performed in real-time against MAAUN's official academic records database.</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Maryam Abacha American University of Nigeria · Registry Division<br />
          For inquiries: registry@maaun.edu.ng · +234 800 MAAUN-NG
        </p>
      </div>
    </div>
  );
}
