import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { JobListComponent } from './components/jobs/job-list.component';
import { JobDetailComponent } from './components/jobs/job-detail.component';
import { ApplicationListComponent } from './components/applications/application-list.component';
import { AdminJobListComponent } from './components/admin/admin-job-list.component';
import { AdminJobFormComponent } from './components/admin/admin-job-form.component';
import { AdminApplicationListComponent } from './components/admin/admin-application-list.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/jobs', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'jobs', component: JobListComponent },
  { path: 'jobs/:id', component: JobDetailComponent },
  { path: 'applications', component: ApplicationListComponent, canActivate: [AuthGuard] },
  { path: 'admin/jobs', component: AdminJobListComponent, canActivate: [AdminGuard] },
  { path: 'admin/jobs/new', component: AdminJobFormComponent, canActivate: [AdminGuard] },
  { path: 'admin/jobs/:id/edit', component: AdminJobFormComponent, canActivate: [AdminGuard] },
  { path: 'admin/applications', component: AdminApplicationListComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '/jobs' }
];