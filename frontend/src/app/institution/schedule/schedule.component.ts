import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScheduleStore } from './schedule.store';
import { ScheduleFacade } from './schedule.facade';

import { AddTimeSlotModalComponent } from './add-time-slots-modal/add-time-slots-modal.component';
@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, RouterLink, AddTimeSlotModalComponent],
  providers: [ScheduleStore, ScheduleFacade],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  private readonly facade = inject(ScheduleFacade);

  // State
  readonly isLoading = this.facade.state.isLoading;
  readonly activities = this.facade.state.activities;
  readonly locations = this.facade.state.locations;
  readonly timeSlots = this.facade.state.timeSlots;
  readonly error = this.facade.state.error;
  readonly timeSlotModalOpen = this.facade.timeSlotModalOpen;

  // Local state
  currentDate = signal(new Date());
  selectedDate = signal<Date | null>(null);
  selectedActivityId = signal<number | null>(null);
  selectedLocationId = signal<number | null>(null);

  // Computed
  currentMonth = computed(() => {
    return this.currentDate().toLocaleDateString('sr-Latn-RS', {
      month: 'long',
      year: 'numeric',
    });
  });

  calendarDays = computed(() => {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: { date: Date; isCurrentMonth: boolean; hasSlots: boolean; slotsCount: number }[] =
      [];

    // Previous month days
    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, isCurrentMonth: false, hasSlots: false, slotsCount: 0 });
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      const slotsCount = this.getSlotsForDate(d).length;
      days.push({ date: d, isCurrentMonth: true, hasSlots: slotsCount > 0, slotsCount });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: d, isCurrentMonth: false, hasSlots: false, slotsCount: 0 });
    }

    return days;
  });

  selectedDateSlots = computed(() => {
    const selected = this.selectedDate();
    if (!selected) return [];

    let slots = this.getSlotsForDate(selected);

    const activityId = this.selectedActivityId();
    const locationId = this.selectedLocationId();

    if (activityId) {
      slots = slots.filter((s) => s.activity_id === activityId);
    }
    if (locationId) {
      slots = slots.filter((s) => s.location_id === locationId);
    }

    return slots.sort((a, b) => a.time_from.localeCompare(b.time_from));
  });

  selectedDateFormatted = computed(() => {
    const selected = this.selectedDate();
    return selected ? this.formatDateISO(selected) : '';
  });

  ngOnInit(): void {
    this.facade.init();
    this.selectedDate.set(new Date());
  }

  private getSlotsForDate(date: Date): any[] {
    const dateStr = this.formatDateISO(date);
    return this.timeSlots().filter((slot) => {
      // Uzmi samo datum dio (prvih 10 karaktera: "2025-12-18")
      const slotDate = slot.date.substring(0, 10);
      return slotDate === dateStr;
    });
  }

  private formatDateISO(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Navigation
  previousMonth(): void {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  goToToday(): void {
    this.currentDate.set(new Date());
    this.selectedDate.set(new Date());
  }

  selectDate(day: { date: Date; isCurrentMonth: boolean }): void {
    if (day.isCurrentMonth) {
      this.selectedDate.set(day.date);
    }
  }

  isSelected(date: Date): boolean {
    const selected = this.selectedDate();
    return selected ? this.formatDateISO(date) === this.formatDateISO(selected) : false;
  }

  isToday(date: Date): boolean {
    return this.formatDateISO(date) === this.formatDateISO(new Date());
  }

  formatSelectedDate(): string {
    const date = this.selectedDate();
    if (!date) return '';
    return date.toLocaleDateString('sr-Latn-RS', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  getActivityName(activityId: number): string {
    return this.activities().find((a) => a.id === activityId)?.name || '';
  }

  getLocationAddress(locationId: number): string {
    return this.locations().find((l) => l.id === locationId)?.address || '';
  }

  getAvailableSpots(slot: any): number {
    return slot.capacity - (slot.booked || 0);
  }

  isFullyBooked(slot: any): boolean {
    return this.getAvailableSpots(slot) <= 0;
  }

  // Filters
  onActivityFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedActivityId.set(value ? parseInt(value) : null);
  }

  onLocationFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedLocationId.set(value ? parseInt(value) : null);
  }

  // Actions
  openAddTimeSlotModal(): void {
    this.facade.openAddTimeSlotModal(this.selectedDateFormatted());
  }

  async deleteTimeSlot(id: number): Promise<void> {
    if (confirm('Da li ste sigurni da želite da obrišete ovaj termin?')) {
      await this.facade.deleteTimeSlot(id);
    }
  }
}
