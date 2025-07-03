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
  loading = false;
  successMessage = '';
  errorMessage = '';

  file: File | undefined;
  fileName: string = '';
  fileUploadError: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder, 
    private productService: ProductService, 
    private imguploadService: ImageUploadService
  ) {}

  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      fileName: [''],
      hourlyPrice: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async onSubmit(): Promise<void> {
    this.successMessage = '';
    this.errorMessage = '';
    if (this.serviceForm.valid) {
      this.loading = true;

      try {
        const formValue = this.serviceForm.value;
        const newService: Service = {
          Title: formValue.title,
          Description: formValue.description,
          FileName: this.fileName || 'default-image.jpg',
          Price: formValue.hourlyPrice
        };

        // Validate required fields
        if (!this.productService.validateServiceData(newService)) {
          throw new Error('Please fill in all required fields correctly.');
        }

        const response = await this.productService.addService(newService);
        if (response.status === 200 || response.status === 201) {
          this.successMessage = 'New Service Added Successfully!';
          if (this.file) {
            await this.uploadFile();
            this.clearFileInput();
          }
        }
        else if (response.status === 409) {
          this.errorMessage = 'A service with this name already exists.';
        } else {
          this.errorMessage = 'Error Adding Service'
          console.error('Error Adding Service:', response);
        }
      } catch (error: any) {
        this.errorMessage = 'Error Adding Service'
        console.error('Error adding service:', error);
      } finally {
        this.loading = false;
      }
    } else {
      this.serviceForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all required fields correctly.';
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

}
