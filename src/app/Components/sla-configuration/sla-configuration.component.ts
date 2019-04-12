import {Component, OnInit, ViewChild} from '@angular/core';
import {RestConnectionService} from "../../Services/rest-connection.service";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {SessionData} from "../sessions/sessions.component";

@Component({
  selector: 'app-sla-configuration',
  templateUrl: './sla-configuration.component.html',
  styleUrls: ['./sla-configuration.component.css']
})
export class SlaConfigurationComponent implements OnInit {

  constructor(private restConnectionService: RestConnectionService) { }

  roundTimeData :any;
  defaultTimeData:any;
  isEnabled:any;
  defaultTime:any;
  roundTimeKeys:any;
  roundTimeVals:any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['number','roundTime'];

  ngOnInit() {
    this.restConnectionService.getSlaMapRoundTime().subscribe(data=>{
      this.roundTimeData = data;
      // const roundTime : RoundTimeData[] = [] ;
      this.roundTimeKeys = Object.keys(this.roundTimeData);
      this.roundTimeVals = Object.values(this.roundTimeData);

    }, (err:any)=>{
      console.log('error:'+err);
    });

    this.restConnectionService.getSlaMapDefaultTime().subscribe(data=>{
      this.defaultTimeData = data;
      this.isEnabled = Object.keys(this.defaultTimeData);
      this.defaultTime = Object.values(this.defaultTimeData);
    },(err:any)=>{
      console.log('error:'+err);
    });
  }
}


