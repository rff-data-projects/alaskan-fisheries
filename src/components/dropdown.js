export default function(){
    var dropdown = document.createElement('select');
    for ( let i = 0; i < 10; i++ ){
        let option = document.createElement('option');
        option.setAttribute('value', 'option-' + i); //TO DO: set options acc to data
        option.innerHTML = 'Option-' + i;
        dropdown.appendChild(option);
    }
    return dropdown.outerHTML;
}