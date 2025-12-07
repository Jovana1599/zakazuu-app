import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { DashboardStore } from './dashboard.store';
import { DashboardFacade } from './dashboard.facade';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [DashboardStore, DashboardFacade],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private readonly facade = inject(DashboardFacade);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // State
  readonly user = this.facade.user;
  readonly activities = this.facade.state.activities;
  readonly isLoading = this.facade.state.isLoading;
  readonly error = this.facade.state.error;
  readonly activitiesCount = this.facade.state.activitiesCount;
  readonly locationsCount = this.facade.state.locationsCount;
  readonly timeSlotsCount = this.facade.state.timeSlotsCount;
  readonly pendingReservations = this.facade.state.pendingReservations;
  readonly pendingReservationsCount = this.facade.state.pendingReservationsCount;
  readonly recentActivities = this.facade.state.recentActivities;

  ngOnInit(): void {
    this.facade.init();
  }

  approveReservation(id: number): void {
    this.facade.approveReservation(id);
  }

  rejectReservation(id: number): void {
    if (confirm('Da li ste sigurni da želite da odbijete ovu rezervaciju?')) {
      this.facade.rejectReservation(id);
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('sr-Latn-RS', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }
}
