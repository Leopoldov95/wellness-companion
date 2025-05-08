import { supabase } from "@/src/lib/supabase";
import { Tables } from "@/src/types/goals";
import { MoodEntry, moodType } from "@/src/types/mood";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const transformMoodEntry = (entry: Tables<"moods">): MoodEntry => ({
  id: entry.id,
  userId: entry.user_id,
  created_at: new Date(entry.created_at),
  mood: entry.mood as moodType,
});

//! dont pass in ID, use session to get user ID
// get current user's mood
export const useMoodList = (id: string) => {
  return useQuery({
    queryKey: ["moods", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("moods")
        .select("*")
        .eq("user_id", id);

      if (error) {
        throw new Error(error.message);
      }
      return (data ?? []).map(transformMoodEntry);
    },
    initialData: [],
  });
};

// creating a new daily mood
//* id and created_at are automatically generated
export const useInsertMood = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const { data: newMood, error } = await supabase
        .from("moods")
        .insert({
          user_id: data.userId,
          mood: data.mood,
        })
        .single();

      if (error) {
        // customized message for unique constraint error
        if (
          error.code === "23505" ||
          error.message.includes("unique constraint")
        ) {
          throw new Error(
            "You've already recorded a mood for today. Try again tomorrow."
          );
        }

        // default error handler
        throw new Error(error.message);
      }

      return data;
    },
    async onSuccess() {
      // this is to update the cache(state)
      await queryClient.invalidateQueries({
        queryKey: ["moods"],
        exact: false,
      });
    },
  });
};
