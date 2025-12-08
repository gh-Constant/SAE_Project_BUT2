import { UserMock } from "@/mocks/users";
import { mockUsers } from "./sharedMockData";

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
};
