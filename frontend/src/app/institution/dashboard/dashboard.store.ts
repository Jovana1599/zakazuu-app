import { Injectable, computed, signal } from '@angular/core';
import { Activity, Location, TimeSlot, Reservation } from '../services/institution.service';

@Injectable()
export class DashboardStore {
  // State
  readonly activities = signal<Activity[]>([]);
  readonly locations = signal<Location[]>([]);
  readonly timeSlots = signal<TimeSlot[]>([]);
  readonly reservations = signal<Reservation[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  // Computed
  readonly activitiesCount = computed(() => this.activities().length);
  readonly locationsCount = computed(() => this.locations().length);
  readonly timeSlotsCount = computed(() => this.timeSlots().length);
  readonly pendingReservations = computed(() =>
    this.reservations().filter((r) => r.status === 'pending')
  );
  readonly pendingReservationsCount = computed(() => this.pendingReservations().length);
  readonly recentActivities = computed(() => this.activities().slice(0, 5));

  // Setters
  setActivities(activities: Activity[]): void {
    this.activities.set(activities);
  }

  setLocations(locations: Location[]): void {
    this.locations.set(locations);
  }

  setTimeSlots(timeSlots: TimeSlot[]): void {
    this.timeSlots.set(timeSlots);
  }

  setReservations(reservations: Reservation[]): void {
    this.reservations.set(reservations);
  }

  updateReservation(updated: Reservation): void {
    this.reservations.update((list) => list.map((r) => (r.id === updated.id ? updated : r)));
  }

  removeReservation(id: number): void {
    this.reservations.update((list) => list.filter((r) => r.id !== id));
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }

  reset(): void {
    this.activities.set([]);
    this.locations.set([]);
    this.timeSlots.set([]);
    this.reservations.set([]);
    this.isLoading.set(false);
    this.error.set(null);
  }
}
