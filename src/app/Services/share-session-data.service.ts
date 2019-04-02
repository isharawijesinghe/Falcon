import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareSessionDataService {

  receivingData:any='';
  serviceData:any='';

  constructor() {
    this.receivingData = {};
  }

  setSessionData(val:Object){
    this.receivingData = val;
    // console.log(this.receivingData);
  }

  getSessionData(){
    // console.log(this.receivingData);
    return this.receivingData;
  }

  setServiceData(data: Object) {
    this.serviceData = data['services'];
    // console.log(this.serviceData);
  }
  getServiceData(){
    // console.log(this.serviceData);
    return this.serviceData;
  }
}
