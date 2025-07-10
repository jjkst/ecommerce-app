import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ScheduleService } from '../services/schedule.service';
import { Schedule } from '../models/schedule.model';
import { MaterialModule } from '../material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HorizontalCardListComponent } from '../shared/horizontal-card-list.component';

@Component({
  selector: 'app-schedule-manager',
  standalone: true, 
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    HorizontalCardListComponent
  ],
  templateUrl: './schedule-manager.component.html',
  styleUrls: ['./schedule-manager.component.scss']
})
export class ScheduleManagerComponent implements OnInit, OnDestroy {
  appointmentForm!: FormGroup;
  availableTimeSlots: string[] = [];
  availableServices: string[] = ['Photography', 'Videography', 'Event Planning'];
  scheduledAppointments: Schedule[] = [];
  loading = false;
  formId = 0;
  formbuttonText = 'Add Schedule';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private snackBar: MatSnackBar
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

    try {
      const response = await this.scheduleService.getSchedules();
      if (response.status === 200 && Array.isArray(response.body)) {
        this.scheduledAppointments = response.body || [];
        console.log('Schedules loaded:', this.scheduledAppointments);
      }
    } catch (error) {
      console.error('Error loading schedules:', error);
      this.showToast('Error loading existing schedules', 'error');
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
          this.showToast('Please fill in all required fields correctly.', 'error');
          return;
        }

        if (this.formId === 0) {
          // Add new schedule
          const response = await this.scheduleService.addSchedule(scheduleData);
          if (response.status === 200 || response.status === 201) {
            this.showToast('Schedule Added Successfully!', 'success');
          } else {
            this.showToast('Error Adding Schedule', 'error');
          }
        } else {
          // Update existing schedule
          const existingSchedule = this.scheduledAppointments[this.formId];
          const response = await this.scheduleService.updateSchedule(existingSchedule.Uid, scheduleData);
          if (response.status === 200) {
            this.showToast('Schedule Updated Successfully!', 'success');
          } else {
            this.showToast('Error Updating Schedule', 'error');
          }
        }
        
        this.resetForm();
        this.loadSchedules();

        console.log('Schedule added/updated:', scheduleData);
      } catch (error) {
        console.error('Error adding/updating schedule:', error);
        this.showToast('Error Adding/Updating Schedule', 'error');
      } finally {
        this.loading = false;
      }
    } else {
      this.appointmentForm.markAllAsTouched();
      this.showToast('Please fill in all required fields correctly.', 'error');
    }
  }

  editSchedule(schedule: Schedule): void {
    this.formId = this.scheduledAppointments.findIndex(s => s.Uid === schedule.Uid);
    
    // First populate the time slots for the selected date
    this.populateTimeSlots(schedule.SelectedDate);
    
    // Then set the form values
    this.appointmentForm.patchValue({
      ContactName: schedule.ContactName,
      Service: schedule.Service,
      SelectedDate: schedule.SelectedDate,
      Timeslot: schedule.Timeslot,
      Note: schedule.Note,
      Uid: schedule.Uid
    });

    // Scroll to the form section
    const formElement = document.querySelector('.schedule-manager-card');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    this.showToast('Schedule loaded for editing. Update the details and click "Update Schedule".', 'info');
    this.formbuttonText = 'Update Schedule';
  }

  async deleteSchedule(schedule: Schedule): Promise<void> {
    if (confirm(`Are you sure you want to delete this schedule?`)) {
      try {
        this.loading = true;
        const response = await this.scheduleService.deleteSchedule(schedule.Uid);
        if (response.status === 200 || response.status === 204) {
          this.showToast('Schedule deleted successfully!', 'success');
          this.loadSchedules();
        } else {
          this.showToast('Error deleting schedule', 'error');
        }
      } catch (error) {
        console.error('Error deleting schedule:', error);
        this.showToast('Error deleting schedule', 'error');
      } finally {
        this.loading = false;
      }
    }
  }

  private generateUid(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private resetForm(): void {
    // Reset form with empty values and clear validation state
    this.appointmentForm.reset({
      ContactName: '',
      Service: '',
      SelectedDate: null,
      Timeslot: null,
      Note: '',
      Uid: ''
    });
    
    // Clear all validation states
    Object.keys(this.appointmentForm.controls).forEach(key => {
      const control = this.appointmentForm.get(key);
      control?.markAsUntouched();
      control?.markAsPristine();
      control?.setErrors(null);
    });
    
    this.formId = 0;
    this.formbuttonText = 'Add Schedule';
    this.appointmentForm.get('Timeslot')?.disable();
    this.availableTimeSlots = [];
  }

  private showToast(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    const duration = 3000; // 3 seconds
    
    this.snackBar.open(message, 'Close', {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [`toast-${type}`]
    });
  }

  getScheduleImageUrl(schedule: Schedule): string {
    return 'assets/schedule.png';
  }

  getScheduleTitle(schedule: Schedule): string {
    return `${schedule.ContactName} - ${schedule.Service}`;
  }
}