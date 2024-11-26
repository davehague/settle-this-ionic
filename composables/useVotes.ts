// composables/useVotes.ts
import { ref } from "vue";
import type { Vote } from "~/types";

export function useVotes() {
  const isVoting = ref(false);
  const votedArguments = ref<Set<string>>(new Set());

  const getVoteStatus = (argumentId: string) => {
    return votedArguments.value.has(argumentId);
  };

  const recordVote = (argumentId: string) => {
    votedArguments.value.add(argumentId);
  };

  const clearVotes = () => {
    votedArguments.value.clear();
  };

  const submitVote = async (voteData: {
    argumentId: string;
    votedFor?: boolean;
    votedForParty1?: boolean;
  }): Promise<Vote> => {
    isVoting.value = true;
    try {
      const response = await $fetch<Vote>(
        `/api/arguments/${voteData.argumentId}/vote`,
        {
          method: "POST",
          body: voteData,
        }
      );
      recordVote(voteData.argumentId);
      return response;
    } finally {
      isVoting.value = false;
    }
  };

  const getUserVote = async (argumentId: string): Promise<Vote | null> => {
    try {
      return await $fetch<Vote>(`/api/arguments/${argumentId}/vote`);
    } catch (error) {
      // If no vote exists, return null
      return null;
    }
  };

  return {
    isVoting,
    getVoteStatus,
    recordVote,
    clearVotes,
    submitVote,
    getUserVote,
  };
}