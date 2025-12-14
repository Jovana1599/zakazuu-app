import { Injectable, computed, signal } from '@angular/core';
import { User } from '../services/admin.service';

export const ROLES_CONFIG: Record<number, { name: string; class: string }> = {
  0: { name: 'Roditelj', class: 'role-parent' },
  1: { name: 'Admin', class: 'role-admin' },
  2: { name: 'Ustanova', class: 'role-institution' },
};

// Prošireni User tip sa role info
export interface UserWithRole extends User {
  roleName: string;
  roleClass: string;
}

@Injectable()
export class UsersStore {
  // State
  readonly users = signal<UserWithRole[]>([]);
  readonly selectedUser = signal<UserWithRole | null>(null);
  readonly isLoading = signal(false);
  readonly isSubmitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly isModalVisible = signal(false);
  readonly searchQuery = signal('');
  readonly roleFilter = signal<number | null>(null);

  // Computed - filtrirani korisnici
  readonly filteredUsers = computed(() => {
    let result = this.users();
    const query = this.searchQuery().toLowerCase();
    const role = this.roleFilter();

    if (query) {
      result = result.filter(
        (u) => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
      );
    }

    if (role !== null) {
      result = result.filter((u) => u.role_as === role);
    }

    return result;
  });

  readonly usersCount = computed(() => this.filteredUsers().length);

  // Setters
  setUsers(users: User[]): void {
    const mapped = users.map((u) => ({
      ...u,
      roleName: ROLES_CONFIG[u.role_as]?.name || 'Nepoznato',
      roleClass: ROLES_CONFIG[u.role_as]?.class || '',
    }));
    this.users.set(mapped);
  }

  updateUser(updated: User): void {
    this.users.update((list) =>
      list.map((user) =>
        user.id === updated.id
          ? {
              ...updated,
              roleName: ROLES_CONFIG[updated.role_as]?.name || 'Nepoznato',
              roleClass: ROLES_CONFIG[updated.role_as]?.class || '',
            }
          : user
      )
    );
  }

  removeUser(id: number): void {
    this.users.update((list) => list.filter((u) => u.id !== id));
  }

  setSelectedUser(user: UserWithRole | null): void {
    this.selectedUser.set(user);
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  setSubmitting(submitting: boolean): void {
    this.isSubmitting.set(submitting);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }

  setModalVisible(visible: boolean): void {
    this.isModalVisible.set(visible);
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  setRoleFilter(role: number | null): void {
    this.roleFilter.set(role);
  }
}
