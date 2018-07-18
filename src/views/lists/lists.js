import s from './lists.scss';
export default function ListView(configs){
    this.configs = configs;
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
        document.querySelector('.main-column').appendChild(container);
    }
};

function List(container, config){

    this.container = container;
    this.config = config;
    this.init();
}

List.prototype = {
    init(){
        var div = document.createElement('div');
        div.className = s.listView;
        div.innerHTML = '<h4>Fisheries '+ this.config.title + ' <span class="' + s.relativeTo + '">overall</span></h4>';
        this.container.appendChild(div);
        this.update('selection', null);
    },
    update(msg,data,fn){
        console.log(msg,data);
        document.querySelectorAll(`span.${s.relativeTo}`).forEach(span => {
            fn(span, data !== null ? 'to ' + data[1] : 'overall');
        });
    }
};