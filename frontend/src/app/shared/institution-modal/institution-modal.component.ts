import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-institution-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './institution-modal.component.html',
  styleUrls: ['./institution-modal.component.scss'],
})
export class InstitutionModalComponent {
  private modalService = inject(ModalService);

  readonly isOpen = this.modalService.institutionModalOpen;
  readonly modalData = this.modalService.institutionModalData;

  closeModal(): void {
    this.modalService.closeInstitutionModal();
  }

  openWebsite(): void {
    const data = this.modalData();
    if (data?.website) {
      window.open(data.website, '_blank');
    }
  }

  sendEmail(): void {
    const data = this.modalData();
    if (data?.email) {
      window.location.href = `mailto:${data.email}`;
    }
  }

  callPhone(): void {
    const data = this.modalData();
    if (data?.phone) {
      window.location.href = `tel:${data.phone}`;
    }
  }
}
