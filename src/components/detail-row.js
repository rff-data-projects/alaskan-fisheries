import s from './detail-row.scss';
import BarChart from './bar-chart.js';
import tippy from 'tippy.js';
export default function(sidebar, field){ // called with `this` = model
    var row = document.createElement('div');
    row.className = 'detail-row flex space-between field-' + field;

    var labelDiv = document.createElement('div');
    labelDiv.setAttribute('title', this.dict.descriptions[field]);
    labelDiv.setAttribute('tabindex', 0);
    labelDiv.innerHTML = this.dict.fields[field] + ': <span class="field-value">n.a.</span>';
    tippy(labelDiv, {
        theme: 'RFF',
        arrow: true
    });
    row.appendChild(labelDiv);

    if ( sidebar.id !== 'network' ) {
        var chartDiv = document.createElement('div');
        chartDiv.className = s.chartDiv;
        row.appendChild(chartDiv);
        sidebar.charts.push(new BarChart(chartDiv, sidebar, field));
    }

    return row;
}   