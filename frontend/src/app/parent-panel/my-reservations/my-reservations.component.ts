import { Component, inject } from '@angular/core';
import { MyReservationsFacade } from './my-reservations.facade';
import { MyReservationsStore } from './my-reservations.store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-reservations.component',
  standalone: true,
  imports: [RouterLink],
  providers: [MyReservationsStore, MyReservationsFacade],

  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.scss',
})
export class MyReservationsComponent {
  private readonly _facade = inject(MyReservationsFacade);
  readonly reservations = this._facade.state.reservations;
  readonly isLoadingReservations = this._facade.state.isLoadingReservations;
  readonly hasReservations = this._facade.state.hasReservations;
  readonly pendingReservationsCount = this._facade.state.pendingReservationsCount;

  ngOnInit(): void {
    this._facade.init();
  }
  cancelReservation(id: number): void {
    if (confirm('Da li ste sigurni da želite da otkažete rezervaciju?')) {
      this._facade.cancelReservation(id);
    }
  }
  getStatusClass(status: string): string {
    return `status-${status}`;
  }
  formatTime(time: string): string {
    return time.substring(0, 5);
  }
  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      pending: 'Na čekanju',
      confirmed: 'Potvrđeno',
      rejected: 'Odbijeno',
      cancelled: 'Otkazano',
    };
    return statusMap[status] || status;
  }
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sr-Latn-RS', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
