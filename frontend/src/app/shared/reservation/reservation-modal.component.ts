import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ChildService, Child } from '../../services/child.service';
import { ReservationService } from '../../services/reservation.service';
import { ModalService, ReservationModalData } from '../../services/modal.service';

@Component({
  selector: 'app-reservation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reservation-modal.component.html',
  styleUrls: ['./reservation-modal.component.scss'],
})
export class ReservationModalComponent implements OnInit {
  private childService = inject(ChildService);
  private reservationService = inject(ReservationService);
  private modalService = inject(ModalService);

  // Modal state from service
  readonly isOpen = this.modalService.reservationModalOpen;
  readonly modalData = this.modalService.reservationModalData;

  children: Child[] = [];
  selectedChildId: number | null = null;
  reservationNote = '';

  isLoading = false;
  isSubmitting = false;
  error: string | null = null;
  reservationSuccess = false;

  constructor() {
    // Kada se modal otvori, učitaj decu
    effect(() => {
      if (this.isOpen()) {
        this.resetState();
        this.loadChildren();
      }
    });
  }

  ngOnInit(): void {}

  loadChildren(): void {
    this.isLoading = true;
    this.childService.getMyChildren().subscribe({
      next: (response: any) => {
        this.children = response.children || response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Greška pri učitavanju dece:', err);
        this.error = 'Greška pri učitavanju liste dece';
        this.isLoading = false;
      },
    });
  }

  get activity() {
    return this.modalData()?.activity || null;
  }

  get timeSlot() {
    return this.modalData()?.timeSlot || null;
  }

  getEligibleChildren(): Child[] {
    if (!this.activity) return this.children;
    return this.children.filter(
      (child) => child.age >= this.activity!.age_from && child.age <= this.activity!.age_to
    );
  }

  selectChild(childId: number): void {
    this.selectedChildId = childId;
  }

  submitReservation(): void {
    if (!this.selectedChildId || !this.timeSlot || !this.activity) {
      this.error = 'Molimo izaberite dete';
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    this.reservationService
      .createReservation({
        child_id: this.selectedChildId,
        activity_id: this.activity.id,
        time_slot_id: this.timeSlot.id,
        note: this.reservationNote || undefined,
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.reservationSuccess = true;
        },
        error: (err) => {
          this.isSubmitting = false;
          this.error = err.error?.message || 'Greška pri kreiranju rezervacije';
          console.error(err);
        },
      });
  }

  closeModal(): void {
    this.modalService.closeReservationModal();
  }

  private resetState(): void {
    this.selectedChildId = null;
    this.reservationNote = '';
    this.error = null;
    this.reservationSuccess = false;
    this.children = [];
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sr-Latn-RS', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }
}
