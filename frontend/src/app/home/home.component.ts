import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SearchFormComponent, SearchParams } from './search-form/search-form.component';
import { CategoriesSectionComponent } from './categories-section/categories-section.component';
import { ActivityCardComponent } from '../shared/activity-card/activity-card.component';
import { HomeStore } from './home.store';
import { HomeFacade } from './home.facade';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SearchFormComponent,
    CategoriesSectionComponent,
    ActivityCardComponent,
  ],
  providers: [HomeStore, HomeFacade],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly _facade = inject(HomeFacade);

  readonly activities = this._facade.state.topActivities;
  readonly isLoading = this._facade.state.isLoading;
  readonly error = this._facade.state.error;

  ngOnInit(): void {
    this._facade.loadActivities();
  }

  onSearch(params: SearchParams): void {
    this._facade.search(params.activity, params.location);
  }
}
