import { Component, ElementRef, ViewChild, AfterViewInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'highcharts-chart',
  template: '<div #chartcontainer style="min-width: 400px; height: 400px; margin: 1em auto; display: block;"></div>'
})

export class HighchartsChartComponent implements AfterViewInit {
  @ViewChild('chartcontainer') el: ElementRef;

  chart: any;
  @Input() Highcharts: any;
  @Input() constructorType: string;
  @Input() callbackFunction: any;
  optionsValue: any;
  @Input()
  set options(val) {
    this.optionsValue = val;
    this.updateOrCreateChart();
  }
  updateValue = false;
  @Output() updateChange = new EventEmitter(true);
  @Input() set update(val) {
    if (val) {
      this.updateOrCreateChart();
      this.updateChange.emit(false); // clear the flag after update
    }
  }
  @Input() oneToOne: boolean; //#20
  
  updateOrCreateChart = function () {
    if (this.chart && this.chart.update) {
      this.chart.update(this.optionsValue, true, this.oneToOne || false);
    } else {
      this.chart = this.Highcharts[this.constructorType || 'chart'](
        this.el.nativeElement,
        this.optionsValue,
        this.callbackFunction || null
      );
      this.optionsValue.series = this.chart.userOptions.series;
    }
  }

  ngAfterViewInit() {
    //this.loopReflow();
  }

  loopReflow() {
    // TODO can we avoid calling reflow when div didn't change size?
    setTimeout(() => {
      if(this.chart) {
          this.chart.reflow();
      }
      this.loopReflow();
    },500);
  }
}