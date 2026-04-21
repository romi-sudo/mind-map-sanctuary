import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type PractitionerStatus = "pending" | "approved" | "rejected" | "none" | null;

export function usePractitionerStatus() {
  const { user } = useAuth();
  const [status, setStatus] = useState<PractitionerStatus>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setStatus(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("practitioner_applications")
      .select("status")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setStatus((data?.status as PractitionerStatus) ?? "none");
        setLoading(false);
      });
  }, [user]);

  return { status, loading };
}
