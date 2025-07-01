import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    CommonModule
  ],
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      questions: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';
    if (this.contactForm.valid) {
      this.loading = true;
      // Simulate async submission (replace with real API call)
      setTimeout(() => { 
        this.loading = false;
        this.successMessage = 'Your message has been sent successfully!';
        this.contactForm.reset();
      }, 1500);
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }
}