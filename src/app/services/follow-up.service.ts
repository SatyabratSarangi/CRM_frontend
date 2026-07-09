import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FollowUp } from '../models/follow-up.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FollowUpService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getByLeadId(leadId: number): Observable<FollowUp[]> {
    return this.http.get<FollowUp[]>(`${this.apiUrl}/leads/${leadId}/followups`);
  }

  create(leadId: number, followUp: FollowUp): Observable<FollowUp> {
    return this.http.post<FollowUp>(`${this.apiUrl}/leads/${leadId}/followups`, followUp);
  }
}
