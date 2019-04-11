import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule, routes} from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderNavBarComponent } from './Components/CommonComponents/header-nav-bar/header-nav-bar.component';
import { SideNavBarComponent } from './Components/CommonComponents/side-nav-bar/side-nav-bar.component';
import { HomeComponent } from './Components/home/home.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { ViewComponent } from './Components/view/view.component';
import { RequestsComponent } from './Components/requests/requests.component';
import { ManageComponent } from './Components/manage/manage.component';
import { ReconcileComponent } from './Components/reconcile/reconcile.component';
import { SessionsComponent } from './Components/sessions/sessions.component';
import { SlaMessagsComponent } from './Components/sla-messags/sla-messags.component';
import { ClientCountGraphComponent } from './Components/client-count-graph/client-count-graph.component';
import { LoginComponent } from './Components/login/login.component';
import { LayoutComponent } from './Components/CommonComponents/layout/layout.component';
import {RestConnectionService} from './services/rest-connection.service';
import {WebSocketConnectionService} from './services/web-socket-connection.service';
import { AuthGuard } from './auth.guard';
import { RouterModule, Routes } from '@angular/router';
import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatHeaderCell,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule, MatSortModule,
  MatStepperModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule, MatTreeModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DataSource} from '@angular/cdk/table';
import { SlaConfigurationComponent } from './Components/sla-configuration/sla-configuration.component';
import { SpecificMessagesComponent } from './Components/specific-messages/specific-messages.component';
import { SessionPopupComponent } from './Components/session-popup/session-popup.component';
import {PopupService} from "./Services/login-popup-service.service";


// import {CdkStepperModule} from '@angular/cdk/stepper';
// import {CdkTableModule} from '@angular/cdk/table';
// import {CdkTreeModule} from '@angular/cdk/tree';
// import {DragDropModule} from '@angular/cdk/typings/esm5/drag-drop';
// import {ScrollingModule} from '@angular/cdk/typings/esm5/scrolling';

@NgModule({
  declarations: [
    AppComponent,
    HeaderNavBarComponent,
    SideNavBarComponent,
    HomeComponent,
    DashboardComponent,
    ViewComponent,
    RequestsComponent,
    ManageComponent,
    ReconcileComponent,
    SessionsComponent,
    SlaMessagsComponent,
    ClientCountGraphComponent,
    LoginComponent,
    LayoutComponent,
    SlaConfigurationComponent,
    SpecificMessagesComponent,
    SessionPopupComponent,
    // CdkStepperModule,
    // CdkTableModule,
    // CdkTreeModule,
    // DragDropModule,

    // ScrollingModule,
  ],
   imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatGridListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),

  ],
  providers: [RestConnectionService, WebSocketConnectionService,AuthGuard, PopupService],
  bootstrap: [AppComponent]
})
export class AppModule { }
