import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list';
import { EventListComponent } from './components/event-list/event-list';
import { UserFormComponent } from './components/user-form/user-form';
import { EventFormComponent } from './components/event-form/event-form';
import { LoginComponent } from './components/login/login';

export const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: 'users', component: UserListComponent },
  { path: 'users/new', component: UserFormComponent },
  { path: 'users/edit/:id', component: UserFormComponent },
  { path: 'events', component: EventListComponent },
  { path: 'events/new', component: EventFormComponent },
  { path: 'events/edit/:id', component: EventFormComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/users' }
];

