import { Component, OnInit } from '@angular/core';
import { BookingService } from '../services/booking.service';

@Component({
  selector: 'app-requests',
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>📋 Available Requests</h2>
        <p>Pending borewell drilling requests in your area — accept a job to get started.</p>
      </div>

      <div *ngIf="loading" class="loading">⏳ Loading available requests...</div>

      <div *ngIf="!loading && requests.length === 0" class="empty-state">
        <div class="empty-state-icon">🎉</div>
        <h3>No pending requests right now</h3>
        <p>Check back soon — new customer requests appear here in real-time.</p>
      </div>

      <div *ngFor="let req of requests" class="job-card">
        <div class="job-card-top">
          <div class="job-card-info">
            <h4>📍 {{req.city}}, {{req.state}} – {{req.pincode}}</h4>
            <p><strong>Customer:</strong> {{req.customer?.name}} ({{req.customer?.phone || 'N/A'}})</p>
            <p><strong>Land Type:</strong> {{req.landType | titlecase}}</p>
            <p><strong>Preferred Date:</strong> {{req.preferredDate | date:'mediumDate'}}</p>
            <p *ngIf="req.estimatedDepth"><strong>Est. Depth:</strong> {{req.estimatedDepth}} feet</p>
            <p *ngIf="req.notes"><strong>Notes:</strong> {{req.notes}}</p>
            <div style="margin-top: 12px;">
              <span class="badge pending">⏳ Pending</span>
            </div>
          </div>
          <div class="job-card-actions">
            <label style="font-size:0.8rem;font-weight:600;color:#6b7280;">Estimated Cost (₹)</label>
            <input type="number" class="cost-input" [(ngModel)]="req.inputCost" placeholder="Enter your price...">
            <button class="btn btn-primary btn-sm" (click)="acceptRequest(req)" [disabled]="req.accepting">
              {{ req.accepting ? '⏳ Accepting...' : '✅ Accept Job' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RequestsComponent implements OnInit {
  requests: any[] = [];
  loading = true;

  constructor(private bookingService: BookingService) {}

  ngOnInit() { this.loadRequests(); }

  loadRequests() {
    this.loading = true;
    this.bookingService.getAvailableRequests().subscribe({
      next: (data) => { this.requests = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  acceptRequest(req: any) {
    if (!req.inputCost || req.inputCost <= 0) {
      alert('Please enter a valid estimated cost before accepting.');
      return;
    }
    req.accepting = true;
    this.bookingService.acceptBooking(req._id, req.inputCost).subscribe({
      next: () => {
        alert('✅ Job accepted successfully! Check My Jobs to manage it.');
        this.loadRequests();
      },
      error: (err) => {
        req.accepting = false;
        alert(err.error?.message || 'Failed to accept the job. Please try again.');
      }
    });
  }
}
