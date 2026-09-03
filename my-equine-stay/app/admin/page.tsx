"use client";

import { useState } from "react";
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

const MONTHLY_GROWTH = [
  { month: "May", signups: 45, listings: 8, revenue: 620 },
  { month: "Jun", signups: 78, listings: 14, revenue: 1100 },
  { month: "Jul", signups: 112, listings: 22, revenue: 1780 },
  { month: "Aug", signups: 165, listings: 31, revenue: 2540 },
  { month: "Sep", signups: 210, listings: 42, revenue: 3450 },
  { month: "Oct", signups: 280, listings: 58, revenue: 4890 },
];

const RECENT_ACTIVITY = [
  { id: 1, type: "listing", title: "New listing: Oak Ridge Farm", detail: "Ocala, FL · Premium $89", time: "10 mins ago" },
  { id: 2, type: "user", title: "New owner signup: James Sterling", detail: "Registered as Property Host", time: "45 mins ago" },
  { id: 3, type: "payment", title: "Stripe payout verified", detail: "$89.00 from Elena Vasquez", time: "2 hours ago" },
  { id: 4, type: "inquiry", title: "Direct Inquiry submitted", detail: "Guest inquiring about Golden Oak Manor", time: "4 hours ago" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1F3A2B]">Platform Overview</h1>
        <p className="text-xs text-[#6E7771] mt-1">
          Real-time metrics, listing subscriptions, user signups, and platform activity.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E5E0D6] shadow-xs">
          <div className="flex justify-between items-center text-[#6E7771] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Users</span>
            <Users size={16} className="text-[#1F3A2B]" />
          </div>
          <div className="font-serif font-bold text-2xl text-[#1B221E]">890</div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-0.5">
            <ArrowUpRight size={12} /> +24% this month
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E0D6] shadow-xs">
          <div className="flex justify-between items-center text-[#6E7771] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Listings</span>
            <Building2 size={16} className="text-[#1F3A2B]" />
          </div>
          <div className="font-serif font-bold text-2xl text-[#1B221E]">58</div>
          <p className="text-[11px] text-[#6E7771] mt-1">42 Premium · 16 Standard</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E0D6] shadow-xs">
          <div className="flex justify-between items-center text-[#6E7771] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Revenue (Oct)</span>
            <DollarSign size={16} className="text-[#E1B534]" />
          </div>
          <div className="font-serif font-bold text-2xl text-[#1F3A2B]">$4,890</div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-0.5">
            <ArrowUpRight size={12} /> +32% subscription growth
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E0D6] shadow-xs">
          <div className="flex justify-between items-center text-[#6E7771] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Inquiries Sent</span>
            <MessageSquare size={16} className="text-[#E1B534]" />
          </div>
          <div className="font-serif font-bold text-2xl text-[#1B221E]">312</div>
          <p className="text-[11px] text-[#6E7771] mt-1">Direct guest connections</p>
        </div>
      </div>

      {/* Recharts Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Growth Area Chart */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-serif font-bold text-base text-[#1B221E]">Listing Revenue ($)</h2>
              <p className="text-xs text-[#6E7771]">Monthly subscription income</p>
            </div>
            <span className="text-xs font-semibold text-[#1F3A2B] bg-[#FAF7F2] border border-[#E5E0D6] px-2.5 py-1 rounded-full">
              Live Stripe Feed
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_GROWTH}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F3A2B" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1F3A2B" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#FAF7F2" />
                <XAxis dataKey="month" stroke="#6E7771" fontSize={11} />
                <YAxis stroke="#6E7771" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#1F3A2B" fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Signups Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-serif font-bold text-base text-[#1B221E]">User Growth &amp; Listings</h2>
              <p className="text-xs text-[#6E7771]">New user signups vs active properties</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_GROWTH}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FAF7F2" />
                <XAxis dataKey="month" stroke="#6E7771" fontSize={11} />
                <YAxis stroke="#6E7771" fontSize={11} />
                <Tooltip />
                <Bar dataKey="signups" fill="#E1B534" radius={[4, 4, 0, 0]} name="Signups" />
                <Bar dataKey="listings" fill="#1F3A2B" radius={[4, 4, 0, 0]} name="Listings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] shadow-xs">
        <h2 className="font-serif font-bold text-base text-[#1B221E] mb-4">Recent Platform Events</h2>
        <div className="divide-y divide-[#E5E0D6] text-xs">
          {RECENT_ACTIVITY.map((act) => (
            <div key={act.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#1B221E]">{act.title}</p>
                <p className="text-[#6E7771]">{act.detail}</p>
              </div>
              <span className="text-[#6E7771] text-[11px]">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
