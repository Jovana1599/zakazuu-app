import { computed, Injectable, signal } from '@angular/core';
import { Child } from '../../services/child.service';
import { Reservation } from '../../services/reservation.service';

export interface User {
  id: number;
  name: string;
  email: string;
  role_as: number;
}

@Injectable()
export class MyReservationsStore {
  readonly isLoading = signal<boolean>(false);
  readonly isLoadingReservations = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly isFormVisible = signal<boolean>(false);
  readonly reservations = signal<Reservation[]>([]);

  readonly hasReservations = computed(() => this.reservations().length > 0);
  readonly reservationsCount = computed(() => this.reservations().length);
  readonly pendingReservationsCount = computed(
    () => this.reservations().filter((r) => r.status === 'pending').length
  );

  setReservations(reservations: Reservation[]): void {
    this.reservations.set(reservations);
  }

  updateReservation(updated: Reservation): void {
    this.reservations.update((list) => list.map((r) => (r.id === updated.id ? updated : r)));
  }
  setLoadingReservations(isLoading: boolean): void {
    this.isLoadingReservations.set(isLoading);
  }

  setLoading(isLoading: boolean): void {
    this.isLoading.set(isLoading);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }
}
