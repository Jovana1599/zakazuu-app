import { Injectable, signal, computed } from '@angular/core';
import type { TimeSlot, Activity, Location } from '../services/institution.service';

interface ScheduleState {
  timeSlots: TimeSlot[];
  activities: Activity[];
  locations: Location[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ScheduleState = {
  timeSlots: [],
  activities: [],
  locations: [],
  isLoading: false,
  error: null,
};

@Injectable()
export class ScheduleStore {
  private readonly state = signal<ScheduleState>(initialState);

  // Selectors
  readonly timeSlots = computed(() => this.state().timeSlots);
  readonly activities = computed(() => this.state().activities);
  readonly locations = computed(() => this.state().locations);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly error = computed(() => this.state().error);

  // Actions
  setLoading(isLoading: boolean): void {
    this.state.update((s) => ({ ...s, isLoading }));
  }

  setError(error: string | null): void {
    this.state.update((s) => ({ ...s, error }));
  }

  setTimeSlots(timeSlots: TimeSlot[]): void {
    this.state.update((s) => ({ ...s, timeSlots }));
  }

  setActivities(activities: Activity[]): void {
    this.state.update((s) => ({ ...s, activities }));
  }

  setLocations(locations: Location[]): void {
    this.state.update((s) => ({ ...s, locations }));
  }

  addTimeSlot(timeSlot: TimeSlot): void {
    this.state.update((s) => ({
      ...s,
      timeSlots: [...s.timeSlots, timeSlot],
    }));
  }

  updateTimeSlot(id: number, timeSlot: Partial<TimeSlot>): void {
    this.state.update((s) => ({
      ...s,
      timeSlots: s.timeSlots.map((ts) => (ts.id === id ? { ...ts, ...timeSlot } : ts)),
    }));
  }

  removeTimeSlot(id: number): void {
    this.state.update((s) => ({
      ...s,
      timeSlots: s.timeSlots.filter((ts) => ts.id !== id),
    }));
  }
}
