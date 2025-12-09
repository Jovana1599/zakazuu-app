import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService, TimeSlotFormData } from '../../../services/modal.service';

@Component({
  selector: 'app-add-time-slot-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-time-slots-modal.component.html',
  styleUrls: ['./add-time-slots-modal.component.scss'],
})
export class AddTimeSlotModalComponent implements OnInit {
  private readonly modalService = inject(ModalService);

  readonly modalData = this.modalService.timeSlotModalData;

  isSubmitting = signal(false);
  error = signal<string | null>(null);

  form: TimeSlotFormData = {
    activity_id: 0,
    location_id: 0,
    date: '',
    time_from: '',
    time_to: '',
    capacity: 10,
  };

  ngOnInit(): void {
    const data = this.modalData();
    if (data?.selectedDate) {
      this.form.date = data.selectedDate;
    }
  }

  close(): void {
    this.modalService.closeTimeSlotModal();
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  async onSubmit(): Promise<void> {
    if (this.isSubmitting()) return;

    this.error.set(null);

    // Validacija
    if (!this.form.activity_id || this.form.activity_id === 0) {
      this.error.set('Molimo izaberite aktivnost');
      return;
    }
    if (!this.form.location_id || this.form.location_id === 0) {
      this.error.set('Molimo izaberite lokaciju');
      return;
    }
    if (!this.form.date) {
      this.error.set('Molimo unesite datum');
      return;
    }
    if (!this.form.time_from || !this.form.time_to) {
      this.error.set('Molimo unesite vreme početka i kraja');
      return;
    }
    if (this.form.time_from >= this.form.time_to) {
      this.error.set('Vreme početka mora biti pre vremena kraja');
      return;
    }
    if (this.form.capacity < 1) {
      this.error.set('Kapacitet mora biti najmanje 1');
      return;
    }

    this.isSubmitting.set(true);

    try {
      const success = await this.modalService.submitTimeSlotModal(this.form);
      if (!success) {
        this.error.set('Greška pri čuvanju termina. Pokušajte ponovo.');
      }
    } catch (err) {
      this.error.set('Greška pri čuvanju termina. Pokušajte ponovo.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
