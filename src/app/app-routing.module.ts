import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LeadTypesComponent } from './components/lead-types/lead-types.component';
import { LeadsComponent } from './components/leads/leads.component';
import { LeadFormComponent } from './components/lead-form/lead-form.component';
import { LeadDetailComponent } from './components/lead-detail/lead-detail.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'leads', component: LeadsComponent },
      { path: 'leads/new', component: LeadFormComponent },
      { path: 'leads/:id', component: LeadDetailComponent },
      { path: 'leads/:id/edit', component: LeadFormComponent },
      { 
        path: 'lead-types', 
        component: LeadTypesComponent, 
        data: { roles: ['ADMIN'] } 
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
