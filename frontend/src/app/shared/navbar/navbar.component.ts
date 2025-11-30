import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        window.location.href = '/home';
      },
      error: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/home';
      },
    });
  }
}
