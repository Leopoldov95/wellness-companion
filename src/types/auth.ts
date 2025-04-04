import { Session } from "@supabase/supabase-js";

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
  profile: any;
  loading: boolean;
};
