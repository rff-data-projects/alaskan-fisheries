import s from './styles.scss';
import createDropdown from '../../components/dropdown.js';
export default {
    init(){
        var div = document.createElement('div');
        div.className = 'layout';
        div.innerHTML = '<h2>Select a fishery</h2>';
        var selectors = document.createElement('div');
        selectors.className = 'layout flex';
        selectors.innerHTML = `
            <div class="flex grow items-center layout ${s.selector}">
                ${createDropdown('species')} <div><b> + </b></div> 
            </div>
            <div class="flex grow items-center layout ${s.selector}">
                ${createDropdown('gear')} <div><b> + </b></div> 
            </div>
            <div class="flex grow items-center layout ${s.selector}">
                ${createDropdown('area')} 
            </div>
            <div class="flex grow items-center layout ${s.selector}">
                <div><b>—OR— </b></div>${createDropdown('fishery')} 
            </div>
        `;

        div.appendChild(selectors);

        document.querySelector('.main-column').appendChild(div);
    }
}