// pages/argument/share/[id].vue
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
      <template v-if="argument">
        <ion-card>
          <ion-card-header>
            <ion-card-title>{{ argument.topic }}</ion-card-title>
            <ion-card-subtitle>{{ argument.category }}</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <p class="ion-margin-bottom">Your position: {{ argument.firstPartyPosition }}</p>

            <ion-item>
              <ion-label position="stacked">Share Link</ion-label>
              <ion-input readonly :value="shareLink" class="ion-margin-bottom"></ion-input>
              <ion-button slot="end" @click="copyLink">
                <ion-icon :icon="copy" slot="start"></ion-icon>
                Copy
              </ion-button>
            </ion-item>

            <div class="ion-text-center ion-margin-top">
              <ion-note>Share this link with the person you want to debate with</ion-note>
            </div>
          </ion-card-content>
        </ion-card>
      </template>

      <ion-spinner v-else></ion-spinner>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { copy } from 'ionicons/icons';
import type { TwoPartyArgument } from '~/types';

const route = useRoute();
const argument = ref<TwoPartyArgument | null>(null);

// Get base URL for share link
const baseUrl = window.location.origin;
const shareLink = computed(() =>
  `${baseUrl}/argument/respond/${route.params.id}`
);

// Load argument data
onMounted(async () => {
  try {
    const data = await $fetch<TwoPartyArgument>(
      `/api/arguments/${route.params.id}`
    );
    argument.value = data;
  } catch (error) {
    console.error('Error loading argument:', error);
  }
});

// Copy link to clipboard
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value);
    // You might want to add a toast or notification here
  } catch (error) {
    console.error('Error copying link:', error);
  }
};
</script>