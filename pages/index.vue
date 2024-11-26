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
import { ref, computed, onMounted } from 'vue'
import { add } from 'ionicons/icons'
import { useArguments } from '~/composables/useArguments'
import { useVotes } from '~/composables/useVotes'
import type { Argument } from '~/types'
import { useUser } from '~/composables/useUser'

type ViewMode = 'published' | 'voted' | 'my-arguments'

// Current user from auth store (you'll need to implement this)
const { user, isLoggedIn } = useUser()  // user is already the ref

const viewMode = ref<ViewMode>('published')
const { argumentsList, loading, fetchMore } = useArguments()
const { getVoteStatus, clearVotes } = useVotes()

const filteredArguments = computed(() => {
  if (!argumentsList.value) return []

  return argumentsList.value.filter((argument: Argument) => {
    switch (viewMode.value) {
      case 'published':
        return argument.status === 'published' && !getVoteStatus(argument.id.toString())
      case 'voted':
        return getVoteStatus(argument.id.toString())
      case 'my-arguments':
        return argument.createdById === user.value?.id
      default:
        return false
    }
  })
})

const loadMore = async (event: CustomEvent) => {
  await fetchMore()
  if (event.target) {
    (event.target as HTMLIonInfiniteScrollElement).complete()
  }
}

onMounted(() => {
  // Clear local vote cache on component mount
  clearVotes()
})
</script>

