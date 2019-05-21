import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-dialog-overview',
  templateUrl: './dialog-overview.component.html',
  styleUrls: ['./dialog-overview.component.css']
})
export class DialogOverviewComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewComponent>,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DialogData) {}

  cancel(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}

export interface DialogData {
  serviceID: string;
  serviceName: string;
  routingTime: string;
}
