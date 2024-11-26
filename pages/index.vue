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
          <ion-segment-button value="published">
            <ion-label>To Vote</ion-label>
          </ion-segment-button>
          <ion-segment-button value="voted">
            <ion-label>Voted</ion-label>
          </ion-segment-button>
          <ion-segment-button value="my-arguments">
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
          <ion-item v-for="argument in filteredArguments" :key="argument.id">
            <ArgumentCard :argument="argument" />
          </ion-item>
        </ion-list>

        <div v-else class="ion-padding ion-text-center">
          <ion-text color="medium">
            <template v-if="viewMode === 'published'">
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
import { ref, computed, onMounted, watch } from 'vue'
import { add } from 'ionicons/icons'
import { useArguments } from '~/composables/useArguments'
import { useVotes } from '~/composables/useVotes'
import { useUser } from '~/composables/useUser'
import { useArgumentsStore } from '~/stores/arguments'


type ViewMode = 'published' | 'voted' | 'my-arguments'

const argumentsStore = useArgumentsStore()
const viewMode = ref<ViewMode>('published')
const { user } = useUser()

const { args: argumentsList, loading, fetchArguments, fetchMore } = useArguments()
const { getVoteStatus, clearVotes } = useVotes()
import type { Argument, ArgumentStatus } from '~/types'

const getFilteredArguments = (viewMode: 'published' | 'voted' | 'my-arguments', userId?: string) => {
  switch (viewMode) {
    case 'published':
      return argumentsList.value.filter(arg =>
        arg.status === 'published' ||
        (arg.status === 'awaitingSecondParty' && arg.createdById !== userId)
      )

    // case 'voted':
    //   return argumentsList.value.filter(arg => 
    //     userVotes.some(vote => vote.argumentId === arg.id)
    //   )

    case 'my-arguments':
      return argumentsList.value.filter(arg =>
        arg.createdById === userId
      )

    default:
      return []
  }
}

const filteredArguments = computed(() => {
  return argumentsStore.getFilteredArguments(viewMode.value, user.value?.id)
    .filter(arg => !getVoteStatus(arg.id.toString()))
})

const loadMore = async (event: CustomEvent) => {
  await fetchMore()
  if (event.target) {
    (event.target as HTMLIonInfiniteScrollElement).complete()
  }
}

watch(viewMode, async (newMode) => {
  const params = newMode === 'my-arguments'
    ? { createdById: user.value?.id }
    : { status: 'published' as ArgumentStatus }

  await argumentsStore.fetchArguments(params)
})

onMounted(async () => {
  await argumentsStore.fetchArguments()
})
</script>

