// src/app/shopping-cart.service.ts
import { Injectable } from '@angular/core';
import { Service } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})

export class ShoppingCartService {
  items: Service[] = [];

  constructor() { }

  addItem(product: Service): void {
    this.items.push(product);
  }

  getItems(): Service[] {
    return this.items;
  }

  removeItem(product: Service): void {
    const index = this.items.indexOf(product);
    if (index >= 0) {
      this.items.splice(index, 1);
    }
  }

  clearCart(): void {
    this.items = [];
  }
}