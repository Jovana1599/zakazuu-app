import { Injectable, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { HomeStore } from './home.store';
import { HomeService } from '../services/home.service';
import { Activity } from '../shared/activity-card/activity-card.component';

const API_URL = 'http://localhost:8000';

@Injectable()
export class HomeFacade {
  private readonly _store = inject(HomeStore);
  private readonly _service = inject(HomeService);
  private readonly _destroyRef = inject(DestroyRef);

  readonly state = {
    activities: this._store.activities,
    topActivities: this._store.topActivities,
    isLoading: this._store.isLoading,
    error: this._store.error,
    hasActivities: this._store.hasActivities,
  };

  private mapImageUrl(url: string | null): string | null {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_URL}${url}`;
  }

  loadActivities(): void {
    this._store.setLoading(true);
    this._store.setError(null);

    this._service
      .getActivities()
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        map((activities: any[]) =>
          activities.map((a) => ({
            ...a,
            image_url: this.mapImageUrl(a.image_url),
            institution_name: a.institution?.name || 'Nepoznato',
          }))
        ),
        tap((activities: Activity[]) => {
          this._store.setActivities(activities);
          this._store.setLoading(false);
        }),
        catchError((error) => {
          this._store.setError('Greška pri učitavanju aktivnosti');
          this._store.setLoading(false);
          return of([]);
        })
      )
      .subscribe();
  }

  selectCategory(category: string | null): void {
    this._store.setCategory(category);
  }
}
