// src/app/shopping-cart.service.ts
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})

export class ShoppingCartService {
  items: Product[] = [];

  constructor() { }

  addItem(product: Product): void {
    this.items.push(product);
  }

  getItems(): Product[] {
    return this.items;
  }

  removeItem(product: Product): void {
    const index = this.items.indexOf(product);
    if (index >= 0) {
      this.items.splice(index, 1);
    }
  }

  clearCart(): void {
    this.items = [];
  }
}