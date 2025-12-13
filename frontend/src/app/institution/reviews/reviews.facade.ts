import { Injectable, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ReviewsStore, Review } from './reviews.store';
import { ApiService } from '../../services/api.service';

@Injectable()
export class ReviewsFacade {
  private readonly store = inject(ReviewsStore);
  private readonly apiService = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastr = inject(ToastrService);

  readonly state = {
    reviews: this.store.reviews,
    selectedReview: this.store.selectedReview,
    isLoading: this.store.isLoading,
    isSubmitting: this.store.isSubmitting,
    error: this.store.error,
    isResponseModalVisible: this.store.isResponseModalVisible,
    reviewsCount: this.store.reviewsCount,
    hasReviews: this.store.hasReviews,
    averageRating: this.store.averageRating,
  };

  init(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.store.setLoading(true);
    this.store.setError(null);

    this.apiService
      .get<{ reviews: Review[] }>('/institution/reviews')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.store.setReviews(res.reviews);
          this.store.setLoading(false);
        }),
        catchError((err) => {
          this.store.setError('Greška pri učitavanju recenzija');
          this.store.setLoading(false);
          return of(null);
        })
      )
      .subscribe();
  }

  respondToReview(reviewId: number, response: string): void {
    this.store.setSubmitting(true);
    this.store.setError(null);

    this.apiService
      .post<{ review: Review }>(`/institution/reviews/${reviewId}/respond`, {
        institution_response: response,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.store.updateReview(res.review);
          this.store.setSubmitting(false);
          this.store.setResponseModalVisible(false);
          this.store.setSelectedReview(null);
          this.toastr.success('Odgovor je uspešno poslat!');
        }),
        catchError((err) => {
          this.store.setError(err.error?.message || 'Greška pri slanju odgovora');
          this.store.setSubmitting(false);
          this.toastr.error('Greška pri slanju odgovora');
          return of(null);
        })
      )
      .subscribe();
  }

  updateResponse(reviewId: number, response: string): void {
    this.store.setSubmitting(true);
    this.store.setError(null);

    this.apiService
      .put<{ review: Review }>(`/institution/reviews/${reviewId}/respond`, {
        institution_response: response,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.store.updateReview(res.review);
          this.store.setSubmitting(false);
          this.store.setResponseModalVisible(false);
          this.store.setSelectedReview(null);
          this.toastr.success('Odgovor je uspešno ažuriran!');
        }),
        catchError((err) => {
          this.store.setError(err.error?.message || 'Greška pri ažuriranju odgovora');
          this.store.setSubmitting(false);
          this.toastr.error('Greška pri ažuriranju odgovora');
          return of(null);
        })
      )
      .subscribe();
  }

  deleteResponse(reviewId: number): void {
    this.apiService
      .delete<{ message: string }>(`/institution/reviews/${reviewId}/respond`)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          const review = this.store.selectedReview();
          if (review) {
            this.store.updateReview({
              ...review,
              institution_response: null,
              responded_at: null,
            });
          }
          this.toastr.success('Odgovor je uspešno obrisan!');
        }),
        catchError((err) => {
          this.toastr.error('Greška pri brisanju odgovora');
          return of(null);
        })
      )
      .subscribe();
  }

  openResponseModal(review: Review): void {
    this.store.setSelectedReview(review);
    this.store.setError(null);
    this.store.setResponseModalVisible(true);
  }

  closeResponseModal(): void {
    this.store.setSelectedReview(null);
    this.store.setError(null);
    this.store.setResponseModalVisible(false);
  }
}
