import { Injectable, inject } from '@angular/core';
import { UserApiService } from '@services/api/user-api.service';
import { UserStore } from '@services/store/user-store.service';
import { UserPublicData } from '@models/user.model';

/**
 * USER FACADE SERVICE - Orchestration Layer
 *
 * Orchestrates user-related operations by coordinating between API and store services.
 * Provides a unified interface for components to manage user data.
 */
@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly api = inject(UserApiService);
    private readonly store = inject(UserStore);

    /** Signal containing all users */
    readonly users = this.store.users;
    /** Signal indicating if users are being loaded */
    readonly loading = this.store.loading;
    /** Signal containing any error message */
    readonly error = this.store.error;
    /** Signal containing the total count of users */
    readonly usersCount = this.store.usersCount;

    /**
     * Loads all users from the API and updates the store
     * Sets loading state and handles errors appropriately
     * @returns Promise that resolves when users are loaded
     */
    public async loadUsers(): Promise<void> {
        try {
            this.store.setLoading(true);
            this.store.setError(null);

            const users: UserPublicData[] = await this.api.getAllUsers();
            // console.log('[SERVICE] - loadUsers() ', users);

            this.store.setUsers(users);
        } catch (error) {
            const message = 'Error loading users';
            console.error(message, error);
            this.store.setError(message);
        } finally {
            this.store.setLoading(false);
        }
    }

}