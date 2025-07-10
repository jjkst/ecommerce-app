import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Service } from '../models/service.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService {
  private readonly endpoint = '/services';

  async getServices(): Promise<HttpResponse<any[]>> {
    return await this.get<Service[]>(this.endpoint);
  }

  async addService(serviceData: Service): Promise<HttpResponse<Service>> {
    return await this.post<Service>(this.endpoint, serviceData);
  }

  async updateService(id: number, serviceData: Service): Promise<HttpResponse<Service>> {
    return await this.put<Service>(`${this.endpoint}/${id}`, serviceData);
  }

  async deleteService(id: number): Promise<HttpResponse<void>> {
    return await this.delete<void>(`${this.endpoint}/${id}`);
  }

  validateServiceData(service: Service): boolean {
    const requiredFields = ['Title', 'Description', 'Price'];
    return this.validateRequiredFields(service, requiredFields);
  }
}