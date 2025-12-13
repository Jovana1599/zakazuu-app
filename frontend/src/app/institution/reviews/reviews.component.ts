import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewsStore, Review } from './reviews.store';
import { ReviewsFacade } from './reviews.facade';

@Component({
  selector: 'app-institution-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ReviewsStore, ReviewsFacade],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class InstitutionReviewsComponent implements OnInit {
  private readonly facade = inject(ReviewsFacade);

  readonly reviews = this.facade.state.reviews;
  readonly selectedReview = this.facade.state.selectedReview;
  readonly isLoading = this.facade.state.isLoading;
  readonly isSubmitting = this.facade.state.isSubmitting;
  readonly error = this.facade.state.error;
  readonly isResponseModalVisible = this.facade.state.isResponseModalVisible;
  readonly reviewsCount = this.facade.state.reviewsCount;
  readonly hasReviews = this.facade.state.hasReviews;
  readonly averageRating = this.facade.state.averageRating;

  responseText = '';

  ngOnInit(): void {
    this.facade.init();
  }

  openResponseModal(review: Review): void {
    this.responseText = review.institution_response || '';
    this.facade.openResponseModal(review);
  }

  closeResponseModal(): void {
    this.responseText = '';
    this.facade.closeResponseModal();
  }

  submitResponse(): void {
    const review = this.selectedReview();
    if (!review || !this.responseText.trim()) return;

    if (review.institution_response) {
      this.facade.updateResponse(review.id, this.responseText.trim());
    } else {
      this.facade.respondToReview(review.id, this.responseText.trim());
    }
  }

  deleteResponse(review: Review): void {
    if (confirm('Da li ste sigurni da želite da obrišete odgovor?')) {
      this.facade.deleteResponse(review.id);
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sr-Latn-RS', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
