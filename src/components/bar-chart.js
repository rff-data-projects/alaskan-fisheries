/* globals d3 */
import s from './bar-chart.scss';
export default function Barchart(container, sidebar, field){ 

    var scaleTypes = {
        permits: 'log',
        degree: 'linear',
        closeness_centrality: 'log',
        avg_edge_weight: 'log',
        fisheries: 'linear',
        avg_permits: 'linear',
        density: 'linear',
        avg_degree: 'linear',
        avg_closeness_centrality: 'linear',
        avg_edge_weight_cluster: 'linear'
    };
    this.scaleType = scaleTypes[field] === 'log' ? d3.scaleLog() : d3.scaleLinear();
    this.scaleTypeStr = scaleTypes[field];
    this.container = container;
    this.field = field;
    this.sidebarID = sidebar.id;
    this.data = sidebar.data;
    this.height = 12.5; // value for svg height in proportion to width = 100
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

        var barGroup = svg.append('g')
            .attr('transform', 'translate(0,' + this.height / 3 + ')');

        this.background = barGroup.append('rect')
            .attr('width', 100)
            .attr('height', this.height / 3)
            .attr('class',s.background);

        this.foreground = barGroup.append('rect')
            .attr('width', 0)
            .attr('height', this.height / 3)
            .attr('class',s.foreground);

        this.hashmarks = barGroup.selectAll('rect.' + s.hashmark)
            .data(this.data.filter(d => !isNaN(d[this.field])))
            .enter().append('rect')
            .attr('class', s.hashmark)
            .attr('width', 0.5)
            .attr('height', this.height / 4)
            .attr('y', this.height / 3)
            .attr('x', d => {
                if ( isNaN(this.scale(d[this.field])) || this.scale(d[this.field]) === -Infinity ) {
                    return 0;
                } else {
                    console.log(this.scale(d[this.field]));
                    return this.scale(d[this.field]);
                }
            });

        this.medianGroup = barGroup.selectAll('g.' + s.median)
            .data([d3.median(this.data.filter(d => !isNaN(d[this.field])), d => {
                if ( isNaN(this.scale(d[this.field])) || this.scale(d[this.field]) === -Infinity ) {
                    return null;
                } else {
                    console.log(this.scale(d[this.field]));
                    return this.scale(d[this.field]);
                }
            })])
            .enter().append('g')
            .attr('transform', d => 'translate(' + d + ',0)')
            .attr('class', s.median);

        this.medianHash = this.medianGroup.append('rect')
                .attr('class', s.hashmark + ' ' + s.median)
                .attr('width', 0.75)
                .attr('height', this.height / 3);

        this.medianLabel = this.medianGroup.append('text')
            .attr('class', s.medianLabel)
            .attr('y',-0.5)
            .text('median');
                



        if ( this.scaleTypeStr === 'log' ){
            svg.append('text')
                .attr('class', s.scaleType)
                .attr('x', 100)
                .attr('y', 3.5)
                .text('log scale');
        }
    },
    update(id){
        if ( id !== 'reset' ){

            this.foreground
                .data([this.data.find(d => d.id === id)])
                .attr('data-id', d => d.id)
                .transition().duration(250)
                .attr('width', d => {
                    if ( isNaN(this.scale(d[this.field])) || this.scale(d[this.field]) === -Infinity ) {
                        return 0;
                    } else {
                        console.log(this.scale(d[this.field]));
                        return this.scale(d[this.field]);
                    }
                });
                
        } else {
            this.foreground
                .attr('data-id', '')
                .transition().duration(250)
                .attr('width', 0);   
        }
    }
};