<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ argument?.topic || 'Loading...' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Loading State -->
      <div v-if="isLoading" class="ion-text-center">
        <ion-spinner></ion-spinner>
      </div>

      <!-- Error State -->
      <ion-alert :is-open="!!errorMessage" :message="errorMessage" :buttons="['OK']"
        @didDismiss="errorMessage = ''"></ion-alert>

      <!-- Content -->
      <template v-if="argument && !isLoading">
        <ion-card>
          <ion-card-header>
            <ion-card-subtitle>{{ argument.category }}</ion-card-subtitle>
            <ion-card-title>{{ argument.topic }}</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <!-- Two Party Argument Display -->
            <template v-if="argument.type === 'twoParty' && twoPartyArgument">
              <div class="ion-margin-bottom">
                <ion-text color="primary">
                  <h2>First Party's Position</h2>
                </ion-text>
                <p>{{ twoPartyArgument.firstPartyPosition }}</p>

                <div class="vote-section">
                  <ion-button :color="userVote?.votedForParty1 ? 'success' : 'medium'" @click="handleVote(true)"
                    :disabled="isVoting">
                    <ion-icon :icon="thumbsUp" slot="start"></ion-icon>
                    Agree ({{ twoPartyArgument.party1Votes }})
                  </ion-button>
                </div>
              </div>

              <div class="ion-margin-bottom">
                <ion-text color="primary">
                  <h2>Second Party's Position</h2>
                </ion-text>
                <p>{{ twoPartyArgument.secondPartyPosition }}</p>

                <div class="vote-section">
                  <ion-button :color="userVote?.votedForParty1 === false ? 'success' : 'medium'"
                    @click="handleVote(false)" :disabled="isVoting">
                    <ion-icon :icon="thumbsUp" slot="start"></ion-icon>
                    Agree ({{ twoPartyArgument.party2Votes }})
                  </ion-button>
                </div>
              </div>
            </template>

            <!-- Single Proposal Argument Display -->
            <template v-if="argument.type === 'singleProposal' && singleProposalArgument">
              <div class="ion-margin-bottom">
                <ion-text color="primary">
                  <h2>Proposal</h2>
                </ion-text>
                <p>{{ singleProposalArgument.proposal }}</p>

                <div class="vote-section">
                  <ion-button :color="userVote?.votedFor ? 'success' : 'medium'" @click="handleVote(true)"
                    :disabled="isVoting" class="ion-margin-end">
                    <ion-icon :icon="thumbsUp" slot="start"></ion-icon>
                    Agree ({{ singleProposalArgument.votesFor }})
                  </ion-button>

                  <ion-button :color="userVote?.votedFor === false ? 'success' : 'medium'" @click="handleVote(false)"
                    :disabled="isVoting">
                    <ion-icon :icon="thumbsDown" slot="start"></ion-icon>
                    Disagree ({{ singleProposalArgument.votesAgainst }})
                  </ion-button>
                </div>
              </div>
            </template>

            <!-- Status and Metadata -->
            <div class="metadata ion-margin-top">
              <ion-chip>
                <ion-label>Status: {{ argument.status }}</ion-label>
              </ion-chip>
              <ion-note>
                Created: {{ new Date(argument.createdAt).toLocaleDateString() }}
              </ion-note>
            </div>
          </ion-card-content>
        </ion-card>
      </template>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { thumbsUp, thumbsDown } from 'ionicons/icons'
import type {
  Argument,
  TwoPartyArgument,
  SingleProposalArgument,
  Vote
} from '~/types'
import { useVotes } from '~/composables/useVotes'
import { useUser } from '~/composables/useUser'

const route = useRoute()
const { user } = useUser()
const { submitVote, getUserVote } = useVotes()

const argument = ref<Argument | null>(null)
const isLoading = ref(true)
const isVoting = ref(false)
const errorMessage = ref('')
const userVote = ref<Vote | null>(null)

// Computed properties for type-specific data
const twoPartyArgument = computed(() =>
  argument.value?.type === 'twoParty' ? argument.value as TwoPartyArgument : null
)

const singleProposalArgument = computed(() =>
  argument.value?.type === 'singleProposal' ? argument.value as SingleProposalArgument : null
)

// Load argument data
onMounted(async () => {
  try {
    const data = await $fetch<Argument>(`/api/arguments/${route.params.id}`)
    argument.value = data

    // Load user's vote if they're logged in
    if (user.value) {
      const vote = await getUserVote(data.id.toString())
      userVote.value = vote
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to load argument'
  } finally {
    isLoading.value = false
  }
})

// Handle voting
const handleVote = async (voteValue: boolean) => {
  if (!user.value) {
    errorMessage.value = 'Please log in to vote'
    return
  }

  if (isVoting.value) return

  isVoting.value = true
  try {
    const vote = await submitVote({
      argumentId: argument.value!.id.toString(),
      votedFor: argument.value?.type === 'singleProposal' ? voteValue : undefined,
      votedForParty1: argument.value?.type === 'twoParty' ? voteValue : undefined
    })

    userVote.value = vote

    // Refresh argument to get updated vote counts
    const updatedArgument = await $fetch<Argument>(`/api/arguments/${route.params.id}`)
    argument.value = updatedArgument
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to submit vote'
  } finally {
    isVoting.value = false
  }
}
</script>

<style scoped>
.vote-section {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.metadata {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>