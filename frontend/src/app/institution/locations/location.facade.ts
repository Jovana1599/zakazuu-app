import { Injectable, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import {
  InstitutionService,
  Location,
  CreateLocationRequest,
} from '../services/institution.service';
import { LocationsStore } from './location.store';

@Injectable()
export class LocationsFacade {
  private readonly store = inject(LocationsStore);
  private readonly institutionService = inject(InstitutionService);
  private readonly destroyRef = inject(DestroyRef);

  readonly state = {
    locations: this.store.locations,
    selectedLocation: this.store.selectedLocation,
    isLoading: this.store.isLoading,
    isSubmitting: this.store.isSubmitting,
    error: this.store.error,
    isFormVisible: this.store.isFormVisible,
    locationsCount: this.store.locationsCount,
    hasLocations: this.store.hasLocations,
  };

  init(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.store.setLoading(true);
    this.store.setError(null);

    this.institutionService
      .getLocations()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.store.setLocations(res.locations);
          this.store.setLoading(false);
        }),
        catchError((err) => {
          this.store.setError('Greška pri učitavanju lokacija');
          this.store.setLoading(false);
          return of(null);
        })
      )
      .subscribe();
  }

  createLocation(data: CreateLocationRequest): void {
    this.store.setSubmitting(true);
    this.store.setError(null);

    this.institutionService
      .createLocation(data)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.store.addLocation(res.location);
          this.store.setSubmitting(false);
          this.store.setFormVisible(false);
        }),
        catchError((err) => {
          this.store.setError(err.error?.message || 'Greška pri kreiranju lokacije');
          this.store.setSubmitting(false);
          return of(null);
        })
      )
      .subscribe();
  }

  updateLocation(id: number, data: Partial<CreateLocationRequest>): void {
    this.store.setSubmitting(true);
    this.store.setError(null);

    this.institutionService
      .updateLocation(id, data)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.store.updateLocation(res.location);
          this.store.setSubmitting(false);
          this.store.setFormVisible(false);
          this.store.setSelectedLocation(null);
        }),
        catchError((err) => {
          this.store.setError(err.error?.message || 'Greška pri ažuriranju lokacije');
          this.store.setSubmitting(false);
          return of(null);
        })
      )
      .subscribe();
  }

  deleteLocation(id: number): void {
    this.institutionService
      .deleteLocation(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.store.removeLocation(id);
        }),
        catchError((err) => {
          this.store.setError('Greška pri brisanju lokacije');
          return of(null);
        })
      )
      .subscribe();
  }

  openAddForm(): void {
    this.store.setSelectedLocation(null);
    this.store.setError(null);
    this.store.setFormVisible(true);
  }

  openEditForm(location: Location): void {
    this.store.setSelectedLocation(location);
    this.store.setError(null);
    this.store.setFormVisible(true);
  }

  closeForm(): void {
    this.store.setSelectedLocation(null);
    this.store.setError(null);
    this.store.setFormVisible(false);
  }
}
