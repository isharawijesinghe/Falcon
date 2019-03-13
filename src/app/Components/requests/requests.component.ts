import { Component, OnInit } from '@angular/core';
import {RestConnectionService} from '../../Services/rest-connection.service';
import {MatTableDataSource} from '@angular/material';


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
  displayedColumns = ['Client', 'Next Node', 'Update Time'];
  

  constructor(private restConnectionService: RestConnectionService) { }

  ngOnInit() {

    this.restConnectionService.getAllRoutes().subscribe(data =>{
      this.routes = data;
      // console.log()
      // dataSource: MatTableDataSource<this.routes>;
      this.routesDetailHide = false;
      console.log(this.routes);
    });
  }

  getRoutes(){
    this.restConnectionService.getRoutesDetails(this.routeClientID).subscribe(data =>{
      this.routes = data;
      this.routesDetailHide = false;
      console.log(this.routes);
    });
  }





}
