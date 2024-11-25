<!-- pages/index.vue -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settle This</ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/create">
            <ion-icon :icon="add" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <ion-toolbar>
        <ion-segment v-model="viewMode">
          <ion-segment-button value="active">
            <ion-label>To Vote</ion-label>
          </ion-segment-button>
          <ion-segment-button value="voted">
            <ion-label>Voted</ion-label>
          </ion-segment-button>
          <ion-segment-button value="mine">
            <ion-label>My Arguments</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div v-if="loading" class="ion-padding ion-text-center">
        <ion-spinner></ion-spinner>
      </div>

      <template v-else>
        <ion-list v-if="filteredArguments.length > 0">
          <ion-item v-for="item in filteredArguments" :key="item.id">
            <ArgumentCard :argument="item" />
          </ion-item>
        </ion-list>

        <div v-else class="ion-padding ion-text-center">
          <ion-text color="medium">
            <template v-if="viewMode === 'active'">
              No arguments to vote on
            </template>
            <template v-else-if="viewMode === 'voted'">
              You haven't voted on any arguments yet
            </template>
            <template v-else>
              You haven't created any arguments yet
            </template>
          </ion-text>
        </div>

        <ion-infinite-scroll @ionInfinite="loadMore">
          <ion-infinite-scroll-content></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </template>
    </ion-content>

    <ion-fab slot="fixed" vertical="bottom" horizontal="end">
      <ion-fab-button router-link="/create">
        <ion-icon :icon="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { add } from 'ionicons/icons'
import { useArguments } from '~/composables/useArguments'
import { useVotes } from '~/composables/useVotes'

const viewMode = ref('active')
const { argumentsList, loading, fetchMore } = useArguments()
const { getVoteStatus } = useVotes()

const filteredArguments = computed(() => {
  if (!argumentsList.value) return []

  switch (viewMode.value) {
    case 'active':
      return argumentsList.value.filter(arg => !getVoteStatus(arg.id))
    case 'voted':
      return argumentsList.value.filter(arg => getVoteStatus(arg.id))
    case 'mine':
      return argumentsList.value.filter(arg => isUserArgument(arg.id))
    default:
      return []
  }
})

// Mock function - replace with actual user check
const isUserArgument = (id: string) => {
  // TODO: Implement actual check against user ID
  return false
}

const loadMore = async (event: any) => {
  await fetchMore()
  event.target.complete()
}
</script>