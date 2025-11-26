import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SearchParams {
  activity: string;
  location: string;
}
@Component({
  selector: 'app-search-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
})
export class SearchFormComponent {
  @Output() search = new EventEmitter<SearchParams>();

  activity = '';
  location = '';

  onSearch(): void {
    this.search.emit({
      activity: this.activity,
      location: this.location,
    });
  }
}
