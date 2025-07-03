import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { Availability } from '../models/availability.model';

@Component({
  selector: 'app-availability-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './availability-manager.component.html',
  styleUrls: ['./availability-manager.component.scss']
})
export class AvailabilityManagerComponent {
  availabilityForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  submittedAvailabilities: Availability[] = [];
  constructor(private fb: FormBuilder) {
    this.availabilityForm = this.fb.group({
      StartDate: [null, Validators.required],
      EndDate: [null, Validators.required],
      Timeslots: ['', Validators.required], // comma-separated string
      Description: ['']
    });
  }

  onSubmit(): void {
    if (this.availabilityForm.valid) {
      const formValue = this.availabilityForm.value;
      const availability: Availability = {
        StartDate: formValue.StartDate,
        EndDate: formValue.EndDate,
        Timeslots: formValue.Timeslots.split(',').map((s: string) => s.trim()),
        Description: formValue.Description
      };
      this.submittedAvailabilities.push(availability);
      this.availabilityForm.reset();
    } else {
      this.availabilityForm.markAllAsTouched();
    }
  }
} 