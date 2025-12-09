import { Injectable, inject } from '@angular/core';
import { forkJoin, tap, catchError, of, firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ScheduleStore } from './schedule.store';
import { InstitutionService, TimeSlot } from '../services/institution.service';
import { ModalService, TimeSlotFormData } from '../../services/modal.service';

@Injectable()
export class ScheduleFacade {
  private readonly store = inject(ScheduleStore);
  private readonly institutionService = inject(InstitutionService);
  private readonly modalService = inject(ModalService);
  private readonly toastr = inject(ToastrService);

  // Expose state
  readonly state = {
    timeSlots: this.store.timeSlots,
    activities: this.store.activities,
    locations: this.store.locations,
    isLoading: this.store.isLoading,
    error: this.store.error,
  };

  // Modal state
  readonly timeSlotModalOpen = this.modalService.timeSlotModalOpen;

  init(): void {
    this.store.setLoading(true);
    this.store.setError(null);

    forkJoin({
      activities: this.institutionService.getActivities(),
      locations: this.institutionService.getLocations(),
      timeSlots: this.institutionService.getTimeSlots(),
    })
      .pipe(
        tap((response) => {
          this.store.setActivities(response.activities.activities || []);
          this.store.setLocations(response.locations.locations || []);
          this.store.setTimeSlots(response.timeSlots.time_slots || []);
        }),
        catchError((error) => {
          this.store.setError('Greška pri učitavanju podataka');
          this.toastr.error('Greška pri učitavanju podataka');
          console.error('Schedule init error:', error);
          return of(null);
        })
      )
      .subscribe(() => {
        this.store.setLoading(false);
      });
  }

  openAddTimeSlotModal(selectedDate?: string): void {
    const activities = this.store.activities().map((a) => ({ id: a.id, name: a.name }));
    const locations = this.store
      .locations()
      .map((l) => ({ id: l.id, address: l.address, city: l.city }));

    this.modalService.openTimeSlotModal(
      {
        activities,
        locations,
        selectedDate,
      },
      (data) => this.createTimeSlot(data)
    );
  }

  closeTimeSlotModal(): void {
    this.modalService.closeTimeSlotModal();
  }

  async createTimeSlot(data: TimeSlotFormData): Promise<void> {
    console.log('Facade: Creating time slot with data:', data);

    try {
      const response = await firstValueFrom(this.institutionService.createTimeSlot(data));

      console.log('Facade: Response from server:', response);

      const activity = this.store.activities().find((a) => a.id === data.activity_id);
      const location = this.store.locations().find((l) => l.id === data.location_id);

      const newTimeSlot: TimeSlot = {
        ...response.time_slot,
        activity: activity ? { id: activity.id, name: activity.name } : undefined,
        location: location
          ? { id: location.id, address: location.address, city: location.city }
          : undefined,
      };

      console.log('Facade: Adding new time slot to store:', newTimeSlot);
      this.store.addTimeSlot(newTimeSlot);
      this.toastr.success('Termin je uspešno kreiran!');
    } catch (error) {
      console.error('Facade: Error creating time slot:', error);
      this.store.setError('Greška pri kreiranju termina');
      this.toastr.error('Greška pri kreiranju termina');
      throw error;
    }
  }

  deleteTimeSlot(id: number): void {
    this.institutionService
      .deleteTimeSlot(id)
      .pipe(
        tap(() => {
          this.store.removeTimeSlot(id);
          this.toastr.success('Termin je uspešno obrisan!');
        }),
        catchError((error) => {
          this.store.setError('Greška pri brisanju termina');
          this.toastr.error('Greška pri brisanju termina');
          console.error('Delete time slot error:', error);
          return of(null);
        })
      )
      .subscribe();
  }
}
