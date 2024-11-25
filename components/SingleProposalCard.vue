<!-- components/SingleProposalCard.vue -->
<template>
  <ion-card>
    <ion-card-header>
      <ion-card-subtitle>
        {{ formatDate(argument.createdAt) }}
        <ion-chip color="secondary" size="small">Single Proposal</ion-chip>
      </ion-card-subtitle>
      <ion-card-title>{{ argument.topic }}</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <div class="proposal-container">
        <h3>Proposal:</h3>
        <p class="proposal-text">{{ argument.proposal }}</p>

        <div class="vote-buttons" v-if="argument.status === 'active' && !hasVoted">
          <ion-button @click="vote('for')" color="success" size="small">
            <ion-icon :icon="thumbsUp" slot="start"></ion-icon>
            Agree
          </ion-button>

          <ion-button @click="vote('against')" color="danger" size="small">
            <ion-icon :icon="thumbsDown" slot="start"></ion-icon>
            Disagree
          </ion-button>
        </div>
      </div>

      <div class="results-section" v-if="argument.status === 'active' && hasVoted">
        <div class="vote-columns">
          <div class="vote-column for">
            <div class="vote-label">Agree</div>
            <div class="vote-bar">
              <div class="vote-fill"
                :style="{ height: `${getVotePercentage(argument.votesFor, argument.votesAgainst)}%` }"></div>
            </div>
            <div class="vote-number">{{ argument.votesFor }}</div>
          </div>

          <div class="vote-column against">
            <div class="vote-label">Disagree</div>
            <div class="vote-bar">
              <div class="vote-fill"
                :style="{ height: `${getVotePercentage(argument.votesAgainst, argument.votesFor)}%` }"></div>
            </div>
            <div class="vote-number">{{ argument.votesAgainst }}</div>
          </div>
        </div>
      </div>

      <ArgumentStatus :status="argument.status" />
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { thumbsUp, thumbsDown } from 'ionicons/icons'
import { useVotes } from '~/composables/useVotes'
import type { SingleProposalArgument } from '~/types'

const props = defineProps<{
  argument: SingleProposalArgument
}>()

const { hasVoted, submitVote } = useVotes(props.argument.id)

const vote = async (type: 'for' | 'against') => {
  await submitVote(type)
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
.proposal-container {
  padding: 1.5rem;
  background: var(--ion-color-light);
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.proposal-text {
  margin: 1rem 0;
  line-height: 1.5;
  white-space: pre-wrap;
}

.vote-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.results-section {
  margin-top: 1.5rem;
}

.vote-columns {
  display: flex;
  justify-content: space-around;
  gap: 2rem;
  height: 200px;
}

.vote-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.vote-label {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.vote-bar {
  width: 48px;
  height: 150px;
  background: var(--ion-color-light);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
}

.vote-bar .vote-fill {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: var(--ion-color-primary);
  transition: height 0.3s ease;
}

.for .vote-fill {
  background: var(--ion-color-success);
}

.against .vote-fill {
  background: var(--ion-color-danger);
}

.vote-number {
  margin-top: 0.5rem;
  font-weight: 500;
}
</style>