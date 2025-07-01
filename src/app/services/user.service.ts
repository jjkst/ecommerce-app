import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { User } from '../models/user.model';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {
  private readonly endpoint = '/users';

  async getUsers(): Promise<HttpResponse<User[]>> {
    return await this.get<User[]>(this.endpoint);
  }

  async addUser(userData: User): Promise<HttpResponse<User>> {
    return await this.post<User>(this.endpoint, userData);
  }

  async updateUser(id: string, userData: User): Promise<HttpResponse<User>> {
    return await this.put<User>(`${this.endpoint}/${id}`, userData);
  }

  async deleteUser(id: string): Promise<HttpResponse<void>> {
    return await this.delete<void>(`${this.endpoint}/${id}`);
  }
}
