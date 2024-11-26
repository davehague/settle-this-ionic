// server/api/arguments/[id]/vote.post.ts
import { defineEventHandler, readBody, createError } from "h3";
import { serverSupabase } from "~/server/utils/serverSupabaseClient";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id)
    throw createError({ statusCode: 400, message: "Missing argument ID" });

  const body = await readBody(event);
  const { votedFor, votedForParty1 } = body;

  try {
    // First check if user has already voted
    const { data: existingVote, error: checkError } = await serverSupabase
      .from("votes")
      .select()
      .eq("argument_id", id)
      .eq("user_id", event.context.user.id)
      .single();

    if (checkError && checkError.code !== "PGRST116") throw checkError; // PGRST116 is "not found"
    if (existingVote)
      throw createError({ statusCode: 400, message: "Already voted" });

    // Create the vote
    const { error: voteError } = await serverSupabase.from("votes").insert({
      argument_id: id,
      user_id: event.context.user.id,
      voted_for: votedFor,
      voted_for_party1: votedForParty1,
    });

    if (voteError) throw voteError;

    // Update vote counts
    if (votedForParty1 !== undefined) {
      const { error: updateError } = await serverSupabase.rpc(
        votedForParty1 ? "increment_party1_votes" : "increment_party2_votes",
        {
          arg_id: id,
        }
      );
      if (updateError) throw updateError;
    } else {
      const { error: updateError } = await serverSupabase.rpc(
        votedFor ? "increment_votes_for" : "increment_votes_against",
        {
          arg_id: id,
        }
      );
      if (updateError) throw updateError;
    }

    return { success: true };
  } catch (error) {
    console.error("Error processing vote:", error);
    throw error;
  }
});
