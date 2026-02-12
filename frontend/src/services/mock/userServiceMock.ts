
import { mockUsers } from "./sharedMockData";


// Helper to calculate rank based on current mockUsers state
// Moved here because Rank calculation is a User domain logic
export const calculateUserRank = (userId: number): number => {
  const sortedUsers = [...mockUsers].sort((a, b) => {
    if (b.level !== a.level) {
      return b.level - a.level;
    }
    return b.xp - a.xp;
  });
  return sortedUsers.findIndex(u => u.id === userId) + 1;
};

export const userServiceMock = {
  getUsers: async (): Promise<Response> => {
    return new Response(JSON.stringify(mockUsers), { status: 200, headers: { 'Content-Type': 'application/json' } });
  },

  verifyUser: async (userId: number): Promise<Response> => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      // Simuler la mise à jour
      mockUsers[userIndex].is_verified = true;
      return new Response(JSON.stringify({ message: `User ${userId} verified successfully.` }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    
    return new Response(JSON.stringify({ message: `User ${userId} not found.` }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  },

  deleteUser: async (userId: number): Promise<Response> => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
       mockUsers.splice(userIndex, 1);
       return new Response(JSON.stringify({ message: `User ${userId} deleted successfully.` }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    
    return new Response(JSON.stringify({ message: `User ${userId} not found.` }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  },

  getUserRank: async (userId: number): Promise<Response> => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      const rank = calculateUserRank(userId);
      return new Response(JSON.stringify({ rank }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    
    return new Response(JSON.stringify({ message: `User ${userId} not found.` }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  },

  getLeaderboard: async (page = 1, limit = 10): Promise<Response> => {
    const sortedUsers = [...mockUsers].sort((a, b) => {
      if (b.level !== a.level) {
        return b.level - a.level;
      }
      return b.xp - a.xp;
    });

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedUsers = sortedUsers.slice(start, end).map((user, index) => ({
      ...user,
      rank: start + index + 1
    }));

    return new Response(JSON.stringify({
      users: paginatedUsers,
      total: sortedUsers.length,
      page,
      limit
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  },
};
