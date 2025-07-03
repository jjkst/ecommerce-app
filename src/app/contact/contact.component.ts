import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { EmailService } from '../services/email.service';
import { Contact } from '../models/contact.model';

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

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      questions: ['', Validators.required]
    });
  }

  async onSubmit(): Promise<void> {
    this.successMessage = '';
    this.errorMessage = '';
    if (this.contactForm.valid) {
      this.loading = true;

      try {
        const formValue = this.contactForm.value;
        const contactData: Contact = {
          FirstName: formValue.firstName,
          LastName: formValue.lastName,
          Email: formValue.email,
          PhoneNumber: formValue.phoneNumber,
          Questions: formValue.questions
        };

        // Validate data before submission
        if (!this.emailService.validateContactData(contactData)) {
          throw new Error('Please fill in all required fields correctly.');
        }

        const response = await this.emailService.sendEmail(contactData);
        if (response.status === 200 || response.status === 201) {
          this.successMessage = 'Your message has been sent successfully!';
        } else {
          this.errorMessage = 'Sorry error sending email reported to the support team.'
          console.error('Error sending email:', response);
        }
      } catch (error) {
        this.errorMessage = 'Sorry error sending email reported to the support team.'
        console.error('Error sending email:', error);
      } finally {
        this.loading = false;
      }
    } else {
      this.contactForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }
}