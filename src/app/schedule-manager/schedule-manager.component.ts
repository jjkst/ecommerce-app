import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for ngIf, ngFor
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Angular Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // Provides date adapter
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-schedule-manager',
  standalone: true, 
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatToolbarModule
  ],
  templateUrl: './schedule-manager.component.html',
  styleUrls: ['./schedule-manager.component.scss']
})
export class ScheduleManagerComponent implements OnInit {
    dynamicBackgroundColor: string = 'purple';
    toolbarTitle: string = 'Schedule Manager'; 
    appointmentForm!: FormGroup;
    availableTimeSlots: string[] = [];
    availableServices: string[] = ['Photography', 'Videography', 'Event Planning']; // List of services
    submittedAppointment: { service: string; date: Date; time: string; note?: string } | null = null;
    scheduledAppointments: { service: string; date: Date; time: string; note?: string }[] = [];
  
    constructor(private fb: FormBuilder) {}
  
    ngOnInit(): void {
      this.appointmentForm = this.fb.group({
        selectedService: [null, Validators.required], 
        selectedDate: [null, Validators.required],
        selectedTimeSlot: [{ value: null, disabled: true }, Validators.required],
        note: [''] 
      });
  
      // Subscribe to date changes to enable/disable time slot and populate
      this.appointmentForm.get('selectedDate')?.valueChanges.subscribe((date: Date | null) => {
        this.populateTimeSlots(date);
      });
    }
  
    onDateChange(): void {
      // This method is triggered by dateInput and dateChange events
      // The valueChanges subscription handles the actual logic.
      // We clear the selected time slot if the date changes.
      this.appointmentForm.get('selectedTimeSlot')?.setValue(null);
    }
  
    private populateTimeSlots(date: Date | null): void {
      this.availableTimeSlots = []; // Clear previous slots
      if (date) {
        // In a real application, you'd make an API call here:
        // this.appointmentService.getAvailableTimeSlots(date).subscribe(slots => {
        //   this.availableTimeSlots = slots;
        //   this.appointmentForm.get('selectedTimeSlot')?.enable();
        // });
  
        // For demonstration, we'll generate mock slots
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day for comparison
        const selectedDateNormalized = new Date(date);
        selectedDateNormalized.setHours(0, 0, 0, 0);
  
        // Simple mock logic:
        if (selectedDateNormalized.getTime() === today.getTime()) {
          // For today, offer slots from now onwards (mock current time)
          const currentHour = new Date().getHours();
          for (let i = currentHour + 1; i < 18; i++) { // From next hour until 5 PM
            this.availableTimeSlots.push(`${i}:00 - ${i}:30`);
            this.availableTimeSlots.push(`${i}:30 - ${i + 1}:00`);
          }
        } else if (selectedDateNormalized.getTime() > today.getTime()) {
          // For future dates, offer a full day of slots
          for (let i = 9; i < 17; i++) { // From 9 AM to 4 PM
            this.availableTimeSlots.push(`${i}:00 - ${i}:30`);
            this.availableTimeSlots.push(`${i}:30 - ${i + 1}:00`);
          }
        }
  
        // Enable time slot selection if slots are available
        if (this.availableTimeSlots.length > 0) {
          this.appointmentForm.get('selectedTimeSlot')?.enable();
        } else {
          this.appointmentForm.get('selectedTimeSlot')?.disable();
        }
      } else {
        this.appointmentForm.get('selectedTimeSlot')?.disable();
      }
    }
  
    onSubmit(): void {
      if (this.appointmentForm.valid) {
        const formValue = this.appointmentForm.value;
        this.submittedAppointment = {
          service: formValue.selectedService ? this.availableServices[0] : '', // Default to first service for demo
          date: formValue.selectedDate,
          time: formValue.selectedTimeSlot,
          note: formValue.note || '' 
        };
        console.log('Appointment Scheduled:', this.submittedAppointment);
  
        this.scheduledAppointments.push(this.submittedAppointment); // Add to scheduled appointments
        this.appointmentForm.reset(); // Reset the form

        // In a real app, you would send this data to your backend API:
        // this.appointmentService.scheduleAppointment(this.submittedAppointment).subscribe({
        //   next: (response) => {
        //     console.log('Backend response:', response);
        //     // Show success message, clear form, etc.
        //     this.appointmentForm.reset();
        //     this.appointmentForm.get('selectedTimeSlot')?.disable();
        //     this.availableTimeSlots = [];
        //   },
        //   error: (err) => {
        //     console.error('Error scheduling appointment:', err);
        //     // Show error message
        //   }
        // });
      } else {
        // Mark all fields as touched to show validation errors
        this.appointmentForm.markAllAsTouched();
      }
    }

    editAppointment(index: number): void {
      const appointment = this.scheduledAppointments[index];
      this.appointmentForm.patchValue({
        selectedService: appointment.service,
        selectedDate: appointment.date,
        selectedTimeSlot: appointment.time,
        note: appointment.note
      });
  
      // Optionally remove the appointment from the list to avoid duplication
      this.scheduledAppointments.splice(index, 1);
    }
  
    deleteAppointment(index: number): void {
      this.scheduledAppointments.splice(index, 1); // Remove the appointment from the list
    }
}