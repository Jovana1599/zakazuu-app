import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';
import { ViewActivitiesComponent } from './view-activities/view-activities.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './institution/dashboard/dashboard.component';
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'activities', component: ViewActivitiesComponent },
  { path: 'activities/:id', component: ActivityDetailComponent },
  { path: 'profile', component: ProfileComponent },

  // Institution routes
  { path: 'institution', component: DashboardComponent },
];
