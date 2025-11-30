import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { ReservationService } from '../services/reservation.service';
import { ChildService, Child } from '../services/child.service';
import { environment } from '../../enviroments/enviroment';

interface TimeSlot {
  id: number;
  date: string;
  time_from: string;
  time_to: string;
  capacity: number;
  booked: number;
  location: {
    id: number;
    address: string;
    city: string;
  };
}

interface Activity {
  id: number;
  name: string;
  description: string;
  category: string;
  age_from: number;
  age_to: number;
  price: number;
  image_url: string;
  institution: {
    id: number;
    name: string;
    email: string;
  };
  time_slots: TimeSlot[];
}

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.scss'],
})
export class ActivityDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  public authService = inject(AuthService);
  private reservationService = inject(ReservationService);
  private childService = inject(ChildService);

  activity: Activity | null = null;
  isLoading = true;
  error: string | null = null;
  selectedSlot: TimeSlot | null = null;

  // Modal properties
  showReservationModal = false;
  children: Child[] = [];
  selectedChildId: number | null = null;
  reservationNote = '';
  isSubmitting = false;
  reservationError: string | null = null;
  reservationSuccess = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadActivity(+id);
    }
  }

  loadActivity(id: number): void {
    this.apiService.get<{ activity: Activity }>(`/activities/${id}`).subscribe({
      next: (response) => {
        this.activity = response.activity;
        if (this.activity.image_url && !this.activity.image_url.startsWith('http')) {
          this.activity.image_url = `${environment.apiUrl.replace('/api', '')}${
            this.activity.image_url
          }`;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Greška pri učitavanju aktivnosti';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  getImageUrl(): string {
    if (this.activity?.image_url) {
      return this.activity.image_url;
    }
    return 'assets/images/placeholder.jpg';
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    };
    return date.toLocaleDateString('sr-Latn-RS', options);
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  getAvailableSpots(slot: TimeSlot): number {
    return slot.capacity - slot.booked;
  }

  selectSlot(slot: TimeSlot): void {
    this.selectedSlot = slot;
  }

  getUniqueLocations(): string[] {
    if (!this.activity?.time_slots) return [];
    const locations = this.activity.time_slots.map(
      (slot) => `${slot.location.city}, ${slot.location.address}`
    );
    return [...new Set(locations)];
  }

  getNextAvailableDate(): string | null {
    if (!this.activity?.time_slots || this.activity.time_slots.length === 0) {
      return null;
    }
    return this.formatDate(this.activity.time_slots[0].date);
  }

  // ============ RESERVATION MODAL ============

  openReservationModal(): void {
    this.reservationError = null;
    this.reservationSuccess = false;
    this.selectedChildId = null;
    this.reservationNote = '';

    // Load children
    this.childService.getMyChildren().subscribe({
      next: (children) => {
        this.children = children;
        this.showReservationModal = true;
      },
      error: (err) => {
        console.error('Greška pri učitavanju dece:', err);
        this.reservationError = 'Greška pri učitavanju liste dece';
        this.showReservationModal = true;
      },
    });
  }

  closeModal(): void {
    this.showReservationModal = false;
    this.reservationError = null;

    // If reservation was successful, reload activity to update slots
    if (this.reservationSuccess) {
      this.reservationSuccess = false;
      if (this.activity) {
        this.loadActivity(this.activity.id);
      }
      this.selectedSlot = null;
    }
  }

  getEligibleChildren(): Child[] {
    if (!this.activity) return this.children;
    return this.children.filter(
      (child) => child.age >= this.activity!.age_from && child.age <= this.activity!.age_to
    );
  }

  submitReservation(): void {
    if (!this.selectedChildId || !this.selectedSlot || !this.activity) {
      this.reservationError = 'Molimo izaberite dete';
      return;
    }

    this.isSubmitting = true;
    this.reservationError = null;

    this.reservationService
      .createReservation({
        child_id: this.selectedChildId,
        activity_id: this.activity.id,
        time_slot_id: this.selectedSlot.id,
        note: this.reservationNote || undefined,
      })
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.reservationSuccess = true;
        },
        error: (err) => {
          this.isSubmitting = false;
          this.reservationError = err.error?.message || 'Greška pri kreiranju rezervacije';
          console.error(err);
        },
      });
  }
}
