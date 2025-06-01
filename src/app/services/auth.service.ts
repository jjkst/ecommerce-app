import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private auth: Auth) { }

  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, new GoogleAuthProvider());
      this.userSubject.next(result.user);
      return result.user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error; 
    }
  }

  async logout() {
    this.userSubject.next(null);
    return await this.auth.signOut();
  }

}
