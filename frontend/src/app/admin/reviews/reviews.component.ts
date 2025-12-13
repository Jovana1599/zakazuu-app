import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewsFacade } from './reviews.facade';
import { ReviewsStore } from './reviews.store';
import { Review } from '../services/admin.service';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule],
  providers: [ReviewsFacade, ReviewsStore],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss',
})
export class AdminReviewsComponent implements OnInit {
  private readonly facade = inject(ReviewsFacade);

  readonly state = this.facade.state;

  ngOnInit(): void {
    this.facade.init();
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.facade.setSearchQuery(query);
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }

  confirmDelete(review: Review): void {
    if (confirm('Da li ste sigurni da želite obrisati ovu recenziju?')) {
      this.facade.deleteReview(review.id);
    }
  }
}
