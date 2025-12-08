import { USERS, UserMock } from "@/mocks/users";

// Shared mutable state for users in mock mode
// This ensures that changes made in one service (e.g., Admin) are reflected in others (e.g., Auth)
export const mockUsers: UserMock[] = [...USERS];
