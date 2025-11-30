import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginFacade } from './login.facade';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(LoginFacade);

  readonly isLoading = this.facade.isLoading;
  readonly errorMessage = this.facade.errorMessage;

  showPassword = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // Izvuci kontrole kao readonly properties
  readonly email = this.loginForm.controls.email;
  readonly password = this.loginForm.controls.password;

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.facade.login(this.email.value!, this.password.value!);
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  clearError(): void {
    this.facade.clearError();
  }
}
