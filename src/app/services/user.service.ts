import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, BehaviorSubject} from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {

  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/users`; 

  async getUsers(): Promise<User[]> {
    return await lastValueFrom(this.http.get<User[]>(`${this.apiUrl}`));
  }

  async addUser(userData: User): Promise<any> {
    return await lastValueFrom(this.http.post(`${this.apiUrl}`, userData));
  }
}
