import { Injectable, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, catchError, of, tap } from 'rxjs';
import { DashboardStore } from './dashboard.store';
import { InstitutionService } from '../services/institution.service';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class DashboardFacade {
  private readonly store = inject(DashboardStore);
  private readonly institutionService = inject(InstitutionService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  // Expose state
  readonly state = {
    activities: this.store.activities,
    locations: this.store.locations,
    timeSlots: this.store.timeSlots,
    reservations: this.store.reservations,
    isLoading: this.store.isLoading,
    error: this.store.error,
    activitiesCount: this.store.activitiesCount,
    locationsCount: this.store.locationsCount,
    timeSlotsCount: this.store.timeSlotsCount,
    pendingReservations: this.store.pendingReservations,
    pendingReservationsCount: this.store.pendingReservationsCount,
    recentActivities: this.store.recentActivities,
  };

  get user() {
    return this.authService.getCurrentUser();
  }

  init(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.store.setLoading(true);
    this.store.setError(null);

    forkJoin({
      activities: this.institutionService.getActivities().pipe(
        catchError((err) => {
          console.error('Error loading activities:', err);
          return of({ activities: [] });
        })
      ),
      locations: this.institutionService.getLocations().pipe(
        catchError((err) => {
          console.error('Error loading locations:', err);
          return of({ locations: [] });
        })
      ),
      timeSlots: this.institutionService.getTimeSlots().pipe(
        catchError((err) => {
          console.error('Error loading time slots:', err);
          return of({ time_slots: [] });
        })
      ),
      reservations: this.institutionService.getReservations().pipe(
        catchError((err) => {
          console.error('Error loading reservations:', err);
          return of({ reservations: [] });
        })
      ),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (results) => {
          this.store.setActivities(results.activities.activities);
          this.store.setLocations(results.locations.locations);
          this.store.setTimeSlots(results.timeSlots.time_slots);
          this.store.setReservations(results.reservations.reservations);
          this.store.setLoading(false);
        },
        error: (err) => {
          this.store.setError('Greška pri učitavanju podataka');
          this.store.setLoading(false);
        },
      });
  }

  approveReservation(id: number): void {
    this.institutionService
      .approveReservation(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.store.updateReservation(res.reservation);
        }),
        catchError((err) => {
          console.error('Error approving reservation:', err);
          return of(null);
        })
      )
      .subscribe();
  }

  rejectReservation(id: number): void {
    this.institutionService
      .rejectReservation(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.store.updateReservation(res.reservation);
        }),
        catchError((err) => {
          console.error('Error rejecting reservation:', err);
          return of(null);
        })
      )
      .subscribe();
  }
}
