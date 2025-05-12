import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  constructor(private cartService: ShoppingCartService) {}

  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  get cartItemCount(): number {
    return this.cartService.getItems().length;
  }
}