import fisheries from './data/fisheries.csv';
import species from './data/species.json';
import gear from './data/gear.json';
import area from './data/regions.json';
import selectionView from './views/selection/selection.js';
var fullAPI = (function(){
  
    var controller = {
        init(){
            console.log('init!');
            this.createFishArrays();
            selectionView.init(model);
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