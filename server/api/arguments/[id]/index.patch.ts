// server/api/arguments/[id]/index.patch.ts
import { defineEventHandler, readBody, createError } from "h3";
import { serverSupabase } from "~/server/utils/serverSupabaseClient";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id)
    throw createError({ statusCode: 400, message: "Missing argument ID" });

  const body = await readBody(event);

  try {
    const { data: argument, error: argumentError } = await serverSupabase
      .from("arguments")
      .update({
        topic: body.topic,
        category: body.category,
        status: body.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (argumentError) throw argumentError;

    if (body.type === "twoParty") {
      const { error: twoPartyError } = await serverSupabase
        .from("two_party_arguments")
        .update({
          first_party_position: body.firstPartyPosition,
          second_party_position: body.secondPartyPosition,
        })
        .eq("argument_id", id);

      if (twoPartyError) throw twoPartyError;
    } else {
      const { error: singleProposalError } = await serverSupabase
        .from("single_proposal_arguments")
        .update({
          proposal: body.proposal,
        })
        .eq("argument_id", id);

      if (singleProposalError) throw singleProposalError;
    }

    return argument;
  } catch (error) {
    console.error("Error updating argument:", error);
    throw error;
  }
});
