import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionStore } from './subscription.store';
import { SubscriptionFacade } from './subscription.facade';
import { Membership } from '../services/institution.service';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule],
  providers: [SubscriptionStore, SubscriptionFacade],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss',
})
export class SubscriptionComponent implements OnInit {
  private readonly facade = inject(SubscriptionFacade);

  readonly state = this.facade.state;

  ngOnInit(): void {
    this.facade.init();
  }

  onSubscribe(membership: Membership): void {
    if (confirm(`Da li ste sigurni da želite da se pretplatite na paket "${membership.name}"?`)) {
      this.facade.subscribe(membership.id);
    }
  }

  onCancel(): void {
    if (confirm('Da li ste sigurni da želite da otkažete članarinu?')) {
      this.facade.cancelSubscription();
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('sr-RS', {
      style: 'currency',
      currency: 'RSD',
      minimumFractionDigits: 0,
    }).format(price);
  }

  formatDate(date: string | null): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('sr-RS');
  }
}
