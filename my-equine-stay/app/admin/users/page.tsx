"use client";

import { useEffect, useState } from "react";
import {
  Search,
  UserCheck,
  ShieldAlert,
  Shield,
  ShieldCheck,
  MoreVertical,
  Edit2,
  Check,
  X,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Building,
  HelpCircle,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export type AdminScope =
  | "super_admin"
  | "listings_moderator"
  | "support_admin"
  | "finance_auditor";

interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  role: "guest" | "owner" | "admin";
  admin_scope?: AdminScope;
  is_suspended: boolean;
  listings_count: number;
  created_at: string;
}

const SCOPE_CONFIG: Record<
  AdminScope,
  { label: string; description: string; icon: any; color: string }
> = {
  super_admin: {
    label: "Super Admin",
    description: "Unrestricted master access: Manage users, roles, settings & finances",
    icon: ShieldCheck,
    color: "bg-amber-100 text-amber-900 border-amber-300",
  },
  listings_moderator: {
    label: "Listing Moderator",
    description: "Manage, review, feature and approve equestrian property stays",
    icon: Building,
    color: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
  support_admin: {
    label: "Support & Inquiries",
    description: "Manage guest communications, host questions, and flag reports",
    icon: HelpCircle,
    color: "bg-blue-100 text-blue-900 border-blue-300",
  },
  finance_auditor: {
    label: "Financial Auditor",
    description: "View Stripe payments, revenue metrics, payouts & subscriptions",
    icon: CreditCard,
    color: "bg-purple-100 text-purple-900 border-purple-300",
  },
};

export default function AdminUsersPage() {
  const supabase = createClient();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Notification message
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State for Assigning Admin
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedUserForAdmin, setSelectedUserForAdmin] = useState<string>("");
  const [adminScope, setAdminScope] = useState<AdminScope>("listings_moderator");
  const [customEmail, setCustomEmail] = useState("");
  const [customFullName, setCustomFullName] = useState("");
  const [savingAdmin, setSavingAdmin] = useState(false);

  // Fetch real users from Supabase
  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, is_suspended, created_at")
        .order("created_at", { ascending: false });

      if (error || !profiles) {
        setUsers([]);
        return;
      }

      // Also get listings count per owner from database
      const { data: allListings } = (await (supabase
        .from("listings") as any)
        .select("id, owner_id")) as any;

      const listingCountMap: Record<string, number> = {};
      (allListings || []).forEach((l: any) => {
        if (l.owner_id) {
          listingCountMap[l.owner_id] = (listingCountMap[l.owner_id] || 0) + 1;
        }
      });

      // Format profiles
      const formattedUsers: AdminUser[] = profiles.map((p: any) => ({
        id: p.id,
        full_name: p.full_name || "User",
        email: p.email || "No email",
        role: p.role || "guest",
        admin_scope: p.role === "admin" ? "super_admin" : undefined,
        is_suspended: !!p.is_suspended,
        listings_count: listingCountMap[p.id] || 0,
        created_at: p.created_at ? p.created_at.split("T")[0] : "Recently",
      }));

      setUsers(formattedUsers);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const showNotice = (type: "success" | "error", text: string) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 4000);
  };

  const toggleSuspension = async (id: string) => {
    const targetUser = users.find((u) => u.id === id);
    if (!targetUser) return;
    const newStatus = !targetUser.is_suspended;

    // Optimistic UI update
    setUsers(users.map((u) => (u.id === id ? { ...u, is_suspended: newStatus } : u)));

    try {
      await (supabase.from("profiles") as any)
        .update({ is_suspended: newStatus })
        .eq("id", id);
      showNotice("success", `User account ${newStatus ? "suspended" : "reactivated"}.`);
    } catch (err: any) {
      showNotice("error", err?.message || "Failed to update suspension status.");
    }
  };

  const changeRole = async (
    id: string,
    newRole: "guest" | "owner" | "admin",
    scope?: AdminScope
  ) => {
    // Optimistic UI update
    setUsers(
      users.map((u) =>
        u.id === id
          ? {
              ...u,
              role: newRole,
              admin_scope: newRole === "admin" ? scope || u.admin_scope || "super_admin" : undefined,
            }
          : u
      )
    );

    try {
      await (supabase.from("profiles") as any)
        .update({ role: newRole })
        .eq("id", id);
      showNotice(
        "success",
        `Role updated to ${newRole.toUpperCase()}${newRole === "admin" ? ` (${SCOPE_CONFIG[scope || "super_admin"].label})` : ""}.`
      );
    } catch (err: any) {
      showNotice("error", err?.message || "Failed to update role.");
    }
  };

  const handleAssignAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAdmin(true);

    try {
      if (selectedUserForAdmin) {
        // Promoting existing user
        await changeRole(selectedUserForAdmin, "admin", adminScope);
        setIsAssignModalOpen(false);
        setSelectedUserForAdmin("");
      } else if (customEmail) {
        // Invite new email as Admin
        const newUser: AdminUser = {
          id: `admin-${Date.now()}`,
          full_name: customFullName || "New Administrator",
          email: customEmail,
          role: "admin",
          admin_scope: adminScope,
          is_suspended: false,
          listings_count: 0,
          created_at: new Date().toISOString().split("T")[0],
        };
        setUsers([newUser, ...users]);
        showNotice(
          "success",
          `Assigned ${customEmail} as ${SCOPE_CONFIG[adminScope].label}!`
        );
        setIsAssignModalOpen(false);
        setCustomEmail("");
        setCustomFullName("");
      }
    } finally {
      setSavingAdmin(false);
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header with Assign Admin Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#1F3A2B]">
            Users &amp; Admin Management
          </h1>
          <p className="text-xs text-[#6E7771] mt-0.5">
            Super admin controls: assign administrative permissions, manage owners, and monitor accounts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadUsers}
            className="text-xs"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>

          <Button
            variant="gold"
            size="sm"
            onClick={() => setIsAssignModalOpen(true)}
            className="text-xs shadow-sm"
          >
            <UserPlus size={15} />
            Assign Administrator
          </Button>
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2 animate-in fade-in duration-200 ${
            notice.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {notice.type === "success" ? (
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-red-600 shrink-0" />
          )}
          <span>{notice.text}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E7771]"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
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
          <option value="admin">Administrators</option>
          <option value="owner">Property Owners</option>
          <option value="guest">Guest Travelers</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#E5E0D6] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E5E0D6] text-[#6E7771] uppercase font-semibold">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role &amp; Admin Scope</th>
                <th className="p-4">Listings</th>
                <th className="p-4">Status</th>
                <th className="p-4">Registered</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D6]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 text-[#6E7771]">
                      <Search size={28} className="text-[#E5E0D6]" />
                      <p className="font-semibold text-[#1B221E] text-sm">
                        No users found
                      </p>
                      <p className="text-xs text-[#6E7771]">
                        No registered users match your current search or role filter.
                      </p>
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
                filtered.map((user) => {
                  const scope = user.admin_scope || "super_admin";
                  const ScopeIcon = SCOPE_CONFIG[scope]?.icon || Shield;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-[#FAF7F2]/60 transition-colors"
                    >
                      {/* User Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-full bg-[#1F3A2B]/10 text-[#1F3A2B] font-semibold flex items-center justify-center text-xs shrink-0">
                            {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-[#1B221E]">
                              {user.full_name}
                            </p>
                            <p className="text-[#6E7771] text-[11px]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role & Scope */}
                      <td className="p-4">
                        <div className="space-y-1.5">
                          <select
                            value={user.role}
                            onChange={(e) => changeRole(user.id, e.target.value as any)}
                            className={`font-semibold border rounded-lg px-2.5 py-1 text-xs focus:outline-none transition-colors ${
                              user.role === "admin"
                                ? "bg-[#E1B534]/15 border-[#E1B534]/50 text-[#966b0a]"
                                : user.role === "owner"
                                ? "bg-[#1F3A2B]/10 border-[#1F3A2B]/30 text-[#1F3A2B]"
                                : "bg-[#FAF7F2] border-[#E5E0D6] text-[#6E7771]"
                            }`}
                          >
                            <option value="guest">Guest Traveler</option>
                            <option value="owner">Property Owner</option>
                            <option value="admin">Administrator</option>
                          </select>

                          {user.role === "admin" && (
                            <div className="flex items-center gap-1 text-[10px] font-medium text-[#966b0a]">
                              <ScopeIcon size={12} />
                              <span>{SCOPE_CONFIG[scope]?.label || "Admin"}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Listings count */}
                      <td className="p-4 font-medium text-[#1B221E]">
                        {user.listings_count}
                      </td>

                      {/* Status */}
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

                      {/* Registered Date */}
                      <td className="p-4 text-[#6E7771]">{user.created_at}</td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {user.role !== "admin" && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUserForAdmin(user.id);
                                setIsAssignModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-[#E1B534]/60 text-[#966b0a] hover:bg-[#E1B534]/10 transition-colors"
                            >
                              Make Admin
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => toggleSuspension(user.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                              user.is_suspended
                                ? "border-green-300 text-green-700 hover:bg-green-50"
                                : "border-red-200 text-red-700 hover:bg-red-50"
                            }`}
                          >
                            {user.is_suspended ? "Reactivate" : "Suspend"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Administrator Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E5E0D6] shadow-2xl max-w-lg w-full p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#E1B534]/20 text-[#966b0a] flex items-center justify-center">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#1F3A2B]">
                    Assign Administrator
                  </h3>
                  <p className="text-xs text-[#6E7771]">
                    Grant elevated administrative control to a team member or owner.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedUserForAdmin("");
                }}
                className="text-[#6E7771] hover:text-[#1B221E]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAssignAdminSubmit} className="space-y-4">
              {/* Select Existing User or New Email */}
              <div>
                <label className="block text-xs font-semibold text-[#1B221E] mb-1.5">
                  Select User to Promote
                </label>
                <select
                  value={selectedUserForAdmin}
                  onChange={(e) => setSelectedUserForAdmin(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E5E0D6] bg-[#FAF7F2]/40 text-[#1B221E] focus:outline-none focus:border-[#1F3A2B]"
                >
                  <option value="">-- Or enter new admin email below --</option>
                  {users
                    .filter((u) => u.role !== "admin")
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.full_name} ({u.email}) — Currently {u.role}
                      </option>
                    ))}
                </select>
              </div>

              {!selectedUserForAdmin && (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B221E] mb-1.5">
                      Admin Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="admin.colleague@example.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      required={!selectedUserForAdmin}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E5E0D6] bg-white text-[#1B221E] focus:outline-none focus:border-[#1F3A2B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1B221E] mb-1.5">
                      Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={customFullName}
                      onChange={(e) => setCustomFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E5E0D6] bg-white text-[#1B221E] focus:outline-none focus:border-[#1F3A2B]"
                    />
                  </div>
                </div>
              )}

              {/* Scope / Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#1B221E] mb-2">
                  Administrative Permission Scope
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Object.keys(SCOPE_CONFIG) as AdminScope[]).map((scopeKey) => {
                    const item = SCOPE_CONFIG[scopeKey];
                    const Icon = item.icon;
                    const isSelected = adminScope === scopeKey;

                    return (
                      <div
                        key={scopeKey}
                        onClick={() => setAdminScope(scopeKey)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "border-[#1F3A2B] bg-[#1F3A2B]/5 ring-1 ring-[#1F3A2B]"
                            : "border-[#E5E0D6] hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon
                            size={16}
                            className={isSelected ? "text-[#1F3A2B]" : "text-[#6E7771]"}
                          />
                          <span className="text-xs font-semibold text-[#1B221E]">
                            {item.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#6E7771] leading-snug">
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#E5E0D6] flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAssignModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="sm"
                  isLoading={savingAdmin}
                >
                  Confirm &amp; Assign Role
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
