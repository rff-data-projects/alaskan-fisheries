import s from './styles.scss';
import createDropdown from '../../components/dropdown.js';
export default {
    init(model){
        console.log(s);
        var div = document.createElement('div');
        div.className = 'layout relative';
        div.innerHTML = '<h2>Select a fishery</h2>';
        var selectors = document.createElement('div');
        selectors.className = 'layout flex';
        selectors.setAttribute('id','selectors');
        selectors.innerHTML = `
            <div class="flex grow items-center layout ${s.selector}">
                ${createDropdown.call(model,'species')} <div><b> + </b></div> 
            </div>
            <div class="flex grow items-center layout ${s.selector}">
                ${createDropdown.call(model,'gear')} <div><b> + </b></div> 
            </div>
            <div class="flex grow items-center layout ${s.selector}">
                ${createDropdown.call(model,'area')} 
            </div>
            <div class="flex grow items-center layout ${s.selector}">
                <div><b>—OR— </b></div>${createDropdown.call(model,'id')} 
            </div>
        `;

        div.appendChild(selectors);

        var reset = document.createElement('button');
        reset.innerHTML = 'clear all';
        reset.setAttribute('id','clear-all');
        reset.className = `${s.resetButton} button--secondary`;
        div.appendChild(reset);

        document.querySelector('.main-column').appendChild(div);
        return div;
    }
}