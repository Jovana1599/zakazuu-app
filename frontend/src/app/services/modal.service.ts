import { Injectable, signal } from '@angular/core';

export interface ReservationModalData {
  activity: {
    id: number;
    name: string;
    price: number;
    age_from: number;
    age_to: number;
  };
  timeSlot: {
    id: number;
    date: string;
    time_from: string;
    time_to: string;
    location: {
      city: string;
      address: string;
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private _reservationModalOpen = signal(false);
  private _reservationModalData = signal<ReservationModalData | null>(null);

  readonly reservationModalOpen = this._reservationModalOpen.asReadonly();
  readonly reservationModalData = this._reservationModalData.asReadonly();

  openReservationModal(data: ReservationModalData): void {
    this._reservationModalData.set(data);
    this._reservationModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeReservationModal(): void {
    this._reservationModalOpen.set(false);
    this._reservationModalData.set(null);
    document.body.style.overflow = '';
  }
}
