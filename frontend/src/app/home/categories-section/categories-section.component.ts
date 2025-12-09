import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CATEGORIES, Category } from '../../shared/categories.config';
@Component({
  selector: 'app-categories-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories-section.component.html',
  styleUrl: './categories-section.component.scss',
})
export class CategoriesSectionComponent {
  private readonly router = inject(Router);

  // Prvih 8 kategorija za prikaz
  categories: Category[] = CATEGORIES.slice(0, 8);

  onCategoryClick(category: Category): void {
    this.router.navigate(['/activities'], {
      queryParams: { category: category.id },
    });
  }
}
