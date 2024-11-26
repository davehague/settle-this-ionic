// server/api/arguments/index.get.ts
import { defineEventHandler, getQuery, createError } from "h3";
import { serverSupabase } from "~/server/utils/serverSupabaseClient";
import type { Argument } from "~/types";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    console.log("Query params:", query);
    const {
      status,
      createdById,
      secondPartyId,
      limit = 10,
      offset = 0,
    } = query;

    const baseQuery = serverSupabase
      .from("arguments")
      .select(
        `
        *,
        two_party_arguments (*),
        single_proposal_arguments (*)
      `
      )
      .order("created_at", { ascending: false })
      .limit(Number(limit))
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (status) {
      baseQuery.eq("status", status);
    }
    if (createdById) {
      baseQuery.eq("created_by_id", createdById);
    }
    if (secondPartyId) {
      baseQuery.eq("second_party_id", secondPartyId);
    }

    const { data, error } = await baseQuery;
    console.log("Data:", data);

    if (error) throw error;

    // Transform the data to match our TypeScript interfaces
    const args: Argument[] = data.map((arg: any) => {
      const base = {
        id: arg.id,
        topic: arg.topic,
        type: arg.type,
        status: arg.status,
        category: arg.category,
        createdAt: arg.created_at,
        updatedAt: arg.updated_at,
        createdById: arg.created_by_id,
        shareToken: arg.share_token,
      };

      if (arg.type === "twoParty") {
        return {
          ...base,
          type: "twoParty",
          firstPartyPosition: arg.two_party_arguments?.first_party_position,
          secondPartyPosition: arg.two_party_arguments?.second_party_position,
          secondPartyId: arg.two_party_arguments?.second_party_id,
          party1Votes: arg.two_party_arguments?.party1_votes || 0,
          party2Votes: arg.two_party_arguments?.party2_votes || 0,
        };
      } else {
        return {
          ...base,
          type: "singleProposal",
          proposal: arg.single_proposal_arguments?.proposal,
          votesFor: arg.single_proposal_arguments?.votes_for || 0,
          votesAgainst: arg.single_proposal_arguments?.votes_against || 0,
        };
      }
    });

    return args;
  } catch (error) {
    console.error("Error fetching arguments:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch arguments",
    });
  }
});
