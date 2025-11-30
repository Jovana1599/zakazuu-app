import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';
import { ViewActivitiesComponent } from './view-activities/view-activities.component';
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'activities', component: ViewActivitiesComponent },
  { path: 'activities/:id', component: ActivityDetailComponent },
];
