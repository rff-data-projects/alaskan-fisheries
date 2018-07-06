export default function(attribute){
    console.log(attribute);
    var dropdown = document.createElement('select');
    var nullOption = document.createElement('option');
    nullOption.value = '';
    nullOption.setAttribute('disabled','');
    nullOption.setAttribute('selected','');
    nullOption.innerHTML = '— select ' + attribute + ' —';
    dropdown.appendChild(nullOption);
    this[attribute].forEach(code => {
        createOption.call(this, code);
    });
    function createOption(code){
        console.log(attribute);
        let option = document.createElement('option');
        option.setAttribute('value', attribute + '--' + code); 
        option.innerHTML = attribute === 'id' ? code : code + ': ' + this.dict[attribute][code];
        dropdown.appendChild(option);
    }
    return dropdown.outerHTML;
}