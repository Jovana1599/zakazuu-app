import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar';

@Component({
  selector: 'app-parent-panel',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './parent-panel.html',
  styleUrls: ['./parent-panel.scss'],
})
export class ParentPanelComponent {}
