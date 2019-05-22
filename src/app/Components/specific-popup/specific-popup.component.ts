import { Component, OnInit } from '@angular/core';
import {PopupService} from "../../Services/login-popup-service.service";
import {RestConnectionService} from "../../Services/rest-connection.service";
import {MatTableDataSource} from "@angular/material";
import {routesHistory} from "../requests/requests.component";

@Component({
  selector: 'app-specific-popup',
  templateUrl: './specific-popup.component.html',
  styleUrls: ['./specific-popup.component.css']
})
export class SpecificPopupComponent implements OnInit {

  constructor(private restconnectionservice:RestConnectionService, private popup: PopupService) { }

  uIdReq:any;
  specificResponse:any;
  displayedColumnsReq = ['reqUniqueId','reqTenantCode','reqMessage'];
  displayedColumnsRes = ['resUniqueId','resTenantCode','resMessage'];
  dataSourceReq:MatTableDataSource<Request>;
  dataSourceRes:MatTableDataSource<Response>;
  noData:boolean = false;


  ngOnInit() {

    this.uIdReq = this.popup.dataService1['uniqueReqID'];
    console.log(this.uIdReq);
    let requestdata: Request [] = [];
    let responsedata: Response [] = [];

    requestdata.push(createNewRequestData(this.popup.dataService1));
    this.dataSourceReq = new MatTableDataSource(requestdata);
    console.log(this.popup.dataService1);

    this.restconnectionservice.getSpecificResponses(this.uIdReq).subscribe(data=>{
      this.specificResponse = data[0];
      if(this.specificResponse){
        responsedata.push(createNewResponseData(this.specificResponse));
        console.log(this.specificResponse);
        this.dataSourceRes = new MatTableDataSource(responsedata);
      }else{
        this.noData = true;
      }


    });

  }

  closePopup(){
    this.popup.close();
  }

}

export interface Request{
  uniqueIDReq: string,
  tenantCodeReq: string,
  messageReq: string
}
export interface Response{
  uniqueIDRes: string,
  tenantCodeRes: string,
  messageRes: string
}

function createNewRequestData (data:any): Request{
  return{
    uniqueIDReq: data['uniqueReqID'],
    tenantCodeReq: data['tenantCode'],
    messageReq: data['message']
  }
}
function createNewResponseData (data:any): Response{
  return{
    uniqueIDRes: data['unique_request_id'],
    tenantCodeRes: data['tenantCode'],
    messageRes: data['message']
  }
}
