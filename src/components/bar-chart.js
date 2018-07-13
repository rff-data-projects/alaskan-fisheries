/* globals d3 */
import s from './bar-chart.scss';
export default function Barchart(container, sidebar, field){ 

    var scaleTypes = {
        permits: 'log',
        degree: 'linear',
        closeness_centrality: 'log',
        avg_edge_weight: 'log',
        fisheries: 'linear',
        avg_permits: 'log',
        density: 'log',
        avg_degree: 'linear',
        avg_closeness_centrality: 'log'
    };
    this.scaleType = scaleTypes[field] === 'log' ? d3.scaleLog() : d3.scaleLinear();
    this.container = container;
    this.field = field;
    this.sidebarID = sidebar.id;
    this.data = sidebar.data;
    this.height = 9; // value for svg height in proportion to width = 100
    this.minDomain = scaleTypes[this.field] === 'log' ? d3.min(this.data, d => {
            if ( d[this.field] !== 0 ){
                return d[this.field];
            } 
        }) : d3.min(this.data, d => d[this.field]); // if log scale ignore zeros in calculation of min
    this.maxDomain = d3.max(this.data, d => d[this.field]);
    this.scale = this.scaleType.domain([this.minDomain, this.maxDomain]).range([1,100]);

    this.init();

}
Barchart.prototype = {
    init(){
        var svg = d3.select(this.container)
          .append('svg')
          .attr('width', '100%')
          .attr('xmlns','http://www.w3.org/2000/svg')
          .attr('version','1.1')
          .attr('viewBox', `0 0 100 ${this.height}`)
          .attr('focusable',false)
          .attr('aria-labelledby', `${this.sidebarID}-${this.field}-svgTitle ${this.sidebarID}-${this.field}-svgDesc`)
          .attr('role','graphics-dataunit');

        svg.append('title')
            .attr('id', `${this.sidebarID}-${this.field}-svgTitle`)
            .text(`Bar chart segment representing the ${this.field} value for the selected ${this.sidebarID}`);

        svg.append('desc')
            .attr('id',`${this.sidebarID}-${this.field}-svgDesc`)
            .text(`Bar chart segment representing the ${this.field} value for the selected ${this.sidebarID}`);

        this.background = svg.append('rect')
            .attr('width', 100)
            .attr('height', this.height / 2)
            .attr('class',s.background);

        this.foreground = svg.append('rect')
            .attr('width', 0)
            .attr('height', this.height / 2)
            .attr('class',s.foreground);

        this.hashmarks = svg.selectAll('rect.' + s.hashmark)
            .data(this.data.filter(d => !isNaN(d[this.field])))
            .enter().append('rect')
            .attr('class', s.hashmark)
            .attr('width', 0.5)
            .attr('height', this.height / 3)
            .attr('y', this.height / 2)
            .attr('x', d => {
                if ( isNaN(this.scale(d[this.field])) || this.scale(d[this.field]) === -Infinity ) {
                    return 0;
                } else {
                    console.log(this.scale(d[this.field]));
                    return this.scale(d[this.field]);
                  //  console.log(this.field, d[this.field], this.minDomain, this.maxDomain);
                    //return 0;
                }
            });
    },
    update(id){
        if ( id !== 'reset' ){
            this.foreground
                .data([this.data.find(d => d.id === id)])
                .transition().duration(250)
                .attr('width', d => this.scale(d[this.field]));
        } else {
            this.foreground
                .transition().duration(250)
                .attr('width', 0);   
        }
    }
};