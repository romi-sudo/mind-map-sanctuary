import { supabase } from "@/integrations/supabase/client";

export type Role = "consumer" | "practitioner" | "company";

/**
 * Determines where to send a user after login/signup based on role
 * and (for practitioners) their application status.
 */
export async function getPostAuthRoute(userId: string, fallbackRole?: Role): Promise<string> {
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  const role = (roles?.[0]?.role as Role) ?? fallbackRole ?? "consumer";

  if (role === "company") return "/corporate";
  if (role === "practitioner") {
    const { data: app } = await supabase
      .from("practitioner_applications")
      .select("status")
      .eq("user_id", userId)
      .maybeSingle();
    if (!app) return "/join-as-practitioner";
    if (app.status === "approved") return "/dashboard";
    return "/pending";
  }
  return "/";
}
