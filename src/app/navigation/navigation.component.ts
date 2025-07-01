import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { UserRole } from '../models/user.model';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isSubMenuOpen = false;
  isLoggedIn = false;
  isAdmin = false;
  isOwner = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService, 
    private cartService: ShoppingCartService
  ) {}

  ngOnInit(): void {
    this.setupAuthSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupAuthSubscription(): void {
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.isLoggedIn = !!user;
          this.isAdmin = user?.Role === UserRole.Admin;
          this.isOwner = user?.Role === UserRole.Owner;
        },
        error: (error) => {
          console.error('Error in auth subscription:', error);
          this.isLoggedIn = false;
          this.isAdmin = false;
          this.isOwner = false;
        }
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

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  get cartItemCount(): number {
    return this.cartService.getItems().length;
  }
}