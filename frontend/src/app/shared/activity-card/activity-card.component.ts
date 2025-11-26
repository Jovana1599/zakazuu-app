import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Activity {
  id: number;
  name: string;
  description: string;
  institution_name: string;
  image_url?: string | null;
  category: string;
  rating: number;
}

@Component({
  selector: 'app-activity-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './activity-card.component.html',
  styleUrl: './activity-card.component.scss',
})
export class ActivityCardComponent {
  @Input() activity!: Activity;

  defaultImage = 'assets/images/placeholder.jpg';
}
