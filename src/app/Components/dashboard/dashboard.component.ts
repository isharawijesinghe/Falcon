import {Component, DoCheck, OnInit} from '@angular/core';
import {WebSocketConnectionService} from '../../services/web-socket-connection.service';
import { Chart } from 'chart.js';
import * as d3 from 'd3';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  private sysMetricObject: any;
  private blockData: any;
  private cpuHistory; any;
  private tpsHeight: any;
  private viewData: any;
  private showKibanaDashboard:any;
  private chart: any;
  private dataX = [];
  private dataY = [];
  // private sysMetricObjectDummy: any;
  // private viewDataDummy: any;



  constructor(private websocketConnectionService: WebSocketConnectionService) {


    // this.tpsHeight = this.drawTps();

    // this.websocketConnectionService.showKibanaUpdated.subscribe((value) => {
    //   this.showKibanaDashboard = value;
    //   console.log(this.showKibanaDashboard);
    // });

    this.websocketConnectionService.viewDataUpdated.subscribe((value) => {
      this.viewData = value;
      // this.viewDataDummy = this.viewData;
    });

    this.websocketConnectionService.sysMetricUpdated.subscribe((value) => {
      this.sysMetricObject = value;
      // this.sysMetricObjectDummy = this.sysMetricObject;
    });

    this.websocketConnectionService.nodeBlockUpdated.subscribe((value) => {
      this.blockData = value;
      if (this.blockData != null) {
        this.drawBlocks();
      }
    });

    this.websocketConnectionService.cpuHistoryUpdated.subscribe( (value => {
      this.cpuHistory = value;
      if (this.cpuHistory != null) {
        this.drawSystemLoadAvg();
      }
    }));


  }

  ngOnInit() {

    this.websocketConnectionService.showKibanaUpdated.subscribe((value) => {
      this.showKibanaDashboard = value;
      console.log(this.showKibanaDashboard);
    });

    if(this.websocketConnectionService.cpuHistory != null ){
      this.drawSystemLoadAvg();
    }

    if(this.websocketConnectionService.nodeBlock != null){
      this.blockData = this.websocketConnectionService.nodeBlock;
      this.drawBlocks();
    }

    if(this.websocketConnectionService.viewData != null){
      this.viewData = this.websocketConnectionService.viewData;
    }

  }

  drawSystemLoadAvg(){
    const data = [];
    const dataPoint = {};
    this.dataX = [];
    this.dataY = [];
    let maxX = 1;
    const reference = this.websocketConnectionService.cpuHistory; // reference to access cpuhistry variable inside inner function
    for (const node in this.websocketConnectionService.cpuHistory) {
      if (this.websocketConnectionService.cpuHistory.hasOwnProperty(node)) {
        this.websocketConnectionService.cpuHistory[node].forEach( (d: any, i: any)=> {
          maxX = node.length > maxX ? reference[node].length : maxX;

          dataPoint['tick'] = i;
          dataPoint['cpu'] = d;
          this.dataX.push(dataPoint['tick']);
          this.dataY.push(dataPoint['cpu']);
        });
      }
    }
    // console.log(this.dataX);
    // console.log(this.dataY);


    if(this.dataX.length !=0){
      this.chart.destroy();
    }

      this.chart = new Chart('canvas', {
        type: 'line',
        data: {
          labels: this.dataX,
          datasets: [{
            label: 'CPU Usage',
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
            pointRadius: 3,
            pointHitRadius: 6,
            data: this.dataY,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: true,
            labels: {
              boxWidth: 20,
              fontColor: 'white'
            }
          },
          scales: {
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'GATEWAY'
              },
              ticks: {
                fontColor: "white",
                fontSize: 9,
              }
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'CPU %'
              },
              ticks: {
                fontColor: "white",
                fontSize: 9,
                beginAtZero: true
              }
            }]
          }
        }
      });

  }


  drawBlocks() {
    const dataGateway = this.blockData.block.GATEWAY;
    const dataOms = this.blockData.block.OMS;
    const dataDfix = this.blockData.block.DFIX;
    const dataAura = this.blockData.block.AURA;
    const dataExchange = this.blockData.block.EXCHANGE;
    const nodeLinks = this.blockData.links;
    const linkClasses = [];
    const blockStateToClasses = {
      'CONNECTED': 'block-connected', 'CONNECTING': 'block-connecting',
      'INITIALIZING': 'block-initializing', 'SUSPENDED': 'block-suspended',
      'CLOSED': 'block-closed', 'UNKNOWN': 'block-unknown'
    };
    let svg = d3.select('#dashboard-blocks svg');
    const margin = {top: 0, right: 0, bottom: 0, left: 0};
    console.log(parseInt(svg.style('width'), 10 ));
    const width = 476 - margin.right - margin.left; // parseint in angular js
    const height = width * 0.7;
    const zoomFactor = width * 0.0035;

    d3.select('#dashboard-blocks').select('svg').remove();
    svg = d3.select('#dashboard-blocks').append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const rh = height * 0.09,
      rw = width * 0.18;

    // const rh = height * 0.1,
    //   rw = width * 0.2;

    const noOfSerialComponents = 4;
    const noOfGaps = 1.8 * noOfSerialComponents;

    const shGateway = (height - dataGateway.length * rh) / (dataGateway.length + 1);
    const shOms = (height - dataAura.length * rh - dataOms.length * rh) / ((dataOms.length + dataAura.length) + 1);
    const shDfix = (height - dataDfix.length * rh) / (dataDfix.length + 1);
    const shExchange = (height - dataExchange.length * rh) / (dataExchange.length + 1);

    const links = [];
    const linkStateToClasses = {'CONNECTED': 'link-connected', 'CLOSED': 'link-closed', 'CONNECTING': 'link-connecting'};

    function calculateLinks(source, target, shSource, shTarget) {
      for (let i = 0; i < source.length; i++) {
        for (let j = 0; j < target.length; j++) {
          const sourceX = (((width - noOfSerialComponents * rw) / noOfGaps) + (width / noOfGaps) * (source[i].x - 1)) + rw;
          const sourceY = source[i].y * shSource + (source[i].y - 1) * rh + rh / 2;
          let targetX, targetY;
          if (shTarget != null) {
            targetX = (((width - noOfSerialComponents * rw) / noOfGaps) + (width / noOfGaps) * (target[j].x - 1));
            targetY = target[j].y * shTarget + (target[j].y - 1 ) * rh + rh / 2;
          } else {
            targetX = (((width - noOfSerialComponents * rw) / noOfGaps) + (width / noOfGaps) * (target[j].x - 1));
            targetY = (height - 1.5 * rh);
          }
          links.push([[sourceX, sourceY], [targetX, targetY]]);
          linkClasses.push(linkStateToClasses[nodeLinks[source[i].text][target[j].text]]);
        }
      }
    }
    calculateLinks(dataGateway, dataOms, shGateway, shOms);
    calculateLinks(dataOms, dataDfix, shOms, shDfix);
    calculateLinks(dataGateway, dataAura, shGateway, null);
    calculateLinks(dataDfix, dataExchange, shDfix, shExchange);

    // draw components
    const gGateway = svg.selectAll('.gatewayModule')
      .data(dataGateway)
      .enter()
      .append('g')
      .attr('class', 'gatewayModule')
      .attr('transform', function (d: any) {
        return 'translate(' +
          (((width - noOfSerialComponents * rw) / noOfGaps) + (width / noOfGaps) * (d.x - 1)) + ',' +
          (d.y * shGateway + (d.y - 1) * rh) + ')';
      });
    gGateway.append('rect')
      .attr('rx', 2 * zoomFactor)
      .attr('ry', 2 * zoomFactor)
      .attr('width', rw)
      .attr('height', rh)
      .attr('class', function (d: any) {
        return blockStateToClasses[d.state];
      });
    gGateway.append('text')
      .style('fill', 'black')
      .style('font-size', (7.5 * zoomFactor) + 'px')
      .style('text-anchor', 'middle')
      .attr('x', rw / 2)
      .attr('y', rh / 1.5)
      .text(function (d: any) {
        return d.text;
      });

    const gOms = svg.selectAll('.omsModule')
      .data(dataOms)
      .enter()
      .append('g')
      .attr('class', 'omsModule')
      .attr('transform', function (d: any) {
        return 'translate(' +
          (((width - noOfSerialComponents * rw) / noOfGaps) + (width / noOfGaps) * (d.x - 1)) + ',' +
          (d.y * shOms + (d.y - 1 ) * rh) + ')';
      });
    gOms.append('rect')
      .attr('rx', 2 * zoomFactor)
      .attr('ry', 2 * zoomFactor)
      .attr('width', rw)
      .attr('height', rh)
      .attr('class', function (d: any) {
        return blockStateToClasses[d.state];
      });
    gOms.append('text')
      .style('fill', 'black')
      .style('font-size', (7.5 * zoomFactor) + 'px')
      .style('text-anchor', 'middle')
      .attr('x', rw / 2)
      .attr('y', rh / 1.5)
      .text(function (d: any) {
        return d.text;
      });

    const gDfix = svg.selectAll('.dfixModule')
      .data(dataDfix)
      .enter()
      .append('g')
      .attr('class', 'dfixModule')
      .attr('transform', function (d: any) {
        return 'translate(' +
          (((width - noOfSerialComponents * rw) / noOfGaps) + (width / noOfGaps) * (d.x - 1)) + ',' +
          (d.y * shDfix + (d.y - 1) * rh) + ')';
      });
    gDfix.append('rect')
      .attr('rx', 2 * zoomFactor)
      .attr('ry', 2 * zoomFactor)
      .attr('width', rw)
      .attr('height', rh)
      .attr('class', function (d: any) {
        return blockStateToClasses[d.state];
      });
    gDfix.append('text')
      .style('fill', 'black')
      .style('font-size', (7.5 * zoomFactor) + 'px')
      .style('text-anchor', 'middle')
      .attr('x', rw / 2)
      .attr('y', rh / 1.5)
      .text(function (d: any) {
        return d.text;
      });

    const gAura = svg.selectAll('.auraModule')
      .data(dataAura)
      .enter()
      .append('g')
      .attr('class', 'auraModule')
      .attr('transform', function (d: any) {
        return 'translate(' +
          (((width - noOfSerialComponents * rw) / noOfGaps) + (width / noOfGaps) * (d.x - 1)) + ',' +
          (height - 2*rh) + ')';
      });
    gAura.append('rect')
      .attr('rx', 2 * zoomFactor)
      .attr('ry', 2 * zoomFactor)
      .attr('width', rw)
      .attr('height', rh)
      .attr('class', function (d: any) {
        return blockStateToClasses[d.state];
      });
    gAura.append('text')
      .style('fill', 'black')
      .style('font-size', (7.5 * zoomFactor) + 'px')
      .style('text-anchor', 'middle')
      .attr('x', rw / 2)
      .attr('y', rh / 1.5)
      .text(function (d: any) {
        return d.text;
      });

    const gExchange = svg.selectAll('.exchangeModule')
      .data(dataExchange)
      .enter()
      .append('g')
      .attr('class', 'exchangeModule')
      .attr('transform', function (d: any) {
        return 'translate(' +
          (((width - noOfSerialComponents * rw) / noOfGaps) + (width / noOfGaps) * (d.x - 1)) + ',' +
          (d.y * shExchange + (d.y - 1) * rh) + ')';
      });
    gExchange.append('rect')
      .attr('rx', 2 * zoomFactor)
      .attr('ry', 2 * zoomFactor)
      .attr('width', rw)
      .attr('height', rh)
      .attr('class', function (d: any) {
        return blockStateToClasses[d.state];
      });
    gExchange.append('text')
      .style('fill', 'black')
      .style('font-size', (7.5 * zoomFactor) + 'px')
      .style('text-anchor', 'middle')
      .attr('x', rw / 2)
      .attr('y', rh / 1.5)
      .text(function (d: any) {
        return d.text;
      });

    // draw connecting lines
    const lineGenerator = d3.line();
    // const diagonal = function (node: any) {
    //   const source = node[0];
    //   const target = node[1];
    //   return 'M' + target[0] + ',' + target[1]
    //     + 'C' + (target[0] + source[0]) / 2 + ',' + target[1]
    //     + ' ' + (target[0] + source[0]) / 2 + ',' + source[1]
    //     + ' ' + source[0] + ',' + source[1];
    // };
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      svg.append('path')
        .attr('d', lineGenerator(link))
        // .attr('d', diagonal(link))
        .attr('fill', 'none')
        .classed(linkClasses[i], true);
    }
  }

  drawTps() {
    let svg = d3.select('#dashboard-tps svg');
    const margin = {top: 10, right: 10, bottom: 10, left: 10};
    // const width = parseInt(svg.style('width'), 10 ) - margin.right - margin.left;
    const width = 1201 - margin.right - margin.left;
    const height = width * 0.5 - margin.top - margin.bottom;
    svg = d3.select('#dashboard-load').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')');
    return height + margin.top + margin.bottom;
  }


  drawSystemLoadAverage() {
    let svg = d3.select('#dashboard-load svg');
    const margin = {top: 10, right: 20, bottom: 20, left: 40};
    const width = parseInt(svg.style('width'), 10 ) - margin.right - margin.left;
    // const height = tpsHeight - margin.top - margin.bottom;
    const height = 320;

    // set the ranges
    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    const z = d3.scaleOrdinal(d3.schemeCategory10);

    const valueline = d3.line()
      .curve(d3.curveBasis)
      .x(function (d: any) {
        return x(parseInt(d.tick, 10));
      })
      .y(function (d: any) {
        return y(d.cpu);
      });

    d3.select('#dashboard-load').select('svg').remove();
    svg = d3.select('#dashboard-load').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')');

    const data = [];
    let maxX = 1;
    const reference = this.websocketConnectionService.cpuHistory; // reference to access cpuhistry variable inside inner function
    for (const node in this.websocketConnectionService.cpuHistory) {
      if (this.websocketConnectionService.cpuHistory.hasOwnProperty(node)) {
        const tempNode = {};
        const nodeData = [];
        this.websocketConnectionService.cpuHistory[node].forEach(function (d: any, i: any) {
          maxX = node.length > maxX ? reference[node].length : maxX;
          const dataPoint = {};
          dataPoint['tick'] = i;
          dataPoint['cpu'] = d;
          nodeData.push(dataPoint);
          // console.log(dataPoint['tick'] + 'this is the i'+' '+dataPoint['cpu']+' this is th d');

        });
        tempNode['id'] = node;
        tempNode['values'] = nodeData;
        data.push(tempNode);
      }
    }
    x.domain([0, maxX - 1]);
    y.domain([0, 100]);
    z.domain(data.map(function (c) {
      return c.id;
    }));

    const lineGroup = svg.selectAll('.lineGroup')
      .data(data)
      .enter().append('g')
      .attr('class', 'lineGroup');

    lineGroup.append('path')
      .attr('class', 'line')
      .attr('d', function (d: any) {
        return valueline(d.values);
      })
      .attr('fill', 'none')
      // .attr("stroke", "steelblue")
      .attr('stroke-width', '1.5px')
      .style('stroke', function (d: any) {
        return z(d.id);
      });
    lineGroup.append('text')
      .datum(function (d: any) {
        return {id: d.id, value: d.values[d.values.length - 1]};
      })
      .attr('transform', function (d: any) {
        console.log('translate(' + x(d.value.tick) + ',' + y(d.value.cpu) + ')');
        return 'translate(' + x(d.value.tick) + ',' + y(d.value.cpu) + ')';
      })
      .attr('x', -20)
      .attr('dy', '0.35em')
      .style('font', '8px sans-serif')
      .text(function (d: any) {
        return d.id;
      });

    svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    svg.append('g')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('fill', '#000')
      .text('cpu %');
  }

}
