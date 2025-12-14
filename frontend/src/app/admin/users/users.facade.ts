import { Injectable, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UsersStore, UserWithRole } from './users.store';
import { AdminService, User } from '../services/admin.service';

@Injectable()
export class UsersFacade {
  private readonly store = inject(UsersStore);
  private readonly adminService = inject(AdminService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastr = inject(ToastrService);

  // Expose state
  readonly state = {
    users: this.store.filteredUsers,
    selectedUser: this.store.selectedUser,
    isLoading: this.store.isLoading,
    isSubmitting: this.store.isSubmitting,
    error: this.store.error,
    isModalVisible: this.store.isModalVisible,
    usersCount: this.store.usersCount,
    searchQuery: this.store.searchQuery,
    roleFilter: this.store.roleFilter,
  };

  init(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.store.setLoading(true);
    this.store.setError(null);

    this.adminService
      .getUsers()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.store.setUsers(res.users);
          this.store.setLoading(false);
        }),
        catchError((err) => {
          this.store.setError('Greška pri učitavanju korisnika');
          this.store.setLoading(false);
          this.toastr.error('Greška pri učitavanju korisnika');
          return of(null);
        })
      )
      .subscribe();
  }

  updateUser(id: number, data: Partial<User>): void {
    this.store.setSubmitting(true);

    this.adminService
      .updateUser(id, data)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.store.updateUser(res.user);
          this.store.setSubmitting(false);
          this.store.setModalVisible(false);
          this.store.setSelectedUser(null);
          this.toastr.success('Korisnik uspešno ažuriran');
        }),
        catchError((err) => {
          this.store.setSubmitting(false);
          this.toastr.error(err.error?.message || 'Greška pri ažuriranju');
          return of(null);
        })
      )
      .subscribe();
  }

  deleteUser(id: number): void {
    this.adminService
      .deleteUser(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.store.removeUser(id);
          this.toastr.success('Korisnik uspešno obrisan');
        }),
        catchError((err) => {
          this.toastr.error(err.error?.message || 'Greška pri brisanju');
          return of(null);
        })
      )
      .subscribe();
  }

  openEditModal(user: UserWithRole): void {
    this.store.setSelectedUser(user);
    this.store.setModalVisible(true);
  }

  closeModal(): void {
    this.store.setSelectedUser(null);
    this.store.setModalVisible(false);
  }

  setSearchQuery(query: string): void {
    this.store.setSearchQuery(query);
  }

  setRoleFilter(role: number | null): void {
    this.store.setRoleFilter(role);
  }
}
