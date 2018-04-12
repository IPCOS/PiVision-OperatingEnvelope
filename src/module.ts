import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgLibrary, SymbolType, SymbolInputType, ConfigPropType } from './framework';
import { LibModuleNgFactory } from './module.ngfactory';

import { OEComponent } from './oe/oe.component';
import { HighchartsChartComponent } from './oe/highcharts-chart.component'

@NgModule({
  declarations: [ OEComponent, HighchartsChartComponent ],
  imports: [ CommonModule ] ,
  exports: [ OEComponent ],
  entryComponents: [ OEComponent ]
})
export class LibModule { }

export class ExtensionLibrary extends NgLibrary {
  module = LibModule;
  moduleFactory = LibModuleNgFactory;
  symbols: SymbolType[] = [
    {
      name: 'oe-symbol',
      displayName: 'Operating Envelope',
      dataParams: { shape: 'xy' },
      thumbnail: '^/assets/images/oe_symbol.svg',
      compCtor: OEComponent,
      inputs: [
        SymbolInputType.Data
      ],
      generalConfig: [
        {
          name: 'OE Options',
          isExpanded: true,
          configProps: [
            { propName: 'title', displayName: 'Title', configType: ConfigPropType.Text, defaultVal: 'My OE chart' },
            { propName: 'bkColor', displayName: 'Background color', configType: ConfigPropType.Color, defaultVal: '#9edae5' },
            { propName: 'minX', displayName: 'Min X', configType: ConfigPropType.Num, defaultVal: 200 },
            { propName: 'maxX', displayName: 'Max X', configType: ConfigPropType.Num, defaultVal: 500 },
            { propName: 'minY', displayName: 'Min Y', configType: ConfigPropType.Num, defaultVal: 0 },
            { propName: 'maxY', displayName: 'Max Y', configType: ConfigPropType.Num, defaultVal: 50 }
          ]
        }
      ],
      layoutWidth: 600,
      layoutHeight: 400
    }
  ];
}
