import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  template: `
    <div class="auth-wrapper">
      <div class="auth-container">
        <div class="auth-logo">
          <div class="auth-logo-icon">🏗️</div>
          <h2>Join as Contractor</h2>
          <p class="auth-sub">Register your drilling business on InRand</p>
        </div>
        <div class="error-msg" *ngIf="error">{{error}}</div>
        <form (ngSubmit)="onSubmit()" #f="ngForm">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="user.name" name="name" placeholder="e.g. Rajesh Kumar" required>
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" [(ngModel)]="user.email" name="email" placeholder="you@example.com">
          </div>
          <div class="form-group">
            <label>Phone Number</label>
            <input type="text" [(ngModel)]="user.phone" name="phone" placeholder="+91 98765 43210">
          </div>
          <div class="form-group">
            <label>Password <span style="color:#6b7280;font-weight:400">(min 6 characters)</span></label>
            <input type="password" [(ngModel)]="user.password" name="password" placeholder="Create a secure password" required minlength="6">
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;" [disabled]="loading">
            {{ loading ? '⏳ Creating account...' : '🚀 Create Contractor Account' }}
          </button>
        </form>
        <div class="text-center">
          Already have an account? <a routerLink="/login">Sign in →</a>
        </div>
      </div>
    </div>
  `
})
export class SignupComponent {
  user = { name: '', email: '', phone: '', password: '' };
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.user.email && !this.user.phone) {
      this.error = 'Please provide an email or phone number.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.authService.signup(this.user).subscribe({
      next: () => {
        this.router.navigate(['/verify-otp'], {
          queryParams: { identifier: this.user.email || this.user.phone }
        });
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Signup failed. Please try again.';
      }
    });
  }
}
