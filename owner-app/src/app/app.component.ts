import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <nav class="navbar" *ngIf="authService.isLoggedIn()">
      <div class="logo">
        <a routerLink="/">🏗️ InRand <span style="color:rgba(255,255,255,0.6);font-weight:400;font-size:1rem;">Owner</span></a>
      </div>
      <div class="links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Dashboard</a>
        <a routerLink="/requests" routerLinkActive="active">Requests</a>
        <a routerLink="/jobs" routerLinkActive="active">My Jobs</a>
        <a routerLink="/profile" routerLinkActive="active">Profile</a>
        <button (click)="logout()">Logout</button>
      </div>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
