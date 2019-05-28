import {AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSelect} from "@angular/material";
import {FormControl} from "@angular/forms";
import {ReplaySubject, Subject} from "rxjs";
import {take, takeUntil} from "rxjs/operators";
import {RestConnectionService} from "../../../Services/rest-connection.service";


@Component({
  selector: 'app-dialog-overview',
  templateUrl: './dialog-overview.component.html',
  styleUrls: ['./dialog-overview.component.css']
})
export class DialogOverviewComponent implements OnInit, AfterViewInit, OnDestroy {

  public serviceFilterCtrl: FormControl = new FormControl();
  public filteredServices: ReplaySubject<serviceData[]> = new ReplaySubject<serviceData[]>(1);
  @ViewChild('singleSelect') singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();
  services:any;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewComponent>,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DialogData, private restconnectionservice: RestConnectionService) {}

  cancel(): void {
    this.dialogRef.close();
  }

  ngOnInit() {

    this.restconnectionservice.getServices().subscribe(data=>{
      this.services = data['services'];
    });

    // load the initial bank list
    this.filteredServices.next(this.services.slice());

    // listen for search field value changes
    this.serviceFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected setInitialValue() {
    this.filteredServices
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: serviceData, b: serviceData) => a && b && a.serviceID === b.serviceID;
      });
  }

  protected filterBanks() {
    if (!this.services) {
      return;
    }
    // get the search keyword
    let search = this.serviceFilterCtrl.value;
    if (!search) {
      this.filteredServices.next(this.services.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredServices.next(
      this.services.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

}

export interface serviceData{
  serviceID: string,
  serviceName: string
}

export interface DialogData {
  serviceID: string;
  serviceName: string;
  routingTime: string;
}
