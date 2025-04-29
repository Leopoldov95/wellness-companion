import { supabase } from "@/src/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useGoalSubscription = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const goalSubscription = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "goals" },
        (payload) => {
          console.log("Change received!", payload);
          queryClient.invalidateQueries(["goals"]);
        }
      )
      .subscribe();

    return () => {
      goalSubscription.unsubscribe();
    };
  });
};
