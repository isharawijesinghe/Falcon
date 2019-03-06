import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './Components/home/home.component';
import {DashboardComponent} from './Components/dashboard/dashboard.component';
import {ViewComponent} from './Components/view/view.component';
import {RequestsComponent} from './Components/requests/requests.component';
import {ManageComponent} from './Components/manage/manage.component';
import {ReconcileComponent} from './Components/reconcile/reconcile.component';
import {SessionsComponent} from './Components/sessions/sessions.component';
import {SlaMessagsComponent} from './Components/sla-messags/sla-messags.component';
import {ClientCountGraphComponent} from './Components/client-count-graph/client-count-graph.component';
import {LoginComponent} from './Components/login/login.component';
import {LayoutComponent} from './Components/CommonComponents/layout/layout.component';

const routes: Routes = [
  { path: '', component: LayoutComponent,
    children : [
      { path: '', redirectTo: 'home', pathMatch: 'full'},
      { path: 'home', component: HomeComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'view', component: ViewComponent },
      { path: 'requests', component: RequestsComponent },
      { path: 'manage', component: ManageComponent },
      { path: 'recouncile', component: ReconcileComponent  },
      { path: 'sessions', component: SessionsComponent },
      { path: 'slamesssages', component: SlaMessagsComponent },
      { path: 'clientcount', component: ClientCountGraphComponent },
    ]},
   { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
