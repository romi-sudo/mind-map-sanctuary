import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Role = "consumer" | "practitioner" | "company";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setRole(null);
      return;
    }
    setLoading(true);
    (async () => {
      const [{ data: prof }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", user.id),
      ]);
      if (prof) setProfile(prof as Profile);
      else {
        // fallback to metadata
        setProfile({
          id: user.id,
          full_name: (user.user_metadata?.full_name as string) ?? null,
          email: user.email ?? null,
          phone: null,
          avatar_url: null,
        });
      }
      if (roles && roles.length > 0) {
        // Prefer practitioner/company over consumer when user has multiple roles
        const priority: Role[] = ["practitioner", "company", "consumer"];
        const userRoles = roles.map((r) => r.role as Role);
        const best = priority.find((p) => userRoles.includes(p)) ?? userRoles[0];
        setRole(best);
      }
      setLoading(false);
    })();
  }, [user]);

  const firstName = (profile?.full_name ?? "").trim().split(" ")[0] || null;

  return { profile, role, firstName, loading };
};
