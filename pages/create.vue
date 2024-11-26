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
      <ion-segment v-model="formData.type" class="ion-margin-bottom">
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
        <ion-input v-model="formData.topic" placeholder="What's the discussion about?" required></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Category</ion-label>
        <ion-select v-model="formData.category">
          <ion-select-option value="social">Social</ion-select-option>
          <ion-select-option value="work">Work</ion-select-option>
          <ion-select-option value="food">Food</ion-select-option>
          <ion-select-option value="relationships">Relationships</ion-select-option>
          <ion-select-option value="other">Other</ion-select-option>
        </ion-select>
      </ion-item>

      <!-- Two Party Fields -->
      <template v-if="formData.type === 'twoParty'">
        <ion-item>
          <ion-label position="stacked">Your Position</ion-label>
          <ion-textarea v-model="formData.firstPartyPosition" placeholder="State your case..." :counter="true"
            :maxlength="500" :rows="4" required></ion-textarea>
        </ion-item>
      </template>

      <!-- Single Proposal Fields -->
      <template v-if="formData.type === 'singleProposal'">
        <ion-item>
          <ion-label position="stacked">Your Proposal</ion-label>
          <ion-textarea v-model="formData.proposal" placeholder="What's your proposal?" :counter="true" :maxlength="500"
            :rows="4" required></ion-textarea>
        </ion-item>
      </template>

      <!-- Action Buttons -->
      <div class="ion-padding">
        <ion-button expand="block" @click="publishArgument" :disabled="!isValid || isSubmitting">
          <ion-spinner v-if="isSubmitting"></ion-spinner>
          <span v-else>
            {{ formData.type === 'twoParty' ? 'Create & Share Link' : 'Publish Proposal' }}
          </span>
        </ion-button>

        <ion-button expand="block" fill="outline" @click="saveDraft" class="ion-margin-top" :disabled="isSubmitting">
          Save as Draft
        </ion-button>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { save } from 'ionicons/icons'
import type { ArgumentType, ArgumentStatus } from '~/types'

interface FormData {
  type: ArgumentType
  topic: string
  category: string
  firstPartyPosition?: string
  proposal?: string
  status?: ArgumentStatus
}

// Form state
const formData = ref<FormData>({
  type: 'twoParty',
  topic: '',
  category: 'other',
  firstPartyPosition: '',
  proposal: ''
})

const isDraft = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

// Computed properties
const isValid = computed(() => {
  const hasCommonFields = formData.value.topic.trim() && formData.value.category

  if (formData.value.type === 'twoParty') {
    return hasCommonFields && formData.value.firstPartyPosition?.trim()
  }

  return hasCommonFields && formData.value.proposal?.trim()
})

// API interaction functions
const publishArgument = async () => {
  if (!isValid.value) return

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const payload = {
      ...formData.value,
      status: formData.value.type === 'twoParty' ? 'awaitingSecondParty' : 'published'
    }

    const response = await $fetch('/api/arguments', {
      method: 'POST',
      body: payload
    })

    if (!response || typeof response.id !== 'number') {
      throw new Error('Invalid response from server')
    }

    // Navigate based on argument type
    if (formData.value.type === 'twoParty') {
      // Using shareToken for sharing URL
      await navigateTo(`/argument/share/${response.shareToken}`)
    } else {
      await navigateTo('/')
    }
  } catch (error: any) {
    console.error('Error creating argument:', error)
    errorMessage.value = error.message || 'Failed to create argument. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

const saveDraft = async () => {
  if (!isValid.value) return

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const payload = {
      ...formData.value,
      status: 'draft' as const
    }

    await $fetch('/api/arguments', {
      method: 'POST',
      body: payload
    })

    isDraft.value = true
    await navigateTo('/drafts')
  } catch (error: any) {
    console.error('Error saving draft:', error)
    errorMessage.value = error.message || 'Failed to save draft. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
</template>