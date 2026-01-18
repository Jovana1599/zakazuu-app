import { Injectable, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, catchError, of, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ReservationsStore, ReservationStatus } from './reservations.store';
import { InstitutionService } from '../services/institution.service';

@Injectable()
export class ReservationsFacade {
  private readonly store = inject(ReservationsStore);
  private readonly institutionService = inject(InstitutionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastr = inject(ToastrService);

  readonly state = {
    reservations: this.store.reservations,
    filteredReservations: this.store.filteredReservations,
    activities: this.store.activities,
    isLoading: this.store.isLoading,
    error: this.store.error,
    selectedStatus: this.store.selectedStatus,
    selectedActivityId: this.store.selectedActivityId,
    pendingCount: this.store.pendingCount,
    confirmedCount: this.store.confirmedCount,
    rejectedCount: this.store.rejectedCount,
  };

  init(): void {
    this.loadData();
  }

  loadData(): void {
    this.store.setLoading(true);
    this.store.setError(null);

    forkJoin({
      reservations: this.institutionService.getReservations(),
      activities: this.institutionService.getActivities(),
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((response) => {
          this.store.setReservations(response.reservations.reservations || []);
          this.store.setActivities(response.activities.activities || []);
          this.store.setLoading(false);
        }),
        catchError((err) => {
          this.store.setError('Greška pri učitavanju rezervacija');
          this.store.setLoading(false);
          this.toastr.error('Greška pri učitavanju rezervacija');
          return of(null);
        }),
      )
      .subscribe();
  }

  setStatusFilter(status: ReservationStatus): void {
    this.store.setSelectedStatus(status);
  }

  setActivityFilter(activityId: number | null): void {
    this.store.setSelectedActivityId(activityId);
  }

  approveReservation(id: number): void {
    this.institutionService
      .approveReservation(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.store.updateReservation(res.reservation);
          this.toastr.success('Rezervacija je uspešno odobrena!');
        }),
        catchError((err) => {
          this.toastr.error('Greška pri odobravanju rezervacije');
          return of(null);
        }),
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
          this.toastr.success('Rezervacija je odbijena.');
        }),
        catchError((err) => {
          this.toastr.error('Greška pri odbijanju rezervacije');
          return of(null);
        }),
      )
      .subscribe();
  }

  toggleNoteExpanded(id: number): void {
    this.store.toggleNoteExpanded(id);
  }

  isNoteExpanded(id: number): boolean {
    return this.store.isNoteExpanded(id);
  }
}
