"use client";

import { useState } from "react";
import { CreditCard, RotateCcw, CheckCircle2, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfirmModal } from "@/components/ui/modal";

interface Transaction {
  id: string;
  owner_name: string;
  owner_email: string;
  listing_title: string;
  amount: number;
  plan: "standard" | "premium";
  status: "completed" | "refunded";
  stripe_session_id: string;
  created_at: string;
}

const SAMPLE_PAYMENTS: Transaction[] = [
  { id: "tx_1", owner_name: "Sarah Mitchell", owner_email: "sarah@mitchellfarm.com", listing_title: "Farm 5 Minutes from WEC", amount: 8900, plan: "premium", status: "completed", stripe_session_id: "cs_live_948293812", created_at: "2026-08-12" },
  { id: "tx_2", owner_name: "James Owens", owner_email: "info@goldenoakmanor.com", listing_title: "Golden Oak Manor", amount: 8900, plan: "premium", status: "completed", stripe_session_id: "cs_live_198239123", created_at: "2026-08-15" },
  { id: "tx_3", owner_name: "Tom Carlyle", owner_email: "tom@bridlegate.com", listing_title: "The Bridle Gate", amount: 5900, plan: "standard", status: "completed", stripe_session_id: "cs_live_583920192", created_at: "2026-08-18" },
  { id: "tx_4", owner_name: "Mark Houser", owner_email: "liveoakrvpad@gmail.com", listing_title: "Live Oak RV Pad", amount: 5900, plan: "standard", status: "completed", stripe_session_id: "cs_live_382910394", created_at: "2026-08-20" },
];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Transaction[]>(SAMPLE_PAYMENTS);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const handleRefund = () => {
    if (selectedTx) {
      setPayments(
        payments.map((p) =>
          p.id === selectedTx.id ? { ...p, status: "refunded" } : p
        )
      );
      setRefundModalOpen(false);
      setSelectedTx(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif font-bold text-2xl text-[#1F3A2B]">Payments &amp; Stripe</h1>
        <p className="text-xs text-[#6E7771] mt-0.5">
          Listing subscription payments collected through Stripe.
        </p>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-[#E5E0D6] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E5E0D6] text-[#6E7771] uppercase font-semibold">
              <tr>
                <th className="p-4">Owner</th>
                <th className="p-4">Listing</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Refund</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D6]">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-[#1B221E]">{p.owner_name}</p>
                    <p className="text-[#6E7771] text-[11px]">{p.owner_email}</p>
                  </td>
                  <td className="p-4 text-[#1B221E] font-medium">{p.listing_title}</td>
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
                  <td className="p-4 font-serif font-bold text-base text-[#1F3A2B]">
                    ${(p.amount / 100).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-[#6E7771]">{p.created_at}</td>
                  <td className="p-4 text-right">
                    {p.status === "completed" && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTx(p);
                          setRefundModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
                      >
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        onConfirm={handleRefund}
        title="Trigger Stripe Refund"
        message={`Are you sure you want to refund $${((selectedTx?.amount || 0) / 100).toFixed(2)} for ${selectedTx?.owner_name}?`}
        confirmLabel="Process Refund"
        isDestructive
      />
    </div>
  );
}
