import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <div class="auth-wrapper">
      <div class="auth-container">
        <div class="auth-logo">
          <div class="auth-logo-icon">🏗️</div>
          <h2>Owner Sign In</h2>
          <p class="auth-sub">Sign in to your InRand contractor account</p>
        </div>
        <div class="error-msg" *ngIf="error">{{error}}</div>
        <form (ngSubmit)="onSubmit()" #f="ngForm">
          <div class="form-group">
            <label>Email or Phone Number</label>
            <input type="text" [(ngModel)]="identifier" name="identifier" placeholder="Enter your email or phone" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="Enter your password" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;" [disabled]="loading">
            {{ loading ? '⏳ Signing in...' : '🔐 Sign In' }}
          </button>
        </form>
        <div class="text-center">
          Don't have an account? <a routerLink="/signup">Register as contractor →</a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  identifier = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.authService.login(this.identifier, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.loading = false;
        if (err.error?.unverified) {
          this.router.navigate(['/verify-otp'], { queryParams: { identifier: this.identifier } });
        } else {
          this.error = err.error?.message || 'Invalid credentials. Please try again.';
        }
      }
    });
  }
}
