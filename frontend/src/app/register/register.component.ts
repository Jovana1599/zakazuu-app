import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage = signal<string>('');
  isLoading = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  registrationType = signal(0); // 0 = roditelj, 2 = ustanova

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: ['', [Validators.required]],
        // Institution fields (optional)
        phone: [''],
        description: [''],
        website: [''],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    // Proveri query param za ulogu
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      if (params['role'] === 'institution') {
        this.registrationType.set(2);
      }
    });
  }

  selectRole(role: number): void {
    this.registrationType.set(role);
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('password_confirmation');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword && !confirmPassword.hasError('required')) {
      confirmPassword.setErrors(null);
    }
    return null;
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  clearError(): void {
    this.errorMessage.set('');
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { name, email, password, password_confirmation, phone, description, website } =
      this.registerForm.value;

    const registrationType = this.registrationType();

    this.authService
      .register(
        name,
        email,
        password,
        password_confirmation,
        registrationType,
        phone,
        description,
        website
      )
      .subscribe({
        next: () => {
          if (registrationType === 2) {
            this.router.navigate(['/institution']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (error) => {
          console.error('Registration error', error);
          this.errorMessage.set(error.error?.message || 'Greška pri registraciji');
          this.isLoading.set(false);
        },
      });
  }

  get name() {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get password_confirmation() {
    return this.registerForm.get('password_confirmation');
  }
}
