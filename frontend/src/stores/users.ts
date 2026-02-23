import { defineStore } from 'pinia';
import { ref } from 'vue';

import { userService } from '@/services/userService';

// Interface pour les utilisateurs mappés
interface MappedUser {
    id: number;
    id_user?: number;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    is_verified: boolean;
    name: string;
    isVerified: boolean;
}

// Interface pour les données brutes de l'API


export const useUsersStore = defineStore('users', () => {
    const unverifiedUsers = ref<MappedUser[]>([]);
    const allUsers = ref<MappedUser[]>([]);

    const fetchUsers = async () => {
        const data = await userService.getUsers();

        // Mapping des données brutes (snake_case) vers le format attendu par la vue (camelCase)
        const mappedUsers = data.map((user: any) => ({
            ...user,
            id: user.id || user.id_user,
            name: `${user.firstname} ${user.lastname}`,
            isVerified: user.is_verified,
        }));

        allUsers.value = mappedUsers;
        unverifiedUsers.value = mappedUsers.filter((user: MappedUser) => !user.isVerified);
    };

    const verifyUser = async (userId: number) => {
        try {
            await userService.verifyUser(userId);
            fetchUsers();
        } catch (e) {
            console.error(e);
        }
    };

    const deleteUser = async (userId: number) => {
        try {
            await userService.deleteUser(userId);
            fetchUsers();
        } catch (e) {
            console.error(e);
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