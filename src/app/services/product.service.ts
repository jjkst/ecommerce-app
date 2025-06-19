// frontend/src/app/products.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Service } from '../models/service.model'; // Import from backend types
import { environment } from 'environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/services`; 

  async getServices(): Promise<HttpResponse<Service[]>> {
    try {
      const response = await lastValueFrom(
        this.http.get<Service[]>(`${this.apiUrl}`, { observe: 'response' })
          .pipe(
            catchError(this.handleError)
          )
      );
      console.log('GET Response Status:', response.status);
      console.log('GET Response Headers:', response.headers.keys());
      return response;
    } catch (error) {
      throw error;
    }
  }

  async addService(serviceData: Service): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.http.post<Service>(`${this.apiUrl}`, serviceData, { observe: 'response' })
          .pipe(
            catchError(this.handleError)
          )
      );
      console.log('POST Response Status:', response.status);
      return response;
    } catch (error) {
      throw error;
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`
      );
    }
    console.error(errorMessage);
    return throwError(() => error); 
  }
}