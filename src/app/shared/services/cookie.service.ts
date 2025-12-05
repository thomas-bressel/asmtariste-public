import { Injectable, signal } from '@angular/core';
import { CookieData } from '../models/cookie.model';

/**
 * COOKIE SERVICE - Cookie Consent Management
 *
 * Manages user cookie consent preferences and visitor tracking.
 * Handles consent state, visit counting, and localStorage persistence.
 */
@Injectable({
  providedIn: 'root'
})
export class CookieService {
  /** LocalStorage key for storing cookie consent data */
  private readonly STORAGE_KEY = 'asmtariste_cookie_consent';

  /** Signal containing the cookie acceptance state (true, false, or null if not set) */
  public cookiesAccepted = signal<boolean | null>(null);

  constructor() {
    this.initialize();
  }

  /**
   * Initializes the cookie consent state from localStorage
   * Called automatically on service construction
   * Loads existing consent data and updates the signal
   */
  private initialize(): void {
    const consent = this.getConsent();
    if (consent) {
      this.cookiesAccepted.set(consent.accepted);
    }
  }





  /**
   * Retrieves the stored cookie consent data from localStorage
   * Includes visit count, timestamps, and acceptance status
   * @returns The stored cookie consent data, or null if not found or on error
   */
  public getConsent(): CookieData | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading cookie consent:', error);
      return null;
    }
  }






  /**
   * Sets the cookie consent data and saves to localStorage
   * Increments visit count, updates timestamps, and stores user language
   * Updates the cookiesAccepted signal
   * @param accepted - Whether the user has accepted cookies
   */
  public setConsent(accepted: boolean): void {
    const language = navigator.language || 'fr-FR';
    const existingData = this.getConsent();

    const cookieData: CookieData = {
      accepted,
      language,
      totalVisits: (existingData?.totalVisits || 0) + 1,
      firstVisit: existingData?.firstVisit || new Date().toISOString(),
      lastVisit: new Date().toISOString()
    };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cookieData));
      this.cookiesAccepted.set(accepted);
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  }



  /**
   * Increments the visit count and updates the last visit timestamp
   * Only updates if cookies have been accepted
   * Used to track returning visitors
   */
  public incrementVisit(): void {
    const consent = this.getConsent();
    if (consent && consent.accepted) {
      const updatedData: CookieData = {
        ...consent,
        totalVisits: consent.totalVisits + 1,
        lastVisit: new Date().toISOString()
      };

      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedData));
      } catch (error) {
        console.error('Error incrementing visit:', error);
      }
    }
  }

  /**
   * Clears the stored cookie consent data from localStorage
   * Resets the cookiesAccepted signal to null
   * Used when user wants to reset their cookie preferences
   */
  public clearConsent(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      this.cookiesAccepted.set(null);
    } catch (error) {
      console.error('Error clearing cookie consent:', error);
    }
  }

  /**
   * Checks if cookies have been accepted by the user
   * @returns True if cookies have been accepted, false otherwise
   */
  public hasConsent(): boolean {
    return this.cookiesAccepted() === true;
  }
}