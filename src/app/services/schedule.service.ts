// src/app/schedule.service.ts
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Schedule } from '../models/schedule.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService extends BaseService {
  private readonly endpoint = '/schedules';
  
  // Local state management for real-time updates
  private schedules$ = new BehaviorSubject<Schedule[]>([]);
  readonly schedules = this.schedules$.asObservable();

  // Mock data for development (remove when backend is ready)
  private mockSchedules: Schedule[] = [
    { 
      ContactName: 'John Doe',
      Service: 'Wedding Photography',
      SelectedDate: new Date('2025-05-16'),
      Timeslot: '09:00-17:00',
      Note: 'Outdoor wedding ceremony',
      Uid: '1'
    },
    { 
      ContactName: 'Jane Smith',
      Service: 'Portrait Session',
      SelectedDate: new Date('2025-05-19'),
      Timeslot: '10:00-12:00',
      Note: 'Family portraits',
      Uid: '2'
    }
  ];

  constructor() {
    super();
    this.schedules$.next(this.mockSchedules);
  }

  // HTTP Methods
  async getSchedulesFromAPI(): Promise<HttpResponse<Schedule[]>> {
    return await this.get<Schedule[]>(this.endpoint);
  }

  async addScheduleToAPI(scheduleData: Schedule): Promise<HttpResponse<Schedule>> {
    const response = await this.post<Schedule>(this.endpoint, scheduleData);
    // Update local state after successful API call
    if (response.status === 200 || response.status === 201) {
      this.addScheduleToLocal(scheduleData);
    }
    return response;
  }

  async updateScheduleInAPI(id: string, scheduleData: Schedule): Promise<HttpResponse<Schedule>> {
    const response = await this.put<Schedule>(`${this.endpoint}/${id}`, scheduleData);
    // Update local state after successful API call
    if (response.status === 200) {
      this.updateScheduleInLocal(id, scheduleData);
    }
    return response;
  }

  async deleteScheduleFromAPI(id: string): Promise<HttpResponse<void>> {
    const response = await this.delete<void>(`${this.endpoint}/${id}`);
    // Update local state after successful API call
    if (response.status === 200 || response.status === 204) {
      this.deleteScheduleFromLocal(id);
    }
    return response;
  }

  // Local State Management Methods (for development/offline support)
  getSchedules(): Observable<Schedule[]> {
    return this.schedules;
  }

  addSchedule(schedule: Schedule): void {
    this.addScheduleToLocal(schedule);
  }

  private addScheduleToLocal(schedule: Schedule): void {
    const currentSchedules = this.schedules$.getValue();
    const newSchedule = { ...schedule, Uid: (currentSchedules.length + 1).toString() };
    this.schedules$.next([...currentSchedules, newSchedule]);
    this.mockSchedules = [...this.schedules$.getValue()];
    console.log('Schedule added to local state:', newSchedule);
  }

  private updateScheduleInLocal(id: string, updatedSchedule: Schedule): void {
    const currentSchedules = this.schedules$.getValue();
    const updatedSchedules = currentSchedules.map(schedule => 
      schedule.Uid === id ? { ...updatedSchedule, Uid: id } : schedule
    );
    this.schedules$.next(updatedSchedules);
    this.mockSchedules = updatedSchedules;
    console.log('Schedule updated in local state:', updatedSchedule);
  }

  private deleteScheduleFromLocal(id: string): void {
    const currentSchedules = this.schedules$.getValue();
    const filteredSchedules = currentSchedules.filter(schedule => schedule.Uid !== id);
    this.schedules$.next(filteredSchedules);
    this.mockSchedules = filteredSchedules;
    console.log('Schedule deleted from local state:', id);
  }

  // Utility Methods
  validateScheduleData(schedule: Schedule): boolean {
    const requiredFields = ['ContactName', 'Service', 'SelectedDate', 'Timeslot', 'Uid'];
    return this.validateRequiredFields(schedule, requiredFields);
  }

  getSchedulesByDate(date: Date): Observable<Schedule[]> {
    return new Observable(observer => {
      this.schedules.subscribe(schedules => {
        const filteredSchedules = schedules.filter(schedule => 
          schedule.SelectedDate.toDateString() === date.toDateString()
        );
        observer.next(filteredSchedules);
      });
    });
  }
}