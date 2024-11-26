// server/api/arguments/[id]/respond.post.ts
import { defineEventHandler, readBody, createError } from "h3";
import { serverSupabase } from "~/server/utils/serverSupabaseClient";
import { snakeToCamel } from "~/utils/caseConversion";
import type { Argument } from "~/types";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const { secondPartyPosition, secondPartyId } = await readBody(event);

  if (!id || !secondPartyPosition) {
    throw createError({
      statusCode: 400,
      message: "Missing required fields",
    });
  }

  try {
    // First verify this is a two_party_argument and it's awaiting response
    const { data: argument, error: fetchError } = await serverSupabase
      .from("arguments")
      .select("*")
      .eq("id", id)
      .eq("type", "twoParty")
      .eq("status", "awaitingSecondParty")
      .single();

    if (fetchError || !argument) {
      throw createError({
        statusCode: 404,
        message: "Argument not found or not available for response",
      });
    }

    // Update the two_party_argument
    const { error: updateError } = await serverSupabase
      .from("two_party_arguments")
      .update({
        second_party_position: secondPartyPosition,
        second_party_id: secondPartyId || null,
      })
      .eq("argument_id", id);

    if (updateError) throw updateError;

    // Update the main argument status to published
    const { data: updatedArgument, error: statusError } = await serverSupabase
      .from("arguments")
      .update({ status: "published" })
      .eq("id", id)
      .select("*")
      .single();

    if (statusError) throw statusError;

    return snakeToCamel<Argument>(updatedArgument);
  } catch (error) {
    console.error("Error updating argument:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update argument",
    });
  }
});
