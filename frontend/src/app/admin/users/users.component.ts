import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersFacade } from './users.facade';
import { UsersStore, UserWithRole } from './users.store';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [UsersFacade, UsersStore],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class AdminUsersComponent implements OnInit {
  private readonly facade = inject(UsersFacade);

  readonly state = this.facade.state;

  // Edit form
  editForm = { name: '', email: '', role_as: 0 };

  ngOnInit(): void {
    this.facade.init();
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.facade.setSearchQuery(query);
  }

  onRoleFilter(role: number | null): void {
    this.facade.setRoleFilter(role);
  }

  openEdit(user: UserWithRole): void {
    this.editForm = {
      name: user.name,
      email: user.email,
      role_as: user.role_as,
    };
    this.facade.openEditModal(user);
  }

  closeModal(): void {
    this.facade.closeModal();
  }

  saveUser(): void {
    const user = this.state.selectedUser();
    if (user) {
      this.facade.updateUser(user.id, this.editForm);
    }
  }

  confirmDelete(user: UserWithRole): void {
    if (confirm(`Da li ste sigurni da želite obrisati korisnika "${user.name}"?`)) {
      this.facade.deleteUser(user.id);
    }
  }
}
