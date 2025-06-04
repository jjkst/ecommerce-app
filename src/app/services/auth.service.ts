import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { ProviderList, User, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private auth: Auth) { }

  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, new GoogleAuthProvider());
      const user: User = {
        displayname: result.user.displayName,
        email: result.user.email,
        emailVerified: result.user.emailVerified,
        uid: result.user.uid,
        role: UserRole.Subscriber, 
        provider: ProviderList.Google
      };

      this.userSubject.next(user);
      return user;
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
