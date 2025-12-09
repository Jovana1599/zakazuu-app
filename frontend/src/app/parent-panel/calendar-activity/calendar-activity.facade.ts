import { Injectable, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReservationService } from '../../services/reservation.service';
import { CalendarStore } from './calendar-activity.store';
@Injectable()
export class CalendarFacade {
  private readonly store = inject(CalendarStore);
  private readonly reservationService = inject(ReservationService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly colorPalette = [
    '#6c5ae5',
    '#e74c3c',
    '#27ae60',
    '#f39c12',
    '#3498db',
    '#9b59b6',
    '#1abc9c',
    '#e91e63',
    '#00bcd4',
    '#ff5722',
  ];

  readonly weekDayNames = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];

  // Expose state
  readonly state = {
    reservations: this.store.reservations,
    isLoading: this.store.isLoading,
    currentDate: this.store.currentDate,
    viewMode: this.store.viewMode,
    selectedDate: this.store.selectedDate,
    childColors: this.store.childColors,
    currentMonth: this.store.currentMonth,
    calendarDays: this.store.calendarDays,
    weekDays: this.store.weekDays,
    weekRange: this.store.weekRange,
    selectedDayReservations: this.store.selectedDayReservations,
  };

  init(): void {
    this.store.setLoading(true);
    this.reservationService
      .getMyReservations()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const active = (res || []).filter((r: any) =>
            r.status === 'confirmed' || r.status === 'pending'
          );
          this.store.setReservations(active);
          this.assignColors(active);
          this.store.setLoading(false);
        },
        error: () => this.store.setLoading(false),
      });
  }

  private assignColors(reservations: any[]): void {
    const ids = [...new Set(reservations.map((r) => r.child_id))];
    const colors: Record<number, string> = {};
    ids.forEach((id, i) => (colors[id] = this.colorPalette[i % this.colorPalette.length]));
    this.store.setChildColors(colors);
  }

  navigate(direction: 'prev' | 'next'): void {
    const current = this.store.currentDate();
    const offset = direction === 'prev' ? -1 : 1;

    if (this.store.viewMode() === 'month') {
      this.store.setCurrentDate(new Date(current.getFullYear(), current.getMonth() + offset, 1));
    } else {
      const newDate = new Date(current);
      newDate.setDate(current.getDate() + offset * 7);
      this.store.setCurrentDate(newDate);
    }
  }

  goToToday(): void {
    const today = new Date();
    this.store.setCurrentDate(today);
    this.store.setSelectedDate(today);
  }

  setViewMode(mode: 'month' | 'week'): void {
    this.store.setViewMode(mode);
  }

  selectDay(day: any): void {
    this.store.setSelectedDate(day.date);
  }

  getChildColor(childId: number): string {
    return this.store.childColors()[childId] || '#6c5ae5';
  }

  formatTime(time: string): string {
    return time?.substring(0, 5) || '';
  }

  formatSelectedDate(): string {
    const date = this.store.selectedDate();
    if (!date) return '';
    return date.toLocaleDateString('sr-Latn-RS', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }
}
