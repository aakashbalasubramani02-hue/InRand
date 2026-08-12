import { Component, OnInit } from '@angular/core';
import { BookingService } from '../services/booking.service';

@Component({
  selector: 'app-jobs',
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>🔨 My Jobs</h2>
        <p>Manage your accepted drilling jobs — update status and track progress.</p>
      </div>

      <div class="filter-bar">
        <label>Filter by Status:</label>
        <select [(ngModel)]="filterStatus" (change)="filterJobs()">
          <option value="all">All Jobs</option>
          <option value="accepted">✅ Accepted</option>
          <option value="in-progress">🔨 In Progress</option>
          <option value="completed">🎉 Completed</option>
        </select>
        <span style="color:#6b7280; font-size:0.85rem;">{{filteredJobs.length}} job(s)</span>
      </div>

      <div *ngIf="loading" class="loading">⏳ Loading your jobs...</div>

      <div *ngIf="!loading && filteredJobs.length === 0" class="empty-state">
        <div class="empty-state-icon">📋</div>
        <h3>No jobs found</h3>
        <p>Accept requests from the "Available Requests" page to see them here.</p>
      </div>

      <div *ngFor="let job of filteredJobs" class="job-card">
        <div class="job-card-top">
          <div class="job-card-info">
            <h4>📍 {{job.fullAddress}}, {{job.city}}, {{job.state}}</h4>
            <p><strong>Customer:</strong> {{job.customer?.name}} | {{job.customer?.phone}}</p>
            <p><strong>Preferred Date:</strong> {{job.preferredDate | date:'mediumDate'}}</p>
            <p><strong>Estimated Cost:</strong> ₹{{job.estimatedCost?.toLocaleString() || 'Not set'}}</p>
            <p *ngIf="job.estimatedDepth"><strong>Depth:</strong> {{job.estimatedDepth}} feet</p>
            <div style="margin-top: 12px;">
              <span class="badge {{job.status}}">
                {{ statusEmoji[job.status] }} {{ job.status | titlecase }}
              </span>
            </div>
          </div>
          <div class="job-card-actions">
            <ng-container *ngIf="job.status === 'accepted'">
              <button class="btn btn-secondary btn-sm" (click)="updateStatus(job, 'in-progress')">
                🔨 Start Job
              </button>
            </ng-container>
            <ng-container *ngIf="job.status === 'in-progress'">
              <label style="font-size:0.8rem;font-weight:600;color:#6b7280;">Update Cost (₹)</label>
              <input type="number" class="cost-input" [(ngModel)]="job.newCost" [placeholder]="job.estimatedCost || 'Final cost...'">
              <button class="btn btn-success btn-sm" (click)="updateStatus(job, 'completed')">
                🎉 Mark Completed
              </button>
            </ng-container>
            <ng-container *ngIf="job.status === 'completed'">
              <span style="color: #22c55e; font-size: 0.85rem; font-weight: 600; display: block;">✅ Job Done</span>
              <div style="margin-top: 8px;">
                <span *ngIf="job.paymentStatus !== 'paid'" class="badge" style="background: #fef08a; color: #854d0e; border: 1px solid #eab308;">
                  ⏳ Payment Pending
                </span>
                <span *ngIf="job.paymentStatus === 'paid'" class="badge" style="background: #dcfce7; color: #166534; border: 1px solid #22c55e;">
                  💳 Payment Received
                </span>
              </div>
            </ng-container>
          </div>
        </div>
      </div>
    </div>
  `
})
export class JobsComponent implements OnInit {
  jobs: any[] = [];
  filteredJobs: any[] = [];
  filterStatus = 'all';
  loading = true;

  statusEmoji: any = {
    'pending': '⏳', 'accepted': '✅', 'in-progress': '🔨', 'completed': '🎉', 'cancelled': '❌'
  };

  constructor(private bookingService: BookingService) {}

  ngOnInit() { this.loadJobs(); }

  loadJobs() {
    this.loading = true;
    this.bookingService.getAssignedJobs().subscribe({
      next: (data) => {
        this.jobs = data;
        this.filterJobs();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  filterJobs() {
    this.filteredJobs = this.filterStatus === 'all'
      ? this.jobs
      : this.jobs.filter(j => j.status === this.filterStatus);
  }

  updateStatus(job: any, newStatus: string) {
    const estimatedCost = job.newCost || job.estimatedCost;
    this.bookingService.updateBookingStatus(job._id, newStatus, estimatedCost).subscribe({
      next: () => this.loadJobs(),
      error: (err) => alert(err.error?.message || 'Failed to update status.')
    });
  }
}
