import { DestroyRef, inject, Injectable } from '@angular/core';
import { ProfileStore } from './profile.store';
import { AuthService } from '../services/auth.service';
import {
  AddChildRequest,
  Child,
  ChildService,
  UpdateChildRequest,
} from '../services/child.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';

@Injectable()
export class ProfileFacade {
  private readonly _store = inject(ProfileStore);
  private readonly _childService = inject(ChildService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _authService = inject(AuthService);

  readonly state = {
    user: this._store.user,
    children: this._store.children,
    isLoading: this._store.isLoading,
    error: this._store.error,
    activeTab: this._store.activeTab,
    hasChildren: this._store.hasChildren,
    childrenCount: this._store.childrenCount,
    editingChild: this._store.editingChild,
    isFormVisible: this._store.isFormVisible,
  };

  init(): void {
    const user = this._authService.getCurrentUser();
    this._store.setUser(user);
    this.loadChildren();
  }
  loadChildren(): void {
    this._store.setLoading(true);
    this._store.setError(null);

    this._childService
      .getMyChildren()
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap((response: any) => {
          const children = response.children || response;
          this._store.setChildren(children);
          this._store.setLoading(false);
        }),
        catchError((error) => {
          this._store.setError('Greška ');
          this._store.setLoading(false);
          return of([]);
        })
      )
      .subscribe();
  }
  addChild(data: AddChildRequest) {
    this._store.setLoading(true);
    this._store.setError(null);

    this._childService
      .addChild(data)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap((response) => {
          this._store.addChild(response.child);
          this._store.setLoading(false);
          this._store.setFormVisible(false);
        }),
        catchError((error) => {
          this._store.setError('Greška pri dodavanju deteta');
          this._store.setLoading(false);
          return of(null);
        })
      )
      .subscribe();
  }

  updateChild(id: number, data: UpdateChildRequest): void {
    this._store.setLoading(true);
    this._store.setError(null);

    this._childService
      .updateChild(id, data)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap((response) => {
          this._store.updateChild(response.child);
          this._store.setLoading(false);
          this._store.setEditingChild(null);
          this._store.setFormVisible(false);
        }),
        catchError((error) => {
          this._store.setError('Greška pri ažuriranju deteta');
          this._store.setLoading(false);
          return of(null);
        })
      )
      .subscribe();
  }

  deleteChild(id: number): void {
    this._store.setLoading(true);
    this._store.setError(null);

    this._childService
      .deleteChild(id)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap(() => {
          this._store.removeChild(id);
          this._store.setLoading(false);
        }),
        catchError((error) => {
          this._store.setError('Greška pri brisanju deteta');
          this._store.setLoading(false);
          return of(null);
        })
      )
      .subscribe();
  }

  setActiveTab(tab: 'profile' | 'children' | 'reservations'): void {
    this._store.setActiveTab(tab);
  }

  openAddChildForm(): void {
    this._store.setEditingChild(null);
    this._store.setFormVisible(true);
  }

  openEditChildForm(child: Child): void {
    this._store.setEditingChild(child);
    this._store.setFormVisible(true);
  }

  closeForm(): void {
    this._store.setEditingChild(null);
    this._store.setFormVisible(false);
  }
}
