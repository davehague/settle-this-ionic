// server/api/arguments/index.post.ts
import {
  defineEventHandler,
  readBody,
  createError,
  setResponseHeaders,
} from "h3";
import type { Argument, ArgumentType, ArgumentStatus } from "~/types";
import { useUser } from "~/composables/useUser";

// Type for the expected request body
interface CreateArgumentBody {
  topic: string;
  category: string;
  type: ArgumentType;
  status: ArgumentStatus;
  firstPartyPosition?: string;
  proposal?: string;
}

export default defineEventHandler(async (event) => {
  try {
    setResponseHeaders(event, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });

    const body = await readBody<CreateArgumentBody>(event);

    // Validate required fields
    if (!body.topic || !body.category || !body.type || !body.status) {
      throw createError({
        statusCode: 400,
        message: "Missing required fields",
      });
    }

    // Validate type-specific required fields
    if (body.type === "twoParty" && !body.firstPartyPosition) {
      throw createError({
        statusCode: 400,
        message: "First party position is required for two-party arguments",
      });
    }

    if (body.type === "singleProposal" && !body.proposal) {
      throw createError({
        statusCode: 400,
        message: "Proposal is required for single-proposal arguments",
      });
    }

    // For testing, using mock user ID - in production this would come from the session
    const mockUserId = "123e4567-e89b-12d3-a456-426614174000";

    const now = new Date().toISOString();
    const baseArgument = {
      id: 1, // For testing
      topic: body.topic,
      type: body.type,
      category: body.category,
      status: body.status,
      createdAt: now,
      updatedAt: now,
      createdById: mockUserId,
      shareToken: crypto.randomUUID(), // Generate a unique share token
    };

    const newArgument: Argument =
      body.type === "twoParty"
        ? {
            ...baseArgument,
            type: "twoParty",
            firstPartyPosition: body.firstPartyPosition!,
            secondPartyPosition: undefined,
            secondPartyId: undefined,
            party1Votes: 0,
            party2Votes: 0,
          }
        : {
            ...baseArgument,
            type: "singleProposal",
            proposal: body.proposal!,
            votesFor: 0,
            votesAgainst: 0,
          };

    return newArgument;
  } catch (error) {
    console.error("Handler error:", error);
    throw error;
  }
});
