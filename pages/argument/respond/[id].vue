<!-- pages/argument/respond/[id].vue -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Respond to Argument</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <template v-if="argument">
        <ion-card>
          <ion-card-header>
            <ion-card-title>{{ argument.topic }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <h3>Their Position:</h3>
            <p v-if="argument.type === 'twoParty'">{{ argument.firstPartyPosition }}</p>
            <p v-else>{{ argument.proposal }}</p>
          </ion-card-content>
        </ion-card>

        <form @submit.prevent="submitResponse">
          <ion-item>
            <ion-label position="stacked">Your Response</ion-label>
            <ion-textarea v-model="response" required placeholder="State your position..." :counter="true"
              :maxlength="500" :rows="4"></ion-textarea>
          </ion-item>

          <div class="ion-padding">
            <ion-button expand="block" type="submit">Submit Response</ion-button>
          </div>
        </form>
      </template>

      <ion-text color="danger" v-else>
        <p>Argument not found or already has a response</p>
      </ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const response = ref('')

const { data: argument } = await useFetch(`/api/arguments/${route.params.id}`)

const submitResponse = async () => {
  try {
    await $fetch(`/api/arguments/${route.params.id}`, {
      method: 'POST',
      body: {
        secondPartyPosition: response.value,
        status: 'active'
      }
    })
    router.push(`/argument/${route.params.id}`)
  } catch (error) {
    console.error('Error submitting response:', error)
  }
}
</script>