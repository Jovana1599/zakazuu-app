import { Injectable, signal, computed } from '@angular/core';
import { Activity } from '../shared/activity-card/activity-card.component';
export interface HomeState {
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  location: string;
  selectedCategory: string | null;
}

@Injectable()
export class HomeStore {
  // State signals
  readonly activities = signal<Activity[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal<string>('');
  readonly location = signal<string>('');
  readonly selectedCategory = signal<string | null>(null);

  // Computed
  readonly topActivities = computed(() => this.activities().slice(0, 4));

  readonly hasActivities = computed(() => this.activities().length > 0);

  // Actions
  setActivities(activities: Activity[]): void {
    this.activities.set(activities);
  }

  setLoading(isLoading: boolean): void {
    this.isLoading.set(isLoading);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  setLocation(location: string): void {
    this.location.set(location);
  }

  setCategory(category: string | null): void {
    this.selectedCategory.set(category);
  }

  reset(): void {
    this.activities.set([]);
    this.isLoading.set(false);
    this.error.set(null);
    this.searchQuery.set('');
    this.location.set('');
    this.selectedCategory.set(null);
  }
}
