import { Injectable, computed, signal } from '@angular/core';
import {
  Membership,
  InstitutionSubscription,
  SubscriptionUsage,
} from '../services/institution.service';

@Injectable()
export class SubscriptionStore {
  // State
  readonly currentSubscription = signal<InstitutionSubscription | null>(null);
  readonly memberships = signal<Membership[]>([]);
  readonly usage = signal<SubscriptionUsage | null>(null);
  readonly history = signal<InstitutionSubscription[]>([]);
  readonly isLoading = signal(false);
  readonly isSubscribing = signal(false);
  readonly error = signal<string | null>(null);

  // Computed
  readonly hasActiveSubscription = computed(() => {
    const sub = this.currentSubscription();
    return sub !== null && sub.status === 'active';
  });

  readonly daysRemaining = computed(() => {
    return this.usage()?.days_remaining ?? 0;
  });

  readonly isNearExpiry = computed(() => {
    return this.daysRemaining() > 0 && this.daysRemaining() <= 7;
  });

  readonly usagePercentage = computed(() => {
    return this.usage()?.percentage_used ?? 0;
  });

  readonly currentMembershipName = computed(() => {
    return this.currentSubscription()?.membership?.name ?? null;
  });

  // Setters
  setCurrentSubscription(subscription: InstitutionSubscription | null): void {
    this.currentSubscription.set(subscription);
  }

  setMemberships(memberships: Membership[]): void {
    this.memberships.set(memberships);
  }

  setUsage(usage: SubscriptionUsage | null): void {
    this.usage.set(usage);
  }

  setHistory(history: InstitutionSubscription[]): void {
    this.history.set(history);
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  setSubscribing(subscribing: boolean): void {
    this.isSubscribing.set(subscribing);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }

  reset(): void {
    this.currentSubscription.set(null);
    this.memberships.set([]);
    this.usage.set(null);
    this.history.set([]);
    this.isLoading.set(false);
    this.isSubscribing.set(false);
    this.error.set(null);
  }
}
