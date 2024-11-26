// composables/useVotes.ts
import { ref } from "vue";

// Track voted arguments in local storage
const VOTES_STORAGE_KEY = "settleThis_votes";

export function useVotes(argumentId?: string) {
  const getStoredVotes = (): Record<string, number> => {
    const stored = localStorage.getItem(VOTES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  };

  const saveVotes = (votes: Record<string, number>) => {
    localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(votes));
  };

  // Get vote status for a specific argument
  const getVoteStatus = (id: string): boolean => {
    const votes = getStoredVotes();
    return !!votes[id];
  };

  const clearVotes = () => {
    localStorage.removeItem(VOTES_STORAGE_KEY);
  };

  // For specific argument instance
  const hasVoted = ref(argumentId ? getVoteStatus(argumentId) : false);

  const submitVote = async (vote: number | "for" | "against") => {
    if (!argumentId) return;

    try {
      // TODO: Replace with actual API call
      // await $fetch(`/api/votes/${argumentId}`, {
      //   method: 'POST',
      //   body: { vote }
      // })

      // Store vote in localStorage
      const votes = getStoredVotes();
      votes[argumentId] =
        typeof vote === "number" ? vote : vote === "for" ? 1 : 0;
      saveVotes(votes);

      hasVoted.value = true;
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  return {
    hasVoted,
    submitVote,
    getVoteStatus,
    clearVotes,
  };
}
