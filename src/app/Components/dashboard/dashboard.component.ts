import {Component, DoCheck, OnInit} from '@angular/core';
import {WebSocketConnectionService} from '../../services/web-socket-connection.service';
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

  constructor(private websocketConnectionService: WebSocketConnectionService) {

    this.websocketConnectionService.nodeBlockUpdated.subscribe((value) => {
      this.blockData = value;
      if (this.blockData != null) {
        this.drawBlocks();
      }
    });



    this.websocketConnectionService.sysMetricUpdated.subscribe((value) => {
      this.sysMetricObject = value;
    });

  }

  ngOnInit() {
    if(this.websocketConnectionService.nodeBlock != null){
      this.blockData = this.websocketConnectionService.nodeBlock;
      this.drawBlocks();
    }
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

    const rh = height * 0.1,
      rw = width * 0.2;

    // const rh = height * 0.1,
    //   rw = width * 0.2;

    const noOfSerialComponents = 4;
    const noOfGaps = 1.6 * noOfSerialComponents;

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
            targetY = (height - 1.8 * rh);
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
          (height - 2.5*rh) + ')';
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

}
