import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Service } from '../models/service.model';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Service | undefined;
  features?: string[];
  pricingPlans?: Array<{ Name: string; InitialSetupFee: string; MonthlySubscription: string; Features: string[] }>;

  constructor(
    private route: ActivatedRoute,
    private cartService: ShoppingCartService,
    private productService: ProductService
  ) { }

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    // Load products from mock service
    const response = await this.productService.getMockServices();
    if (response.status === 200 && Array.isArray(response.body)) {
      this.product = response.body.find((p: Service) => p.Id === id);
      this.features = this.product?.Features;
      this.pricingPlans = this.product?.PricingPlans;
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addItem({
        Id: this.product.Id ?? 0,
        Title: this.product.Title,
        Description: this.product.Description,
        FileName: this.product.FileName
      });
      alert(`${this.product.Title} added to cart!`);
    }
  }
}