import { stateModule as S } from 'stateful-dead';
import PS from 'pubsub-setter';
import fisheries from './data/fisheries.csv';
import species from './data/species.json';
import gear from './data/gear.json';
import area from './data/regions.json';
import selectionView from './views/selection/selection.js';
var fullAPI = (function(){
  
    var controller = {
        init(){
            console.log(PS);
            PS.setSubs([
                ['selection', this.checkDropdownOptions]
            ]);
            this.createFishArrays();
            var selectionDiv = selectionView.init(model);
            this.selectionOnRender(selectionDiv);
        },
        createFishArrays(){
            ['species','gear','area', 'id'].forEach(attr => {
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
            div.querySelectorAll('select').forEach(select => {
                select.onchange = function(e){
                    S.setState('selection', e.target.value.split('--'));
                };
            });
        },
        checkDropdownOptions(msg,data){
            console.log(msg,data);
        }
    };
 
    var model = {
        fisheries,
        dict: {
            species,
            gear,
            area
        } 
    };

    return {
        controller
    }   

})(); // end IIFE

export default fullAPI;