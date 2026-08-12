import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  template: `
    <div class="page-content">
      <div class="profile-container">
        <div class="profile-header">
          <div class="profile-avatar">{{nameInitial}}</div>
          <h2>{{user.name || 'Your Profile'}}</h2>
          <span>Borewell Contractor · InRand</span>
        </div>
        <div class="profile-body">
          <div class="success-msg" *ngIf="message && !message.includes('Failed')">✅ {{message}}</div>
          <div class="error-msg" *ngIf="message && message.includes('Failed')">{{message}}</div>
          <form (ngSubmit)="onSubmit()" #f="ngForm">
            <div style="margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid #e5e7eb;">
              <p style="font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;margin-bottom:14px;">Personal Info</p>
              <div class="form-group">
                <label>Full Name</label>
                <input type="text" [(ngModel)]="user.name" name="name" required placeholder="Your full name">
              </div>
              <div class="form-group">
                <label>Email Address</label>
                <input type="email" [(ngModel)]="user.email" name="email" placeholder="your@email.com">
              </div>
              <div class="form-group">
                <label>Phone Number</label>
                <input type="text" [(ngModel)]="user.phone" name="phone" placeholder="+91 98765 43210">
              </div>
            </div>
            <div style="margin-bottom:20px;">
              <p style="font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;margin-bottom:14px;">Business Info</p>
              <div class="form-group">
                <label>Business / Company Name</label>
                <input type="text" [(ngModel)]="user.businessName" name="businessName" placeholder="e.g. Kumar Drilling Services">
              </div>
              <div class="form-group">
                <label>Service Area</label>
                <input type="text" [(ngModel)]="user.serviceArea" name="serviceArea" placeholder="e.g. Rajasthan, Gujarat">
              </div>
              <div class="form-group">
                <label>Years of Experience</label>
                <input type="number" [(ngModel)]="user.experienceYears" name="experienceYears" placeholder="e.g. 8">
              </div>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;" [disabled]="loading">
              {{ loading ? '⏳ Saving...' : '💾 Save Changes' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user: any = { name: '', email: '', phone: '', businessName: '', serviceArea: '', experienceYears: null };
  message = '';
  loading = false;
  nameInitial = '?';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.http.get(`${environment.apiUrl}/users/me`).subscribe({
      next: (data: any) => {
        this.user = {
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          businessName: data.businessName || '',
          serviceArea: data.serviceArea || '',
          experienceYears: data.experienceYears || null
        };
        this.nameInitial = (data.name || '?').charAt(0).toUpperCase();
      },
      error: () => {}
    });
  }

  onSubmit() {
    this.loading = true;
    this.message = '';
    this.http.put(`${environment.apiUrl}/users/me`, this.user).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Profile updated successfully!';
        this.nameInitial = (this.user.name || '?').charAt(0).toUpperCase();
        setTimeout(() => this.message = '', 4000);
      },
      error: () => {
        this.loading = false;
        this.message = 'Failed to update profile. Please try again.';
      }
    });
  }
}
