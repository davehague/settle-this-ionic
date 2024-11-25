// composables/useArguments.ts
import { ref, onMounted } from "vue";
import type { Ref } from "vue";
import type {
  Argument,
  TwoPartyArgument,
  SingleProposalArgument,
} from "~/types";

export function useArguments() {
  const argumentsList: Ref<Argument[]> = ref([]);
  const loading = ref(true);
  const error = ref<Error | null>(null);
  const page = ref(1);

  const fetchArguments = async () => {
    loading.value = true;
    try {
      // Mock data for now - replace with actual API call
      const response: Argument[] = [
        {
          id: 1,
          type: "twoParty",
          topic: "Who controls the TV remote?",
          firstPartyPosition:
            "The person who gets home first and starts watching TV should keep the remote. Constantly asking to change channels interrupts the viewing experience.",
          secondPartyPosition:
            "The remote should be shared equally. Both people should have input on what to watch and take turns choosing programs.",
          status: "active",
          category: "relationship",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          party1Votes: 67,
          party2Votes: 89,
        } as TwoPartyArgument,
        {
          id: 2,
          type: "singleProposal",
          topic: "Social Media Boundaries",
          proposal:
            "Partners should ask permission before posting photos or personal stories about each other on social media. Everyone has different comfort levels with online sharing.",
          status: "active",
          category: "relationship",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          votesFor: 178,
          votesAgainst: 22,
        } as SingleProposalArgument,
        {
          id: 3,
          type: "twoParty",
          topic: "Meeting the Parents Timeline",
          firstPartyPosition:
            "Meeting the parents should happen within the first 3 months of dating. It shows commitment and helps establish if there are any major family compatibility issues early on.",
          secondPartyPosition:
            "Meeting the parents should wait until at least 6 months of dating. The relationship needs time to develop naturally without family pressure.",
          status: "active",
          category: "relationship",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          party1Votes: 95,
          party2Votes: 112,
        } as TwoPartyArgument,
        {
          id: 4,
          type: "twoParty",
          topic: "Thermostat Settings",
          firstPartyPosition:
            "The thermostat should be set at 72°F (22°C) year-round for optimal comfort. Being too cold or too hot affects sleep quality and daily comfort.",
          secondPartyPosition:
            "The thermostat should be set at 68°F (20°C) to save energy and money. People can always add or remove layers for comfort.",
          status: "active",
          category: "relationship",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          party1Votes: 134,
          party2Votes: 156,
        } as TwoPartyArgument,
        {
          id: 5,
          type: "singleProposal",
          topic: "Shared Calendar Policy",
          proposal:
            "Couples should maintain a shared digital calendar for all social events, appointments, and date nights to avoid scheduling conflicts and ensure quality time together.",
          status: "active",
          category: "relationship",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          votesFor: 198,
          votesAgainst: 45,
        } as SingleProposalArgument,
        {
          id: 6,
          type: "twoParty",
          topic: "Joint vs. Separate Bank Accounts",
          firstPartyPosition:
            "Couples should maintain separate bank accounts with a joint account for shared expenses. This preserves financial independence and reduces money-related conflicts.",
          secondPartyPosition:
            "All accounts should be joint accounts. Marriage/partnership means sharing everything, including finances. Separate accounts create unnecessary division.",
          status: "active",
          category: "relationship",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          party1Votes: 167,
          party2Votes: 145,
        } as TwoPartyArgument,
        {
          id: 7,
          type: "twoParty",
          topic: "Should pineapple be allowed on pizza?",
          firstPartyPosition:
            "Pineapple on pizza is a delicious combination of sweet and savory. The tropical sweetness perfectly complements the salty cheese and savory sauce.",
          secondPartyPosition:
            "Pizza is a savory dish and pineapple ruins the entire balance. It's too sweet and the texture doesn't belong on a pizza.",
          status: "active",
          category: "food",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          party1Votes: 42,
          party2Votes: 36,
        } as TwoPartyArgument,
        {
          id: 8,
          type: "singleProposal",
          topic: "Movie Theater Etiquette",
          proposal:
            "People should not be allowed to use their phones during movies, even on silent mode. The light is distracting to other viewers.",
          status: "active",
          category: "social",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          votesFor: 89,
          votesAgainst: 11,
        } as SingleProposalArgument,
        {
          id: 9,
          type: "twoParty",
          topic: "Working from home vs office",
          firstPartyPosition:
            "Working from home increases productivity, saves commute time, and provides better work-life balance. Companies should make it the default option.",
          secondPartyPosition:
            "Office work promotes better collaboration, maintains company culture, and provides clearer work-life boundaries. It should remain the standard.",
          status: "active",
          category: "work",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          party1Votes: 156,
          party2Votes: 142,
        } as TwoPartyArgument,
        {
          id: 4,
          type: "singleProposal",
          topic: "Public Transportation Rule",
          proposal:
            "If you're listening to music or watching videos on public transportation, you must use headphones. No exceptions.",
          status: "active",
          category: "social",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          votesFor: 245,
          votesAgainst: 3,
        } as SingleProposalArgument,
      ];
      argumentsList.value = response;
    } catch (err) {
      error.value =
        err instanceof Error ? err : new Error("Unknown error occurred");
      argumentsList.value = [];
    } finally {
      loading.value = false;
    }
  };

  const fetchMore = async () => {
    page.value++;
    await fetchArguments();
  };

  // Call fetch immediately instead of waiting for onMounted
  fetchArguments();

  return {
    argumentsList,
    loading,
    error,
    fetchMore,
  };
}
