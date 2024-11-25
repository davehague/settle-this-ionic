<!-- components/TwoPartyCard.vue -->
<template>
  <ion-card>
    <ion-card-header>
      <ion-card-subtitle>
        {{ formatDate(argument.createdAt) }}
        <ion-chip color="primary" size="small">Two Party</ion-chip>
      </ion-card-subtitle>
      <ion-card-title>{{ argument.topic }}</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <!-- First Position -->
      <div class="position-container">
        <ion-text color="medium" class="position-label">Position {{ randomizePositions ? 2 : 1 }}</ion-text>
        <p class="position-text">{{ randomizePositions ? argument.secondPartyPosition || 'Waiting for response...' :
          argument.firstPartyPosition }}</p>
        <ion-button v-if="argument.status === 'active' && !hasVoted" @click="vote(randomizePositions ? 2 : 1)"
          color="primary" size="small" class="vote-button">
          Vote for this position
        </ion-button>
      </div>

      <div class="divider">
        <ion-text color="medium">VS</ion-text>
      </div>

      <!-- Second Position -->
      <div class="position-container">
        <ion-text color="medium" class="position-label">Position {{ randomizePositions ? 1 : 2 }}</ion-text>
        <p class="position-text">{{ randomizePositions ? argument.firstPartyPosition : argument.secondPartyPosition ||
          'Waiting for response...' }}</p>
        <ion-button
          v-if="argument.status === 'active' && !hasVoted && (randomizePositions ? true : argument.secondPartyPosition)"
          @click="vote(randomizePositions ? 1 : 2)" color="primary" size="small" class="vote-button">
          Vote for this position
        </ion-button>
      </div>

      <div class="results-section" v-if="argument.status === 'active' && hasVoted">
        <div class="vote-bar">
          <div class="vote-fill party1"
            :style="{ width: `${getVotePercentage(argument.party1Votes, argument.party2Votes)}%` }"></div>
          <div class="vote-numbers">
            <span>{{ argument.party1Votes }}</span>
            <span>{{ argument.party2Votes }}</span>
          </div>
        </div>
      </div>

      <ArgumentStatus :status="argument.status" />
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVotes } from '~/composables/useVotes'
import type { TwoPartyArgument } from '~/types'

const props = defineProps<{
  argument: TwoPartyArgument
}>()

const { hasVoted, submitVote } = useVotes(props.argument.id)
const randomizePositions = ref(false)

onMounted(() => {
  randomizePositions.value = Math.random() > 0.5
})

const vote = async (party: 1 | 2) => {
  await submitVote(party)
}

const getVotePercentage = (votes1: number, votes2: number) => {
  const total = votes1 + votes2
  if (total === 0) return 50
  return (votes1 / total) * 100
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}
</script>

<style scoped>
.results-section {
  margin-top: 1.5rem;
  padding-top: 1rem;
}

.vote-bar {
  height: 24px;
  background: var(--ion-color-light);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.vote-fill {
  height: 100%;
  background: var(--ion-color-primary);
  transition: width 0.3s ease;
}

.vote-numbers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  color: var(--ion-color-dark);
  font-weight: 500;
}
</style>