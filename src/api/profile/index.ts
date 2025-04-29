import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/AuthProvider";

type UpdateProfileInput = {
  id: string; // user id
  full_name?: string;
  avatar_url?: string;
  password?: string;
};

export const useUpdateProfile = () => {
  const { refreshProfile } = useAuth(); // 👈

  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      const { id, ...fieldsToUpdate } = input;

      // Password change, only update if needed
      if (input.password) {
        const { error: pwError } = await supabase.auth.updateUser({
          password: input.password,
        });

        if (pwError) {
          throw new Error(pwError.message);
        }
      }

      // update public profile
      const { data, error } = await supabase
        .from("profiles")
        .update({ ...fieldsToUpdate, updated_at: new Date().toISOString() })
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // updates profile locally
      await refreshProfile();

      return data;
    },
  });
};

export const useDeleteProfile = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("profiles").delete().eq("id", id);

      if (error) {
        throw new Error(error.message);
      }

      return true;
    },
  });
};
