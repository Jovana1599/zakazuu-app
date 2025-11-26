import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Activity } from '../shared/activity-card/activity-card.component';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private readonly _api = inject(ApiService);

  getActivities(): Observable<Activity[]> {
    return this._api
      .get<{ activities: Activity[] }>('/activities')
      .pipe(map((response) => response.activities || []));
  }

  searchActivities(query: string, location: string): Observable<Activity[]> {
    return this.getActivities().pipe(
      map((activities) =>
        activities.filter((a) => {
          const matchesQuery = !query || a.name.toLowerCase().includes(query.toLowerCase());
          const matchesLocation =
            !location || a.institution_name.toLowerCase().includes(location.toLowerCase());
          return matchesQuery && matchesLocation;
        })
      )
    );
  }
}
