import { defineEventHandler, readBody, createError } from "h3";
import { serverSupabase } from "~/server/utils/serverSupabaseClient";
import { snakeToCamel } from "~/utils/caseConversion";
import type { Argument } from "~/types";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { type, topic, category, status, firstPartyPosition, proposal } = body;

  const tempUser = {
    id: "e496416c-4526-4792-90bc-c6cc030ee5ea",
    email: "david.hague@gmail.com",
    name: "David Hague",
  };

  try {
    // Start a transaction
    const { data: dbArgument, error: argumentError } = await serverSupabase
      .from("arguments")
      .insert({
        topic,
        type,
        category,
        status,
        created_by_id: tempUser.id,
      })
      .select("*")
      .single();

    if (argumentError) throw argumentError;

    if (type === "twoParty") {
      const { error: twoPartyError } = await serverSupabase
        .from("two_party_arguments")
        .insert({
          argument_id: dbArgument.id,
          first_party_position: firstPartyPosition,
        });

      if (twoPartyError) throw twoPartyError;
    } else {
      const { error: singleProposalError } = await serverSupabase
        .from("single_proposal_arguments")
        .insert({
          argument_id: dbArgument.id,
          proposal,
        });

      if (singleProposalError) throw singleProposalError;
    }

    return snakeToCamel<Argument>(dbArgument);
  } catch (error) {
    console.error("Error creating argument:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to create argument",
    });
  }
});
