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
import { ImageUploadService } from '../services/imageupload.service';

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

  file: File | undefined; // For image file upload
  fileName: string = '';
  fileUploadError: string | null = null; // For image upload error message

  constructor(private fb: FormBuilder, private productService: ProductService, 
    private imguploadService: ImageUploadService) {}

  async ngOnInit(): Promise<void> {
    this.serviceForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      fileName: [''], // File name for the image
      hourlyPrice: ['', [Validators.required, Validators.min(0)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.serviceForm.valid) {
      const newService = this.serviceForm.value;
      newService.fileName = this.fileName; 
      console.log('New Service Data:', newService);
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

      // Upload file
      if (this.file) {
        this.imguploadService.uploadImage(this.file).then(() => {
          console.log('File uploaded successfully');
          this.fileUploadError = null;
        }).catch((error) => {
          console.error('File upload failed:', error);
          this.fileUploadError = 'Failed to upload file. Please try again.';
        });
      } else {
        this.fileUploadError = 'Please select a valid file.';
      }
    }
  }

  onFileSelected(event: Event): void {
    this.file = (event.target as HTMLInputElement).files?.[0];
    if (this.file) {
      this.fileName = this.file.name;
    }   
  }

  // Resets all states and clears the file input


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
