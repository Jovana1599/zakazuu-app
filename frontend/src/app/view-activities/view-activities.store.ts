
  import { Injectable, signal, computed } from '@angular/core';
  import { Activity } from '../shared/activity-card/activity-card.component';
import { Category, CATEGORIES } from '../shared/categories.config';
 

export interface ActivityFilters {
    search: string;
    city: string;
    category: string;
    age: string;
    minPrice: number | null;
    maxPrice: number | null;
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
    readonly selectedAge = signal<string>('');
    readonly minPrice = signal<number | null>(null);
    readonly maxPrice = signal<number | null>(null);

    // Static data - koristi shared kategorije
    readonly cities = signal<string[]>([
      'Beograd',
      'Novi Sad',
      'Niš',
      'Kragujevac',
      'Subotica',
      'Loznica',
      'Čačak',
      'Zrenjanin',
    ]);
    readonly categories = signal<Category[]>(CATEGORIES);

    readonly hasActiveFilters = computed(
      () =>
        !!(
          this.searchQuery() ||
          this.selectedCity() ||
          this.selectedCategory() ||
          this.selectedAge() ||
          this.minPrice() ||
          this.maxPrice()
        )
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

    setFilters(filters: ActivityFilters): void {
      this.searchQuery.set(filters.search);
      this.selectedCity.set(filters.city);
      this.selectedCategory.set(filters.category);
      this.selectedAge.set(filters.age);
      this.minPrice.set(filters.minPrice);
      this.maxPrice.set(filters.maxPrice);
    }

    clearFilters(): void {
      this.searchQuery.set('');
      this.selectedCity.set('');
      this.selectedCategory.set('');
      this.selectedAge.set('');
      this.minPrice.set(null);
      this.maxPrice.set(null);
    }
  }