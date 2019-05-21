import {Component, OnInit, ViewChild} from '@angular/core';
import {RestConnectionService} from "../../Services/rest-connection.service";
import {MatDialog, MatPaginator, MatSort} from "@angular/material";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DialogOverviewComponent} from "./dialog-overview/dialog-overview.component";
import {SelectionModel} from "@angular/cdk/collections";

@Component({
  selector: 'app-sla-configuration',
  templateUrl: './sla-configuration.component.html',
  styleUrls: ['./sla-configuration.component.css']
})
export class SlaConfigurationComponent implements OnInit {


  constructor(private restConnectionService: RestConnectionService, private httpClient: HttpClient,public dialog: MatDialog) { }

  roundTimeData :any;
  defaultTimeData:any;
  isEnabledStr:any
  isEnabled:boolean;
  defaultTime:any;
  serviceID:any;
  roundTime:any;
  isDataAvailable:any;
  serviceData:any;
  serviceName:any;
  isMatched: boolean;
  slaconfigurationdata : SlaConfigurationData [] = [];
  changesSaved: boolean = false;
  editBtnText:string = "Enable Edit";
  controls: FormArray;
  dataSource:any;
  editable:boolean= false;
  newServiceID:any;
  newServiceName:any;
  newRoutingTime:any;
  editEnabled:boolean = false;
  sladata:any;
  displayedColumns = ['serviceID','serviceName','roundTime'];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  slaConfigList: BehaviorSubject<SlaConfigurationData[]> ;
  selection = new SelectionModel<SlaConfigurationData>(true, []);

  ngOnInit() {

    this.restConnectionService.getSlaMapDefaultTime().subscribe(data=>{
      this.defaultTimeData = data;
      this.isEnabledStr = Object.keys(this.defaultTimeData);
      this.defaultTime = Object.values(this.defaultTimeData);
      if(this.isEnabledStr =="False"){
        this.isEnabled = false;
      }else{
        this.isEnabled = true;
      }
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

          this.slaconfigurationdata.push(createNewSlaConfigurationData(
            this.serviceID[servicedataid],this.serviceName[servicedataid],this.roundTime[servicedataid]));
        }

        this.slaConfigList = new BehaviorSubject(this.slaconfigurationdata);
        this.sladata = Object.assign(this.slaconfigurationdata);

        const toGroups = this.slaConfigList.value.map(entity => {
          return new FormGroup({
            serviceID:  new FormControl(entity.serviceID, Validators.required),
            serviceName: new FormControl(entity.serviceName, Validators.required),
            roundTime: new FormControl(entity.roundTime, Validators.required),
          },{updateOn: "blur"});
        });

        this.controls = new FormArray(toGroups);
        this.dataSource = this.slaConfigList;

      },(err)=>{
        console.log('error:'+err);
      });


      this.isDataAvailable = true;
    }, (err:any)=>{
      console.log('error:'+err);
    });


  }


  updateField(index, field) {
    const control = this.getControl(index, field);
    if (control.valid) {
      this.slaconfigurationdata = this.slaconfigurationdata.map((e, i) => {
        if (index === i) {
          return {
            ...e,
            [field]: control.value
          }
        }
        return e;
      });
      this.slaConfigList.next(this.slaconfigurationdata);
    }

  }

  getControl(index, fieldName) {
    const a  = this.controls.at(index).get(fieldName) as FormControl;
    return this.controls.at(index).get(fieldName) as FormControl;
  }

  toggleEdit(){
    this.editable = !this.editable;

    if(!this.editable){
      this.editBtnText = "Enable Edit";
      this.displayedColumns = ['serviceID','serviceName','roundTime'];
      this.changesSaved = false;
    }else{
      this.editBtnText = "Save Changes";
      this.displayedColumns = ['select','serviceID','serviceName','roundTime'];
      this.changesSaved = true;
    }
  }

  addRow(){
    const dialogRef = this.dialog.open(DialogOverviewComponent, {
      width: '300px',
      data: {serviceID: this.newServiceID, serviceName: this.newServiceName, routingTime: this.newRoutingTime}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.slaconfigurationdata.push(createNewSlaConfigurationData(result['serviceID'],result['serviceName'],result['routingTime']));
      this.slaConfigList = new BehaviorSubject(this.slaconfigurationdata);

      const toGroups = this.slaConfigList.value.map(entity => {
        return new FormGroup({
          serviceID:  new FormControl(entity.serviceID, Validators.required),
          serviceName: new FormControl(entity.serviceName, Validators.required),
          roundTime: new FormControl(entity.roundTime, Validators.required),
        },{updateOn: "blur"});
      });

      this.controls = new FormArray(toGroups);
      this.dataSource = this.slaConfigList;
      this.dataSource._updateChangeSubscription();
    });
  }

  removeSelectedRows() {
    if(this.selection.selected){
      this.selection.selected.forEach(item => {
        if(this.sladata){
          let index: number = this.sladata.findIndex(d => d === item);
          console.log(this.sladata.findIndex(d => d === item));
          this.sladata.splice(index,1)
          this.dataSource = new BehaviorSubject<SlaConfigurationData>(this.sladata);
        }
      });
      this.selection = new SelectionModel<SlaConfigurationData>(true, []);
    }
  }

  submit(){
    let jsonDefaultTime:any;
    let roundTime:any;
    let serviceList: any;
    let dataBundle :any;
    this.editEnabled = false;
    jsonDefaultTime = '{';
    jsonDefaultTime = jsonDefaultTime.concat('\"enabled\" :'+'"'+this.isEnabled+'"  ,'+' \"defaultTime\" :'+this.defaultTime+'}');

    roundTime = '{';
    serviceList = '{';
    dataBundle = '{';

    for(let entity in this.slaconfigurationdata){
      // console.log('{'+this.slaconfigurationdata[entity].serviceID+':'+this.slaconfigurationdata[entity].roundTime+'}');
      if(parseInt(entity) == this.slaconfigurationdata.length-1){
        roundTime = roundTime.concat('"'+this.slaconfigurationdata[entity].serviceID+'"'+': '+this.slaconfigurationdata[entity].roundTime+'}');
        serviceList = serviceList.concat('"'+this.slaconfigurationdata[entity].serviceID+'"'+': '+'"'+this.slaconfigurationdata[entity].serviceName+'"}');
      }else{
        roundTime = roundTime.concat('"'+this.slaconfigurationdata[entity].serviceID+'"'+': '+this.slaconfigurationdata[entity].roundTime+', ');
        serviceList = serviceList.concat('"'+this.slaconfigurationdata[entity].serviceID+'"'+': '+'"'+this.slaconfigurationdata[entity].serviceName+'", ');
      }

    }

    dataBundle = dataBundle.concat('\"defaultTime\"	:'+jsonDefaultTime+',  \"roundTimeMapping\"	:'+roundTime+', \"serviceList\":  '+serviceList+'}'	);

    // console.log((jsonDefaultTime));
    // console.log((roundTime));
    // console.log((serviceList));
    console.log(JSON.parse(dataBundle));

    this.changesSaved = !this.changesSaved;

    this.httpClient.post('http://localhost:8060/watchdogclient/slamapdata',JSON.parse(dataBundle)).subscribe((data)=>{
      alert("Changes submitted to the server successfully..!");
    },(err)=>{
      console.log(err);
    });
  }

  enableEdit(){
    this.toggleEdit();
    this.editEnabled = true;
  }

  cancel(){
    this.toggleEdit();
    this.editEnabled = false;
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
