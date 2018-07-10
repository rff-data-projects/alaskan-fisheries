import { stateModule as S } from 'stateful-dead';
import PS from 'pubsub-setter';
import fisheries from './data/fisheries.csv';
import species from './data/species.json';
import gear from './data/gear.json';
import area from './data/regions.json';
import selectionView from './views/selection/selection.js';
import mapView from  './views/map/map.js';
var fullAPI = (function(){
    var attributeOrder = ['species','gear','area'];  
    var controller = {
        init(){
            console.log(PS);
            PS.setSubs([
                ['partialSelection', this.checkDropdownOptions],
                ['selection', this.selectFishery],
                ['selection', this.highlightNodes],
                ['preview', this.highlightNodes]
            ]);
            this.createFishArrays();
            var selectionDiv = selectionView.init(model);
            this.selectionOnRender(selectionDiv);
            this.mapViewOnRender(mapView.init());
        },
        createFishArrays(){
            [...attributeOrder, 'id'].forEach(attr => {
                model[attr] = [];
                model.fisheries.forEach(each => {
                    if ( model[attr].indexOf(each[attr]) === -1 ){
                        model[attr].push(each[attr]);
                    }
                });
                model[attr].sort((a,b) => {
                    if ( a < b ) return -1;
                    if ( a > b ) return 1;
                    return 0;
                });
            });
            console.log(model);
        },
        selectionOnRender(div){
            div.querySelectorAll('select').forEach((select,i, array) => {
                if ( i === 0 || i === array.length - 1 ) {
                    select.removeAttribute('disabled');
                }
                if ( i < array.length - 1 ){
                    select.onchange = function(e){
                        S.setState('partialSelection', e.target.value.split('--'));
                    };
                } else {
                    select.onchange = function(e){
                        S.setState('selection', e.target.value.split('--'));
                    };
                }
            });
            div.querySelector('#clear-all').onclick = () => {
                //this.resetSelections();
                S.setState('selection', null);
            };
        },
        checkDropdownOptions(msg,data){
            model.matching.fisheries = model.matching.fisheries.filter(each => { // filter the fisheries acc to selection
                var value = isNaN(+data[1]) ? data[1] : +data[1];
                console.log(value);
                return each[data[0]] === value;
            });
            attributeOrder.forEach(attr => { // create array for each attribute consisting only of available values
                console.log(attr);
                model.matching[attr] = [];
                model.matching.fisheries.forEach(each => {
                    if ( model.matching[attr].indexOf(each[attr]) === -1 ){
                        model.matching[attr].push(each[attr]);
                    }
                });
            });
            var index = attributeOrder.indexOf(data[0]);
            document.getElementById('dropdown-' + data[0]).setAttribute('disabled',''); // disable the just selected drodown and
                                                                                        // the unavailable options in the next dropdown(s) 
            if ( index < attributeOrder.length - 1 ){
                let nextAttr = attributeOrder[index + 1];
                let nextDropdown = document.getElementById('dropdown-' + nextAttr);
                Array.from(nextDropdown.options).forEach(o => {
                    var testValue = isNaN(+o.value.split('--')[1]) ? o.value.split('--')[1] : +o.value.split('--')[1];
                    if ( model.matching[nextAttr].indexOf(testValue) === -1 ) {
                        o.setAttribute('disabled','');
                    }
                });
                nextDropdown.removeAttribute('disabled');
            }
            console.log(model.matching);
            if ( model.matching.fisheries.length === 1 ) {
                S.setState('selection', ['id', model.matching.fisheries[0].id]);
            }
        },
        selectFishery(msg,data){
            console.log('selection made!', msg, data);
            if ( data === null ){
                controller.resetSelections();
                return;
            }
            model.matching.fisheries = model.fisheries.filter(f => f.id === data[1]);
            attributeOrder.forEach(attr => {
                document.getElementById('dropdown-' + attr).removeAttribute('disabled');    
            });
            [...attributeOrder, 'id'].forEach(attr => {
                document.getElementById('dropdown-' + attr).value = attr + '--' + model.matching.fisheries[0][attr];
            });
            attributeOrder.forEach(attr => {
                document.getElementById('dropdown-' + attr).setAttribute('disabled','');
            });
        },
        resetSelections(){
            document.querySelectorAll('#selectors select').forEach((select, i, array) => {
                if ( i === 0 || i === array.length - 1 ){
                    select.removeAttribute('disabled');
                } else {
                    select.setAttribute('disabled','');
                }
                select.value = '';
                Array.from(select.options).forEach(o => {
                    o.removeAttribute('disabled');
                });
            });
            model.matching.fisheries = model.fisheries;
        },
        mapViewOnRender(div){
            div.querySelectorAll('circle').forEach(c => {
                c.addEventListener('mouseenter', activate);
                c.addEventListener('mouseleave', deactivate);
                c.addEventListener('focus', activate);
                c.addEventListener('blur', deactivate);
                c.addEventListener('click', function(e){
                    e.stopPropagation();
                    clickEnterHandler.call(this);
                });
                c.addEventListener('keyup', function(e){
                    e.stopPropagation();
                    if (e.keyCode === 13) {
                        clickEnterHandler.call(this);
                    }
                });
            });
            function clickEnterHandler(){
                var currentSelection = S.getState('selection');
                if ( currentSelection && currentSelection[1] === this.dataset.name){ // is same node
                    S.setState('selection', null);
                    div.removeEventListener('click', mapClickHandler); // div = .map-container
                } else {
                    S.setState('selection', ['id',this.dataset.name]);
                    div.addEventListener('click', mapClickHandler);

                }
            }
            function mapClickHandler(){
                S.setState('selection', null);
                div.removeEventListener('click', mapClickHandler);
            }
            function activate(e){
                e.stopPropagation();
                if (!S.getState('selection')) { // only allow mouseover  preview / depreview if nothing is selected
                    S.setState('preview',['id',this.dataset.name]);
                }
                /*if (e.type !== 'focus') {
                    document.activeElement.blur();
                } 
                let circle = document.querySelector('circle.active');
                console.log(circle);
                if ( circle ) {
                    deactivate.call(circle);
                }
                document.querySelectorAll('.nodes circle').forEach(function(each){
                    each.classList.add('not-active');
                });
                this.classList.remove('not-active');
                this.classList.add('active');
                showLinks(this.dataset);
                showDetails(this.dataset);*/
            }

            function deactivate(e){
                e.stopPropagation();
                if (!S.getState('selection')) { // only allow mouseover  preview / depreview if nothing is selected
                    S.setState('preview', null);
                }
                /*document.querySelectorAll('.nodes circle').forEach(function(each){
                    each.classList.remove('not-active');
                });
                this.classList.remove('active');
                hideLinks(this.dataset);
                hideDetails();*/
            }
        },
        highlightNodes(msg,data){
            console.log(msg,data);
            
            var svg = document.querySelector('.map-container svg');
            svg.querySelectorAll('.nodes circle').forEach(function(each){
                each.classList.add('not-active');
                each.classList.remove('active');
                each.classList.remove('attached');
            });
            if ( data !== null ){
                let active = svg.querySelector(`.nodes circle[data-name=${data[1]}]`);
                active.classList.remove('not-active');
                active.classList.add('active');
                highlightLinkedNodes(active.dataset);
            } else {
                unhighlightLinkedNodes();
            }
            function highlightLinkedNodes(d){
                svg.querySelectorAll('line.' + d.name).forEach(l => {
                    l.classList.add('active');
                    var attachedNodes = l.className.baseVal.match(/[A-Z]+-.*?-[^ ]/g);
                    attachedNodes.forEach(ndId => {
                        if ( ndId !== d.name ){
                            let nd = svg.querySelector('circle[data-name="' + ndId + '"]');
                            if ( nd ) {
                                nd.classList.remove('not-active');
                                nd.classList.add('attached');
                            }
                        }
                    });
                });
            }
            function unhighlightLinkedNodes(){
                svg.querySelectorAll('line.active').forEach(l => {
                    l.classList.remove('active');
                });
                svg.querySelectorAll('circle.attached').forEach(c => {
                    c.classList.remove('attached');
                });
            }
        }
    };
 
    var model = {
        fisheries,
        dict: {
            species,
            gear,
            area
        },
        matching: {
            fisheries
        } 
    };

    return {
        controller
    }   

})(); // end IIFE

export default fullAPI;