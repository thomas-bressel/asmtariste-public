import { Injectable, signal } from '@angular/core';
import { CookieData } from '../models/cookie.model';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  private readonly STORAGE_KEY = 'asmtariste_cookie_consent';
  
  
  public cookiesAccepted = signal<boolean | null>(null);

  constructor() {
    this.initialize();
  }


  /**
   * Initializes the cookie consent state from localStorage.
   */
  private initialize(): void {
    const consent = this.getConsent();
    if (consent) {
      this.cookiesAccepted.set(consent.accepted);
    }
  }





  /**
   * Retrieves the stored cookie consent data.
   * @returns The stored cookie consent data, or null if not found.
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
   * Sets the cookie consent data.
   * @param accepted - Whether the user has accepted cookies.
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
   * Increments the visit count and updates the last visit timestamp.
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
   * Clears the stored cookie consent data.
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
   * Checks if cookies have been accepted.
   * @returns True if cookies have been accepted, false otherwise.
   */
  public hasConsent(): boolean {
    return this.cookiesAccepted() === true;
  }
}