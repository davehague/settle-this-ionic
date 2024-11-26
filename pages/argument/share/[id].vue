<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Share Argument</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-alert :is-open="!!errorMessage" :message="errorMessage" :buttons="['OK']"
        @didDismiss="errorMessage = ''"></ion-alert>

      <template v-if="argument && twoPartyData">
        <ion-card>
          <ion-card-header>
            <ion-card-title>{{ argument.topic }}</ion-card-title>
            <ion-card-subtitle>{{ argument.category }}</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <p class="ion-margin-bottom">First Party's Position: {{ twoPartyData.firstPartyPosition }}</p>

            <ion-item>
              <ion-label position="stacked">Share Link</ion-label>
              <ion-input readonly :value="shareLink" class="ion-margin-bottom"></ion-input>
              <ion-button slot="end" @click="copyLink">
                <ion-icon :icon="copyIcon" slot="start"></ion-icon>
                Copy
              </ion-button>
            </ion-item>

            <div class="ion-text-center ion-margin-top">
              <ion-note>Share this link with the person you want to debate with</ion-note>
            </div>
          </ion-card-content>
        </ion-card>
      </template>

      <div v-else-if="isLoading" class="ion-text-center">
        <ion-spinner></ion-spinner>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { copy as copyIcon } from 'ionicons/icons'
import type { BaseArgument } from '~/types'

const route = useRoute()
const isLoading = ref(true)
const errorMessage = ref('')
const argument = ref<BaseArgument | null>(null)
const twoPartyData = ref<{ firstPartyPosition: string } | null>(null)

// Get base URL for share link
const baseUrl = window.location.origin
const shareLink = computed(() =>
  argument.value?.shareToken
    ? `${baseUrl}/argument/share/${argument.value.shareToken}`
    : ''
)

// Load argument data
onMounted(async () => {
  try {
    const response = await $fetch<{
      argument: BaseArgument,
      twoPartyArgument: { firstPartyPosition: string }
    }>(`/api/arguments/share/${route.params.id}`)

    argument.value = response.argument
    twoPartyData.value = response.twoPartyArgument
  } catch (error: any) {
    console.error('Error loading argument:', error)
    errorMessage.value = error.message || 'Failed to load argument'
  } finally {
    isLoading.value = false
  }
})

// Copy link to clipboard
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value)
    // TODO: Add toast notification for successful copy
  } catch (error) {
    errorMessage.value = 'Failed to copy link to clipboard'
  }
}
</script>