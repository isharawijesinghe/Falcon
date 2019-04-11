import { Injectable } from '@angular/core';
import { Overlay, OverlayConfig, GlobalPositionStrategy, PositionStrategy, } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { LoginComponent } from '../Components/login/login.component';
import {ComponentType} from "@angular/cdk/typings/portal";
@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(private overlay: Overlay) { }
  overlayRef:any;
  currentlyLoaded:boolean;
  component:any;
  dataService1:any;
  dataService2:any;

  modal(comp) {
    this.component = comp;
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayConfig: OverlayConfig = {
      backdropClass: 'popover-backdrop',
      panelClass: 'g-class',
      width:'100%',
      height:'100%',
      positionStrategy: positionStrategy,
      hasBackdrop: true
    };

    this.overlayRef = this.overlay.create(overlayConfig);
    const portal = new ComponentPortal(this.component);
    this.overlayRef.attach(portal);
    this.currentlyLoaded =true;
  }

  close(){
    this.overlayRef.dispose();
    this.currentlyLoaded = false;
  }


}
