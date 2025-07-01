import { Component, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { Product } from '../models/product.model';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-shopping-cart',
  imports: [CommonModule, MaterialModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  cartItems: Product[] = [];

  constructor(private cartService: ShoppingCartService) { }

  ngOnInit(): void {
    this.cartItems = this.cartService.getItems();
  }

  removeItem(product: Product): void {
    this.cartService.removeItem(product);
    this.cartItems = this.cartService.getItems(); // Update the view
  }

  get total(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }
}