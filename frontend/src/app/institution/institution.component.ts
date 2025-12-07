import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-institution.component',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './institution.component.html',
  styleUrl: './institution.component.scss',
})
export class InstitutionComponent {}
