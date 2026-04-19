import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle pending role from OAuth signup
      if (session?.user) {
        const pendingRole = sessionStorage.getItem("pending_role");
        if (pendingRole && ["consumer", "practitioner", "company"].includes(pendingRole)) {
          setTimeout(async () => {
            const { data: existing } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", session.user.id);
            if (!existing || existing.length === 0) {
              await supabase.from("user_roles").insert({
                user_id: session.user.id,
                role: pendingRole as "consumer" | "practitioner" | "company",
              });
            }
            sessionStorage.removeItem("pending_role");
          }, 0);
        }
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
