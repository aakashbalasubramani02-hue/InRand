import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  getAvailableRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/available`);
  }

  getAssignedJobs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/assigned`);
  }

  acceptBooking(id: string, estimatedCost: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/accept`, { estimatedCost });
  }

  updateBookingStatus(id: string, status: string, estimatedCost?: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status, estimatedCost });
  }
}
