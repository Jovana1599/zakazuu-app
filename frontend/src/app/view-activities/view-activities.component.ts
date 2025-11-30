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

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['search'] || '';
      this.selectedCity = params['city'] || '';
      this.selectedCategory = params['category'] || '';

      this.facade.setFiltersFromParams(this.searchQuery, this.selectedCity, this.selectedCategory);
      this.facade.loadActivities();
    });
  }

  applyFilters(): void {
    this.facade.applyFilters(this.searchQuery, this.selectedCity, this.selectedCategory);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCity = '';
    this.selectedCategory = '';
    this.facade.clearFilters();
  }

  loadActivities(): void {
    this.facade.loadActivities();
  }
}
