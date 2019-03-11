import { Component, OnInit } from '@angular/core';
import {RestConnectionService} from '../../Services/rest-connection.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  routeClientID: any;
  routes:any;
  routesDetailHide: boolean = true;
  routeHistoryClientID: any;

  constructor(private restConnectionService: RestConnectionService) { }

  ngOnInit() {
  }

  getRoutes(){
    this.restConnectionService.getRoutesDetails(this.routeClientID).subscribe(data =>{
      this.routes = data;
      this.routesDetailHide = false;
      console.log(this.routes);
    });
  }

}
