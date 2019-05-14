import {Component, OnInit, ViewChild} from '@angular/core';
import {RestConnectionService} from "../../Services/rest-connection.service";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {SessionData} from "../sessions/sessions.component";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";

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
  serviceID:any;
  roundTime:any;
  isDataAvailable:any;
  serviceData:any;
  serviceName:any;
  isMatched: boolean;
  slaconfigurationdata : SlaConfigurationData [] = [];
  editField: string;
  editEnabled:boolean = false;
  editBtnText:string = "Enable Edit";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['serviceID','serviceName','roundTime'];


  ngOnInit() {

    this.restConnectionService.getSlaMapDefaultTime().subscribe(data=>{
      this.defaultTimeData = data;
      this.isEnabled = Object.keys(this.defaultTimeData);
      this.defaultTime = Object.values(this.defaultTimeData);
    },(err:any)=>{
      console.log('error:'+err);
    });

    this.restConnectionService.getSlaMapRoundTime().subscribe(data=>{

      this.roundTimeData = data;
      this.serviceID = Object.keys(this.roundTimeData);
      this.roundTime = Object.values(this.roundTimeData);

      this.restConnectionService.getSlaServices().subscribe(data=>{
        this.serviceData = data;
        let serviceDataID = Object.keys(this.serviceData);
        this.serviceName = Object.values(this.serviceData);
        // console.log(this.serviceData);
        this.isMatched = true;

        for(let servicedataid in serviceDataID){
          try {
            if(serviceDataID[servicedataid]!=this.serviceID[servicedataid]){
              this.isMatched = false;
              break;
            }
          }catch (e) {
            this.isMatched = false;
            break;
          }

          this.slaconfigurationdata.push(createNewSlaConfigurationData(this.serviceID[servicedataid],this.serviceName[servicedataid],this.roundTime[servicedataid]));
        }
        // console.log(slaconfigurationdata);
        // for(let index in this.serviceIDs)
        // this.dataSource = new MatTableDataSource(slaconfigurationdata);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;



      },(err)=>{
        console.log('error:'+err);
      });


      this.isDataAvailable = true;
    }, (err:any)=>{
      console.log('error:'+err);
    });


  }

  updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent;
    this.slaconfigurationdata[id][property] = editField;
  }

  remove(id: any) {
    // this.awaitingPersonList.push(this.personList[id]);
    this.slaconfigurationdata.splice(id, 1);
  }

  add() {
    // if (this.awaitingPersonList.length > 0) {
    //   const person = this.awaitingPersonList[0];
    //   this.personList.push(person);
    //   this.awaitingPersonList.splice(0, 1);
    // }
    this.slaconfigurationdata.push(createNewSlaConfigurationData(".....",".....","....."));
    console.log('adding to table');
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }

  toggleEdit(){
    this.editEnabled = !this.editEnabled;
    if(this.editEnabled){
      this.editBtnText = "Save Changes";
    }else{
      this.editBtnText = "Enable Edit";
    }

  }
}

export interface SlaConfigurationData{
  serviceID: string,
  serviceName: string,
  roundTime: string
}

function createNewSlaConfigurationData(serviceID:any,serviceName:any,roundTimeVals:any):SlaConfigurationData{
  return{
    serviceID: serviceID,
    serviceName: serviceName,
    roundTime: roundTimeVals,
  }
}

