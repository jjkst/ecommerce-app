import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private router = inject(Router);
  constructor(private authService: AuthService) {}

  async login() {
    const user = await this.authService.loginWithGoogle();
    console.log(user);
    this.router.navigate(['/']); 
  }

  async logout() {
    return await this.authService.logout();
  }
  
}
