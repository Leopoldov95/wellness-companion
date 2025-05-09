import { supabase } from "@/src/lib/supabase";
import { AuthData } from "@/src/types/auth";
import { Session } from "@supabase/supabase-js";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { ensureCurrentWeeklyGoals } from "../api/goals";
import { Tables } from "../database.types";

const AuthContext = createContext<AuthData>({
  session: null,
  loading: true,
  profile: {
    id: "",
    avatar_url: "",
    full_name: "",
    updated_at: new Date().toISOString(),
  },
  refreshProfile: async () => {},
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [loading, setLoading] = useState(true);

  const maybeRunGoalInit = async (userId: string) => {
    try {
      await ensureCurrentWeeklyGoals(userId);
    } catch (error) {
      console.error("Failed to ensure current weekly goals:", error);
    }
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    }

    setProfile(data || null);
  };
  useEffect(() => {
    const getSessionAndProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);

      if (session) {
        await fetchProfile(session.user.id);
        // run goal updates here
        await maybeRunGoalInit(session.user.id);
      }

      setLoading(false);
    };

    getSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth state changed:", _event);
        setSession(session);

        if (session) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (session?.user?.id) {
      await fetchProfile(session.user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ session, loading, profile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
