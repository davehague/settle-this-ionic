<!-- components/ArgumentCard.vue -->
<template>
  <TwoPartyCard v-if="argument.type === 'twoParty'" :argument="argument as TwoPartyArgument" />
  <SingleProposalCard v-else :argument="argument as SingleProposalArgument" />
</template>

<script setup lang="ts">
import type { Argument, TwoPartyArgument, SingleProposalArgument } from '~/types'

defineProps<{
  argument: Argument
}>()
</script>