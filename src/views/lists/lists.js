/* global d3 */
import s from './lists.scss';
import adjacency from '../../data/adjacency-matrix.csv';
import { stateModule as S } from 'stateful-dead';

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
export default function ListView(selector, configs){
    this.configs = configs;
    this.selector = selector;
    this.children = [];
    this.init();
}

ListView.prototype = {
    init(){
        var container = document.createElement('div');
        container.className = s.listsContainer;
        this.configs.forEach(config => {
            this.children.push(new List(container, config));
        });
        document.querySelector(this.selector).appendChild(container);
    }
};

function List(container, config){

    this.parent = container;
    this.config = config;
    this.init();
}

List.prototype = {
    init(){
        var div = document.createElement('div');
        div.className = s.listView;
        div.innerHTML = '<p>' + this.config.title + '</p>';
        this.list = document.createElement('ol');
        div.appendChild(this.list)
        this.container = div;
        this.parent.appendChild(div);
        this.update('selection', null);
    },
    update(msg,data,fadeInText){
        console.log(this,msg,data);
       
        /* update list */
        if ( data !== null) {
            this.list.classList.remove(s.hidden);
        } else {
            this.list.classList.add(s.hidden);
        }
        var matchingValues = data !== null ? keyedAdjacency.find(obj => obj.key === data[1]).values : null;
        var temp = document.createElement('div');
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
        for ( let i = 0; i < 5; i++ ){
                let listItem = document.createElement('li');
                listItem.setAttribute('tabindex', '0');
                listItem.setAttribute('data-id', data !== null && matchingValues[i].value > 0 ? matchingValues[i].key : null);
                listItem.innerHTML = `<span><span>${data !== null && matchingValues[i].value > 0 ? matchingValues[i].key : 'n.a.'}</span> <span>${data !== null && matchingValues[i].value > 0? '(' + matchingValues[i].value + ' shared permits)' : ''}</span></span>`;
                temp.appendChild(listItem);
        }
        if ( fadeInText ) {
            fadeInText(this.list,temp.innerHTML).then(() => {
                setEventListeners.call(this);
            });
        } else {
            this.list.innerHTML = temp.innerHTML;
            setEventListeners.call(this);
        }
        function setConnectedState(){
            S.setState('connected', this.dataset.id);
        }
        function unsetConnectedState(){
            S.setState('connected', null);
        }
        function setEventListeners(){
            console.log(S, this);
            this.list.querySelectorAll('li').forEach(item => {
                item.addEventListener('mouseenter', setConnectedState);
                item.addEventListener('mouseleave', unsetConnectedState);
                item.addEventListener('focus', setConnectedState);
                item.addEventListener('blur', unsetConnectedState);
            });
        }
        


    }
};