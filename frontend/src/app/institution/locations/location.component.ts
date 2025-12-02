import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { LocationsStore } from './location.store';
import { LocationsFacade } from './location.facade';
import { AuthService } from '../../services/auth.service';
import { Location } from '../services/institution.service';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  providers: [LocationsStore, LocationsFacade],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationsComponent implements OnInit {
  private readonly facade = inject(LocationsFacade);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // State
  readonly locations = this.facade.state.locations;
  readonly selectedLocation = this.facade.state.selectedLocation;
  readonly isLoading = this.facade.state.isLoading;
  readonly isSubmitting = this.facade.state.isSubmitting;
  readonly error = this.facade.state.error;
  readonly isFormVisible = this.facade.state.isFormVisible;
  readonly hasLocations = this.facade.state.hasLocations;

  // Form
  locationForm = {
    name: '',
    address: '',
    city: '',
  };

  ngOnInit(): void {
    if (!this.authService.isInstitution()) {
      this.router.navigate(['/']);
      return;
    }
    this.facade.init();
  }

  openAddForm(): void {
    this.resetForm();
    this.facade.openAddForm();
  }

  openEditForm(location: Location): void {
    this.locationForm = {
      name: location.name,
      address: location.address,
      city: location.city,
    };
    this.facade.openEditForm(location);
  }

  closeForm(): void {
    this.resetForm();
    this.facade.closeForm();
  }

  saveLocation(): void {
    const selected = this.selectedLocation();
    if (selected) {
      this.facade.updateLocation(selected.id, this.locationForm);
    } else {
      this.facade.createLocation(this.locationForm);
    }
  }

  deleteLocation(id: number): void {
    if (confirm('Da li ste sigurni da želite da obrišete ovu lokaciju?')) {
      this.facade.deleteLocation(id);
    }
  }

  private resetForm(): void {
    this.locationForm = {
      name: '',
      address: '',
      city: '',
    };
  }
}
