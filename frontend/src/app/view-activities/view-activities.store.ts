import { Injectable, signal, computed } from '@angular/core';
import { Activity } from '../shared/activity-card/activity-card.component';

export interface Category {
  id: string;
  name: string;
}

@Injectable()
export class ViewActivitiesStore {
  // State signals
  readonly activities = signal<Activity[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal<string>('');
  readonly selectedCity = signal<string>('');
  readonly selectedCategory = signal<string>('');

  // Static data
  readonly cities = signal<string[]>(['Beograd', 'Novi Sad', 'Niš', 'Kragujevac', 'Subotica']);
  readonly categories = signal<Category[]>([
    { id: 'birthday', name: 'Rođendani' },
    { id: 'swimming', name: 'Plivanje' },
    { id: 'skating', name: 'Klizanje' },
    { id: 'education', name: 'Edukacija' },
    { id: 'art', name: 'Umetnost' },
    { id: 'football', name: 'Fudbal' },
    { id: 'dance', name: 'Ples' },
    { id: 'nature', name: 'Boravak u prirodi' },
  ]);

  readonly hasActiveFilters = computed(
    () => !!(this.searchQuery() || this.selectedCity() || this.selectedCategory())
  );

  readonly activitiesCount = computed(() => this.activities().length);

  readonly selectedCategoryName = computed(() => {
    const category = this.categories().find((c) => c.id === this.selectedCategory());
    return category?.name || this.selectedCategory();
  });

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

  setSelectedCity(city: string): void {
    this.selectedCity.set(city);
  }

  setSelectedCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  setFilters(search: string, city: string, category: string): void {
    this.searchQuery.set(search);
    this.selectedCity.set(city);
    this.selectedCategory.set(category);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedCity.set('');
    this.selectedCategory.set('');
  }
}
