import s from './styles.scss';
import createDetailRow from '../../components/detail-row.js';
export default { // called with `this` = model
    init(sidebar){
        var div = document.createElement('div');
        div.className = s.sidebarDiv;
        div.innerHTML = `<h3>${sidebar.name}</h3><h4></h4>`
        var container = document.createElement('div');
        container.id = `${sidebar.data}-details`;
        sidebar.fields.forEach(field => {
            container.appendChild(createDetailRow.call(this,field, ( sidebar.data !== 'network' )));
        });

        div.appendChild(container);
        document.querySelector('.side-column').appendChild(div);
     //   return div;
    }
}