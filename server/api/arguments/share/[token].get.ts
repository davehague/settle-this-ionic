// server/api/arguments/share/[token].get.ts
import { defineEventHandler, createError } from "h3";
import { serverSupabase } from "~/server/utils/serverSupabaseClient";
import { snakeToCamel } from "~/utils/caseConversion";
import type { Argument } from "~/types";

export default defineEventHandler(async (event) => {
  const token = event.context.params?.token;

  if (!token) {
    throw createError({
      statusCode: 400,
      message: "Share token is required",
    });
  }

  try {
    const { data: argument, error } = await serverSupabase
      .from("arguments")
      .select(
        `
        *,
        two_party_arguments (*)
      `
      )
      .eq("share_token", token)
      .single();

    if (error || !argument) {
      throw createError({
        statusCode: 404,
        message: "Argument not found",
      });
    }

    return snakeToCamel<Argument>(argument);
  } catch (error) {
    console.error("Error fetching argument:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch argument",
    });
  }
});
