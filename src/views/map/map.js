import s from './styles.scss';
import map from './map.html';
import legend from './legend.html';
export default {
    init(){
       console.log(s);
        var div = document.createElement('div');
        div.className = 'map-container';
        div.innerHTML = map;

        var legendDiv = document.createElement('div');
        legendDiv.className = 'legend-container';
        legendDiv.innerHTML = legend;
        div.appendChild(legendDiv);
        document.querySelector('.main-column').appendChild(div);

        return div;
    }
}