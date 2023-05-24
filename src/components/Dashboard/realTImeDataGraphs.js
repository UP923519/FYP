import XYPlot from 'reactochart/XYPlot';
import XAxis from 'reactochart/XAxis';
import XAxisTitle from 'reactochart/XAxisTitle';
import YAxis from 'reactochart/YAxis';
import YAxisTitle from 'reactochart/YAxisTitle';
import YAxisLabels from 'reactochart/YAxisTitle';

import LineChart from 'reactochart/LineChart';
import BarChart from 'reactochart/BarChart';
import 'reactochart/styles.css';
import { graphArray } from './realTImeDataTotals';

const funnelData = [
  {time: 1, value: 100},
  {time: 2, value: 85},
  {time: 3, value: 42},
  {time: 4, value: 37},
  {time: 5, value: 12}
];

export const TrendBarChart = props => (
  <div>
    <h4>Trend over time </h4>

    <XYPlot xyPlotStyle={{fill:"#ebe6dd"}} width={360} height={275}>
      <XAxis/>
      <YAxis/>
      <BarChart
        barStyle={{fill: "#4e6682"}}
          data={graphArray}
          x={d => d.Transaction}
          y={d => d.Amount}
          barThickness={40}
      />
          <XAxisTitle  title="Time period (weekly - starting from date)" style={{fontSize:"14px", fill:"028499"}} distance={25} />
          <YAxisTitle  title="Carbon (CO2e)" style={{fontSize:"14px", fill:"#028499"}} distance={35} />

      
    </XYPlot>
    <br/> 

  </div>
);

