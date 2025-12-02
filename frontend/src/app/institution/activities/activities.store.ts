import { Injectable, computed, signal } from '@angular/core';
import { Activity } from '../services/institution.service';

@Injectable()
export class ActivitiesStore {
  // State
  readonly activities = signal<Activity[]>([]);
  readonly selectedActivity = signal<Activity | null>(null);
  readonly isLoading = signal(false);
  readonly isSubmitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly isFormVisible = signal(false);

  // Computed
  readonly activitiesCount = computed(() => this.activities().length);
  readonly hasActivities = computed(() => this.activities().length > 0);

  // Setters
  setActivities(activities: Activity[]): void {
    this.activities.set(activities);
  }

  addActivity(activity: Activity): void {
    this.activities.update((list) => [activity, ...list]);
  }

  updateActivity(updated: Activity): void {
    this.activities.update((list) => list.map((a) => (a.id === updated.id ? updated : a)));
  }

  removeActivity(id: number): void {
    this.activities.update((list) => list.filter((a) => a.id !== id));
  }

  setSelectedActivity(activity: Activity | null): void {
    this.selectedActivity.set(activity);
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

  reset(): void {
    this.activities.set([]);
    this.selectedActivity.set(null);
    this.isLoading.set(false);
    this.isSubmitting.set(false);
    this.error.set(null);
    this.isFormVisible.set(false);
  }
}
