// src/app/auth.service.ts
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

declare var google: any; // Declare google variable

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly GOOGLE_CLIENT_ID = '592807454995-slo26ong8f8ftbqg4sqo5gft9bri3jea.apps.googleusercontent.com'; // Replace with your Client ID

  private _user$ = new BehaviorSubject<any | null>(null);
  public user$ = this._user$.asObservable();

  constructor(private router: Router, private ngZone: NgZone) {}

  public initGoogleSignIn() {
    if (typeof window === 'undefined' || !window.document) {
      console.error('Window or document not available for Google Sign-In initialization.');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      google.accounts.id.initialize({
        client_id: this.GOOGLE_CLIENT_ID,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: true, // Set to true for One Tap sign-up/sign-in
        cancel_on_tap_outside: true, // Set to true to close One Tap if user clicks outside
      });
      // You can also render the button here if you have a designated element
      // google.accounts.id.renderButton(
      //   document.getElementById('google-button'), // Your button element's ID
      //   { theme: 'outline', size: 'large', type: 'standard' }
      // );
      google.accounts.id.prompt(); // Display the One Tap prompt
    };
    script.onerror = () => {
      console.error('Google Identity Services script failed to load.');
    };
    document.head.appendChild(script);
  }

  private handleCredentialResponse(response: any) {
    // The response object contains the ID token (response.credential)
    // Send this token to your backend for verification and to create a session/user record
    // For client-side only, you can decode it to get basic profile information (not recommended for secure actions)
    if (response.credential) {
      const idToken = response.credential;
      // Example: Decode JWT token (you might want a library for robust decoding)
      const payload = this.decodeJwt(idToken);

      this.ngZone.run(() => { // Run inside Angular zone for change detection
        this._user$.next(payload);
        // Navigate to a different route or update UI
        // this.router.navigate(['/dashboard']);
        console.log('User signed in:', payload);
      });
    } else {
      console.error('Google Sign-In failed:', response);
    }
  }

  // Basic JWT decoder (for demonstration only, use a library for production)
  private decodeJwt(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Error decoding JWT', e);
      return null;
    }
  }

  public signOut() {
    // For GIS, revoking the token or just clearing local state might be enough
    // depending on your session management strategy.
    // google.accounts.id.disableAutoSelect(); // Important for subsequent sign-ins
    // google.accounts.id.revoke(this._user$.value?.email, (done: any) => {
    //   this.ngZone.run(() => {
    //     this._user$.next(null);
    //     this.router.navigate(['/login']);
    //     console.log('User signed out');
    //   });
    // });
    // Simpler sign out by just clearing local state:
    this.ngZone.run(() => {
      this._user$.next(null);
      // Optionally, disable auto select for next time
      if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        google.accounts.id.disableAutoSelect();
      }
      this.router.navigate(['/login']); // Or your desired route after logout
      console.log('User signed out');
    });
  }

  public getUser() {
    return this._user$.value;
  }

  public isLoggedIn(): boolean {
    return !!this._user$.value;
  }
}