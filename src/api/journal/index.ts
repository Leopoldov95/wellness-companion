import { supabase } from "@/src/lib/supabase";
import { GratitudeEntry, JournalAPIEntry } from "@/src/types/journal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const transformJournalEntry = (
  entry: JournalAPIEntry
): GratitudeEntry => ({
  id: entry.id,
  userId: entry.user_id,
  created_at: new Date(entry.created_at),
  items: [entry.item_1, entry.item_2, entry.item_3],
  isShared: entry.is_shared,
  isFavorite: entry.is_favorite,
});

// get USER journal
export const useJournals = (id: number) => {
  return useQuery<GratitudeEntry[]>({
    queryKey: ["journal", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal")
        .select("*")
        .eq("user_id", id);

      if (error) {
        throw new Error(error.message);
      }

      return (data ?? []).map(transformJournalEntry);
    },
  });
};

// post USER journal
export const useInsertJournal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const { data: newJournal, error } = await supabase
        .from("journal")
        .insert({
          user_id: data.userId,
          item_1: data.items[0],
          item_2: data.items[1],
          item_3: data.items[2],
          is_shared: data.is_shared,
          is_favorite: false,
        })
        .single();

      if (error) {
        // customized message for unique constraint error
        if (
          error.code === "23505" ||
          error.message.includes("unique constraint")
        ) {
          throw new Error(
            "You've already recorded a journal entry for today. Try again tomorrow."
          );
        }

        // default error handler
        throw new Error(error.message);
      }

      //   return data;
      return transformJournalEntry(newJournal);
    },
    async onSuccess(_, data) {
      await queryClient.invalidateQueries({ queryKey: ["journal"] });
      await queryClient.invalidateQueries({ queryKey: ["journal", data.id] });
    },
  });
};

// edit USER journal
//* Only edit options are adjusting the shared or favorite columns
export const useUpdateJournal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: {
      id: number;
      is_shared?: boolean;
      is_favorite?: boolean;
    }) {
      const updateFields: Record<string, boolean> = {};

      if (typeof data.is_shared === "boolean") {
        updateFields.is_shared = data.is_shared;
      }

      if (typeof data.is_favorite === "boolean") {
        updateFields.is_favorite = data.is_favorite;
      }

      const { data: updatedJournal, error } = await supabase
        .from("journal")
        .update(updateFields)
        .eq("id", data.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      //   return updatedJournal;
      return transformJournalEntry(updatedJournal);
    },
    async onSuccess(_, data) {
      await queryClient.invalidateQueries({ queryKey: ["journal"] });
      await queryClient.invalidateQueries({ queryKey: ["journal", data.id] });
    },
    onError(error) {},
  });
};

// delete USER journal
export const useDeleteJournal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(id: number) {
      const { error } = await supabase.from("journal").delete().eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["journal"] });
    },
  });
};

// get SHARED journals
//TODO GET all shared journals NOT belonging to current user AND not SEEN
export const useSharedJournals = (id: number) => {
  return useQuery({
    queryKey: ["shared_journal", id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_unseen_shared_journals", {
        p_user_id: id,
      });
      // .from("journal")
      // .select("*")
      // .eq("is_shared", true)
      // .neq("user_id", id);

      if (error) {
        throw new Error(error.message);
      }

      return (data ?? []).map(transformJournalEntry);
    },
  });
};

// upate user seen SHARED journals, insert/add after a user navigates away from shared screen
