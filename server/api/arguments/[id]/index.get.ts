// server/api/arguments/[id]/index.get.ts
import { defineEventHandler, createError } from "h3";
import { serverSupabase } from "~/server/utils/serverSupabaseClient";
import type { Argument } from "~/types";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id)
    throw createError({ statusCode: 400, message: "Missing argument ID" });

  try {
    const { data, error } = await serverSupabase
      .from("arguments")
      .select(
        `
        *,
        two_party_arguments (*),
        single_proposal_arguments (*)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data)
      throw createError({ statusCode: 404, message: "Argument not found" });

    // Transform the database response to match our TypeScript interface
    const base = {
      id: data.id,
      topic: data.topic,
      type: data.type,
      status: data.status,
      category: data.category,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      createdById: data.created_by_id,
      shareToken: data.share_token,
    };

    const argument: Argument =
      data.type === "twoParty"
        ? {
            ...base,
            type: "twoParty",
            firstPartyPosition: data.two_party_arguments?.first_party_position,
            secondPartyPosition:
              data.two_party_arguments?.second_party_position,
            secondPartyId: data.two_party_arguments?.second_party_id,
            party1Votes: data.two_party_arguments?.party1_votes || 0,
            party2Votes: data.two_party_arguments?.party2_votes || 0,
          }
        : {
            ...base,
            type: "singleProposal",
            proposal: data.single_proposal_arguments?.proposal,
            votesFor: data.single_proposal_arguments?.votes_for || 0,
            votesAgainst: data.single_proposal_arguments?.votes_against || 0,
          };

    return argument;
  } catch (error) {
    console.error("Error fetching argument:", error);
    throw error;
  }
});
