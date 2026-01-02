import { Injectable, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap, forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { SubscriptionStore } from './subscription.store';
import { InstitutionService } from '../services/institution.service';

@Injectable()
export class SubscriptionFacade {
  private readonly store = inject(SubscriptionStore);
  private readonly institutionService = inject(InstitutionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastr = inject(ToastrService);

  // Expose state
  readonly state = {
    currentSubscription: this.store.currentSubscription,
    memberships: this.store.memberships,
    usage: this.store.usage,
    history: this.store.history,
    isLoading: this.store.isLoading,
    isSubscribing: this.store.isSubscribing,
    error: this.store.error,
    hasActiveSubscription: this.store.hasActiveSubscription,
    daysRemaining: this.store.daysRemaining,
    isNearExpiry: this.store.isNearExpiry,
    usagePercentage: this.store.usagePercentage,
    currentMembershipName: this.store.currentMembershipName,
  };

  init(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.store.setLoading(true);
    this.store.setError(null);

    forkJoin({
      subscription: this.institutionService.getCurrentSubscription(),
      memberships: this.institutionService.getMemberships(),
      usage: this.institutionService.getSubscriptionUsage(),
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.store.setCurrentSubscription(res.subscription.subscription);
          this.store.setMemberships(res.memberships.memberships);
          this.store.setUsage(res.usage.usage);
          this.store.setLoading(false);
        }),
        catchError((err) => {
          this.store.setError('Greška pri učitavanju podataka o članarini');
          this.store.setLoading(false);
          return of(null);
        })
      )
      .subscribe();
  }

  loadSubscription(): void {
    this.institutionService
      .getCurrentSubscription()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.store.setCurrentSubscription(res.subscription);
        }),
        catchError((err) => {
          return of(null);
        })
      )
      .subscribe();
  }

  loadMemberships(): void {
    this.institutionService
      .getMemberships()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.store.setMemberships(res.memberships);
        }),
        catchError((err) => {
          return of(null);
        })
      )
      .subscribe();
  }

  loadUsage(): void {
    this.institutionService
      .getSubscriptionUsage()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.store.setUsage(res.usage);
        }),
        catchError((err) => {
          return of(null);
        })
      )
      .subscribe();
  }

  loadHistory(): void {
    this.store.setLoading(true);
    this.institutionService
      .getSubscriptionHistory()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.store.setHistory(res.subscriptions);
          this.store.setLoading(false);
        }),
        catchError((err) => {
          this.store.setLoading(false);
          return of(null);
        })
      )
      .subscribe();
  }

  subscribe(membershipId: number, paymentReference?: string): void {
    this.store.setSubscribing(true);
    this.store.setError(null);

    this.institutionService
      .subscribe(membershipId, paymentReference)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.store.setCurrentSubscription(res.subscription);
          this.store.setSubscribing(false);
          this.toastr.success(res.message);
          this.loadUsage();
        }),
        catchError((err) => {
          this.store.setError(err.error?.message || 'Greška pri pretplati');
          this.store.setSubscribing(false);
          this.toastr.error(err.error?.message || 'Greška pri pretplati');
          return of(null);
        })
      )
      .subscribe();
  }

  cancelSubscription(): void {
    this.store.setSubscribing(true);

    this.institutionService
      .cancelSubscription()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.store.setSubscribing(false);
          this.toastr.success(res.message);
          this.loadSubscription();
          this.loadUsage();
        }),
        catchError((err) => {
          this.store.setSubscribing(false);
          this.toastr.error('Greška pri otkazivanju članarine');
          return of(null);
        })
      )
      .subscribe();
  }
}
