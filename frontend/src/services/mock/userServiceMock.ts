import { USERS, UserMock } from "@/mocks/users";

// État local pour simuler la persistance (rechargé à chaque refresh de page)
let localUsers: UserMock[] = [...USERS];

export const userServiceMock = {
  getUsers: async (): Promise<Response> => {
    return new Response(JSON.stringify(localUsers), { status: 200, headers: { 'Content-Type': 'application/json' } });
  },

  verifyUser: async (userId: number): Promise<Response> => {
    const userIndex = localUsers.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      // Simuler la mise à jour
      localUsers[userIndex].is_verified = true;
      return new Response(JSON.stringify({ message: `User ${userId} verified successfully.` }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    
    return new Response(JSON.stringify({ message: `User ${userId} not found.` }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  },

  deleteUser: async (userId: number): Promise<Response> => {
    const initialLength = localUsers.length;
    localUsers = localUsers.filter(u => u.id !== userId);
    
    if (localUsers.length < initialLength) {
      return new Response(JSON.stringify({ message: `User ${userId} deleted successfully.` }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    
    return new Response(JSON.stringify({ message: `User ${userId} not found.` }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  },
};
