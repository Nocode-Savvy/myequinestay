import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. If signed out, redirect to signin
  if (!user) {
    redirect("/auth?mode=signin&redirectTo=/admin");
  }

  // 2. Query database for user profile and role
  const { data: profile } = (await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()) as { data: { role?: string } | null };

  // 3. Strict server-side verification: must have role === 'admin'
  if (profile?.role !== "admin") {
    redirect("/dashboard?unauthorized=admin");
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-10 overflow-y-auto max-w-7xl w-full">
        {children}
      </main>
    </div>
  );
}
