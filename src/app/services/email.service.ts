import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { BaseService } from './base.service';
import { Contact } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService extends BaseService {
  private readonly endpoint = '/email/send';

  async sendEmail(contact: Contact): Promise<HttpResponse<Contact>> {
    return await this.post<Contact>(this.endpoint, contact);
  }

  validateContactData(contact: Contact): boolean {
    const requiredFields = ['FirstName', 'LastName', 'Email', 'PhoneNumber', 'Questions'];
    return this.validateRequiredFields(contact, requiredFields);
  }
}
