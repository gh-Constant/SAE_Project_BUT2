import { USERS } from '@/mocks';

export const apiService = {
  login(email : string, password : string) {
    return new Promise((resolve, reject) => {
      const user = USERS.find(u => u.email === email && u.password_hashed === password);
      if (user) resolve(user); // if resolved login return the user table
      else reject(new Error('Identifiants incorrects')); // if rejected login return error
    });
  },
}