import { USERS, UserMock } from '@/mocks';

export const authMockService = {
  login(email : string, password : string) {
    return new Promise((resolve, reject) => {
      const user = USERS.find(u => u.email === email && u.password_hashed === password);
      if (user) resolve(user); // if resolved login return the user table
      else reject(new Error('Identifiants incorrects')); // if rejected login return error
    });
  },
  register(firstName: string, lastName: string, email: string, password: string, role: string) {
    return new Promise<UserMock>((resolve, reject) => {
      const existingUser = USERS.find(u => u.email === email);
      if (existingUser) {
        reject(new Error('Email already exists'));
        return;
      }
      // Mock registration - in real app, this would call API
      const newUser: UserMock = {
        id: USERS.length + 1,
        firstname: firstName,
        lastname: lastName,
        email,
        password_hashed: password, // In real app, hash this
        roleId: role === 'adventurer' ? 2 : 1, // Assuming IDs from roles
        role: { id: role === 'adventurer' ? 2 : 1, name: role },
        is_active: true,
        is_verified: false,
        xp: 0,
        level: 1,
      };
      USERS.push(newUser);
      resolve(newUser);
    });
  },
}