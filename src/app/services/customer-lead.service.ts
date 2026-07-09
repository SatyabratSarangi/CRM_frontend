import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerLead } from '../models/customer-lead.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerLeadService {
  private apiUrl = `${environment.apiUrl}/leads`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<CustomerLead[]> {
    return this.http.get<CustomerLead[]>(this.apiUrl);
  }

  search(filters: { name?: string; status?: string; priority?: string; city?: string }): Observable<CustomerLead[]> {
    let params = new HttpParams();
    if (filters.name) params = params.set('name', filters.name);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.priority) params = params.set('priority', filters.priority);
    if (filters.city) params = params.set('city', filters.city);
    return this.http.get<CustomerLead[]>(`${this.apiUrl}/search`, { params });
  }

  getById(id: number): Observable<CustomerLead> {
    return this.http.get<CustomerLead>(`${this.apiUrl}/${id}`);
  }

  create(lead: CustomerLead): Observable<CustomerLead> {
    return this.http.post<CustomerLead>(this.apiUrl, lead);
  }

  update(id: number, lead: CustomerLead): Observable<CustomerLead> {
    return this.http.put<CustomerLead>(`${this.apiUrl}/${id}`, lead);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
