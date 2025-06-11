// src/app/schedule.service.ts
import { Injectable } from '@angular/core';
import { Schedule } from 'commonlib';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private schedules$ = new BehaviorSubject<Schedule[]>([]);
  readonly schedules = this.schedules$.asObservable();

  private mockSchedules: Schedule[] = [
    { id: 1, name: 'Weekend Sale Prep', selectedDate: new Date('2025-05-16'), startTime: new Date('2025-05-16T09:00:00'), endTime: new Date('2025-05-16T17:00:00'), description: 'Prepare website for the upcoming weekend sale.' },
    { id: 2, name: 'Inventory Check', selectedDate: new Date('2025-05-19'), startTime: new Date('2025-05-19T10:00:00'), endTime: new Date('2025-05-19T12:00:00'), description: 'Check and update product inventory levels.' }
  ];

  constructor() {
    this.schedules$.next(this.mockSchedules);
  }

  getSchedules(): Observable<Schedule[]> {
    return this.schedules;
  }

  addSchedule(schedule: Schedule): void {
    const currentSchedules = this.schedules$.getValue();
    const newSchedule = { ...schedule, id: currentSchedules.length + 1 };
    this.schedules$.next([...currentSchedules, newSchedule]);
    this.mockSchedules = [...this.schedules$.getValue()]; // Update mock data
    console.log('Schedule added:', newSchedule);
  }

  // In a real app, you'd have methods to update and delete schedules
}