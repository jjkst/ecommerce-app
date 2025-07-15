import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { ScheduleService } from '../services/schedule.service';
import { Schedule } from '../models/schedule.model';
import { MaterialModule } from '../material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HorizontalCardListComponent } from '../shared/horizontal-card-list.component';
import { AvailabilityService } from '../services/availability.service';

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
  availableDates: Date[] = [];
  availableTimeSlots: string[] = [];
  availableServices: string[] = [];
  scheduledAppointments: Schedule[] = [];
  loading = false;
  formId = 0;
  formbuttonText = 'Add Schedule';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private availabilityService: AvailabilityService,
    private snackBar: MatSnackBar
  ) {}

  // ------------------- Utility Methods -------------------
  private formatDateToYMD(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    const ymd = this.formatDateToYMD(date);
    return this.availableDates.some(d => this.formatDateToYMD(new Date(d)) === ymd);
  };

  private generateUid(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // ------------------- Data Loading Methods -------------------
  async ngOnInit(): Promise<void> {
    this.initializeForm();
    await this.loadSchedules();
    await this.loadAvailableDates();
    this.setupFormSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.appointmentForm = this.fb.group({
      ContactName: ['', Validators.required],
      SelectedDate: [null, Validators.required],
      Services: [[], Validators.required],
      Timeslots: [[], Validators.required],
      Note: [''],
      Uid: ['']
    });
  }

  private setupFormSubscriptions(): void {
    this.appointmentForm.get('SelectedDate')?.valueChanges.subscribe((date: Date | null) => {
      this.onDateChange();
    });
    this.appointmentForm.get('Services')?.valueChanges.subscribe((services: string[]) => {
      this.onServiceChange();
    });
  }

  async loadSchedules(): Promise<void> {
    this.loading = true;
    try {
      const response = await this.scheduleService.getSchedules();
      if (response.status === 200 && Array.isArray(response.body)) {
        this.scheduledAppointments =
          response.body.map((schedule) => ({
            Id: schedule.id,
            ContactName: schedule.contactName,
            SelectedDate: schedule.selectedDate,
            Services: schedule.services,
            Timeslots: schedule.timeslots,
            Uid: '',
            Notes: schedule.note
          })) || [];
      }
    } catch (error) {
      console.error('Error loading schedules:', error);
      this.showToast('Error loading existing schedules', 'error');
    } finally {
      this.loading = false;
    }
  }

  async loadAvailableDates(): Promise<void> {
    this.loading = true;
    try {
      const response = await this.availabilityService.getAvailableDates();
      if (response.status === 200 && Array.isArray(response.body)) {
        this.availableDates = response.body || [];
      }
    } catch (error) {
      console.error('Error loading availabilities:', error);
      this.showToast('Error loading existing availabilities', 'error');
    } finally {
      this.loading = false;
    }
  }

  async loadServices(date?: Date): Promise<void> {
    try {
      if (!date) {
        this.availableServices = [];
        return;
      }
      const response = await this.availabilityService.getAvailableServicesByDate(this.formatDateToYMD(new Date(date)));
      if (response.status === 200 && Array.isArray(response.body)) {
        this.availableServices = response.body;
      } else {
        this.availableServices = [];
      }
    } catch (error) {
        console.error('Error loading services:', error);
        this.showToast('Error loading available services for date', 'error');
    }
  }

  async loadTimeSlots(date: Date, services: string[]): Promise<void> {
    if (!date || !services || services.length === 0) {
      this.availableTimeSlots = [];
      return;
    }
    try {
      const response = await this.availabilityService.postAvailableTimeslotsByDateByServices(date, services);
      console.log('loaded services:', response.body);
      if (response.status === 200 && Array.isArray(response.body)) {
        this.availableTimeSlots = response.body;
      } else {
        this.availableTimeSlots = [];
      }
    } catch (error) {
      this.availableTimeSlots = [];
      this.showToast('Error loading available timeslots for date and services', 'error');
    }
  }

  // ------------------- Form Event Handlers -------------------
  onDateChange(): void {
    const selectedDate = this.appointmentForm.get('SelectedDate')?.value;
    this.appointmentForm.get('Services')?.setValue([]);
    this.appointmentForm.get('Timeslots')?.setValue([]);
    this.loadServices(selectedDate);
  }

  onServiceChange(): void {
    const selectedDate = this.appointmentForm.get('SelectedDate')?.value;
    const selectedServices = this.appointmentForm.get('Services')?.value || [];
    this.loadTimeSlots(selectedDate, selectedServices);
  }

  // ------------------- UI Helpers -------------------
  isServiceSelected(service: string): boolean {
    if (!this.appointmentForm) return false;
    const services = this.appointmentForm.value?.Services;
    return Array.isArray(services) && services.includes(service);
  }

  isSlotSelected(slot: string): boolean {
    if (!this.appointmentForm) return false;
    const timeslots = this.appointmentForm.value?.Timeslots;
    return Array.isArray(timeslots) && timeslots.includes(slot);
  }

  toggleService(service: string): void {
    if (!this.appointmentForm) return;
    const currentServices = this.appointmentForm.value?.Services || [];
    const selected = Array.isArray(currentServices) ? [...currentServices] : [];
    const idx = selected.indexOf(service);
    if (idx > -1) {
      selected.splice(idx, 1);
    } else {
      selected.push(service);
    }
    this.appointmentForm.get('Services')?.setValue([...selected]);
    this.appointmentForm.get('Services')?.markAsDirty();
  }

  toggleTimeslot(slot: string): void {
    if (!this.appointmentForm) return;
    const currentTimeslots = this.appointmentForm.value?.Timeslots || [];
    const selected = Array.isArray(currentTimeslots) ? [...currentTimeslots] : [];
    const idx = selected.indexOf(slot);
    if (idx > -1) {
      selected.splice(idx, 1);
    } else {
      selected.push(slot);
    }
    this.appointmentForm.get('Timeslots')?.setValue([...selected]);
    this.appointmentForm.get('Timeslots')?.markAsDirty();
  }


  // ------------------- CRUD & Submission -------------------
  async onSubmit(): Promise<void> {
    if (this.appointmentForm.valid) {
      this.loading = true;
      try {
        const formValue = this.appointmentForm.value;
        const scheduleData: Schedule = {
          ContactName: formValue.ContactName,
          SelectedDate: formValue.SelectedDate,
          Services: formValue.Services,
          Timeslots: formValue.Timeslots, // now an array
          Note: formValue.Note || '',
          Uid: formValue.Uid || this.generateUid()
        };
        if (!this.scheduleService.validateScheduleData(scheduleData)) {
          console.log('scedule data: ', scheduleData);
          this.showToast('Please fill in all required fields correctly.', 'error');
          return;
        }
        if (this.formId === 0) {
          const response = await this.scheduleService.addSchedule(scheduleData);
          if (response.status === 200 || response.status === 201) {
            this.showToast('Schedule Added Successfully!', 'success');
          } else {
            this.showToast('Error Adding Schedule', 'error');
          }
        } else {
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
    const selectedServices = this.appointmentForm.get('Services')?.value || [];
    this.loadTimeSlots(schedule.SelectedDate, selectedServices);
    this.appointmentForm.patchValue({
      ContactName: schedule.ContactName,
      SelectedDate: schedule.SelectedDate,
      Services: schedule.Services,
      Timeslots: schedule.Timeslots, 
      Note: schedule.Note,
      Uid: schedule.Uid
    });
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

  private resetForm(): void {
    this.appointmentForm.reset({
      ContactName: '',
      SelectedDate: null,
      Services: [],
      Timeslots: [],
      Note: '',
      Uid: ''
    });
    Object.keys(this.appointmentForm.controls).forEach(key => {
      const control = this.appointmentForm.get(key);
      control?.markAsUntouched();
      control?.markAsPristine();
      control?.setErrors(null);
    });
    this.formId = 0;
    this.formbuttonText = 'Add Schedule';
    this.availableTimeSlots = [];
  }

  private showToast(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    const duration = 3000;
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
    return schedule.SelectedDate ? new Date(schedule.SelectedDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) : 'No date';
  }
}