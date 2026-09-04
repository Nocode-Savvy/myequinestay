"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Building2,
  DollarSign,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  Activity,
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
import { createClient } from "@/lib/supabase/client";

interface ActivityItem {
  id: string;
  type: "listing" | "user" | "payment" | "inquiry";
  title: string;
  detail: string;
  time: string;
  timestamp: number;
}

interface MonthlyMetric {
  month: string;
  signups: number;
  listings: number;
  revenue: number;
}

export default function AdminDashboardPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeListings, setActiveListings] = useState(0);
  const [premiumListings, setPremiumListings] = useState(0);
  const [standardListings, setStandardListings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [inquiriesSent, setInquiriesSent] = useState(0);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [monthlyGrowth, setMonthlyGrowth] = useState<MonthlyMetric[]>([]);

  useEffect(() => {
    async function fetchAdminStats() {
      try {
        setLoading(true);

        // 1. Total users
        const { count: usersCount, data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name, email, role, created_at", { count: "exact" })
          .order("created_at", { ascending: false });

        setTotalUsers(usersCount || 0);

        // 2. Listings
        const { data: listings } = (await (supabase
          .from("listings") as any)
          .select("id, title, city, plan, status, created_at")
          .order("created_at", { ascending: false })) as any;

        const allListings = listings || [];
        const active = allListings.filter((l: any) => l.status === "active");
        setActiveListings(active.length);
        setPremiumListings(active.filter((l: any) => l.plan === "premium").length);
        setStandardListings(active.filter((l: any) => l.plan === "standard").length);

        // 3. Payments
        const { data: payments } = (await (supabase
          .from("payments") as any)
          .select("id, amount, plan, status, created_at")
          .order("created_at", { ascending: false })) as any;

        const allPayments = payments || [];
        const revTotal = allPayments
          .filter((p: any) => p.status === "completed")
          .reduce((sum: number, p: any) => sum + (p.amount || 0) / 100, 0);
        setTotalRevenue(revTotal);

        // 4. Inquiries
        const { count: inqCount, data: inquiries } = (await (supabase
          .from("inquiries") as any)
          .select("id, guest_name, listing_id, created_at", { count: "exact" })
          .order("created_at", { ascending: false })) as any;

        setInquiriesSent(inqCount || 0);

        // 5. Build live recent activity feed from real records
        const activities: ActivityItem[] = [];

        // Users activity
        (profiles || []).slice(0, 4).forEach((p: any) => {
          activities.push({
            id: `user-${p.id}`,
            type: "user",
            title: `New user signup: ${p.full_name || p.email}`,
            detail: `Registered as ${p.role === "admin" ? "Administrator" : p.role === "owner" ? "Property Owner" : "Guest Traveler"}`,
            time: formatTimeAgo(p.created_at),
            timestamp: new Date(p.created_at).getTime(),
          });
        });

        // Listings activity
        allListings.slice(0, 4).forEach((l: any) => {
          activities.push({
            id: `listing-${l.id}`,
            type: "listing",
            title: `New listing: ${l.title || "Untitled"}`,
            detail: `${l.city ? `${l.city} · ` : ""}${l.plan === "premium" ? "Premium $89" : "Standard $59"} (${l.status})`,
            time: formatTimeAgo(l.created_at),
            timestamp: new Date(l.created_at).getTime(),
          });
        });

        // Payments activity
        allPayments.slice(0, 4).forEach((p: any) => {
          activities.push({
            id: `payment-${p.id}`,
            type: "payment",
            title: `Payment verified: $${((p.amount || 0) / 100).toFixed(2)}`,
            detail: `${p.plan === "premium" ? "Premium" : "Standard"} 3-month subscription (${p.status})`,
            time: formatTimeAgo(p.created_at),
            timestamp: new Date(p.created_at).getTime(),
          });
        });

        // Inquiries activity
        (inquiries || []).slice(0, 4).forEach((inq: any) => {
          activities.push({
            id: `inquiry-${inq.id}`,
            type: "inquiry",
            title: `Inquiry sent by ${inq.guest_name || "Guest"}`,
            detail: "Direct traveler communication",
            time: formatTimeAgo(inq.created_at),
            timestamp: new Date(inq.created_at).getTime(),
          });
        });

        activities.sort((a, b) => b.timestamp - a.timestamp);
        setRecentActivity(activities.slice(0, 6));

        // 6. Build 6-month timeline metrics from live data
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const now = new Date();
        const monthsList: { month: string; year: number; monthIndex: number }[] = [];

        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          monthsList.push({
            month: monthNames[d.getMonth()],
            year: d.getFullYear(),
            monthIndex: d.getMonth(),
          });
        }

        const metrics: MonthlyMetric[] = monthsList.map(({ month, year, monthIndex }) => {
          const signupsInMonth = (profiles || []).filter((p: any) => {
            const dt = new Date(p.created_at);
            return dt.getFullYear() === year && dt.getMonth() === monthIndex;
          }).length;

          const listingsInMonth = allListings.filter((l: any) => {
            const dt = new Date(l.created_at);
            return dt.getFullYear() === year && dt.getMonth() === monthIndex;
          }).length;

          const revInMonth = allPayments
            .filter((p: any) => {
              const dt = new Date(p.created_at);
              return p.status === "completed" && dt.getFullYear() === year && dt.getMonth() === monthIndex;
            })
            .reduce((sum: number, p: any) => sum + (p.amount || 0) / 100, 0);

          return {
            month,
            signups: signupsInMonth,
            listings: listingsInMonth,
            revenue: revInMonth,
          };
        });

        setMonthlyGrowth(metrics);
      } catch (err) {
        console.error("Error loading admin stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminStats();
  }, [supabase]);

  function formatTimeAgo(dateStr: string) {
    if (!dateStr) return "Recently";
    const sec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (sec < 60) return "Just now";
    if (sec < 3600) return `${Math.floor(sec / 60)} mins ago`;
    if (sec < 86400) return `${Math.floor(sec / 3600)} hours ago`;
    return new Date(dateStr).toLocaleDateString();
  }

  const currentMonthName = new Date().toLocaleString("default", { month: "short" });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1F3A2B]">Platform Overview</h1>
          <p className="text-xs text-[#6E7771] mt-1">
            Live metrics from your connected Supabase database and Stripe payments.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium self-start">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          Live App Connected
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E0D6] shadow-xs">
          <div className="flex justify-between items-center text-[#6E7771] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Users</span>
            <Users size={16} className="text-[#1F3A2B]" />
          </div>
          <div className="font-serif font-bold text-3xl text-[#1B221E]">
            {loading ? "…" : totalUsers}
          </div>
          <p className="text-[11px] text-[#6E7771] mt-1">
            Registered accounts in database
          </p>
        </div>

        {/* Active Listings */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E0D6] shadow-xs">
          <div className="flex justify-between items-center text-[#6E7771] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Listings</span>
            <Building2 size={16} className="text-[#1F3A2B]" />
          </div>
          <div className="font-serif font-bold text-3xl text-[#1B221E]">
            {loading ? "…" : activeListings}
          </div>
          <p className="text-[11px] text-[#6E7771] mt-1">
            {premiumListings} Premium · {standardListings} Standard
          </p>
        </div>

        {/* Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E0D6] shadow-xs">
          <div className="flex justify-between items-center text-[#6E7771] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Revenue ({currentMonthName})</span>
            <DollarSign size={16} className="text-[#E1B534]" />
          </div>
          <div className="font-serif font-bold text-3xl text-[#1F3A2B]">
            {loading ? "…" : `$${totalRevenue.toLocaleString()}`}
          </div>
          <p className="text-[11px] text-[#6E7771] mt-1">
            Verified Stripe subscription income
          </p>
        </div>

        {/* Inquiries */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E0D6] shadow-xs">
          <div className="flex justify-between items-center text-[#6E7771] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Inquiries Sent</span>
            <MessageSquare size={16} className="text-[#E1B534]" />
          </div>
          <div className="font-serif font-bold text-3xl text-[#1B221E]">
            {loading ? "…" : inquiriesSent}
          </div>
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
              <p className="text-xs text-[#6E7771]">Monthly subscription income from Stripe</p>
            </div>
            <span className="text-[10px] font-semibold text-[#1F3A2B] bg-[#FAF7F2] border border-[#E5E0D6] px-2.5 py-1 rounded-full uppercase tracking-wider">
              Live Feed
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyGrowth}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F3A2B" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1F3A2B" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#FAF7F2" />
                <XAxis dataKey="month" stroke="#6E7771" fontSize={11} />
                <YAxis stroke="#6E7771" fontSize={11} />
                <Tooltip
                  formatter={(val: any) => [`$${val}`, "Revenue"]}
                  contentStyle={{ borderRadius: "12px", border: "1px solid #E5E0D6" }}
                />
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
              <BarChart data={monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FAF7F2" />
                <XAxis dataKey="month" stroke="#6E7771" fontSize={11} />
                <YAxis stroke="#6E7771" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #E5E0D6" }}
                />
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
        {recentActivity.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#6E7771]">
            <Activity size={24} className="mx-auto text-[#E5E0D6] mb-2" />
            No platform events recorded yet. As users sign up and publish properties, live events will appear here.
          </div>
        ) : (
          <div className="divide-y divide-[#E5E0D6] text-xs">
            {recentActivity.map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#1B221E]">{act.title}</p>
                  <p className="text-[#6E7771]">{act.detail}</p>
                </div>
                <span className="text-[#6E7771] text-[11px] shrink-0 ml-4">{act.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
