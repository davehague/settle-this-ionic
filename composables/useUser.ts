// composables/useUser.ts
import { ref } from "vue";

interface User {
  id: string; // UUID format
  email: string;
  name: string;
  pictureUrl?: string;
}

// Mock user data
const mockUser: User = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  email: "test@example.com",
  name: "Test User",
  pictureUrl: "https://example.com/avatar.jpg",
};

// Create a global state
const currentUser = ref<User | null>(mockUser);

export function useUser() {
  // Mock login/logout functions
  const login = () => {
    currentUser.value = mockUser;
  };

  const logout = () => {
    currentUser.value = null;
  };

  const isLoggedIn = computed(() => currentUser.value !== null);

  return {
    user: currentUser,
    login,
    logout,
    isLoggedIn,
  };
}
