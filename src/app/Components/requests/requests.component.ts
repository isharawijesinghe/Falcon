import { Component, OnInit } from '@angular/core';
import {RestConnectionService} from '../../Services/rest-connection.service';
import { ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';


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
  displayedColumns :['client','nextnode']
  dataSource: MatTableDataSource<routes>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private restConnectionService: RestConnectionService) {

    this.restConnectionService.getAllRoutes().subscribe(data =>{
      this.routes = data;
      const routeData: routes[] = [];
      //this.dataSource = this.routes;
      this.routesDetailHide = false;
      console.log(this.routes);
      for(let routedata of this.routes){
        routeData.push(createNewroutedata(routedata));
      }
      this.dataSource = new MatTableDataSource(routeData);
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getRoutes(){
    this.restConnectionService.getRoutesDetails(this.routeClientID).subscribe(data =>{
      this.routes = data;
      this.routesDetailHide = false;
      console.log(this.routes);
    });
  }
}

export interface routes{
  client : String;
  nextnode: String;
}

function createNewroutedata (routedata : any): routes{
  return{
    client : routedata['client'],nextnode:routedata['nextnode']
  };
}
