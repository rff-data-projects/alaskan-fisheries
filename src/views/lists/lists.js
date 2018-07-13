import s from './lists.scss';
export default {
    init(){

        var container = document.createElement('div');
        container.className = s.listsContainer;

        ['Most connected', 'Least connected'].forEach(title => {
            var div = document.createElement('div');
            div.className = s.listView;
            div.innerHTML = '<h4>' + title + ' list to come</h4>';
            container.appendChild(div);
        });

        document.querySelector('.main-column').appendChild(container);
    }
}