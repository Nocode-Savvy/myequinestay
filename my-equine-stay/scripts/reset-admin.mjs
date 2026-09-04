import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Load .env.local manually if not in process.env
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx > 0) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://htfcjcktyvcggviqzyxj.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error("ERROR: SUPABASE_SERVICE_ROLE_KEY is not set in .env.local or environment.");
  console.log("Please retrieve your service_role secret key from Supabase Dashboard -> Project Settings -> API.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function resetAdmin() {
  console.log("Searching for admin user with email admin@equinestay.com...");
  
  // List users to find ID
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Error listing users:", listError.message);
    process.exit(1);
  }

  const existingAdmin = usersData.users.find(
    (u) => u.email?.toLowerCase() === "admin@equinestay.com" || u.email?.toLowerCase() === "buildwithtimi8@gmail.com"
  );

  if (!existingAdmin) {
    console.error("Could not find user with email admin@equinestay.com or buildwithtimi8@gmail.com.");
    process.exit(1);
  }

  console.log(`Found existing admin user: ID = ${existingAdmin.id}, Current Email = ${existingAdmin.email}`);

  // Update password and email without changing the user ID
  const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
    existingAdmin.id,
    {
      email: "buildwithtimi8@gmail.com",
      password: "Admin2026#",
      email_confirm: true,
      user_metadata: {
        ...existingAdmin.user_metadata,
        role: "admin",
      },
    }
  );

  if (updateError) {
    console.error("Error updating admin auth user:", updateError.message);
    process.exit(1);
  }

  console.log("Successfully updated auth user credentials!");

  // Ensure profiles table matches
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: existingAdmin.id,
      email: "buildwithtimi8@gmail.com",
      role: "admin",
      updated_at: new Date().toISOString(),
    });

  if (profileError) {
    console.warn("Profile update warning:", profileError.message);
  } else {
    console.log("Successfully updated profile role to 'admin' and email to buildwithtimi8@gmail.com!");
  }

  console.log("\n>>> RESET COMPLETE: You can now log in at /login or /auth with:");
  console.log("Email: buildwithtimi8@gmail.com");
  console.log("Password: Admin2026#");
}

resetAdmin().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
