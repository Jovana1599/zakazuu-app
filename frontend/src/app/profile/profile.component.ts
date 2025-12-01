import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProfileStore } from './profile.store';
import { ProfileFacade } from './profile.facade';
import { Child } from '../services/child.service';
import { Reservation } from '../services/reservation.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  providers: [ProfileStore, ProfileFacade],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  private readonly _facade = inject(ProfileFacade);

  // State
  readonly user = this._facade.state.user;
  readonly children = this._facade.state.children;
  readonly reservations = this._facade.state.reservations;
  readonly isLoading = this._facade.state.isLoading;
  readonly isLoadingReservations = this._facade.state.isLoadingReservations;
  readonly error = this._facade.state.error;
  readonly activeTab = this._facade.state.activeTab;
  readonly hasChildren = this._facade.state.hasChildren;
  readonly hasReservations = this._facade.state.hasReservations;
  readonly pendingReservationsCount = this._facade.state.pendingReservationsCount;
  readonly editingChild = this._facade.state.editingChild;
  readonly isFormVisible = this._facade.state.isFormVisible;

  // Form model
  childForm = {
    first_name: '',
    last_name: '',
    age: 0,
    medical_restrictions: '',
    note: '',
  };

  ngOnInit(): void {
    this._facade.init();
  }

  setActiveTab(tab: 'profile' | 'children' | 'reservations'): void {
    this._facade.setActiveTab(tab);
  }

  openAddForm(): void {
    this.resetForm();
    this._facade.openAddChildForm();
  }

  openEditForm(child: Child): void {
    this.childForm = {
      first_name: child.first_name,
      last_name: child.last_name,
      age: child.age,
      medical_restrictions: child.medical_restrictions || '',
      note: child.note || '',
    };
    this._facade.openEditChildForm(child);
  }

  closeForm(): void {
    this.resetForm();
    this._facade.closeForm();
  }

  saveChild(): void {
    const editing = this.editingChild();
    if (editing) {
      this._facade.updateChild(editing.id, this.childForm);
    } else {
      this._facade.addChild(this.childForm);
    }
    this.resetForm();
  }

  deleteChild(id: number): void {
    if (confirm('Da li ste sigurni da želite da obrišete dete?')) {
      this._facade.deleteChild(id);
    }
  }

  cancelReservation(id: number): void {
    if (confirm('Da li ste sigurni da želite da otkažete rezervaciju?')) {
      this._facade.cancelReservation(id);
    }
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      pending: 'Na čekanju',
      confirmed: 'Potvrđeno',
      rejected: 'Odbijeno',
      cancelled: 'Otkazano',
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sr-Latn-RS', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  private resetForm(): void {
    this.childForm = {
      first_name: '',
      last_name: '',
      age: 0,
      medical_restrictions: '',
      note: '',
    };
  }
}
