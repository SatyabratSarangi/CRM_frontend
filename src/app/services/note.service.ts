import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from '../models/note.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getByLeadId(leadId: number): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/leads/${leadId}/notes`);
  }

  create(leadId: number, note: Note): Observable<Note> {
    return this.http.post<Note>(`${this.apiUrl}/leads/${leadId}/notes`, note);
  }
}
