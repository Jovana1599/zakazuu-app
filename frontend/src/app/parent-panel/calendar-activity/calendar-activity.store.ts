import { Injectable, computed, signal } from '@angular/core';

export interface CalendarReservation {
  id: number;
  child_id: number;
  status: string;
  child?: { first_name: string };
  activity?: { name: string };
  time_slot?: {
    date: string;
    time_from: string;
    time_to: string;
    location?: { address: string };
  };
}

@Injectable()
export class CalendarStore {
  // State
  readonly reservations = signal<CalendarReservation[]>([]);
  readonly isLoading = signal(true);
  readonly currentDate = signal(new Date());
  readonly viewMode = signal<'month' | 'week'>('month');
  readonly selectedDate = signal<Date | null>(null);
  readonly childColors = signal<Record<number, string>>({});

  // Computed
  readonly currentMonth = computed(() =>
    this.currentDate().toLocaleDateString('sr-Latn-RS', {
      month: 'long',
      year: 'numeric',
    })
  );

  readonly calendarDays = computed(() => this.generateDays('month'));
  readonly weekDays = computed(() => this.generateDays('week'));

  readonly selectedDayReservations = computed(() => {
    const selected = this.selectedDate();
    return selected ? this.getReservationsForDate(selected) : [];
  });

  readonly weekRange = computed(() => {
    const days = this.weekDays();
    if (!days.length) return '';
    return `${days[0].date.getDate()}. -
  ${days[6].date.getDate()}.
  ${days[6].date.toLocaleDateString('sr-Latn-RS', { month: 'long' })}`;
  });

  // Setters
  setReservations(reservations: CalendarReservation[]): void {
    this.reservations.set(reservations);
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  setCurrentDate(date: Date): void {
    this.currentDate.set(date);
  }

  setViewMode(mode: 'month' | 'week'): void {
    this.viewMode.set(mode);
  }

  setSelectedDate(date: Date | null): void {
    this.selectedDate.set(date);
  }

  setChildColors(colors: Record<number, string>): void {
    this.childColors.set(colors);
  }

  // Helpers
  getReservationsForDate(date: Date): CalendarReservation[] {
    const dateStr = date.toISOString().split('T')[0];
    return this.reservations().filter((r) => r.time_slot?.date === dateStr);
  }

  private generateDays(mode: 'month' | 'week') {
    const date = this.currentDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (mode === 'week') {
      const start = this.getStartOfWeek(date);
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return this.createDay(d, d.getMonth() === date.getMonth(), today);
      });
    }

    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = this.getStartOfWeek(firstDay);

    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      return this.createDay(d, d.getMonth() === month, today);
    });
  }

  private createDay(date: Date, isCurrentMonth: boolean, today: Date) {
    return {
      date,
      isCurrentMonth,
      isToday: date.getTime() === today.getTime(),
      reservations: this.getReservationsForDate(date),
    };
  }

  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
    return d;
  }
}
