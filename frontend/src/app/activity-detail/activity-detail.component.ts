import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';
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
  imports: [CommonModule, RouterLink],
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.scss'],
})
export class ActivityDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private modalService = inject(ModalService);
  public authService = inject(AuthService);

  activity: Activity | null = null;
  isLoading = true;
  error: string | null = null;
  selectedSlot: TimeSlot | null = null;

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

  openReservationModal(): void {
    if (!this.activity || !this.selectedSlot) return;

    this.modalService.openReservationModal({
      activity: {
        id: this.activity.id,
        name: this.activity.name,
        price: this.activity.price,
        age_from: this.activity.age_from,
        age_to: this.activity.age_to,
      },
      timeSlot: {
        id: this.selectedSlot.id,
        date: this.selectedSlot.date,
        time_from: this.selectedSlot.time_from,
        time_to: this.selectedSlot.time_to,
        location: {
          city: this.selectedSlot.location.city,
          address: this.selectedSlot.location.address,
        },
      },
    });
  }
}
