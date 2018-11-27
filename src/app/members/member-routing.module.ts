import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardPageModule'
  },
  { path: 'patient',
  loadChildren: './register-patient/register-patient.module#RegisterPatientPageModule'
  },
  { path: 'pending-appointment',
   loadChildren: './pending-appointment/pending-appointment.module#PendingAppointmentPageModule' },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MemberRoutingModule { }
