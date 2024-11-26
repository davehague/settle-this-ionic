// stores/arguments.ts
import { defineStore } from "pinia";
import type { Argument, ArgumentStatus } from "~/types";

interface ArgumentsState {
  arguments: Argument[];
  loading: boolean;
  lastFetch: {
    [key: string]: number; // timestamp of last fetch for each query type
  };
  cache: {
    [key: string]: Argument[]; // cached arguments for each query type
  };
}

export const useArgumentsStore = defineStore("arguments", {
  state: (): ArgumentsState => ({
    arguments: [],
    loading: false,
    lastFetch: {},
    cache: {},
  }),

  actions: {
    async fetchArguments(
      params: {
        status?: ArgumentStatus;
        createdById?: string;
        limit?: number;
        offset?: number;
      } = {}
    ) {
      // Create a cache key based on the params
      const cacheKey = JSON.stringify(params);
      const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

      // Check if we have valid cached data
      if (
        this.lastFetch[cacheKey] &&
        Date.now() - this.lastFetch[cacheKey] < CACHE_DURATION &&
        this.cache[cacheKey]
      ) {
        this.arguments = this.cache[cacheKey];
        return this.cache[cacheKey];
      }

      this.loading = true;

      try {
        const data = (await $fetch("/api/arguments", {
          params,
          method: "GET",
        })) as Argument[];

        // Update cache
        this.cache[cacheKey] = data;
        this.lastFetch[cacheKey] = Date.now();
        this.arguments = data;

        console.log("Fetched arguments:", data.length);
        return data;
      } catch (error) {
        console.error("Error fetching arguments:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearCache() {
      this.lastFetch = {};
      this.cache = {};
    },
  },

  getters: {
    getFilteredArguments: (state) => (viewMode: string, userId?: string) => {
      return state.arguments.filter((arg: Argument) => {
        if (!arg) return false;

        switch (viewMode) {
          case "published":
            return (
              arg.status === "published" ||
              (arg.status === "awaitingSecondParty" &&
                arg.createdById !== userId)
            );

          // case "voted":
          //   userVotes.some(vote => vote.argumentId === arg.id)
          case "my-arguments":
            return arg.createdById === userId;
          default:
            return false;
        }
      });
    },
  },
});