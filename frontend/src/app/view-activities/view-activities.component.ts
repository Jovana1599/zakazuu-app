import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivityCardComponent } from '../shared/activity-card/activity-card.component';
import { ViewActivitiesStore } from './view-activities.store';
import { ViewActivitiesFacade } from './view-activities.facade';

@Component({
  selector: 'app-view-activities',
  standalone: true,
  imports: [RouterLink, FormsModule, ActivityCardComponent],
  providers: [ViewActivitiesStore, ViewActivitiesFacade],
  templateUrl: './view-activities.component.html',
  styleUrls: ['./view-activities.component.scss'],
})
export class ViewActivitiesComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly facade = inject(ViewActivitiesFacade);

  // State from facade
  readonly activities = this.facade.state.activities;
  readonly isLoading = this.facade.state.isLoading;
  readonly error = this.facade.state.error;
  readonly cities = this.facade.state.cities;
  readonly categories = this.facade.state.categories;
  readonly hasActiveFilters = this.facade.state.hasActiveFilters;
  readonly activitiesCount = this.facade.state.activitiesCount;
  readonly selectedCategoryName = this.facade.state.selectedCategoryName;

  // Local form state
  searchQuery = '';
  selectedCity = '';
  selectedCategory = '';
  selectedAge = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  // Age options
  readonly ageOptions = [
    { value: '2', label: '2 godine' },
    { value: '3', label: '3 godine' },
    { value: '4', label: '4 godine' },
    { value: '5', label: '5 godina' },
    { value: '6', label: '6 godina' },
    { value: '7', label: '7 godina' },
    { value: '8', label: '8 godina' },
    { value: '9', label: '9 godina' },
    { value: '10', label: '10 godina' },
    { value: '11', label: '11 godina' },
    { value: '12', label: '12 godina' },
    { value: '13', label: '13 godina' },
    { value: '14', label: '14 godina' },
    { value: '15', label: '15 godina' },
  ];

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['search'] || '';
      this.selectedCity = params['city'] || '';
      this.selectedCategory = params['category'] || '';
      this.selectedAge = params['age'] || '';
      this.minPrice = params['min_price'] ? +params['min_price'] : null;
      this.maxPrice = params['max_price'] ? +params['max_price'] : null;

      this.facade.setFiltersFromParams({
        search: this.searchQuery,
        city: this.selectedCity,
        category: this.selectedCategory,
        age: this.selectedAge,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
      });
      this.facade.loadActivities();
    });
  }

  applyFilters(): void {
    this.facade.applyFilters({
      search: this.searchQuery,
      city: this.selectedCity,
      category: this.selectedCategory,
      age: this.selectedAge,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCity = '';
    this.selectedCategory = '';
    this.selectedAge = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.facade.clearFilters();
  }

  loadActivities(): void {
    this.facade.loadActivities();
  }
}
