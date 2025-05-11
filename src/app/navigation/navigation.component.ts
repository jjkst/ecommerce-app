import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink], 
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  constructor(private cartService: ShoppingCartService) {}

  get cartItemCount(): number {
    return this.cartService.getItems().length;
  }
}