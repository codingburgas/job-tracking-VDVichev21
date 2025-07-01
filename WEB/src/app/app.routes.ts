import { Routes } from '@angular/router';
import { JobListComponent } from './components/job-list/job-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MyJobsComponent } from './components/my-jobs/my-jobs.component';
import { MyApplicationsComponent } from './components/my-applications/my-applications.component';
import { ReceivedApplicationsComponent } from './components/received-applications/received-applications.component';
import { JobFormComponent } from './components/job-form/job-form.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: JobListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'my-jobs', component: MyJobsComponent, canActivate: [AuthGuard] },
  { path: 'my-jobs/new', component: JobFormComponent, canActivate: [AuthGuard] },
  { path: 'my-jobs/:id/edit', component: JobFormComponent, canActivate: [AuthGuard] },
  { path: 'my-applications', component: MyApplicationsComponent, canActivate: [AuthGuard] },
  { path: 'received-applications', component: ReceivedApplicationsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];