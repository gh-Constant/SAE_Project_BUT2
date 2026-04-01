
import { mockUsers } from "./sharedMockData";
import { Role } from "@/mocks/users";

const getRankedUsers = () =>
  mockUsers
    .filter((user) => user.role === Role.AVENTURIER_ROLE_ID)
    .sort((a, b) => {
      if (b.level !== a.level) {
        return b.level - a.level;
      }
      return b.xp - a.xp;
    });


// Helper to calculate rank based on current mockUsers state
// Moved here because Rank calculation is a User domain logic
export const calculateUserRank = (userId: number): number => {
  const sortedUsers = getRankedUsers();
  const rankIndex = sortedUsers.findIndex((u) => u.id === userId);

  if (rankIndex === -1) {
    throw new Error(`User ${userId} is not ranked.`);
  }

  return rankIndex + 1;
};

export const userServiceMock = {
  getUsers: async (): Promise<any> => {
    return mockUsers.filter(user => user.role !== 'admin');
  },

  verifyUser: async (userId: number): Promise<any> => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      mockUsers[userIndex].is_verified = true;
      return { message: `User ${userId} verified successfully.` };
    }
    throw new Error(`User ${userId} not found.`);
  },

  deleteUser: async (userId: number): Promise<any> => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
       mockUsers.splice(userIndex, 1);
       return { message: `User ${userId} deleted successfully.` };
    }
    throw new Error(`User ${userId} not found.`);
  },

  getUserRank: async (userId: number): Promise<any> => {
    const user = mockUsers.find((u) => u.id === userId);
    
    if (user) {
      if (user.role !== Role.AVENTURIER_ROLE_ID) {
        throw new Error('Only adventurers are ranked.');
      }

      const rank = calculateUserRank(userId);
      return { rank };
    }
    throw new Error(`User ${userId} not found.`);
  },

  getLeaderboard: async (page = 1, limit = 10): Promise<any> => {
    const sortedUsers = getRankedUsers();

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedUsers = sortedUsers.slice(start, end).map((user, index) => ({
      ...user,
      rank: start + index + 1
    }));

    return {
      users: paginatedUsers,
      total: sortedUsers.length,
      page,
      limit
    };
  },
};
