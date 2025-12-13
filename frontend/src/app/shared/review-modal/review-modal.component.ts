import { Component, inject, effect, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-review-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.scss'],
})
export class ReviewModalComponent {
  private apiService = inject(ApiService);
  private modalService = inject(ModalService);

  @Output() reviewSubmitted = new EventEmitter<void>();

  readonly isOpen = this.modalService.reviewModalOpen;
  readonly modalData = this.modalService.reviewModalData;

  rating = 0;
  hoverRating = 0;
  comment = '';

  isSubmitting = false;
  error: string | null = null;
  success = false;

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.resetForm();
      }
    });
  }

  setRating(value: number): void {
    this.rating = value;
  }

  setHoverRating(value: number): void {
    this.hoverRating = value;
  }

  submitReview(): void {
    if (!this.rating || !this.comment.trim()) {
      this.error = 'Molimo unesite ocenu i komentar';
      return;
    }

    const data = this.modalData();
    if (!data) return;

    this.isSubmitting = true;
    this.error = null;

    this.apiService.post('/parent/reviews', {
      institution_user_id: data.institutionId,
      rating: this.rating,
      comment: this.comment.trim()
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.success = true;
        this.reviewSubmitted.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.error = err.error?.message || 'Greška pri slanju recenzije';
      }
    });
  }

  closeModal(): void {
    this.modalService.closeReviewModal();
  }

  private resetForm(): void {
    this.rating = 0;
    this.hoverRating = 0;
    this.comment = '';
    this.error = null;
    this.success = false;
    this.isSubmitting = false;
  }
}
