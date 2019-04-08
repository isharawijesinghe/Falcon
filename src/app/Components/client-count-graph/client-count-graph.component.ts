import { Component, OnInit } from '@angular/core';
import {RestConnectionService} from "../../Services/rest-connection.service";
import { Chart } from 'chart.js';

@Component({
  selector: 'app-client-count-graph',
  templateUrl: './client-count-graph.component.html',
  styleUrls: ['./client-count-graph.component.css']
})
export class ClientCountGraphComponent implements OnInit {

  clientCount:any;
  chart:any;
  xValues = [];
  yValues = [];

  constructor(private restConnectionService: RestConnectionService) { }

  ngOnInit() {
    this.restConnectionService.getclientCountMap().subscribe((data)=>{

      console.log(data);
      // this.clientCount = data;
      this.clientCount = sortResults('date',true,data);

      this.clientCount.forEach((record)=>{
        this.xValues.push(record['date']);
        this.yValues.push(record['value']);

      });

      // console.log(this.xValues);
      // console.log(this.yValues);


      if(this.chart){
        this.chart.data = this.clientCount;
        this.chart.update();
      }else {

        this.chart = new Chart('canvas', {
          type: 'line',
          data: {
            labels: this.xValues,
            datasets: [
              {
                label: "Client Counts",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,1)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 5,
                pointHitRadius: 10,
                data: this.yValues
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: true,
              position: 'right',
              labels: {
                boxWidth: 80,
                fontColor: 'white'
              }
            },
            scales: {
              xAxes: [{
                ticks: {
                  fontColor: "white",
                  fontSize: 12,
                  stepSize: 1,
                  beginAtZero: true
                }
              }],
              yAxes: [{
                ticks: {
                  fontColor: "white",
                  fontSize: 12,
                  stepSize: 50,
                  beginAtZero: true
                }
              }]
            },
          }
        });
      }

    });
  }

}

function sortResults(prop, asc, data) {
  data = data.sort(function(a, b) {
    if (asc) {
      return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
    } else {
      return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
    }
  });

  return data;
}
