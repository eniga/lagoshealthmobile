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
    { path: 'new-appointment',
     loadChildren: './new-appointment/new-appointment.module#NewAppointmentPageModule' },
     { path: 'appointments',
      loadChildren: './appointments/appointments.module#AppointmentsPageModule' },
      { path: 'update-detail',
      loadChildren: './update-patient-detail/update-patient-detail.module#UpdatePatientDetailPageModule' },
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
