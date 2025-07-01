import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Service } from '../models/service.model';
import { ProductService } from '../services/product.service';
import { ImageUploadService } from '../services/imageupload.service';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-service-manager',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './service-manager.component.html',
  styleUrl: './service-manager.component.scss'
})
export class ServiceManagerComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;

  serviceForm!: FormGroup;
  dynamicBackgroundColor: string = 'purple';
  toolbarTitle: string = 'Service Manager'; 
  cardTitle: string = 'Add Your Product/Service';
  services: Service[] = [];
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;
  file: File | undefined;
  fileName: string = '';
  fileUploadError: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder, 
    private productService: ProductService, 
    private imguploadService: ImageUploadService
  ) {}

  ngOnInit(): Promise<void> {
    this.initializeForm();
    this.loadServices();
    return Promise.resolve();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.serviceForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      fileName: [''],
      hourlyPrice: ['', [Validators.required, Validators.min(0)]]
    });
  }

  async loadServices(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const response = await this.productService.getServices();
      this.services = response.body || [];
      console.log('Services loaded successfully:', this.services);
    } catch (error) {
      console.error('Error loading services:', error);
      this.error = 'Failed to load services. Please try again later.';
    } finally {
      this.loading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.serviceForm.valid) {
      this.loading = true;
      this.error = null;
      this.successMessage = null;

      try {
        const formValue = this.serviceForm.value;
        const newService: Service = {
          Title: formValue.title,
          Description: formValue.description,
          FileName: this.fileName || 'default-image.jpg',
          Price: formValue.hourlyPrice
        };

        // Validate required fields
        const requiredFields = ['Title', 'Description', 'Price'];
        if (!this.validateRequiredFields(newService, requiredFields)) {
          throw new Error('Please fill in all required fields correctly.');
        }

        console.log('New Service Data:', newService);

        // Add service to API
        const response = await this.productService.addService(newService);
        
        if (response.status === 200 || response.status === 201) {
          this.toolbarTitle = 'New Service Added Successfully!';
          this.dynamicBackgroundColor = 'green';
          this.successMessage = 'Service added successfully!';
          this.serviceForm.reset();
          this.clearFileInput();
          
          // Reload services to show the new one
          await this.loadServices();
        }

        // Upload file if selected
        if (this.file) {
          await this.uploadFile();
        }

      } catch (error: any) {
        console.error('Error adding service:', error);
        
        if (error.status === 409) {
          this.toolbarTitle = 'Service Already Exists';
          this.dynamicBackgroundColor = 'orange';
          this.error = 'A service with this name already exists.';
        } else {
          this.toolbarTitle = 'Error Adding Service';
          this.dynamicBackgroundColor = 'red';
          this.error = this.formatErrorMessage(error);
        }
      } finally {
        this.loading = false;
      }
    } else {
      this.serviceForm.markAllAsTouched();
      this.error = 'Please fill in all required fields correctly.';
    }
  }

  private async uploadFile(): Promise<void> {
    if (!this.file) {
      this.fileUploadError = 'Please select a valid file.';
      return;
    }

    try {
      await this.imguploadService.uploadImage(this.file);
      console.log('File uploaded successfully');
      this.fileUploadError = null;
      this.successMessage = 'File uploaded successfully!';
    } catch (error) {
      console.error('File upload failed:', error);
      this.fileUploadError = 'Failed to upload file. Please try again.';
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.file = target.files?.[0];
    
    if (this.file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(this.file.type)) {
        this.fileUploadError = 'Please select a valid image file (JPEG, PNG, GIF, WebP).';
        this.file = undefined;
        this.fileName = '';
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (this.file.size > maxSize) {
        this.fileUploadError = 'File size must be less than 5MB.';
        this.file = undefined;
        this.fileName = '';
        return;
      }

      this.fileName = this.file.name;
      this.fileUploadError = null;
    }
  }

  private clearFileInput(): void {
    this.file = undefined;
    this.fileName = '';
    this.fileUploadError = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  retryLoad(): void {
    this.loadServices();
  }

  clearMessages(): void {
    this.error = null;
    this.successMessage = null;
    this.fileUploadError = null;
  }

  getFieldError(fieldName: string): string {
    const field = this.serviceForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
      }
      if (field.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['minlength'].requiredLength} characters.`;
      }
      if (field.errors['min']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['min'].min}.`;
      }
    }
    return '';
  }

  private validateRequiredFields(data: any, requiredFields: string[]): boolean {
    return requiredFields.every(field => data[field] !== null && data[field] !== undefined && data[field] !== '');
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
