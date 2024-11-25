<!-- pages/create.vue -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Create Argument</ion-title>
        <ion-buttons slot="end" v-if="isDraft">
          <ion-button @click="saveDraft">
            <ion-icon :icon="save" slot="start"></ion-icon>
            Save Draft
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>



    <ion-content class="ion-padding">

      <ion-alert :is-open="!!errorMessage" :message="errorMessage" :buttons="['OK']"
        @didDismiss="errorMessage = ''"></ion-alert>

      <!-- Argument Type Selection -->
      <ion-segment v-model="argumentType" class="ion-margin-bottom">
        <ion-segment-button value="twoParty">
          <ion-label>Two Party Debate</ion-label>
        </ion-segment-button>
        <ion-segment-button value="singleProposal">
          <ion-label>Single Proposal</ion-label>
        </ion-segment-button>
      </ion-segment>

      <!-- Common Fields -->
      <ion-item>
        <ion-label position="stacked">Topic</ion-label>
        <ion-input v-model="topic" placeholder="What's the discussion about?" required></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Category</ion-label>
        <ion-select v-model="category">
          <ion-select-option value="social">Social</ion-select-option>
          <ion-select-option value="work">Work</ion-select-option>
          <ion-select-option value="food">Food</ion-select-option>
          <ion-select-option value="relationships">Relationships</ion-select-option>
          <ion-select-option value="other">Other</ion-select-option>
        </ion-select>
      </ion-item>

      <!-- Two Party Fields -->
      <template v-if="argumentType === 'twoParty'">
        <ion-item>
          <ion-label position="stacked">Your Position</ion-label>
          <ion-textarea v-model="firstPartyPosition" placeholder="State your case..." :counter="true" maxlength="500"
            rows="4" required></ion-textarea>
        </ion-item>
      </template>

      <!-- Single Proposal Fields -->
      <template v-if="argumentType === 'singleProposal'">
        <ion-item>
          <ion-label position="stacked">Your Proposal</ion-label>
          <ion-textarea v-model="proposal" placeholder="What's your proposal?" :counter="true" maxlength="500" rows="4"
            required></ion-textarea>
        </ion-item>
      </template>

      <!-- Action Buttons -->
      <div class="ion-padding">
        <ion-button expand="block" @click="publishArgument" :disabled="!isValid || isSubmitting">
          <ion-spinner v-if="isSubmitting"></ion-spinner>
          <span v-else>
            {{ argumentType === 'twoParty' ? 'Create & Share Link' : 'Publish Proposal' }}
          </span>
        </ion-button>

        <ion-button expand="block" fill="outline" @click="saveDraft" class="ion-margin-top">
          Save as Draft
        </ion-button>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { save } from 'ionicons/icons'
import type { ArgumentType } from '~/types'

const argumentType = ref<ArgumentType>('twoParty')
const topic = ref('')
const category = ref('other')
const firstPartyPosition = ref('')
const proposal = ref('')
const isDraft = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

const isValid = computed(() => {
  const hasCommonFields = topic.value.trim() && category.value

  if (argumentType.value === 'twoParty') {
    return hasCommonFields && firstPartyPosition.value.trim()
  }

  return hasCommonFields && proposal.value.trim()
})

const publishArgument = async () => {
  if (!isValid.value) return;

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    const data = await $fetch('/api/arguments', {
      method: 'POST',
      body: {
        type: argumentType.value,
        topic: topic.value,
        category: category.value,
        ...(argumentType.value === 'twoParty'
          ? { firstPartyPosition: firstPartyPosition.value, status: 'pending' }
          : { proposal: proposal.value, status: 'active' }
        )
      }
    });

    if (!data || typeof data.id !== 'number') {
      console.error('Invalid response:', data);
      throw new Error('Invalid response from server');
    }

    if (argumentType.value === 'twoParty') {
      await navigateTo(`/argument/share/${data.id}`); // Updated path
    } else {
      await navigateTo('/');
    }
  } catch (error: any) {
    console.error('Error creating argument:', error);
    errorMessage.value = error.message || 'Failed to create argument. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};

const saveDraft = async () => {
  // TODO: Implement draft saving
  isDraft.value = true
}
</script>