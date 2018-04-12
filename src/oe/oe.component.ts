/**
 * @license
 * Copyright © 2017-2018 OSIsoft, LLC. All rights reserved.
 * Use of this source code is governed by the terms in the accompanying LICENSE file.
 */
import { Component, Input, OnChanges } from '@angular/core';
import Highcharts from 'highcharts';
import { constantToCurve, isInsideWindow, numberOfIntersections, isOnSafeSide, curvelimitToArea } from './limit.functions'

import { Axis, Type, Category } from './limit.constants'
import { CurveLimit, ConstantLimit, ColorArea, Pnt, WindowOfInterest } from './limit.types';

@Component({
  selector: 'oe',
  templateUrl: 'oe.component.html',
  styleUrls: ['oe.component.css']
})
export class OEComponent implements OnChanges {
  @Input() title: string;
  @Input() bkColor: string;
  @Input() minX: number;
  @Input() maxX: number;
  @Input() minY: number;
  @Input() maxY: number;
  @Input() data: any;
  xTitle: string = 'X';
  yTitle: string = 'Y';

  Highcharts = Highcharts;
  chartOptions = this.getChartOptions();
  chartConstructor = 'chart'; // optional string, defaults to 'chart'
  chartCallback = function (chart) { } // optional function, defaults to null
  updateFlag = false; // optional boolean
  oneToOneFlag = true; // optional boolean, defaults to false

  ngOnChanges(changes) {
    this.chartOptions = this.getChartOptions();
    this.updateFlag = true;
  }

  getChartOptions() {
    return {
      series: this.buildSeries(),
      chart: {
        plotBackgroundColor: this.bkColor
      },
      title: {
        text: this.title
      },
      xAxis: {
        min: this.minX,
        max: this.maxX,
        endOnTick:false,
        title: { text: this.xTitle }
      },
      yAxis: {
        min: this.minY,
        max: this.maxY,
        endOnTick:false,
        title: { text: this.yTitle }
      },
      legend: {
        enabled: false
      }
    };
  }

  buildSeries() {
    let seriesCollection = [];

    // Make sure X and Y data are available
    if (this.data &&
        this.data.body &&
        this.data.body.length > 1)
    {     

      let xPath = this.data.body[0].path;
      let yPath = this.data.body[1].path;

      // Build the const collection
      let constCollection = new Array<ConstantLimit>();
      for (let i=0;i<this.data.body.length;i++)
      {
        let attr = this.data.body[i];
        let path = attr.path;
        // figure out the axis
        let axis;
        if (path.startsWith(xPath))
          axis = Axis.X;
        else if (path.startsWith(yPath))
          axis = Axis.Y;
        else
          continue;

        // figure out the type and catgory
        let type;
        let category;
        let splitted = path.split('|');
        switch(splitted[splitted.length-1])
        {
          case "High":
            type = Type.Max;
            category = Category.Capacity;
            break;
          case "HighHigh":
            type = Type.Max;
            category = Category.Integrity;
            break;
          case "Low":
            type = Type.Min;
            category = Category.Capacity;
            break;
          case "LowLow":
            type = Type.Min;
            category = Category.Integrity;
            break;
          default:
            continue;
        }

        // retrieve the value
        let value = attr.events[attr.events.length-1].value[1];

        // push to collection
        constCollection.push(new ConstantLimit(axis,type,category,value));
      }

      let windowOfInterest = new WindowOfInterest(
        new Pnt(this.minX,this.maxY),
        new Pnt(this.maxX, this.maxY),
        new Pnt(this.minX, this.minY),
        new Pnt(this.maxX, this.minY)
      );

      let curveCollection = new Array<CurveLimit>();
      // Split curve limits that don't start and end outside the window
      let toLineCollection = new Array<CurveLimit>();
      let toAreaCollection = new Array<CurveLimit>();
      for (let i = 0;i < curveCollection.length;i++){
        let p1 = curveCollection[i].values[0];
        let pend = curveCollection[i].values[(curveCollection[i].values.length)-1];
        if (!isInsideWindow(p1, windowOfInterest) && !isInsideWindow(pend, windowOfInterest)){
          toAreaCollection.push(curveCollection[i]);
        }
        else{
          toLineCollection.push(curveCollection[i]);
        }
      }

      // Convert all the constant limits into curve limits
      for (let i =0;i<constCollection.length;i++)
        toAreaCollection.push(constantToCurve(constCollection[i], windowOfInterest));

      // Sort the curves
      toAreaCollection.sort(function(a, b) {return b.category.priority - a.category.priority;});

      // Create collection of areas to be displayed
      let areaCollection = new Array<ColorArea>();
      for (let i =0;i<toAreaCollection.length;i++) {
        let area = curvelimitToArea(toAreaCollection[i], windowOfInterest);
        areaCollection.push(area);
      }

      // Create series for the different areas
      for (let i = 0;i<areaCollection.length;i++){
        seriesCollection.push({
                name: 'curve'+i,
                data: (areaCollection[i]).points,
                color: (areaCollection[i]).color,
                lineWidth: 0,
                type: 'area',
                marker: { enabled: false },
                fillOpacity: 1
            });
      }

      // Create lines for curves that don't start and end outside the window
      for (let i = 0;i<toLineCollection.length;i++){
        seriesCollection.push({
                name: 'curve'+i,
                data: (toLineCollection[i]).values,
                color: '#000000',
                lineWidth: 3,
                type: 'line',
                marker: { enabled: false }
            });
      }

      this.xTitle = xPath.split('|')[1];
      this.yTitle = yPath.split('|')[1];
      let events = this.data.body[1].events;
      let startTime = Date.parse(events[0].timestamp[0]);
      let endTime = Date.parse(events[events.length-1].timestamp[0]);
      let data = events.map(e => {
        if (!e || !e.value || !e.timestamp || e.value.length < 2 || e.timestamp.length < 1)
          return {x: NaN, y: NaN, time: ''};
        let t = e.timestamp[0];
        let b = Math.floor(255 * (endTime-Date.parse(t))/(endTime-startTime));
        let color = "rgba(" + b + "," + b + "," + b + ",0.8)";
        return {x: e.value[0], y: e.value[1], time: new Date(t), marker:{fillColor:color}};
      });
      seriesCollection.push({
        name: 'operating points',
        data: data,
        type: 'scatter',
        marker: {
          radius: 5,
          fillOpacity:0.3,
          symbol: 'diamond'
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.time}: {point.x}, {point.y}'
        }
      });
    }

    return seriesCollection;
  }
}
