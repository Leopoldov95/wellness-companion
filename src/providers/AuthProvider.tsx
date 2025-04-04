import { AuthData, User } from "@/src/types/auth";
import { Session } from "@supabase/supabase-js";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "@/src/lib/supabase";

const FAKE_USER: User = {
  id: 0,
  name: "test123",
  email: "sample@email.com",
  password: "12345",
};

const AuthContext = createContext<AuthData>({
  session: null,
  loading: true,
  profile: null,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // right, cannot call async directly inside useEffect. Must create function first then call
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      setSession(session);

      if (session) {
        //fetch profile
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setProfile(data || null);
      }
      setLoading(false);
    };

    fetchSession();
    // sets the session on supabase state change
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("triggering...");

      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading, profile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
