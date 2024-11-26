// types/index.ts
export type ArgumentType = "twoParty" | "singleProposal";

export type ArgumentStatus = 
  | "draft"           // Initial creation, not shared
  | "awaitingSecondParty"  // Shared but waiting for party 2
  | "published"       // Live and accepting votes
  | "closed";         // No longer accepting votes

export interface BaseArgument {
  id: number;
  topic: string;
  type: ArgumentType;
  status: ArgumentStatus;
  category: string;
  createdAt: string;
  updatedAt: string;
  createdById: string;    // User ID of creator
  shareToken?: string;    // Unique token for sharing
}

export interface TwoPartyArgument extends BaseArgument {
  type: "twoParty";
  firstPartyPosition: string;
  secondPartyPosition?: string;
  secondPartyId?: string;  // User ID of second party
  party1Votes: number;
  party2Votes: number;
}

export interface SingleProposalArgument extends BaseArgument {
  type: "singleProposal";
  proposal: string;
  votesFor: number;
  votesAgainst: number;
}

export type Argument = TwoPartyArgument | SingleProposalArgument;

// Additional interfaces for vote tracking
export interface Vote {
  id: number;
  argumentId: number;
  userId: string;
  createdAt: string;
  // For two-party arguments
  votedForParty1?: boolean;
  // For single-proposal arguments
  votedFor?: boolean;
}