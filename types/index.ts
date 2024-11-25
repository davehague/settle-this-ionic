// types/index.ts
export type ArgumentType = "twoParty" | "singleProposal";

export interface BaseArgument {
  id: number;
  topic: string;
  type: ArgumentType;
  status: "pending" | "active" | "closed";
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface TwoPartyArgument extends BaseArgument {
  type: "twoParty";
  firstPartyPosition: string;
  secondPartyPosition?: string;
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
