
import { Component, OnInit } from '@angular/core';
import {RestConnectionService} from '../../Services/rest-connection.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  treeData: any;
  root:any;

  constructor(private restConnectionService : RestConnectionService) {
  }

  ngOnInit() {
    this.drawLegend();
    this.restConnectionService.getViewInfo().subscribe(data => {
      this.treeData = data[0];
      // console.log('tree data '+  d3.hierarchy(this.treeData).descendants() );
      this.drawTree();
    });
  }

  drawTree(){
    var margin = {top: 20, right: 100, bottom: 30, left: 110},
      width = 660 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // declares a tree layout and assigns the size
    var treemap = d3.tree()
      .size([height, width]);

    //  assigns the data to a hierarchy using parent-child relationships
    var root = d3.hierarchy(this.treeData);

    root = treemap(root);


    d3.select("#main-view").select("svg").remove();
    var svg = d3.select("#main-view").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom),
      g = svg.append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    // var link = g.selectAll(".link")
    //   .data( root.descendants().slice(1))
    //   .enter().append("path")
    //   .attr("class", "link")
    //   .style("stroke", function(d) { return d.data.level; })
    //   .attr("d", function(d) {
    //     return "M" + d.y + "," + d.x
    //       + "C" + (d.y + d.parent.y) / 2 + "," + d.x
    //       + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
    //       + " " + d.parent.y + "," + d.parent.x;
    //   });

    var link = g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr("class", "link")
      .style("stroke", function(d) { return d.target.data.level; })
      .attr("d", function(d) {
            return "M" + d.target.y + "," + d.target.x
              + "," + d.source.y
              + "," + d.source.x;
      });


    // adds each node as a group
    var node = g.selectAll(".node")
      .data(root.descendants())
      .enter().append("g")
      .attr("class", function(d) {
        return "node" +
          (d.children ? " node--internal" : " node--leaf"); })
      .attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")"; });

    node.append("circle")
      .attr("r", function(d) { return d.data.value; })
      .style("stroke-width", function(d) { return d.data.outer; })
      .style("stroke", function(d) { return d.data.type; })
      .style("fill", function(d) { return d.data.level; });

    // adds the text to the node
    node.append("text")
      .attr("dy", ".35em").attr("fill","grey")
      .attr("x", function(d) { return d.children ?
        (d.data.value + 4) * -1 : d.data.value + 4 })
      .style("text-anchor", function(d) {
        return d.children ? "end" : "start"; })
      .text(function(d) { return d.data.name; });

  }

  drawLegend(){

    let circleX = 21;
    let circleY = 15;
    let circleY2 = 21;
    let circleR = 15;
    let circleS = 4;
    let textX = 45;
    let textY = 20;

    let svgWidth = 150;
    let svgHeight = 50;

    let tempSvg =  d3.select("#view-legend").append("svg").attr("width", 200).attr("height", svgHeight);
    tempSvg.append("text").attr("x", 0).attr("y", 30).attr("font-size", "15px")
      .attr("fill", "grey").text("COMPONENT STATES");

    tempSvg =  d3.select("#view-legend").append("svg").attr("width", svgWidth).attr("height", svgHeight);
    tempSvg.append("circle").attr("cx", circleX).attr("cy", circleY).attr("r", circleR)
      .style("fill", "red");
    tempSvg.append("text").attr("x", textX).attr("y", textY).attr("fill", "grey").text("CLOSED");

    tempSvg =  d3.select("#view-legend").append("svg").attr("width", svgWidth).attr("height", svgHeight);
    tempSvg.append("circle").attr("cx", circleX).attr("cy", circleY).attr("r", circleR)
      .style("fill", "orange");
    tempSvg.append("text").attr("x", textX).attr("y", textY).attr("fill", "grey").text("SUSPENDED");

    tempSvg =  d3.select("#view-legend").append("svg").attr("width", svgWidth).attr("height", svgHeight);
    tempSvg.append("circle").attr("cx", circleX).attr("cy", circleY).attr("r", circleR)
      .style("fill", "yellow");
    tempSvg.append("text").attr("x", textX).attr("y", textY).attr("fill", "grey").text("INITIALIZING");

    tempSvg =  d3.select("#view-legend").append("svg").attr("width", svgWidth).attr("height", svgHeight);
    tempSvg.append("circle").attr("cx", circleX).attr("cy", circleY).attr("r", circleR)
      .style("fill", "blue").style("float", "left");
    tempSvg.append("text").attr("x", textX).attr("y", textY).attr("fill", "grey").text("CONNECTING");

    tempSvg =  d3.select("#view-legend").append("svg").attr("width", svgWidth).attr("height", svgHeight);
    tempSvg.append("circle").attr("cx", circleX).attr("cy", circleY).attr("r", circleR)
      .style("fill", "green").style("float", "left");
    tempSvg.append("text").attr("x", textX).attr("y", textY).attr("fill", "grey").text("CONNECTED");

    tempSvg =  d3.select("#view-legend").append("svg").attr("width", 200).attr("height", svgHeight);
    tempSvg.append("text").attr("x", 0).attr("y", 30).attr("font-size", "15px")
      .attr("fill", "grey").text("PREVIOUS STATES");

    tempSvg =  d3.select("#view-legend").append("svg").attr("width", svgWidth).attr("height", svgHeight);
    tempSvg.append("circle").attr("cx", circleX).attr("cy", circleY2).attr("r", circleR)
      .style("fill", "#2a2a2a").style("stroke", "yellow").style("stroke-width", circleS);
    tempSvg.append("text").attr("x", textX).attr("y", textY).attr("fill", "grey").text("CLOSED");

    tempSvg =  d3.select("#view-legend").append("svg").attr("width", svgWidth).attr("height", svgHeight);
    tempSvg.append("circle").attr("cx", circleX).attr("cy", circleY2).attr("r", circleR)
      .style("fill", "#2a2a2a").style("stroke", "darkgreen").style("stroke-width", circleS);
    tempSvg.append("text").attr("x", textX).attr("y", textY).attr("fill", "grey").text("CONNECTED");
  }

}
