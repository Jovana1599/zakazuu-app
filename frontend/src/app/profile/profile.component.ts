import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileStore } from './profile.store';
import { ProfileFacade } from './profile.facade';
import { Child } from '../services/child.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ProfileStore, ProfileFacade],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  private readonly _facade = inject(ProfileFacade);

  // State
  readonly user = this._facade.state.user;
  readonly children = this._facade.state.children;
  readonly isLoading = this._facade.state.isLoading;
  readonly error = this._facade.state.error;
  readonly activeTab = this._facade.state.activeTab;
  readonly hasChildren = this._facade.state.hasChildren;
  readonly editingChild = this._facade.state.editingChild;
  readonly isFormVisible = this._facade.state.isFormVisible;

  // Form model
  childForm = {
    first_name: '',
    last_name: '',
    age: 0,
    medical_restrictions: '',
    note: '',
  };

  ngOnInit(): void {
    this._facade.init();
  }

  setActiveTab(tab: 'profile' | 'children' | 'reservations'): void {
    this._facade.setActiveTab(tab);
  }

  openAddForm(): void {
    this.resetForm();
    this._facade.openAddChildForm();
  }

  openEditForm(child: Child): void {
    this.childForm = {
      first_name: child.first_name,
      last_name: child.last_name,
      age: child.age,
      medical_restrictions: child.medical_restrictions || '',
      note: child.note || '',
    };
    this._facade.openEditChildForm(child);
  }

  closeForm(): void {
    this.resetForm();
    this._facade.closeForm();
  }

  saveChild(): void {
    const editing = this.editingChild();
    if (editing) {
      this._facade.updateChild(editing.id, this.childForm);
    } else {
      this._facade.addChild(this.childForm);
    }
    this.resetForm();
  }

  deleteChild(id: number): void {
    if (confirm('Da li ste sigurni da želite da obrišete dete?')) {
      this._facade.deleteChild(id);
    }
  }

  private resetForm(): void {
    this.childForm = {
      first_name: '',
      last_name: '',
      age: 0,
      medical_restrictions: '',
      note: '',
    };
  }
}
