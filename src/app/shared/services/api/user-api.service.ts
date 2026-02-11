import { Injectable, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserPublicData } from '@models/user.model';
import { USER_API_URI, PROJECT_ID } from '../../config-api';

/**
 * User API Service for HTTP Operations
 *
 * This service handles all HTTP requests related to user data.
 * It provides access to public user information from the user API.
 *
 * Features:
 * - Retrieve all users with public profile data
 * - Public endpoints (no authentication required)
 * - Returns sanitized user information
 */
@Injectable({
    providedIn: 'root'
})
export class UserApiService {
    private readonly authService = inject(AuthService);

    /**
     * Retrieves all users with their public profile information from the server
     * Makes HTTP GET request to public users endpoint
     * @returns {Promise<UserPublicData[]>} Promise resolving to array of public user data objects
     * @throws {Error} Throws error if HTTP request fails
     */
    public async getAllUsers(): Promise<UserPublicData[]> {
        const headers = new Headers({ 
      'Content-Type': 'application/json',
      'X-Project-ID': PROJECT_ID 
    });

        const response = await fetch(`${USER_API_URI}/user/v1/public/users`, {
            method: 'GET',
            headers
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const data = await response.json();
        // console.log('\x1b[34m[API] getAllUsers() - data:\x1b[0m] ', data);
        return Array.isArray(data) ? data : [];
    }

}