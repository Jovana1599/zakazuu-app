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

export interface TimeSlotModalData {
  activities: { id: number; name: string }[];
  locations: { id: number; address: string; city: string }[];
  selectedDate?: string;
}

export interface TimeSlotFormData {
  activity_id: number;
  location_id: number;
  date: string;
  time_from: string;
  time_to: string;
  capacity: number;
}

export interface ReviewModalData {
  institutionId: number;
  institutionName: string;
}

export interface InstitutionModalData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  description?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  // Reservation Modal
  private _reservationModalOpen = signal(false);
  private _reservationModalData = signal<ReservationModalData | null>(null);

  readonly reservationModalOpen = this._reservationModalOpen.asReadonly();
  readonly reservationModalData = this._reservationModalData.asReadonly();

  // TimeSlot Modal
  private _timeSlotModalOpen = signal(false);
  private _timeSlotModalData = signal<TimeSlotModalData | null>(null);
  private _timeSlotModalCallback: ((data: TimeSlotFormData) => Promise<void>) | null = null;

  readonly timeSlotModalOpen = this._timeSlotModalOpen.asReadonly();
  readonly timeSlotModalData = this._timeSlotModalData.asReadonly();

  // Review Modal
  private _reviewModalOpen = signal(false);
  private _reviewModalData = signal<ReviewModalData | null>(null);

  readonly reviewModalOpen = this._reviewModalOpen.asReadonly();
  readonly reviewModalData = this._reviewModalData.asReadonly();

  // Institution Modal
  private _institutionModalOpen = signal(false);
  private _institutionModalData = signal<InstitutionModalData | null>(null);

  readonly institutionModalOpen = this._institutionModalOpen.asReadonly();
  readonly institutionModalData = this._institutionModalData.asReadonly();

  // Reservation Modal Methods
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

  // TimeSlot Modal Methods
  openTimeSlotModal(
    data: TimeSlotModalData,
    onSave: (data: TimeSlotFormData) => Promise<void>
  ): void {
    console.log('ModalService: Opening time slot modal with data:', data);
    console.log('ModalService: Callback registered:', !!onSave);
    this._timeSlotModalData.set(data);
    this._timeSlotModalCallback = onSave;
    this._timeSlotModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeTimeSlotModal(): void {
    console.log('ModalService: Closing time slot modal');
    this._timeSlotModalOpen.set(false);
    this._timeSlotModalData.set(null);
    this._timeSlotModalCallback = null;
    document.body.style.overflow = '';
  }

  async submitTimeSlotModal(data: TimeSlotFormData): Promise<boolean> {
    console.log('ModalService: submitTimeSlotModal called with:', data);
    console.log('ModalService: Callback exists:', !!this._timeSlotModalCallback);

    if (this._timeSlotModalCallback) {
      try {
        console.log('ModalService: Calling callback...');
        await this._timeSlotModalCallback(data);
        console.log('ModalService: Callback completed successfully');
        this.closeTimeSlotModal();
        return true;
      } catch (error) {
        console.error('ModalService: Error in callback:', error);
        return false;
      }
    }
    console.log('ModalService: No callback registered!');
    return false;
  }

  // Review Modal Methods
  openReviewModal(data: ReviewModalData): void {
    this._reviewModalData.set(data);
    this._reviewModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeReviewModal(): void {
    this._reviewModalOpen.set(false);
    this._reviewModalData.set(null);
    document.body.style.overflow = '';
  }

  // Institution Modal Methods
  openInstitutionModal(data: InstitutionModalData): void {
    this._institutionModalData.set(data);
    this._institutionModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeInstitutionModal(): void {
    this._institutionModalOpen.set(false);
    this._institutionModalData.set(null);
    document.body.style.overflow = '';
  }
}
