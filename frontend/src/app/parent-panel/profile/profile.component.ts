import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileStore } from './profile.store';
import { ProfileFacade } from './profile.facade';
import { Child } from '../../services/child.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  providers: [ProfileStore, ProfileFacade],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  private readonly facade = inject(ProfileFacade);

  // Samo ono što postoji u store-u
  readonly user = this.facade.state.user;
  readonly children = this.facade.state.children;
  readonly isLoading = this.facade.state.isLoading;
  readonly error = this.facade.state.error;
  readonly hasChildren = this.facade.state.hasChildren;
  readonly editingChild = this.facade.state.editingChild;
  readonly isFormVisible = this.facade.state.isFormVisible;

  childForm = {
    first_name: '',
    last_name: '',
    age: 0,
    medical_restrictions: '',
    note: '',
  };

  ngOnInit(): void {
    this.facade.init();
  }

  openAddForm(): void {
    this.resetForm();
    this.facade.openAddChildForm();
  }

  openEditForm(child: Child): void {
    this.childForm = {
      first_name: child.first_name,
      last_name: child.last_name,
      age: child.age,
      medical_restrictions: child.medical_restrictions || '',
      note: child.note || '',
    };
    this.facade.openEditChildForm(child);
  }

  closeForm(): void {
    this.resetForm();
    this.facade.closeForm();
  }

  saveChild(): void {
    const editing = this.editingChild();
    if (editing) {
      this.facade.updateChild(editing.id, this.childForm);
    } else {
      this.facade.addChild(this.childForm);
    }
    this.resetForm();
  }

  deleteChild(id: number): void {
    if (confirm('Da li ste sigurni da želite da obrišete dete?')) {
      this.facade.deleteChild(id);
    }
  }

  isFormValid(): boolean {
    return !!(
      this.childForm.first_name?.trim() &&
      this.childForm.last_name?.trim() &&
      this.childForm.age >= 1 &&
      this.childForm.age <= 18
    );
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
