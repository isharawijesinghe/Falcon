import { Component, OnInit } from '@angular/core';
import {RestConnectionService} from "../../Services/rest-connection.service";

@Component({
  selector: 'app-client-count-graph',
  templateUrl: './client-count-graph.component.html',
  styleUrls: ['./client-count-graph.component.css']
})
export class ClientCountGraphComponent implements OnInit {

  clientCount:any;
  xValues = [];
  yValues = [];

  constructor(private restConnectionService: RestConnectionService) { }

  ngOnInit() {
    this.restConnectionService.getclientCountMap().subscribe((data)=>{
      this.clientCount = data;
      console.log(this.clientCount);

      this.xValues = data['date'];
      this.yValues = data['value'];

      


    });
  }

}
