import { Session } from "@supabase/supabase-js";
import { Tables } from "../database.types";

export type User = {
  id?: number;
  name: string;
  email: string;
  password: string;
  profileImg?: string;
};

// TODO ~ might need to handle the profile type
export type AuthData = {
  session: Session | null;
  profile: Tables<"profiles">;
  loading: boolean;
  refreshProfile: () => {};
};
