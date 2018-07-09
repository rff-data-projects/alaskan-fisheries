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
                ['selection', this.selectFishery]
            ]);
            this.createFishArrays();
            var selectionDiv = selectionView.init(model);
            this.selectionOnRender(selectionDiv);
            mapView.init();
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
                this.resetSelections();
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