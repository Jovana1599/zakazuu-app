import { Injectable, computed, signal } from '@angular/core';
import { Review } from '../services/admin.service';

@Injectable()
export class ReviewsStore {
  readonly reviews = signal<Review[]>([]);
  readonly isLoading = signal(false);
  readonly searchQuery = signal('');

  readonly filteredReviews = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.reviews();

    return this.reviews().filter(
      (r) =>
        r.user?.name?.toLowerCase().includes(query) ||
        r.institution?.name?.toLowerCase().includes(query) ||
        r.comment?.toLowerCase().includes(query)
    );
  });

  readonly reviewsCount = computed(() => this.filteredReviews().length);

  setReviews(reviews: Review[]): void {
    this.reviews.set(reviews);
  }

  removeReview(id: number): void {
    this.reviews.update((list) => list.filter((r) => r.id !== id));
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }
}
