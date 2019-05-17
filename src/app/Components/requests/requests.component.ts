import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
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
  routesHistory: any;
  routeMainHide: boolean = true;
  routesDetailHide: boolean = true;
  routesHistoryDetailHide: boolean = true;
  routeHistoryClientID: any;
  displayedColumns :String[]=['client','nextNode'];
  displayedColumnsHistory : String[]=['historyClient','historyNextNode','updateTime']
  dataSource: MatTableDataSource<routes>;
  dataSourceHistory: MatTableDataSource<routesHistory>;
  firstDataRowClient: any;
  isDataAvailable:boolean =true;
  firstClient :any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatPaginator) paginator2: MatPaginator;
  // @ViewChildren(MatPaginator) paginators: QueryList<MatPaginator>;
  // @ViewChildren(MatSort) sorts: QueryList<MatSort>;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private restConnectionService: RestConnectionService) {

  }

  ngOnInit() {
    this.restConnectionService.getAllRoutes().subscribe(data =>{
      this.routes = data;

      this.firstDataRowClient = this.routes[0]['client'];
      this.getRoutesHistoryDefault((String)(this.firstDataRowClient));

      const routeData: routes[] = [];
      //this.dataSource = this.routes;
      this.routesDetailHide = false;
      console.log(this.routes);
      for(let routedata of this.routes){
        routeData.push(createNewroutedata(routedata));
      }
      this.routeMainHide = false;
      this.dataSource = new MatTableDataSource(routeData);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
        setTimeout(() => this.dataSource.paginator = this.paginator);
        setTimeout(() => this.dataSource.sort = this.sort);
    },
      error => this.routeMainHide = false);

    // this.firstDataRowClient = this.routes[0]['client'];
    // setTimeout(()=>this.getRoutesHistoryDefault((String)(this.firstDataRowClient)));
    // console.log(this.routes[0]['client']+'******');
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


  getRoutes(){
    this.restConnectionService.getRoutesDetails(this.routeClientID).subscribe(data =>{
      this.routes = data;
      this.routesDetailHide = false;
      console.log(this.routes);
    });
  }

  getRoutesHistory(){
    this.routesHistoryDetailHide = true;
    this.isDataAvailable = true;
      this.restConnectionService.getRoutesHistoryDetails(this.routeHistoryClientID).subscribe(data =>{
      this.routesHistory = data;
      const routeHistorydata: routesHistory[] = [];
      //this.dataSource = this.routes;
      for(let routeDataHistory of this.routesHistory){
        routeHistorydata.push(createNewHistoryroutedata(routeDataHistory));
      }
      this.routesHistoryDetailHide = false;
      this.dataSourceHistory = new MatTableDataSource(routeHistorydata);
      // this.dataSourceHistory.paginator = this.paginators.toArray()[1];
      // this.dataSourceHistory.sort = this.sorts.toArray()[1];
      console.log(this.routesHistory);
      if(this.routesHistory.length==0 && this.routesHistory!= null){
        this.isDataAvailable = false;
      }
    });

  }

  getRoutesHistoryDefault(firstData:any){
    this.restConnectionService.getRoutesHistoryDetails(firstData).subscribe(data =>{
      this.routesHistory = data;
      this.firstClient = this.routesHistory[0]['client'];
      const routeHistorydata: routesHistory[] = [];
      //this.dataSource = this.routes;
      for(let routeDataHistory of this.routesHistory){
        routeHistorydata.push(createNewHistoryroutedata(routeDataHistory));
      }
      this.routesHistoryDetailHide = false;
      this.dataSourceHistory = new MatTableDataSource(routeHistorydata);
      // this.dataSourceHistory.paginator = this.paginators.toArray()[1];
      // this.dataSourceHistory.sort = this.sorts.toArray()[1];
      console.log(this.routesHistory);
    });
  }
}

export interface routes{
  client : String;
  nextNode: String;
}

export interface routesHistory{
  historyClient : String;
  historyNextNode: String;
  updateTime: String;
}

function createNewroutedata (routedata : any): routes{
  return{
    client : routedata['client'],
    nextNode:routedata['nextNode']
  };

}
function createNewHistoryroutedata (routeHistorydata : any): routesHistory {
  return {
    historyClient: routeHistorydata['client'],
    historyNextNode: routeHistorydata['nextNode'],
    updateTime: routeHistorydata['updateTime']
  };
}


