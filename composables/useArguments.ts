// composables/useArguments.ts
import { ref, computed } from "vue";
import type { Argument } from "~/types";

export function useArguments() {
  const args = ref<Argument[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const page = ref(0);
  const hasMore = ref(true);

  async function fetchArguments(params?: {
    status?: string;
    createdById?: string;
    limit?: number;
    offset?: number;
  }) {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<Argument[]>("/api/arguments", {
        params: {
          ...params,
          limit: 10,
          offset: page.value * 10,
        },
      });

      if (page.value === 0) {
        args.value = result;
      } else {
        args.value.push(...result);
      }

      hasMore.value = result.length === 10;
    } catch (e: any) {
      error.value = e.message;
      console.error("Error fetching arguments:", e);
    } finally {
      loading.value = false;
    }
  }

  async function createArgument(data: any) {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<Argument>("/api/arguments", {
        method: "POST",
        body: data,
      });

      console.log("Response from server in createArgument:", response);

      // Add the new argument to the list if we have one
      if (args.value.length > 0) {
        args.value.unshift(response);
      }

      console.log("Returning from createArgument:", response);
      return response;
    } catch (e: any) {
      error.value = e.statusMessage || e.message || "Failed to create argument";
      console.error("Error creating argument:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchMore() {
    if (!hasMore.value || loading.value) return;
    page.value++;
    await fetchArguments();
  }

  return {
    args,
    loading,
    error,
    hasMore,
    fetchArguments,
    createArgument,
    fetchMore,
  };
}