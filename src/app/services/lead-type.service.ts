import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeadType } from '../models/lead-type.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeadTypeService {
  private apiUrl = `${environment.apiUrl}/lead-types`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<LeadType[]> {
    return this.http.get<LeadType[]>(this.apiUrl);
  }

  getById(id: number): Observable<LeadType> {
    return this.http.get<LeadType>(`${this.apiUrl}/${id}`);
  }

  create(leadType: LeadType): Observable<LeadType> {
    return this.http.post<LeadType>(this.apiUrl, leadType);
  }

  update(id: number, leadType: LeadType): Observable<LeadType> {
    return this.http.put<LeadType>(`${this.apiUrl}/${id}`, leadType);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
