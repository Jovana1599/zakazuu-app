import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';
import { ViewActivitiesComponent } from './view-activities/view-activities.component';
import { ProfileComponent } from './parent-panel/profile/profile.component';
import { LocationsComponent } from './institution/locations/location.component';
// Institution
import { ActivitiesComponent } from './institution/activities/activities.component';
import { ReservationsComponent } from './institution/reservations/reservations.component';
import { ScheduleComponent } from './institution/schedule/schedule.component';
import { InstitutionReviewsComponent } from './institution/reviews/reviews.component';
import { InstitutionComponent } from './institution/institution.component';
import { DashboardComponent } from './institution/dashboard/dashboard.component';
import { institutionGuard, parentGuard } from './services/auth.guard';
import { CalendarComponent } from './parent-panel/calendar-activity/calendar-activity.component';
import { MyReservationsComponent } from './parent-panel/my-reservations/my-reservations.component';
import { ParentPanelComponent } from './parent-panel/parent-panel';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'activities', component: ViewActivitiesComponent },
  { path: 'activities/:id', component: ActivityDetailComponent },

  // Parent Panel routes
  {
    path: 'parent',
    component: ParentPanelComponent,
    canActivate: [parentGuard],
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'reservations', component: MyReservationsComponent },
      { path: 'calendar', component: CalendarComponent },
    ],
  },

  // Institution routes
  {
    path: 'institution',
    component: InstitutionComponent,
    canActivate: [institutionGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'schedule', component: ScheduleComponent },
      { path: 'activities', component: ActivitiesComponent },
      { path: 'locations', component: LocationsComponent },
      { path: 'reservations', component: ReservationsComponent },
      { path: 'reviews', component: InstitutionReviewsComponent },
    ],
  },
];
