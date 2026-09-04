"use client";

import { useState } from "react";
import { CheckCircle2, ShieldCheck, Flag } from "lucide-react";

interface ReportItem {
  id: string;
  target_type: "listing" | "user" | "message";
  target_title: string;
  reporter_email: string;
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  created_at: string;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#1F3A2B]">Reports Center</h1>
          <p className="text-xs text-[#6E7771] mt-0.5">
            User reports regarding inaccurate listings, biosecurity concerns, or inappropriate inquiries.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium self-start">
          <ShieldCheck size={14} className="text-emerald-600" />
          Queue Clean
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E0D6] shadow-xs overflow-hidden">
        {reports.length === 0 ? (
          <div className="p-16 text-center">
            <div className="size-12 rounded-full bg-emerald-50 text-emerald-700 grid place-items-center mx-auto mb-3 border border-emerald-100">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="font-serif text-lg text-[#1B221E] mb-1">
              All clear — no pending reports
            </h3>
            <p className="text-xs text-[#6E7771] max-w-sm mx-auto">
              The moderation queue is currently empty. When travelers or property owners submit concerns or flag listings, they will appear here for review.
            </p>
          </div>
        ) : (
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
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td className="p-4 font-medium text-[#1B221E]">{r.target_title}</td>
                    <td className="p-4 uppercase text-[10px] font-semibold text-[#6E7771]">{r.target_type}</td>
                    <td className="p-4 text-[#6E7771]">{r.reporter_email}</td>
                    <td className="p-4 text-[#1B221E]">{r.reason}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => setReports((prev) => prev.filter((item) => item.id !== r.id))}
                        className="px-3 py-1 rounded-lg border border-[#E5E0D6] text-[11px] font-medium hover:bg-slate-50"
                      >
                        Dismiss
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
