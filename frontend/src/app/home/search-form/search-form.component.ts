import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
})
export class SearchFormComponent {
  private readonly router = inject(Router);

  activity = '';
  location = '';

  onSearch(): void {
    const queryParams: any = {};

    if (this.activity.trim()) {
      queryParams.search = this.activity.trim();
    }

    if (this.location.trim()) {
      queryParams.city = this.location.trim();
    }

    this.router.navigate(['/activities'], { queryParams });
  }
}
