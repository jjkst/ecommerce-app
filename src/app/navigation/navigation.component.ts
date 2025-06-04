import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { UserRole } from '../models/user.model';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive, NgClass, NgIf],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  isMenuOpen = false;
  isSubMenuOpen = false;
  isLoggedIn = false;
  isAdmin = false;
  isOwner = false;

  constructor(private authService: AuthService, private cartService: ShoppingCartService) {
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === UserRole.Admin;
      this.isOwner = user?.role === UserRole.Owner;
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleSubMenu(): void {
    this.isSubMenuOpen = !this.isSubMenuOpen; 
  }


  closeMenu(): void {
    this.isMenuOpen = false;
    this.isSubMenuOpen = false; 
  }

  logout() {
    this.authService.logout();
  }

  get cartItemCount(): number {
    return this.cartService.getItems().length;
  }
}