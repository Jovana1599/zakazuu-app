import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginFacade {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly _isLoading = signal(false);
  private readonly _errorMessage = signal<string | null>(null);

  readonly isLoading = this._isLoading.asReadonly();
  readonly errorMessage = this._errorMessage.asReadonly();

  login(email: string, password: string): void {
    this._isLoading.set(true);
    this._errorMessage.set(null);

    this.authService.login(email, password).subscribe({
      next: () => {
        this._isLoading.set(false);
        this.redirectBasedOnRole();
      },
      error: (error) => {
        this._isLoading.set(false);
        this._errorMessage.set(error.error?.message || 'Greška pri prijavljivanju');
      },
    });
  }

  clearError(): void {
    this._errorMessage.set(null);
  }

  private redirectBasedOnRole(): void {
    if (this.authService.isParent()) {
      this.router.navigate(['/home']);
    } else if (this.authService.isInstitution()) {
      this.router.navigate(['/institution']);
    } else if (this.authService.isAdmin()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
