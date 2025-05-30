import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user: any;

  constructor(private authService: AuthService) {}

  async login() {
    try {
      const user = await this.authService.loginWithGoogle();
      this.user = user;
      console.log(user);
    }
    catch (error) {
      console.error("Login failed:", error);
    }
  }

  logout() {
    this.user = null;
    return this.authService.logout();
  }

}
