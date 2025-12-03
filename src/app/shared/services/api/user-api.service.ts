import { Injectable, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserPublicData } from '@models/user.model';
import { USER_API_URI } from '../../config-api';

@Injectable({
    providedIn: 'root'
})
export class UserApiService {
    private readonly authService = inject(AuthService);

    /**
     * Retrieves all articles from the server
     */
    public async getAllUsers(): Promise<UserPublicData[]> {
        const headers = new Headers({ 'Content-Type': 'application/json' });

        const response = await fetch(`${USER_API_URI}/user/v1/public/users`, {
            method: 'GET',
            headers
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const data = await response.json();
        console.log('\x1b[34m[API] getAllUsers() - data:\x1b[0m] ', data);
        return Array.isArray(data) ? data : [];
    }

}