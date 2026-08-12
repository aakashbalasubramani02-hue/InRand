import { Component, OnInit } from '@angular/core';
import { BookingService } from '../services/booking.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="page-content">
      <div class="dashboard-welcome">
        <h2>Good day, {{ownerName}}! 👷</h2>
        <p>Here's an overview of your drilling jobs and pending requests.</p>
      </div>

      <div class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-icon requests">📋</div>
          <div>
            <h3>Available Requests</h3>
            <p>{{loading ? '–' : availableCount}}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon active">🔨</div>
          <div>
            <h3>Active Jobs</h3>
            <p>{{loading ? '–' : activeCount}}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon completed">✅</div>
          <div>
            <h3>Completed Jobs</h3>
            <p>{{loading ? '–' : completedCount}}</p>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && availableCount === 0 && activeCount === 0">
        <div class="empty-state-icon">🏗️</div>
        <h3>No activity yet</h3>
        <p>Check "Available Requests" to start accepting drilling jobs!</p>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  ownerName = 'Contractor';
  availableCount = 0;
  activeCount = 0;
  completedCount = 0;
  loading = true;

  constructor(private bookingService: BookingService, private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user?.name) {
      this.ownerName = user.name.split(' ')[0];
    }

    Promise.all([
      this.bookingService.getAvailableRequests().toPromise(),
      this.bookingService.getAssignedJobs().toPromise()
    ]).then(([available, assigned]: any) => {
      this.availableCount = available?.length || 0;
      let active = 0, completed = 0;
      (assigned || []).forEach((b: any) => {
        if (b.status === 'completed') completed++;
        else active++;
      });
      this.activeCount = active;
      this.completedCount = completed;
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
  }
}
