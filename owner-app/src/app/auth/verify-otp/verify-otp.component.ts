import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  template: `
    <div class="auth-wrapper">
      <div class="auth-container">
        <div class="auth-logo">
          <div class="auth-logo-icon">✉️</div>
          <h2>Verify Your Account</h2>
          <p class="auth-sub">Enter the 6-digit OTP sent to<br><strong>{{identifier}}</strong></p>
        </div>
        <div class="error-msg" *ngIf="error">{{error}}</div>
        <form (ngSubmit)="onSubmit()" #f="ngForm">
          <div class="form-group">
            <label>OTP Code</label>
            <input
              type="text"
              [(ngModel)]="otp"
              name="otp"
              placeholder="Enter 6-digit OTP"
              required
              maxlength="6"
              style="font-size: 1.4rem; letter-spacing: 0.3em; text-align: center; font-weight: 700;"
            >
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;" [disabled]="loading">
            {{ loading ? '⏳ Verifying...' : '✅ Verify & Continue' }}
          </button>
        </form>
        <div class="text-center" style="margin-top: 14px;">
          <a routerLink="/login" style="color: #6b7280;">← Back to Login</a>
        </div>
      </div>
    </div>
  `
})
export class VerifyOtpComponent implements OnInit {
  otp = '';
  identifier = '';
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.identifier = params['identifier'];
      if (!this.identifier) {
        this.router.navigate(['/login']);
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.authService.verifyOtp(this.identifier, this.otp).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Verification failed. Check your OTP and try again.';
      }
    });
  }
}
