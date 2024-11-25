// server/api/arguments.post.ts
import {
  defineEventHandler,
  readBody,
  createError,
  setResponseHeaders,
} from "h3";
import type { Argument } from "~/types";

export default defineEventHandler(async (event) => {
  try {
    // Set response headers explicitly
    setResponseHeaders(event, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });

    const body = await readBody(event);

    if (!body.topic || !body.category || !body.type) {
      throw createError({
        statusCode: 400,
        message: "Missing required fields",
      });
    }

    const now = new Date().toISOString();
    const baseArgument = {
      id: 1, // For testing
      topic: body.topic,
      type: body.type,
      category: body.category,
      status: body.status,
      createdAt: now,
      updatedAt: now,
    };

    const newArgument: Argument =
      body.type === "twoParty"
        ? {
            ...baseArgument,
            type: "twoParty",
            firstPartyPosition: body.firstPartyPosition,
            party1Votes: 0,
            party2Votes: 0,
          }
        : {
            ...baseArgument,
            type: "singleProposal",
            proposal: body.proposal,
            votesFor: 0,
            votesAgainst: 0,
          };

    return newArgument;
  } catch (error) {
    console.error("Handler error:", error);
    throw error;
  }
});
