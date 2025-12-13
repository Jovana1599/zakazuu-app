import { Injectable, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ReviewsStore } from './reviews.store';
import { AdminService } from '../services/admin.service';

@Injectable()
export class ReviewsFacade {
  private readonly store = inject(ReviewsStore);
  private readonly adminService = inject(AdminService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastr = inject(ToastrService);

  readonly state = {
    reviews: this.store.filteredReviews,
    isLoading: this.store.isLoading,
    reviewsCount: this.store.reviewsCount,
    searchQuery: this.store.searchQuery,
  };

  init(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.store.setLoading(true);

    this.adminService
      .getReviews()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.store.setReviews(res.reviews);
          this.store.setLoading(false);
        }),
        catchError((err) => {
          this.store.setLoading(false);
          this.toastr.error('Greška pri učitavanju recenzija');
          return of(null);
        })
      )
      .subscribe();
  }

  deleteReview(id: number): void {
    this.adminService
      .deleteReview(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.store.removeReview(id);
          this.toastr.success('Recenzija obrisana');
        }),
        catchError((err) => {
          this.toastr.error('Greška pri brisanju recenzije');
          return of(null);
        })
      )
      .subscribe();
  }

  setSearchQuery(query: string): void {
    this.store.setSearchQuery(query);
  }
}
