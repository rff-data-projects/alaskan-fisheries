import s from './detail-row.scss';
export default function(field, makeCharts){ // called with `this` = model
    var row = document.createElement('div');
    row.className = 'detail-row flex space-between field-' + field;

    var labelDiv = document.createElement('div');
    labelDiv.innerHTML = this.dict.fields[field] + ': <span class="field-value">n.a.</span>';
    row.appendChild(labelDiv);

    if ( makeCharts) {
        var chartDiv = document.createElement('div');
        chartDiv.className = s.chartDiv;
        row.appendChild(chartDiv);
    }

    return row;
}   