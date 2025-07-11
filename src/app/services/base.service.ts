import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { catchError, throwError } from 'rxjs';
import { environment } from 'environment';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {
  protected http = inject(HttpClient);
  protected readonly apiBaseUrl = environment.apiBaseUrl;

  /**
   * Generic GET request with error handling
   */
  protected async get<T>(endpoint: string, options?: any): Promise<HttpResponse<T>> {
    try {
      const response = await lastValueFrom(
        this.http.get<T>(`${this.apiBaseUrl}${endpoint}`, { 
          observe: 'response',
          ...options 
        }).pipe(
          catchError(this.handleError)
        )
      );
      
      if (response instanceof HttpResponse) {
        this.logResponse('GET', endpoint, response.status);
        return response;
      }
      throw new Error('Invalid response type');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generic POST request with error handling
   */
  protected async post<T>(endpoint: string, data: any, options?: any): Promise<HttpResponse<T>> {
    try {
      console.log('post route:', `${this.apiBaseUrl}${endpoint}`);

      const response = await lastValueFrom(
        this.http.post<T>(`${this.apiBaseUrl}${endpoint}`, data, { 
          observe: 'response',
          ...options 
        }).pipe(
          catchError(this.handleError)
        )
      );
      if (response instanceof HttpResponse) {
        this.logResponse('POST', endpoint, response.status);
        return response;
      }
      throw new Error('Invalid response type');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generic PUT request with error handling
   */
  protected async put<T>(endpoint: string, data: any, options?: any): Promise<HttpResponse<T>> {
    try {
      const response = await lastValueFrom(
        this.http.put<T>(`${this.apiBaseUrl}${endpoint}`, data, { 
          observe: 'response',
          ...options 
        }).pipe(
          catchError(this.handleError)
        )
      );
      
      if (response instanceof HttpResponse) {
        this.logResponse('PUT', endpoint, response.status);
        return response;
      }
      throw new Error('Invalid response type');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generic DELETE request with error handling
   */
  protected async delete<T>(endpoint: string, options?: any): Promise<HttpResponse<T>> {
    try {
      const response = await lastValueFrom(
        this.http.delete<T>(`${this.apiBaseUrl}${endpoint}`, { 
          observe: 'response',
          ...options 
        }).pipe(
          catchError(this.handleError)
        )
      );
      
      if (response instanceof HttpResponse) {
        this.logResponse('DELETE', endpoint, response.status);
        return response;
      }
      throw new Error('Invalid response type');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Centralized error handling for HTTP requests
   */
  protected handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`
      );
    }
    
    console.error('Error details:', errorMessage);
    return throwError(() => error);
  }

  /**
   * Log HTTP response details
   */
  private logResponse(method: string, endpoint: string, status: number): void {
    console.log(`${method} Response Status:`, status);
    console.log(`${method} Endpoint:`, endpoint);
  }

  /**
   * Utility method to validate required fields
   */
  protected validateRequiredFields(data: any, requiredFields: string[]): boolean {
    return requiredFields.every(field => data[field] !== null && data[field] !== undefined && data[field] !== '');
  }

  /**
   * Utility method to format error messages for user display
   */
  protected formatErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.error?.message) {
      return error.error.message;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
  }
} 