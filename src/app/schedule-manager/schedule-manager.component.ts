import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for ngIf, ngFor
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';


// Services and Models
import { ScheduleService } from '../services/schedule.service';
import { Schedule } from '../models/schedule.model';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-schedule-manager',
  standalone: true, 
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './schedule-manager.component.html',
  styleUrls: ['./schedule-manager.component.scss']
})
export class ScheduleManagerComponent implements OnInit, OnDestroy {
    dynamicBackgroundColor: string = 'purple';
    toolbarTitle: string = 'Schedule Manager'; 
    appointmentForm!: FormGroup;
    availableTimeSlots: string[] = [];
    availableServices: string[] = ['Photography', 'Videography', 'Event Planning']; // List of services
    scheduledAppointments: Schedule[] = [];
    loading = false;
    error: string | null = null;
    private destroy$ = new Subject<void>();
  
    constructor(
      private fb: FormBuilder,
      private scheduleService: ScheduleService
    ) {}
  
    ngOnInit(): void {
      this.initializeForm();
      this.loadSchedules();
      this.setupFormSubscriptions();
    }
  
    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
  
    private initializeForm(): void {
      this.appointmentForm = this.fb.group({
        ContactName: ['', Validators.required],
        Service: ['', Validators.required],
        SelectedDate: [null, Validators.required],
        Timeslot: [{ value: null, disabled: true }, Validators.required],
        Note: [''],
        Uid: ['']
      });
    }
  
    private setupFormSubscriptions(): void {
      this.appointmentForm.get('SelectedDate')?.valueChanges.subscribe((date: Date | null) => {
        this.populateTimeSlots(date);
      });
    }
  
    async loadSchedules(): Promise<void> {
      this.loading = true;
      this.error = null;
  
      try {
        // Use local state for now (can be changed to API call later)
        this.scheduleService.getSchedules().subscribe(schedules => {
          this.scheduledAppointments = schedules;
          console.log('Schedules loaded:', schedules);
        });
      } catch (error) {
        console.error('Error loading schedules:', error);
        this.error = 'Failed to load schedules. Please try again later.';
      } finally {
        this.loading = false;
      }
    }
  
    onDateChange(): void {
      this.appointmentForm.get('Timeslot')?.setValue(null);
    }
  
    private populateTimeSlots(date: Date | null): void {
      this.availableTimeSlots = [];
      
      if (date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDateNormalized = new Date(date);
        selectedDateNormalized.setHours(0, 0, 0, 0);
  
        if (selectedDateNormalized.getTime() === today.getTime()) {
          // For today, offer slots from now onwards
          const currentHour = new Date().getHours();
          for (let i = currentHour + 1; i < 18; i++) {
            this.availableTimeSlots.push(`${i}:00 - ${i}:30`);
            this.availableTimeSlots.push(`${i}:30 - ${i + 1}:00`);
          }
        } else if (selectedDateNormalized.getTime() > today.getTime()) {
          // For future dates, offer a full day of slots
          for (let i = 9; i < 17; i++) {
            this.availableTimeSlots.push(`${i}:00 - ${i}:30`);
            this.availableTimeSlots.push(`${i}:30 - ${i + 1}:00`);
          }
        }
  
        if (this.availableTimeSlots.length > 0) {
          this.appointmentForm.get('Timeslot')?.enable();
        } else {
          this.appointmentForm.get('Timeslot')?.disable();
        }
      } else {
        this.appointmentForm.get('Timeslot')?.disable();
      }
    }
  
    async onSubmit(): Promise<void> {
      if (this.appointmentForm.valid) {
        this.loading = true;
        this.error = null;
  
        try {
          const formValue = this.appointmentForm.value;
          const scheduleData: Schedule = {
            ContactName: formValue.ContactName,
            Service: formValue.Service,
            SelectedDate: formValue.SelectedDate,
            Timeslot: formValue.Timeslot,
            Note: formValue.Note || '',
            Uid: formValue.Uid || this.generateUid()
          };
  
          // Validate data before submission
          if (!this.scheduleService.validateScheduleData(scheduleData)) {
            throw new Error('Please fill in all required fields correctly.');
          }
  
          // Add to local state (can be changed to API call later)
          this.scheduleService.addSchedule(scheduleData);
          
          this.toolbarTitle = 'Appointment Scheduled Successfully!';
          this.dynamicBackgroundColor = 'green';
          this.appointmentForm.reset();
          this.appointmentForm.get('Timeslot')?.disable();
          this.availableTimeSlots = [];
  
          console.log('Appointment scheduled:', scheduleData);
        } catch (error) {
          console.error('Error scheduling appointment:', error);
          this.error = this.formatErrorMessage(error);
          this.toolbarTitle = 'Error Scheduling Appointment';
          this.dynamicBackgroundColor = 'red';
        } finally {
          this.loading = false;
        }
      } else {
        this.appointmentForm.markAllAsTouched();
        this.error = 'Please fill in all required fields correctly.';
      }
    }
  
    editAppointment(schedule: Schedule): void {
      this.appointmentForm.patchValue({
        ContactName: schedule.ContactName,
        Service: schedule.Service,
        SelectedDate: schedule.SelectedDate,
        Timeslot: schedule.Timeslot,
        Note: schedule.Note,
        Uid: schedule.Uid
      });
  
      // Remove from list to avoid duplication
      this.scheduledAppointments = this.scheduledAppointments.filter(
        s => s.Uid !== schedule.Uid
      );
    }
  
    deleteAppointment(schedule: Schedule): void {
      this.scheduledAppointments = this.scheduledAppointments.filter(
        s => s.Uid !== schedule.Uid
      );
      console.log('Appointment deleted:', schedule);
    }
  
    private generateUid(): string {
      return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }
  
    retryLoad(): void {
      this.loadSchedules();
    }
  
    clearError(): void {
      this.error = null;
    }
  
    private formatErrorMessage(error: any): string {
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