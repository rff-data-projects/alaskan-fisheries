/* global d3 */
import s from './lists.scss';
import adjacency from '../../data/adjacency-matrix.csv';
import { stateModule as S } from 'stateful-dead';
import descriptions from './../../data/descriptions.json';
import tippy from 'tippy.js';

var keyedAdjacency = adjacency.map(each => {
    var values = [];
    for (var key in each ){
        if ( each.hasOwnProperty(key) && key !== 'self' && key !== each.self ) {
            values.push({
                key,
                value: each[key]
            });
        }
    }
    values.sort((a,b) => d3.descending(a.value, b.value));
    return {
        key: each.self,
        values
    };
});
export default function ListView(selector, configs, fisheries){
    this.configs = configs;
    this.selector = selector;
    this.children = [];
    this.fisheries = fisheries;
    console.log(this.fisheries);
    this.init();
}

ListView.prototype = {
    init(){
        var container = document.createElement('div');
        container.className = s.listsContainer;
        this.configs.forEach(config => {
            this.children.push(new List(container, config, this.fisheries));
        });
        document.querySelector(this.selector).appendChild(container);
    }
};

function List(container, config, fisheries){

    this.parent = container;
    this.config = config;
    this.fisheries = fisheries;
    this.init();
}

List.prototype = {
    init(){
        var div = document.createElement('div');
        div.className = s.listView;
        var opacity = this.config.id === 'relative' ? 'no-opacity' : '';
        div.innerHTML = '<p class="' + opacity +  (this.config.id === 'relative' ? '' : ' info-mark') +'">' + this.config.title + '</p>';
        if ( this.config.id !== 'relative' ){
            div.setAttribute('title', descriptions[this.config.id]);
            div.setAttribute('tabindex', 0);
            tippy(div, {
                theme: 'RFF',
                arrow: true
            });
        }
        this.list = document.createElement('ol');
        div.appendChild(this.list)
        this.container = div;
        this.parent.appendChild(div);
        this.update('selection', null, null);
    },
    update(msg,data,fadeInText){
        if ( this.config.id === 'relative') {

            console.log(this,msg,data);
            console.log(this);
            /* update list */
            if ( data !== null) {
                this.list.classList.remove(s.hidden);
            } else {
                this.list.classList.add(s.hidden);
            }
            let matchingValues = data !== null ? keyedAdjacency.find(obj => obj.key === data[1]).values : null;
            let temp = document.createElement('div');
          /*  var x;
            if ( matchingValues === null ){
                x = 5;
            } else {
                x = 0;
                for ( let i = 0; i < 5; i++ ){
                    if ( matchingValues[i].value > 0 ) {
                        x++;
                    }
                }
            }*/
            var x = matchingValues !== null ? matchingValues.length : 5;
            for ( let i = 0; i < x; i++ ){
                if ( data !== null && i === 0 && matchingValues[i].value === 0 ) {
                    let text = 'None';
                    temp.innerHTML = text;
                } else if ( data === null || matchingValues[i].value > 0 ){
                    let listItem = document.createElement('li');
                    listItem.setAttribute('tabindex', '0');
                    listItem.setAttribute('title','Click to select this fishery');
                    listItem.setAttribute('data-id', data !== null && matchingValues[i].value > 0 ? matchingValues[i].key : null);
                    listItem.innerHTML = `<span><span>${data !== null && matchingValues[i].value > 0 ? matchingValues[i].key : 'n.a.'}</span> <span>${data !== null && matchingValues[i].value > 0? '(' + matchingValues[i].value + ' shared permits)' : ''}</span></span>`;
                    temp.appendChild(listItem);
                }
            }
            if ( fadeInText ) {
                fadeInText(this.list,temp.innerHTML).then(() => {
                    setEventListeners.call(this);
                });
            } else {
                this.list.innerHTML = temp.innerHTML;
                setEventListeners.call(this);
            }
            let p = this.container.querySelector('p');
            p.innerHTML = data !== null ? 'Fisheries most connected to ' + data[1] : 'none selected';
            if ( data !== null ) {
                p.classList.remove('no-opacity');
            } else {
                 p.classList.add('no-opacity');
            }
        } // end if id == relative
            else {
                console.log(this);
                let temp = document.createElement('div');
                this.fisheries.sort((a,b) => {
                    //console.log(a,b,this);
                    if ( a.closeness_centrality > b.closeness_centrality ){
                        return this.config.id === 'most' ? -1 : 1;
                    }
                    if ( b.closeness_centrality > a.closeness_centrality ){
                        return this.config.id === 'most' ? 1 : -1;
                    }
                    return 0;
                });
                let x = this.config.id === 'most' ? Math.ceil(this.fisheries.length / 2) : Math.floor(this.fisheries.length / 2);
                for ( let i = 0; i < x; i++ ){
                    let listItem = document.createElement('li');
                    listItem.setAttribute('tabindex', '0');
                    listItem.setAttribute('title','Click to select this fishery');
                    listItem.setAttribute('data-id', this.fisheries[i].id);
                    listItem.innerHTML = `<span><span>${this.fisheries[i].id}</span></span>`;
                    temp.appendChild(listItem);
                }
                this.list.innerHTML = temp.innerHTML;
                setEventListeners.call(this);
                console.log(this.fisheries);
            }
        function setPreviewState(){
            S.setState('preview', ['id', this.dataset.id]);
        }
        function unsetPreviewState(){
            var selection = S.getState('selection');
            if (!selection) { // only allow mouseover  preview / depreview if nothing is selected
                S.setState('preview', null);
            } else {
                S.setState('preview', selection)   
            }
        }
        function clickHandler(){
            var selection = S.getState('selection');
            console.log(selection);
            if ( !selection || selection[1] !== this.dataset.id ) { 
                S.setState('selection', ['id',this.dataset.id]);
            } else {
                S.setState('selection', null)   
            }
        }
        function setEventListeners(){
            console.log(S, this);
            this.list.querySelectorAll('li').forEach(item => {
                item.addEventListener('mousemove', setPreviewState);
                item.addEventListener('mouseleave', unsetPreviewState);
                item.addEventListener('focus', setPreviewState);
                item.addEventListener('blur', unsetPreviewState);
                item.addEventListener('click', clickHandler);
                item.addEventListener('keyup', function(e){
                    if ( e.keyCode === 13 ){
                        clickHandler.call(this);
                    }
                });
            });
        }
        


    }
};