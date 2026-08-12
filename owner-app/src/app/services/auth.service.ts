import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private userSubject = new BehaviorSubject<any>(this.getCurrentUser());

  constructor(private http: HttpClient) {}

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('inrand_owner') || 'null');
  }

  isLoggedIn() {
    return !!this.getCurrentUser();
  }

  login(identifier: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { identifier, password, role: 'owner' }).pipe(
      tap((res: any) => {
        localStorage.setItem('inrand_owner', JSON.stringify(res));
        this.userSubject.next(res);
      })
    );
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { ...userData, role: 'owner' });
  }

  verifyOtp(identifier: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otp`, { identifier, otp }).pipe(
      tap((res: any) => {
        localStorage.setItem('inrand_owner', JSON.stringify(res));
        this.userSubject.next(res);
      })
    );
  }

  logout() {
    localStorage.removeItem('inrand_owner');
    this.userSubject.next(null);
  }
}
