// frontend/src/app/products.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../../../backend/src/types'; // Import from backend types

// Make sure this matches your backend URL and port
const API_URL = 'http://localhost:3000/api';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_URL}/products`);
  }

  createProduct(product: Omit<Product, 'id' | 'created_at'>): Observable<Product> {
    return this.http.post<Product>(`${API_URL}/products`, product);
  }
}