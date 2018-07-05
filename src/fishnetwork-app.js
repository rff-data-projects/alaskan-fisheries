import selectionView from './views/selection/selection.js';
var fullAPI = (function(){
  
    var controller = {
            init(){
                console.log('init!');
                selectionView.init();
            }
        };

    return {
        controller
    }   

})(); // end IIFE

export default fullAPI;