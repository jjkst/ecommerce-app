import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { Service } from '../models/service.model';
import { ProductService } from '../services/product.service';
import { ImageUploadService } from '../services/imageupload.service';
import { MaterialModule } from '../material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HorizontalCardListComponent } from '../shared/horizontal-card-list.component';

@Component({
  selector: 'app-service-manager',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    HorizontalCardListComponent,
  ],
  templateUrl: './service-manager.component.html',
  styleUrl: './service-manager.component.scss',
})
export class ServiceManagerComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;
  serviceForm!: FormGroup;
  formbuttonText = 'Add Service';
  formId = 0;
  loading = false;
  file: File | undefined;
  fileName: string = '';
  fileUploadError: string | null = null;
  private destroy$ = new Subject<void>();

  services: Service[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private imguploadService: ImageUploadService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      fileName: [''],
      hourlyPrice: ['', [Validators.required, Validators.min(0)]],
    });
    this.loadServices();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async onSubmit(): Promise<void> {
    if (this.serviceForm.valid) {
      this.loading = true;

      const formValue = this.serviceForm.value;
      const addUpdateService: Service = {
        Id: this.formId,
        Title: formValue.title,
        Description: formValue.description,
        FileName: this.fileName || 'default-image.jpg',
        Price: formValue.hourlyPrice,
      };

      if (!this.productService.validateServiceData(addUpdateService)) {
        this.showToast(
          'Please fill in all required fields correctly.',
          'error'
        );
        this.loading = false;
        return;
      }

      try {
        const response =
          this.formId === 0
            ? await this.productService.addService(addUpdateService)
            : await this.productService.updateService(
                addUpdateService?.Id ?? 0,
                addUpdateService
              );

        if (response.status === 200 || response.status === 201) {
          this.showToast('Service Added/Updated Successfully!', 'success');
          if (this.file) {
            await this.uploadFile();
          }
          this.resetForm();
          this.loadServices();
        } else if (response.status === 409) {
          this.showToast('A service with this name already exists.', 'error');
        } else {
          this.showToast('Error Adding Service', 'error');
          console.error('Error Adding Service:', response);
        }
      } catch (error: any) {
        this.showToast('Error Adding Service', 'error');
        console.error('Error adding service:', error);
      } finally {
        this.loading = false;
      }
    } else {
      this.serviceForm.markAllAsTouched();
      this.showToast('Please fill in all required fields correctly.', 'error');
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
      this.showToast('File uploaded successfully!', 'success');
    } catch (error) {
      console.error('File upload failed:', error);
      this.fileUploadError = 'Failed to upload file. Please try again.';
      this.showToast('Failed to upload file. Please try again.', 'error');
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.file = target.files?.[0];

    if (this.file) {
      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
      ];
      if (!allowedTypes.includes(this.file.type)) {
        this.fileUploadError =
          'Please select a valid image file (JPEG, PNG, GIF, WebP).';
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

  private async loadServices(): Promise<void> {
    try {
      const response = await this.productService.getServices();
      if (response.status === 200 && Array.isArray(response.body)) {
        this.services =
          response.body.map((service) => ({
            Id: service.id,
            Title: service.title,
            Description: service.description,
            Price: service.price,
            FileName: service.fileName,
          })) || [];
      }
    } catch (error) {
      console.error('Error loading services:', error);
      this.showToast('Error loading existing services', 'error');
    }
  }

  editService(service: Service): void {
    this.formId = service.Id ?? 0;
    this.fileName = service.FileName;
    this.serviceForm.patchValue({
      title: service.Title,
      description: service.Description,
      hourlyPrice: service.Price,
    });

    // Scroll to the form section
    const formElement = document.querySelector('.service-manager-card');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }

    this.showToast(
      'Service loaded for editing. Update the details and click "Update Service".',
      'info'
    );
    this.formbuttonText = 'Update Service';
  }

  async deleteService(service: Service): Promise<void> {
    if (confirm(`Are you sure you want to delete "${service.Title}"?`)) {
      try {
        this.loading = true;
        const response = await this.productService.deleteService(service.Id ?? 0);
        if (response.status === 200 || response.status === 204) {
          this.showToast('Service deleted successfully!', 'success');
          this.loadServices();
        } else {
          this.showToast('Error deleting services', 'error');
        }
      } catch (error) {
        console.error('Error deleting service:', error);
        this.showToast('Error deleting service', 'error');
      } finally {
        this.loading = false;
      }
    }
  }

  private showToast(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning'
  ): void {
    const duration = 3000; // 3 seconds

    this.snackBar.open(message, 'Close', {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [`toast-${type}`],
    });
  }

  private resetForm(): void {
    // Reset form with empty values and clear validation state
    this.serviceForm.reset({
      title: '',
      description: '',
      fileName: '',
      hourlyPrice: '',
    });

    this.formId = 0;
    this.formbuttonText = 'Add Service';
    this.clearFileInput();
  }

  private clearFileInput(): void {
    this.file = undefined;
    this.fileName = '';
    this.fileUploadError = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  getServiceImageUrl(service: Service): string {
    return `assets/${service.FileName}`;
  }

  getServiceTitle(service: Service): string {
    return service.Title;
  }
}
