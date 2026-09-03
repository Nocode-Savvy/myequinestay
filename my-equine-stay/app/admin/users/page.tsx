"use client";

import { useState } from "react";
import { Search, UserCheck, ShieldAlert, MoreVertical, Edit2, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  role: "guest" | "owner" | "admin";
  is_suspended: boolean;
  listings_count: number;
  created_at: string;
}

const SAMPLE_USERS: AdminUser[] = [
  { id: "u0", full_name: "Admin EquineStay", email: "admin@equinestay.com", role: "admin", is_suspended: false, listings_count: 0, created_at: "2026-01-01" },
  { id: "u1", full_name: "Sarah Mitchell", email: "sarah@mitchellfarm.com", role: "owner", is_suspended: false, listings_count: 2, created_at: "2026-01-15" },
  { id: "u2", full_name: "James & Patricia Owens", email: "info@goldenoakmanor.com", role: "owner", is_suspended: false, listings_count: 1, created_at: "2026-02-01" },
  { id: "u4", full_name: "Emily Watson", email: "emily.w@equestrian.org", role: "guest", is_suspended: false, listings_count: 0, created_at: "2026-03-10" },
  { id: "u5", full_name: "Mark Houser", email: "liveoakrvpad@gmail.com", role: "owner", is_suspended: false, listings_count: 1, created_at: "2026-03-14" },
  { id: "u6", full_name: "Spam Bot", email: "spammer@botmail.xyz", role: "guest", is_suspended: true, listings_count: 0, created_at: "2026-04-02" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(SAMPLE_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const toggleSuspension = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, is_suspended: !u.is_suspended } : u)));
  };

  const changeRole = (id: string, newRole: "guest" | "owner" | "admin") => {
    setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
  };

  const filtered = users.filter((u) => {
    const matchesSearch = u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#1F3A2B]">Users &amp; Roles</h1>
          <p className="text-xs text-[#6E7771] mt-0.5">Manage user accounts, owner permissions, and admin access levels.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E7771]" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#E5E0D6] bg-white text-[#1B221E] focus:outline-none focus:border-[#1F3A2B] transition-colors"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3.5 py-2.5 text-xs rounded-xl border border-[#E5E0D6] bg-white text-[#1B221E] focus:outline-none focus:border-[#1F3A2B]"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admins</option>
          <option value="owner">Owners</option>
          <option value="guest">Guests</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#E5E0D6] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E5E0D6] text-[#6E7771] uppercase font-semibold">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Listings</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D6]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 text-[#6E7771]">
                      <Search size={28} className="text-[#E5E0D6]" />
                      <p className="font-semibold text-[#1B221E] text-sm">No users found</p>
                      <p className="text-xs text-[#6E7771]">No registered users match your current search or role filter.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setRoleFilter("all");
                        }}
                        className="mt-2 text-xs font-semibold text-[#E1B534] hover:underline"
                      >
                        Reset filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-[#1B221E]">{user.full_name}</p>
                      <p className="text-[#6E7771] text-[11px]">{user.email}</p>
                    </td>
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) => changeRole(user.id, e.target.value as any)}
                        className={`font-semibold border rounded-lg px-2.5 py-1 text-xs focus:outline-none ${
                          user.role === "admin"
                            ? "bg-[#E1B534]/15 border-[#E1B534]/40 text-[#C8A928]"
                            : user.role === "owner"
                            ? "bg-[#1F3A2B]/10 border-[#1F3A2B]/30 text-[#1F3A2B]"
                            : "bg-[#FAF7F2] border-[#E5E0D6] text-[#6E7771]"
                        }`}
                      >
                        <option value="guest">Guest</option>
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-4 font-medium text-[#1B221E]">{user.listings_count}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          user.is_suspended
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.is_suspended ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td className="p-4 text-[#6E7771]">{user.created_at}</td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => toggleSuspension(user.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                          user.is_suspended
                            ? "border-green-300 text-green-700 hover:bg-green-50"
                            : "border-amber-300 text-amber-700 hover:bg-amber-50"
                        }`}
                      >
                        {user.is_suspended ? "Reactivate" : "Suspend"}
                      </button>
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
