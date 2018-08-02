import s from './styles.scss';
import createDropdown from '../../components/dropdown.js';
export default {
    init(model){
        console.log(s);
        var div = document.createElement('div');
        div.className = `layout relative flex ${s.selectionDiv}`;
        div.innerHTML = `<h2 class="${s.heading}">Select a fishery: </h2>`;
        var selectors = document.createElement('div');
        selectors.className = 'layout flex';
        selectors.setAttribute('id','selectors');
        selectors.innerHTML = `
            <div class="flex grow items-center layout ${s.selector}">
                ${createDropdown.call(model,'species', s)} <div><b> + </b></div> 
            </div>
            <div class="flex grow items-center layout ${s.selector}">
                ${createDropdown.call(model,'gear', s)} <div><b> + </b></div> 
            </div>
            <div class="flex grow items-center layout ${s.selector}">
                ${createDropdown.call(model,'area', s)} 
            </div>
            <div class="flex grow items-center layout ${s.selector}">
                <div><b>&mdash;OR&mdash; </b></div>${createDropdown.call(model,'id', s)} 
            </div>
        `;

        div.appendChild(selectors);

        var reset = document.createElement('button');
        reset.innerHTML = 'clear all';
        reset.setAttribute('id','clear-all');
        reset.className = `${s.resetButton} button--secondary`;
        div.appendChild(reset);

        document.querySelector('#app-container').insertAdjacentHTML('afterbegin',div.outerHTML);
        console.log(s.selectionDiv);
        return document.querySelector('.' + s.selectionDiv );
    }
}