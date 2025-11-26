import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Category {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-categories-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories-section.component.html',
  styleUrl: './categories-section.component.scss',
})
export class CategoriesSectionComponent {
  categories: Category[] = [
    { id: 'birthday', name: 'Rođendani', icon: '🎂' },
    { id: 'swimming', name: 'Plivanje', icon: '🏊' },
    { id: 'skating', name: 'Klizanje', icon: '⛸️' },
    { id: 'education', name: 'Edukacija', icon: '📚' },
    { id: 'art', name: 'Umetnost', icon: '🎨' },
    { id: 'football', name: 'Fudbal', icon: '⚽' },
    { id: 'dance', name: 'Ples', icon: '💃' },
    { id: 'nature', name: 'Boravak u prirodi', icon: '🌲' },
  ];

  constructor(private router: Router) {}

  onCategoryClick(categoryId: string): void {
    this.router.navigate(['/activities'], {
      queryParams: { category: categoryId },
    });
  }
}
