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
   { path: 'defaulters',
    loadChildren: './defaulters/defaulters.module#DefaultersPageModule' },
   { path: 'patient-detail',
    loadChildren: './patient-detail/patient-detail.module#PatientDetailPageModule' },
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
