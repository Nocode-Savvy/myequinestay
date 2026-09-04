"use client";

import { useEffect, useState } from "react";
import { CreditCard, DollarSign, CheckCircle2, RotateCcw, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Transaction {
  id: string;
  owner_name: string;
  owner_email: string;
  listing_title: string;
  amount: number;
  plan: "standard" | "premium";
  status: "completed" | "refunded" | "pending" | "failed";
  stripe_session_id: string;
  created_at: string;
}

export default function AdminPaymentsPage() {
  const supabase = createClient();

  const [payments, setPayments] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refundNotice, setRefundNotice] = useState<string | null>(null);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = (await (supabase
        .from("payments") as any)
        .select("*, listings(title), profiles(full_name, email)")
        .order("created_at", { ascending: false })) as any;

      if (!error && data) {
        const mapped: Transaction[] = data.map((p: any) => ({
          id: p.id,
          owner_name: p.profiles?.full_name || "Owner",
          owner_email: p.profiles?.email || "No email",
          listing_title: p.listings?.title || "Property",
          amount: p.amount || 0,
          plan: p.plan || "standard",
          status: p.status || "completed",
          stripe_session_id: p.stripe_session_id || "N/A",
          created_at: new Date(p.created_at).toLocaleDateString(),
        }));
        setPayments(mapped);
      } else {
        setPayments([]);
      }
    } catch (err) {
      console.error("Failed to load payments:", err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const totalCollected = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount / 100, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#1F3A2B]">Payments &amp; Stripe</h1>
          <p className="text-xs text-[#6E7771] mt-0.5">
            Verified listing subscription transactions from the live database and Stripe checkout.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E0D6] text-xs self-start shadow-2xs">
          <span className="text-[#6E7771]">Total Collected:</span>
          <span className="font-semibold text-[#1F3A2B]">${totalCollected.toLocaleString()}</span>
        </div>
      </div>

      {refundNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{refundNotice}</span>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-[#E5E0D6] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E5E0D6] text-[#6E7771] uppercase font-semibold">
              <tr>
                <th className="p-4">Owner</th>
                <th className="p-4">Listing</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Stripe Reference</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D6]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#6E7771]">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="size-6 border-2 border-[#1F3A2B] border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs">Loading payment transactions from database…</p>
                    </div>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#6E7771]">
                    <CreditCard size={32} className="text-[#E5E0D6] mx-auto mb-2" />
                    <p className="font-medium text-sm text-[#1B221E] mb-1">No payment transactions yet</p>
                    <p className="text-xs max-w-md mx-auto">
                      When property owners subscribe to Standard ($59) or Premium ($89) listing tiers via Stripe, verified records and transaction session IDs will be recorded here.
                    </p>
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-[#1B221E]">{p.owner_name}</p>
                      <p className="text-[#6E7771] text-[11px]">{p.owner_email}</p>
                    </td>
                    <td className="p-4 text-[#1B221E] font-medium">{p.listing_title}</td>
                    <td className="p-4 font-semibold text-[#1B221E]">${(p.amount / 100).toFixed(2)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.plan === "premium"
                            ? "bg-[#E1B534]/15 text-[#C8A928] border border-[#E1B534]/30"
                            : "bg-[#FAF7F2] text-[#6E7771] border border-[#E5E0D6]"
                        }`}
                      >
                        {p.plan}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-[#6E7771]">{p.stripe_session_id}</td>
                    <td className="p-4 text-[#6E7771]">{p.created_at}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : p.status === "refunded"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {p.status}
                      </span>
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
