"use client";

import { useState } from "react";
import { Flag, CheckCircle, Eye, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReportItem {
  id: string;
  target_type: "listing" | "user" | "message";
  target_title: string;
  reporter_email: string;
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  created_at: string;
}

const SAMPLE_REPORTS: ReportItem[] = [
  { id: "r1", target_type: "listing", target_title: "WildBit Pasture Rental", reporter_email: "guest@horses.org", reason: "Host updated stall count from 6 to 4 after discussion.", status: "pending", created_at: "Yesterday" },
  { id: "r2", target_type: "message", target_title: "Inquiry Message", reporter_email: "sarah@mitchellfarm.com", reason: "Suspected promotional solicitations instead of guest booking.", status: "resolved", created_at: "3 days ago" },
];

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>(SAMPLE_REPORTS);

  const resolveReport = (id: string, newStatus: "resolved" | "dismissed") => {
    setReports(reports.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif font-bold text-2xl text-[#1F3A2B]">Reports Center</h1>
        <p className="text-xs text-[#6E7771] mt-0.5">
          User reports regarding inaccurate listings, biosecurity concerns, or inappropriate inquiries.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E0D6] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E5E0D6] text-[#6E7771] uppercase font-semibold">
              <tr>
                <th className="p-4">Target</th>
                <th className="p-4">Type</th>
                <th className="p-4">Reported By</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D6]">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 text-[#6E7771]">
                      <CheckCircle size={28} className="text-emerald-600" />
                      <p className="font-semibold text-[#1B221E] text-sm">All clear — no pending reports</p>
                      <p className="text-xs text-[#6E7771]">The platform moderation queue is currently empty.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                reports.map((r) => (
                  <tr key={r.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="p-4 font-semibold text-[#1B221E]">{r.target_title}</td>
                    <td className="p-4">
                      <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF7F2] border border-[#E5E0D6] text-[#6E7771]">
                        {r.target_type}
                      </span>
                    </td>
                    <td className="p-4 text-[#6E7771]">{r.reporter_email}</td>
                    <td className="p-4 text-[#1B221E] max-w-xs">{r.reason}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : r.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : "bg-[#FAF7F2] text-[#6E7771]"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {r.status === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() => resolveReport(r.id, "resolved")}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                          >
                            Resolve
                          </button>
                          <button
                            type="button"
                            onClick={() => resolveReport(r.id, "dismissed")}
                            className="px-2.5 py-1 text-xs font-semibold text-[#6E7771] hover:bg-[#FAF7F2] rounded-lg border border-[#E5E0D6] transition-colors"
                          >
                            Dismiss
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
