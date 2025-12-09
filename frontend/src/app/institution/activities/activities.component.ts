import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ActivitiesStore } from './activities.store';
import { ActivitiesFacade } from './activities.facade';
import { AuthService } from '../../services/auth.service';
import { Activity } from '../services/institution.service';
import { environment } from '../../../enviroments/enviroment';
import { CATEGORIES } from '../../shared/categories.config';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  providers: [ActivitiesStore, ActivitiesFacade],
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent implements OnInit {
  private readonly facade = inject(ActivitiesFacade);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // State
  readonly activities = this.facade.state.activities;
  readonly selectedActivity = this.facade.state.selectedActivity;
  readonly isLoading = this.facade.state.isLoading;
  readonly isSubmitting = this.facade.state.isSubmitting;
  readonly error = this.facade.state.error;
  readonly isFormVisible = this.facade.state.isFormVisible;
  readonly hasActivities = this.facade.state.hasActivities;

  // Form
  activityForm = {
    name: '',
    description: '',
    category: '',
    age_from: 3,
    age_to: 18,
    price: 0,
  };

  // Image upload
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  // Categories - koristi shared config
  categories = CATEGORIES;

  ngOnInit(): void {
    this.facade.init();
  }

  openAddForm(): void {
    this.resetForm();
    this.facade.openAddForm();
  }

  openEditForm(activity: Activity): void {
    this.activityForm = {
      name: activity.name,
      description: activity.description,
      category: activity.category,
      age_from: activity.age_from,
      age_to: activity.age_to,
      price: activity.price,
    };
    // Ako ima sliku, prikaži je
    if (activity.image_url) {
      this.imagePreview = this.getImageUrl(activity.image_url);
    } else {
      this.imagePreview = null;
    }
    this.selectedImage = null;
    this.facade.openEditForm(activity);
  }

  closeForm(): void {
    this.resetForm();
    this.facade.closeForm();
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validacija tipa
      if (!file.type.startsWith('image/')) {
        alert('Molimo izaberite sliku');
        return;
      }

      // Validacija veličine (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Slika mora biti manja od 2MB');
        return;
      }

      this.selectedImage = file;

      // Preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
  }

  saveActivity(): void {
    const selected = this.selectedActivity();
    if (selected) {
      this.facade.updateActivity(selected.id, this.activityForm, this.selectedImage || undefined);
    } else {
      this.facade.createActivity(this.activityForm, this.selectedImage || undefined);
    }
  }

  deleteActivity(id: number): void {
    if (confirm('Da li ste sigurni da želite da obrišete ovu aktivnost?')) {
      this.facade.deleteActivity(id);
    }
  }
  isFormValid(): boolean {
    return !!(
      this.activityForm.name &&
      this.activityForm.category &&
      this.activityForm.age_from &&
      this.activityForm.age_to &&
      (this.activityForm.price || this.activityForm.price === 0)
    );
  }
  getImageUrl(imageUrl: string | null): string {
    if (!imageUrl) {
      return 'assets/images/placeholder.jpg';
    }
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `${environment.apiUrl.replace('/api', '')}${imageUrl}`;
  }

  getCategoryName(categoryId: string): string {
    const category = CATEGORIES.find(c => c.id === categoryId);
    return category?.name || categoryId;
  }

  private resetForm(): void {
    this.activityForm = {
      name: '',
      description: '',
      category: '',
      age_from: 3,
      age_to: 18,
      price: 0,
    };
    this.selectedImage = null;
    this.imagePreview = null;
  }
}
