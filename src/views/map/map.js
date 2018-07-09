import s from './styles.scss';
import map from './map.html';
export default {
    init(){
       console.log(s);
        var div = document.createElement('div');
        div.className = 'map-container';
        div.innerHTML = map;

        document.querySelector('.main-column').appendChild(div);

        return div;
    }
}