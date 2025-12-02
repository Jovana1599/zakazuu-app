import { Injectable, computed, signal } from '@angular/core';
import { Location } from '../services/institution.service';

@Injectable()
export class LocationsStore {
  readonly locations = signal<Location[]>([]);
  readonly selectedLocation = signal<Location | null>(null);
  readonly isLoading = signal(false);
  readonly isSubmitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly isFormVisible = signal(false);

  readonly locationsCount = computed(() => this.locations().length);
  readonly hasLocations = computed(() => this.locations().length > 0);

  setLocations(locations: Location[]): void {
    this.locations.set(locations);
  }

  addLocation(location: Location): void {
    this.locations.update((list) => [location, ...list]);
  }

  updateLocation(updated: Location): void {
    this.locations.update((list) => list.map((l) => (l.id === updated.id ? updated : l)));
  }

  removeLocation(id: number): void {
    this.locations.update((list) => list.filter((l) => l.id !== id));
  }

  setSelectedLocation(location: Location | null): void {
    this.selectedLocation.set(location);
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  setSubmitting(submitting: boolean): void {
    this.isSubmitting.set(submitting);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }

  setFormVisible(visible: boolean): void {
    this.isFormVisible.set(visible);
  }
}
