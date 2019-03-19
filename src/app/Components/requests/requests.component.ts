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
  displayedColumns :String[]=['client','nextNode'];
  dataSource: MatTableDataSource<routes>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private restConnectionService: RestConnectionService) {
  }

  ngOnInit() {
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
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    // this.dataSource.filterPredicate = (data: routes, filter: string) => {
    //     return data.nextNode == filter;
    // };

    // this.dataSource.filterPredicate = (data: routes, filtersJson: string) => {
    //     const matchFilter = [];
    //     const filters = JSON.parse(filtersJson);
    //
    //     filters.forEach(filter => {
    //       const val = data[filter.id] === null ? '' : data[filter.id];
    //       matchFilter.push(val.toLowerCase().includes(filter.value.toLowerCase()));
    //     });
    //     return matchFilter.every(Boolean);
    //   };

  }


  setupFilter(column: string) {
    this.dataSource.filterPredicate = (d: routes, filter: string) => {
      const textToSearch = d[column] && d[column].toLowerCase() || '';
      return textToSearch.indexOf(filter) !== -1;
    };
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  //
  // applyFilter(filterValue: string) {
  //   filterValue = filterValue.trim(); // Remove whitespace
  //   filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  //   this.dataSource.filter = filterValue;
  // }
  //
  // applyNodeFilter(filterValue: string) {
  //   filterValue = filterValue.trim(); // Remove whitespace
  //   filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
  //   this.dataSource.filter = filterValue;
  // }

  // applyNodeFilter(filterValue: string) {
  //   const tableFilters = [];
  //   tableFilters.push({
  //     id: 'nextNode',
  //     value: filterValue
  //   });
  // }

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
  nextNode: String;
}

function createNewroutedata (routedata : any): routes{
  return{
    client : routedata['client'],
    nextNode:routedata['nextNode']
  };
}
