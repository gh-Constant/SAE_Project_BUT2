import { defineStore } from 'pinia';
import { ref } from 'vue';

import { userService } from '@/services/userService';

export const useUsersStore = defineStore('users', () => {
    const unverifiedUsers = ref([]);
    const allUsers = ref([]);

    const fetchUsers = async () => {
        const response = await userService.getUsers();
        const data = await response.json();
        
        // Mapping des données brutes (snake_case) vers le format attendu par la vue (camelCase)
        const mappedUsers = data.map((user: any) => ({
            ...user,
            name: `${user.firstname} ${user.lastname}`,
            isVerified: user.is_verified,
        }));

        allUsers.value = mappedUsers;
        unverifiedUsers.value = mappedUsers.filter((user: any) => !user.isVerified);
    };

    const verifyUser = async (userId: number) => {
        const response = await userService.verifyUser(userId);
        if (response.ok) {
            fetchUsers();
        }
    };

    const deleteUser = async (userId: number) => {
        const response = await userService.deleteUser(userId);
        if (response.ok) {
            fetchUsers();
        }
    };

    return {
        unverifiedUsers,
        allUsers,
        fetchUsers,
        verifyUser,
        deleteUser,
    };
});