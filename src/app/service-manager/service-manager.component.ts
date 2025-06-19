import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Service } from '../models/service.model';
import { ProductService } from '../services/product.service';
import { NgClass, NgIf } from '@angular/common';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon'; // For file upload icon

@Component({
  selector: 'app-service-manager',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgIf,
    MatToolbarModule,
    MatProgressBarModule,
    MatIconModule
  ],
  templateUrl: './service-manager.component.html',
  styleUrl: './service-manager.component.scss'
})
export class ServiceManagerComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  serviceForm!: FormGroup;
  dynamicBackgroundColor: string = 'purple';
  toolbarTitle: string = 'Service Manager'; 
  cardTitle: string = 'Add Your Product/Service';
  services: Service[] = [];

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  uploadStatus: string | null = null;
  uploadError: string | null = null;
  uploadedImageUrl: string | null = null;
  uploadProgress: number | null = null; // For MatProgressBar

  constructor(private fb: FormBuilder, private productService: ProductService) {}

  async ngOnInit(): Promise<void> {
    this.serviceForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      imageLink: ['', Validators.required],
      hourlyPrice: ['', [Validators.required, Validators.min(0)]]
    });

    const newService = this.serviceForm.value;
    this.services = await this.productService.addService(newService);
  }

  async onSubmit(): Promise<void> {
    if (this.serviceForm.valid) {
      const newService = this.serviceForm.value;
      try {
        await this.productService.addService(newService);
        this.toolbarTitle = 'New Service Added Successfully';
        this.dynamicBackgroundColor = 'green';
        this.serviceForm.reset(); 
      }
      catch (error: any) {
        if (error.status === 409) {
          this.toolbarTitle = 'Service Already Exists';
          this.dynamicBackgroundColor = 'orange';
          return;
        }
        console.error('Error adding service:', error);
        this.toolbarTitle = 'Error Adding Service';
        this.dynamicBackgroundColor = 'red';
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.resetUploadState(); // Reset previous states

      // Create a URL for image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.clearSelection(); // If no file is selected (e.g., dialog cancelled)
    }
  }

  onUpload(): void {
    if (!this.selectedFile) {
      this.uploadError = 'Please select an image file first.';
      return;
    }

    this.uploadStatus = 'Uploading...';
    this.uploadError = null;
    this.uploadedImageUrl = null;
    this.uploadProgress = 0; // Start progress bar at 0

    const formData = new FormData();
    formData.append('image', this.selectedFile, this.selectedFile.name);

    // const headers = new HttpHeaders();
    // // Do NOT set Content-Type header when sending FormData.

    // const req = new HttpRequest('POST', this.uploadUrl, formData, {
    //   headers: headers,
    //   reportProgress: true
    // });

    // this.http.request(req)
    //   .pipe(
    //     finalize(() => {
    //       this.uploadProgress = null; // Hide progress bar on completion
    //     })
    //   )
    //   .subscribe({
    //     next: (event: HttpEventType | any) => {
    //       if (event.type === HttpEventType.UploadProgress) {
    //         this.uploadProgress = Math.round(100 * event.loaded / event.total);
    //         this.uploadStatus = `Uploading... ${this.uploadProgress}%`;
    //       } else if (event.type === HttpEventType.Response) {
    //         console.log('Upload complete!', event);
    //         if (event.status === HttpStatusCode.Ok || event.status === HttpStatusCode.Created) {
    //           this.uploadStatus = 'Upload successful!';
    //           this.uploadedImageUrl = event.body?.imageUrl || 'No URL returned';
    //           // Optionally: this.clearFileInput(); if you want to immediately clear after success
    //         } else {
    //           this.uploadError = `Upload failed with status: ${event.status}`;
    //         }
    //       }
    //     },
    //     error: (err) => {
    //       console.error('Upload Error:', err);
    //       this.uploadStatus = 'Upload failed.';
    //       this.uploadProgress = null; // Hide progress bar on error
    //       if (err.status) {
    //         this.uploadError = `Server error (${err.status}): ${err.error?.message || err.message || 'Something went wrong.'}`;
    //       } else {
    //         this.uploadError = `Network error: Could not connect to the server.`;
    //       }
    //     }
    //   });
  }

  // Resets all states and clears the file input
  clearSelection(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.resetUploadState();
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private resetUploadState(): void {
    this.uploadStatus = null;
    this.uploadError = null;
    this.uploadedImageUrl = null;
    this.uploadProgress = null;
  }

  // services: Service[] = [
  //   { Title: 'Service 1', Description: 'Description 1', ImageLink: 'link1.jpg', Price: 100 },
  //   { Title: 'Service 2', Description: 'Description 2', ImageLink: 'link2.jpg', Price: 200 }
  // ];


  // editService(index: number, updatedService: Service): void {
  //   this.services[index] = updatedService;
  // }

  // deleteService(index: number): void {
  //   this.services.splice(index, 1);
  // }
}
