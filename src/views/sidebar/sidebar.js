import s from './styles.scss';
import createDetailRow from '../../components/detail-row.js';
export default { // called with `this` = model
    init(sidebar){
        console.log(sidebar);
        var div = document.createElement('div');
        div.className = s.sidebarDiv + ' ' + sidebar.id;
        div.innerHTML = `<h3 class="${sidebar.id === 'network' ? '' : 'no-opacity'}">${sidebar.name}</h3>`
        var container = document.createElement('div');
        container.id = `${sidebar.id}-details`;
        container.className = s.notApplicable;
        container.innerHTML = '<h4></h4>';
        sidebar.fields.forEach(field => {
            container.appendChild(createDetailRow.call(this, sidebar, field));
        });

        div.appendChild(container);
        document.querySelector('.side-column').appendChild(div);
     //   return div;
    }
}