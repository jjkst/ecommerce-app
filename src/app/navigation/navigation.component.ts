import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive, NgClass, NgIf],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  isMenuOpen = false;
  isLoggedIn = false;

  constructor(private authService: AuthService, private cartService: ShoppingCartService) {
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user; // Update login status
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  logout() {
    this.authService.logout();
  }

  get cartItemCount(): number {
    return this.cartService.getItems().length;
  }
}