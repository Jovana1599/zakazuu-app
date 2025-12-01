import { computed, Injectable, signal } from '@angular/core';
import { Child } from '../services/child.service';
export interface User {
  id: number;
  name: string;
  email: string;
  role_as: number;
}
@Injectable()
export class ProfileStore {
  readonly user = signal<User | null>(null);
  readonly children = signal<Child[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly activeTab = signal<'profile' | 'children' | 'reservations'>('profile');
  readonly editingChild = signal<Child | null>(null);
  readonly isFormVisible = signal<boolean>(false);

  readonly hasChildren = computed(() => this.children().length > 0);
  readonly childrenCount = computed(() => this.children().length);

  setUser(user: User | null) {
    this.user.set(user);
  }
  setChildren(children: Child[]): void {
    this.children.set(children);
  }

  addChild(child: Child): void {
    this.children.update((children) => [...children, child]);
  }

  updateChild(updatedChild: Child): void {
    this.children.update((children) =>
      children.map((c) => (c.id === updatedChild.id ? updatedChild : c))
    );
  }

  removeChild(childId: number): void {
    this.children.update((children) => children.filter((c) => c.id !== childId));
  }

  setLoading(isLoading: boolean): void {
    this.isLoading.set(isLoading);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }

  setActiveTab(tab: 'profile' | 'children' | 'reservations'): void {
    this.activeTab.set(tab);
  }

  setEditingChild(child: Child | null): void {
    this.editingChild.set(child);
  }

  setFormVisible(visible: boolean): void {
    this.isFormVisible.set(visible);
  }

  reset(): void {
    this.children.set([]);
    this.isLoading.set(false);
    this.error.set(null);
    this.editingChild.set(null);
    this.isFormVisible.set(false);
  }
}
