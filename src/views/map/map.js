import s from './styles.scss';
import map from './map.html';
import legend from './legend.html';
export default {
    init(){
       console.log(s);
        var div = document.createElement('div');
        div.className = 'map-container';
        div.innerHTML = map;
        document.querySelector('.main-column').appendChild(div);

        var legendDiv = document.createElement('div');
        legendDiv.className = 'legend-container';
        legendDiv.innerHTML = legend;
        document.querySelector('.main-column').appendChild(legendDiv);

        return div;
    }
}