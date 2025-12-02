import { Injectable, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { ActivitiesStore } from './activities.store';
import {
  InstitutionService,
  Activity,
  CreateActivityRequest,
} from '../services/institution.service';

@Injectable()
export class ActivitiesFacade {
  private readonly store = inject(ActivitiesStore);
  private readonly institutionService = inject(InstitutionService);
  private readonly destroyRef = inject(DestroyRef);

  // Expose state
  readonly state = {
    activities: this.store.activities,
    selectedActivity: this.store.selectedActivity,
    isLoading: this.store.isLoading,
    isSubmitting: this.store.isSubmitting,
    error: this.store.error,
    isFormVisible: this.store.isFormVisible,
    activitiesCount: this.store.activitiesCount,
    hasActivities: this.store.hasActivities,
  };

  init(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.store.setLoading(true);
    this.store.setError(null);

    this.institutionService
      .getActivities()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.store.setActivities(res.activities);
          this.store.setLoading(false);
        }),
        catchError((err) => {
          this.store.setError('Greška pri učitavanju aktivnosti');
          this.store.setLoading(false);
          return of(null);
        })
      )
      .subscribe();
  }

  createActivity(data: CreateActivityRequest, image?: File): void {
    this.store.setSubmitting(true);
    this.store.setError(null);

    this.institutionService
      .createActivity(data, image)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.store.addActivity(res.activity);
          this.store.setSubmitting(false);
          this.store.setFormVisible(false);
        }),
        catchError((err) => {
          this.store.setError(err.error?.message || 'Greška pri kreiranju aktivnosti');
          this.store.setSubmitting(false);
          return of(null);
        })
      )
      .subscribe();
  }

  updateActivity(id: number, data: Partial<CreateActivityRequest>, image?: File): void {
    this.store.setSubmitting(true);
    this.store.setError(null);

    this.institutionService
      .updateActivity(id, data, image)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.store.updateActivity(res.activity);
          this.store.setSubmitting(false);
          this.store.setFormVisible(false);
          this.store.setSelectedActivity(null);
        }),
        catchError((err) => {
          this.store.setError(err.error?.message || 'Greška pri ažuriranju aktivnosti');
          this.store.setSubmitting(false);
          return of(null);
        })
      )
      .subscribe();
  }

  deleteActivity(id: number): void {
    this.institutionService
      .deleteActivity(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.store.removeActivity(id);
        }),
        catchError((err) => {
          this.store.setError('Greška pri brisanju aktivnosti');
          return of(null);
        })
      )
      .subscribe();
  }

  openAddForm(): void {
    this.store.setSelectedActivity(null);
    this.store.setError(null);
    this.store.setFormVisible(true);
  }

  openEditForm(activity: Activity): void {
    this.store.setSelectedActivity(activity);
    this.store.setError(null);
    this.store.setFormVisible(true);
  }

  closeForm(): void {
    this.store.setSelectedActivity(null);
    this.store.setError(null);
    this.store.setFormVisible(false);
  }
}
