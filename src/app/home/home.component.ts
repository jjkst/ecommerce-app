import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Service } from '../models/service.model';
import { ProductService } from '../services/product.service';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { MaterialModule } from '../material.module';
import { Testimonial } from '../models/testimony.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ], 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  services: Service[] = [];
  testimonials: Testimonial[] = [];
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
      const response = await this.productService.getServices();
      this.services = response.body || [];
      console.log('Services loaded successfully:', this.services);
    } catch (error) {
      console.error('Error loading services:', error);
      this.error = 'Failed to load services. Please try again later.';
      // Fallback to mock data if API fails
      this.loadMockServices();
    } finally {
      this.loading = false;
    }
  }

  private loadMockServices(): void {
    this.services = [
      { 
        Title: 'Photo Shoot', 
        Description: 'Professional photography services',
        FileName: 'assets/Outdoor-Dining-and-Vistas.jpg', 
        Price: 1200 
      },
      { 
        Title: 'Video Shoot', 
        Description: 'High-quality video production',
        FileName: 'assets/Outdoor-Dining-and-Vistas.jpg', 
        Price: 2500 
      },
      { 
        Title: 'Wedding Ceremony', 
        Description: 'Complete wedding photography package',
        FileName: 'assets/Outdoor-Dining-and-Vistas.jpg', 
        Price: 3500 
      },
      { 
        Title: 'Event Filming', 
        Description: 'Professional event videography',
        FileName: 'assets/Outdoor-Dining-and-Vistas.jpg', 
        Price: 1800 
      },
      { 
        Title: 'Portrait Session', 
        Description: 'Individual and family portraits',
        FileName: 'assets/Outdoor-Dining-and-Vistas.jpg', 
        Price: 500 
      }
    ];
    this.testimonials = [
      {
        Quote: 'Nic Taylor Photography exceeded our expectations. The team was professional and the results were stunning!',
        Author: 'Sarah & John'
      },
    ];
  }

  viewDetails(service: Service): void {
    // Navigate to service detail page
    this.router.navigate(['/services', service.Title]);
  }

  addToCart(service: Service): void {
    // Convert Service to Product for cart
    const product = {
      id: this.generateId(),
      name: service.Title,
      price: service.Price,
      imageUrl: service.FileName
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