export const goldMockService = {
  createCheckoutSession: async (userId: number, amountGold: number, priceInCents: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          url: `/client/gold-success?session_id=mock_session_${Date.now()}_${amountGold}`,
          sessionId: `mock_session_${Date.now()}_${amountGold}`
        });
      }, 500);
    });
  },

  fulfillPurchase: async (sessionId: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!sessionId.startsWith('mock_session_')) {
          reject(new Error('Invalid mock session'));
          return;
        }
        
        const parts = sessionId.split('_');
        const amountGold = parseInt(parts[parts.length - 1], 10);
        
        // Retrieve current user and update local storage mock
        try {
          const currentUserStr = localStorage.getItem('currentUser');
          if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            const currentUserId = currentUser.id_user || currentUser.id;
            
            currentUser.gold = (currentUser.gold || 0) + amountGold;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update users list if it exists
            const usersStr = localStorage.getItem('users');
            if (usersStr) {
              const users = JSON.parse(usersStr);
              const userIndex = users.findIndex((u: any) => (u.id_user || u.id) === currentUserId);
              if (userIndex !== -1) {
                users[userIndex].gold = currentUser.gold;
                localStorage.setItem('users', JSON.stringify(users));
              }
            }
            
            resolve({ success: true, user: currentUser });
            return;
          }
        } catch(e) {
          console.error('Mock error updating gold', e);
        }
        
        resolve({ success: true, user: { gold: amountGold } });
      }, 500);
    });
  },

  getBalance: async (userId: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const currentUserStr = localStorage.getItem('currentUser');
          if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            if ((currentUser.id_user || currentUser.id) === userId) {
              resolve({ gold: currentUser.gold || 0 });
              return;
            }
          }
          const usersStr = localStorage.getItem('users');
          if (usersStr) {
            const users = JSON.parse(usersStr);
            const user = users.find((u: any) => (u.id_user || u.id) === userId);
            if (user) {
              resolve({ gold: user.gold || 0 });
              return;
            }
          }
        } catch (e) {
          // ignore
        }
        resolve({ gold: 0 });
      }, 300);
    });
  }
};
