import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Service } from '../models/service.model';
import { ProductService } from '../services/product.service';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { MaterialModule } from '../material.module';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ], 
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  services: Service[] = [];
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router, 
    private productService: ProductService,
    private cartService: ShoppingCartService
  ) { }

  ngOnInit(): void {
    this.loadServices();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadServices(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const response = await this.productService.getMockServices();
      this.services = response.body || [];
      console.log('Services loaded successfully:', this.services);
    } catch (error) {
      console.error('Error loading services:', error);
      this.error = 'Failed to load services. Please try again later.';
    } finally {
      this.loading = false;
    }
  }

  viewDetails(service: Service): void {
    // Navigate to product detail page using the correct route and id
    this.router.navigate(['/products', service.Id]);
  }

  addToCart(service: Service): void {
    // Convert Service to Product for cart
    const product = {
      Id: this.generateId(),
      Title: service.Title,
      Description: service.Description,
      FileName: service.FileName
    };
    
    this.cartService.addItem(product);
    console.log(`${service.Title} added to cart!`);
  }

  private generateId(): number {
    return Math.floor(Math.random() * 10000);
  }

  retryLoad(): void {
    this.loadServices();
  }
}