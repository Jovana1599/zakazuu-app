import { DestroyRef, inject, Injectable } from '@angular/core';

import { MyReservationsStore } from './my-reservations.store';

import { ReservationService } from '../../services/reservation.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
@Injectable()
export class MyReservationsFacade {
  private readonly _reservationService = inject(ReservationService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _store = inject(MyReservationsStore);

  readonly state = {
    reservations: this._store.reservations,
    isLoading: this._store.isLoading,
    isLoadingReservations: this._store.isLoadingReservations,
    error: this._store.error,
    hasReservations: this._store.hasReservations,
    reservationsCount: this._store.reservationsCount,
    pendingReservationsCount: this._store.pendingReservationsCount,
    isFormVisible: this._store.isFormVisible,
  };

  init(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this._store.setLoadingReservations(true);

    this._reservationService
      .getMyReservations()
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap((response: any) => {
          const reservations = response.reservations || response;
          this._store.setReservations(reservations);
          this._store.setLoadingReservations(false);
        }),
        catchError((error) => {
          console.error('Greška pri učitavanju rezervacija:', error);
          this._store.setLoadingReservations(false);
          return of([]);
        })
      )
      .subscribe();
  }

  cancelReservation(id: number): void {
    this._reservationService
      .cancelReservation(id)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap((response) => {
          this._store.updateReservation(response.reservation);
        }),
        catchError((error) => {
          console.error('Greška pri otkazivanju rezervacije:', error);
          return of(null);
        })
      )
      .subscribe();
  }
}
