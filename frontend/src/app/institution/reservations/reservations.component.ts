import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReservationsStore, ReservationStatus } from './reservations.store';
import { ReservationsFacade } from './reservations.facade';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ReservationsStore, ReservationsFacade],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss'],
})
export class ReservationsComponent implements OnInit {
  private readonly facade = inject(ReservationsFacade);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly reservations = this.facade.state.filteredReservations;
  readonly activities = this.facade.state.activities;
  readonly isLoading = this.facade.state.isLoading;
  readonly error = this.facade.state.error;
  readonly selectedStatus = this.facade.state.selectedStatus;
  readonly selectedActivityId = this.facade.state.selectedActivityId;
  readonly pendingCount = this.facade.state.pendingCount;
  readonly confirmedCount = this.facade.state.confirmedCount;
  readonly rejectedCount = this.facade.state.rejectedCount;

  ngOnInit(): void {
    this.facade.init();
  }

  onStatusChange(status: ReservationStatus): void {
    this.facade.setStatusFilter(status);
  }

  onActivityFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.facade.setActivityFilter(value ? parseInt(value) : null);
  }

  approveReservation(id: number): void {
    this.facade.approveReservation(id);
  }

  rejectReservation(id: number): void {
    if (confirm('Da li ste sigurni da želite da odbijete ovu rezervaciju?')) {
      this.facade.rejectReservation(id);
    }
  }

  toggleNote(id: number): void {
    this.facade.toggleNoteExpanded(id);
  }

  isNoteExpanded(id: number): boolean {
    return this.facade.isNoteExpanded(id);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('sr-Latn-RS', {
      day: 'numeric',
      month: 'short',
    });
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }
}
