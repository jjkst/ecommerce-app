import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { Product } from '../models/product.model';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    NgFor,
    MatCard,
    MatCardTitle,
    MatToolbarModule
  ], 
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})

export class ProductsListComponent implements OnInit {
  products: Product[] = [
    { id: 1, name: 'Photo Shoot', imageUrl: 'assets/Outdoor-Dining-and-Vistas.jpg', price: 1200 },
    { id: 2, name: 'Video Shoot', imageUrl: 'assets/Outdoor-Dining-and-Vistas.jpg', price: 25 },
    { id: 3, name: 'Wedding Cermony', imageUrl: 'assets/Outdoor-Dining-and-Vistas.jpg', price: 75 },
    { id: 4, name: 'Filming', imageUrl: 'assets/Outdoor-Dining-and-Vistas.jpg', price: 75 },
    { id: 5, name: 'Other Event', imageUrl: 'assets/Outdoor-Dining-and-Vistas.jpg', price: 75 }
    // ... more products
  ];

  constructor(private router: Router, private cartService: ShoppingCartService) { }

  ngOnInit(): void {
  }

  viewDetails(id: number): void {
    this.router.navigate(['/products', id]);
  }

  addToCart(product: Product): void {
    this.cartService.addItem(product);
    alert(`${product.name} added to cart!`);
  }
}