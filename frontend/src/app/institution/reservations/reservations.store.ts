import { Injectable, computed, signal } from '@angular/core';
import { Reservation, Activity } from '../services/institution.service';

export type ReservationStatus = 'all' | 'pending' | 'confirmed' | 'rejected';

@Injectable()
export class ReservationsStore {
  // State
  readonly reservations = signal<Reservation[]>([]);
  readonly activities = signal<Activity[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedStatus = signal<ReservationStatus>('pending');
  readonly selectedActivityId = signal<number | null>(null);
  readonly expandedNoteIds = signal<Set<number>>(new Set());

  // Computed
  readonly filteredReservations = computed(() => {
    let result = this.reservations();

    // Filter by status
    const status = this.selectedStatus();
    if (status !== 'all') {
      result = result.filter((r) => r.status === status);
    }

    // Filter by activity
    const activityId = this.selectedActivityId();
    if (activityId) {
      result = result.filter((r) => r.activity_id === activityId);
    }

    return result;
  });

  readonly pendingCount = computed(
    () => this.reservations().filter((r) => r.status === 'pending').length
  );

  readonly confirmedCount = computed(
    () => this.reservations().filter((r) => r.status === 'confirmed').length
  );

  readonly rejectedCount = computed(
    () => this.reservations().filter((r) => r.status === 'rejected').length
  );

  // Methods
  setReservations(reservations: Reservation[]): void {
    this.reservations.set(reservations);
  }

  setActivities(activities: Activity[]): void {
    this.activities.set(activities);
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }

  setSelectedStatus(status: ReservationStatus): void {
    this.selectedStatus.set(status);
  }

  setSelectedActivityId(activityId: number | null): void {
    this.selectedActivityId.set(activityId);
  }

  updateReservation(updated: Reservation): void {
    this.reservations.update((reservations) =>
      reservations.map((r) => (r.id === updated.id ? updated : r))
    );
  }

  toggleNoteExpanded(id: number): void {
    this.expandedNoteIds.update((set) => {
      const newSet = new Set(set);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  isNoteExpanded(id: number): boolean {
    return this.expandedNoteIds().has(id);
  }
}
