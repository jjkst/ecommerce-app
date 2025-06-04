import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User, UserRole, ProviderList } from '../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private router = inject(Router);

  constructor(private authService: AuthService, private userService: UserService) {}
  /**
   * Initiates the login process using Google authentication.
   * After successful login, it sends user data to the backend API
   * and navigates to the home page.
   */
  async loginWithGoogle() {
    let user: any; 

    try {
      user = await this.authService.loginWithGoogle();
      console.log("Successfully logged in!!!");
    }
    catch (error) {
      console.error('Login failed:', error);
      return;
    }
    
    const userData: User = {
      displayname: user.displayName,
      email: user.email,
      emailVerified: user.emailVerified,
      uid: user.uid,
      provider: ProviderList.Google, 
      role: UserRole.Subscriber 
    };

    try {
      const users: User[] = await this.userService.getUsers();
      
      // Navigate to home page
      this.router.navigate(['/']);

      // Check if user already exists
      const existingUser = users.find(u => u.uid === userData.uid);
      if (existingUser) {
        console.log('User already exists!');
        this.authService.userSubject.next(existingUser);
        this.router.navigate(['/']);
        return;
      }

      // Call user POST API after successful login
      await this.userService.addUser(userData);
      console.log('User data sent to API successfully.');


    } catch (error) {
      console.error('Error during login or API call:', error);
    }
  }

  async logout() {
    return await this.authService.logout();
  }
  
}
