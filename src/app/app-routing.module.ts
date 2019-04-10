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
import {SlaConfigurationComponent} from "./Components/sla-configuration/sla-configuration.component";
import {AuthGuard} from "./auth.guard";
import {SpecificMessagesComponent} from "./Components/specific-messages/specific-messages.component";

export const routes: Routes = [
  { path: '', component: LayoutComponent,
    children : [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      { path: 'home', component: HomeComponent,canActivate: [AuthGuard] },
      { path: 'dashboard', component: DashboardComponent},
      { path: 'view', component: ViewComponent,canActivate: [AuthGuard] },
      { path: 'requests', component: RequestsComponent ,canActivate: [AuthGuard]},
      { path: 'manage', component: ManageComponent,canActivate: [AuthGuard] },
      { path: 'recouncile', component: ReconcileComponent,canActivate: [AuthGuard]  },
      { path: 'sessions', component: SessionsComponent,canActivate: [AuthGuard] },
      { path: 'specificmessages', component: SpecificMessagesComponent,canActivate: [AuthGuard] },
      { path: 'slamesssages', component: SlaMessagsComponent ,canActivate: [AuthGuard]},
      { path: 'slaconfiguration', component: SlaConfigurationComponent ,canActivate: [AuthGuard]},
      { path: 'clientcount', component: ClientCountGraphComponent ,canActivate: [AuthGuard]},
    ]},
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
