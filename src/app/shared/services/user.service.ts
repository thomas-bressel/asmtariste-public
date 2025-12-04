import { Injectable, inject } from '@angular/core';
import { UserApiService } from '@services/api/user-api.service';
import { UserStore } from '@services/store/user-store.service';
import { UserPublicData } from '@models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly api = inject(UserApiService);
    private readonly store = inject(UserStore);

    readonly users = this.store.users;
    readonly loading = this.store.loading;
    readonly error = this.store.error;
    readonly usersCount = this.store.usersCount;

    /**
     * Loads all articles from API and updates the store
     */
    public async loadUsers(): Promise<void> {
        try {
            this.store.setLoading(true);
            this.store.setError(null);

            const users: UserPublicData[] = await this.api.getAllUsers();
            // console.log('[SERVICE] - loadUsers() ', users);

            this.store.setUsers(users);
        } catch (error) {
            const message = 'Erreur lors du chargement des utilisateurs';
            console.error(message, error);
            this.store.setError(message);
        } finally {
            this.store.setLoading(false);
        }
    }

}