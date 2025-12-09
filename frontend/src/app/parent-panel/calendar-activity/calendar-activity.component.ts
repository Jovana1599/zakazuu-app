import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CalendarFacade } from './calendar-activity.facade';
import { CalendarStore } from './calendar-activity.store';
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [CalendarStore, CalendarFacade],
  templateUrl: './calendar-activity.component.html',
  styleUrls: ['./calendar-activity.component.scss'],
})
export class CalendarComponent implements OnInit {
  readonly facade = inject(CalendarFacade);
  readonly s = this.facade.state;

  ngOnInit(): void {
    this.facade.init();
  }
}
