import { Injectable, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { ViewActivitiesStore } from './view-activities.store';
import { ApiService } from '../services/api.service';
import { Activity } from '../shared/activity-card/activity-card.component';
import { environment } from '../../enviroments/enviroment';

@Injectable()
export class ViewActivitiesFacade {
  private readonly store = inject(ViewActivitiesStore);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // Expose state
  readonly state = {
    activities: this.store.activities,
    isLoading: this.store.isLoading,
    error: this.store.error,
    searchQuery: this.store.searchQuery,
    selectedCity: this.store.selectedCity,
    selectedCategory: this.store.selectedCategory,
    cities: this.store.cities,
    categories: this.store.categories,
    hasActiveFilters: this.store.hasActiveFilters,
    activitiesCount: this.store.activitiesCount,
    selectedCategoryName: this.store.selectedCategoryName,
  };

  // Actions
  loadActivities(): void {
    this.store.setLoading(true);
    this.store.setError(null);

    const queryParams: string[] = [];
    const search = this.store.searchQuery();
    const city = this.store.selectedCity();
    const category = this.store.selectedCategory();

    if (search) queryParams.push(`search=${search}`);
    if (city) queryParams.push(`city=${city}`);
    if (category) queryParams.push(`category=${category}`);

    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

    this.api
      .get<{ activities: any[] }>(`/activities${queryString}`)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((response) => this.mapActivities(response.activities)),
        tap((activities) => {
          this.store.setActivities(activities);
          this.store.setLoading(false);
        }),
        catchError((error) => {
          this.store.setError('Greška pri učitavanju aktivnosti');
          this.store.setLoading(false);
          console.error(error);
          return of([]);
        })
      )
      .subscribe();
  }

  setFiltersFromParams(search: string, city: string, category: string): void {
    this.store.setFilters(search, city, category);
  }

  applyFilters(search: string, city: string, category: string): void {
    const queryParams: any = {};
    if (search) queryParams.search = search;
    if (city) queryParams.city = city;
    if (category) queryParams.category = category;

    this.router.navigate(['/activities'], { queryParams });
  }

  clearFilters(): void {
    this.store.clearFilters();
    this.router.navigate(['/activities']);
  }

  private mapActivities(activities: any[]): Activity[] {
    return activities.map((activity) => ({
      id: activity.id,
      name: activity.name,
      description: activity.description,
      institution_name: activity.institution?.name || 'Nepoznata ustanova',
      image_url: this.mapImageUrl(activity.image_url),
      category: activity.category,
      rating: activity.rating || 4.5,
    }));
  }

  private mapImageUrl(url: string | null): string | null {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${environment.apiUrl.replace('/api', '')}${url}`;
  }
}
