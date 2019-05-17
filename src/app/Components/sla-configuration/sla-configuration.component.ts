import {Component, OnInit, ViewChild} from '@angular/core';
import {RestConnectionService} from "../../Services/rest-connection.service";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-sla-configuration',
  templateUrl: './sla-configuration.component.html',
  styleUrls: ['./sla-configuration.component.css']
})
export class SlaConfigurationComponent implements OnInit {


  constructor(private restConnectionService: RestConnectionService, private httpClient: HttpClient) { }

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
  editField: string;
  editEnabled:boolean = false;
  editBtnText:string = "Enable Edit";
  controls: FormArray;
  dataSource:any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['serviceID','serviceName','roundTime'];

  slaConfigList: BehaviorSubject<SlaConfigurationData[]> ;

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

          this.slaconfigurationdata.push(createNewSlaConfigurationData(this.serviceID[servicedataid],this.serviceName[servicedataid],this.roundTime[servicedataid]));
        }

        this.slaConfigList = new BehaviorSubject(this.slaconfigurationdata);

        const toGroups = this.slaConfigList.value.map(entity => {
          return new FormGroup({
            serviceID:  new FormControl(entity.serviceID, Validators.required),
            serviceName: new FormControl(entity.serviceName, Validators.required),
            roundTime: new FormControl(entity.roundTime, Validators.required),
          },{updateOn: "blur"});
        });

        this.controls = new FormArray(toGroups);


        // console.log(slaconfigurationdata);
        // for(let index in this.serviceIDs)
        this.dataSource = this.slaConfigList;
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

  // updateList(id: number, property: string, event: any) {
  //   const editField = event.target.textContent;
  //   this.slaconfigurationdata[id][property] = editField;
  // }
  //
  // remove(id: any) {
  //   // this.awaitingPersonList.push(this.personList[id]);
  //   this.slaconfigurationdata.splice(id, 1);
  // }
  //
  // add() {
  //   // if (this.awaitingPersonList.length > 0) {
  //   //   const person = this.awaitingPersonList[0];
  //   //   this.personList.push(person);
  //   //   this.awaitingPersonList.splice(0, 1);
  //   // }
  //   this.slaconfigurationdata.push(createNewSlaConfigurationData(".....",".....","....."));
  //   console.log('adding to table');
  // }
  //
  // changeValue(id: number, property: string, event: any) {
  //   this.editField = event.target.textContent;
  // }
  //
  // toggleEdit(){
  //   this.editEnabled = !this.editEnabled;
  //   if(this.editEnabled){
  //     this.editBtnText = "Save Changes";
  //   }else{
  //     this.editBtnText = "Enable Edit";
  //   }
  //
  // }

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

  submit(){
    let jsonDefaultTime:any;
    let roundTime:any;
    let serviceList: any;
    let dataBundle :any;
    jsonDefaultTime = JSON.stringify(this.defaultTimeData);
    // console.log(this.slaconfigurationdata);

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



    this.httpClient.post('http://localhost:8060/watchdogclient/slamapdata',JSON.parse(dataBundle)).subscribe((data)=>{
      console.log('SLA Map data posted');
    },(err)=>{
      console.log(err);
    });
  }

}

export interface SlaConfigurationData{
  serviceID: string,
  serviceName: string,
  roundTime: string
}

// export interface RoundTimeData{
//   serviceID: string,
//   roundTime: string
// }
//
// export interface ServiceData{
//   serviceID: string,
//   serviceName: string
// }

function createNewSlaConfigurationData(serviceID:any,serviceName:any,roundTimeVals:any):SlaConfigurationData{
  return{
    serviceID: serviceID,
    serviceName: serviceName,
    roundTime: roundTimeVals,
  }
}

// function createNewServiceData(serviceID:any,serviceName:any):ServiceData{
//   return{
//     serviceID: serviceID,
//     serviceName: serviceName
//   }
// }
//
// function createNewRoundTimeData(serviceID:any, roundTime:any):RoundTimeData{
//   return{
//     serviceID: serviceID,
//     roundTime: roundTime
//   }
// }

