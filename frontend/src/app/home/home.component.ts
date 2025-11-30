import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchFormComponent } from './search-form/search-form.component';
import { CategoriesSectionComponent } from './categories-section/categories-section.component';
import { ActivityCardComponent } from '../shared/activity-card/activity-card.component';
import { HomeStore } from './home.store';
import { HomeFacade } from './home.facade';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, SearchFormComponent, CategoriesSectionComponent, ActivityCardComponent],
  providers: [HomeStore, HomeFacade],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly facade = inject(HomeFacade);

  readonly activities = this.facade.state.topActivities;
  readonly isLoading = this.facade.state.isLoading;
  readonly error = this.facade.state.error;

  ngOnInit(): void {
    this.facade.loadActivities();
  }
}
