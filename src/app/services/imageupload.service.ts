import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { inject } from '@angular/core';
import { environment } from 'environment';

@Injectable({ providedIn: 'root' })
export class ImageUploadService {

    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiBaseUrl}/uploadimage`; 

    async uploadImage(file: File): Promise<any> {
        const formData = new FormData();
        formData.append('file', file);
        return await lastValueFrom(this.http.post(`${this.apiUrl}`, formData));
    }

}
