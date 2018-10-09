$(document).ready(function() {
    var requestURL = "data/BB_S01E01_009_D3.json";
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
      var data = request.response;
      affichage(data);

}

});
function affichage(data){

               //Width of the window
    var width = $(window).width();
    var height = $(window).height();
    var nodes = {};
    var valueMax = 0;
    var valueMin = 0;

    data.nodes.forEach(function(node,index) {
        var linkSorted = data.links.filter(link => (link.source == node.id || link.target == node.id));
        if(linkSorted.length  > 0)
        { //TODO
            const value = linkSorted.reduce(function(x , link){
            return x += link.value;

        },0);
        if(value > valueMax || valueMax === 0){
            valueMax = value;
        }
        else if (value < valueMin || valueMin === 0) {
            valueMin = value;
        }
        node.value = value;
        nodes[node.label] = node;   
        }
    });


    data.links.forEach(function(link,index) {

        const source = data.nodes.find(node => node.id == link.source);
        const target = data.nodes.find(node => node.id == link.target);
        link.source = source;
        link.target = target;

    });

    console.log(valueMin, valueMax);
    var links = data.links;

                //Width of the window
            var width = $(window).width();
            var height = $(window).height();


            //Call to the function resize() on resize of the window
            d3.select(window).on('resize', resize);

            //Initialize force relation inside the graph
            var force = d3.layout.force()
                .nodes(d3.values(nodes))
                .links(links)
                .size([width, height])
                .linkDistance(1)
                .charge(-10000)
                .on('tick', tick)
                .start();

            //Create and initialize the svg for graph
            var svg = d3.select('#display').append('svg')
                .attr('width', width)
                .attr('height', height)
                .call(d3.behavior.zoom().on('zoom', function () {
                svg.attr('transform', 'translate(' + d3.event.translate + ')' + ' scale(' + d3.event.scale + ')')
              }))
                .append('g'); 


            //Create and initialize all paths
            var path = svg.append('g').selectAll('path')
                .data(force.links())
                .enter().append('path')
                .attr('class', function(d) {
                    return 'link ' + "suit";
                })
                .attr('id', function(d) {
                    return d.source.id + '-' + d.target.id;
                })
                .attr('value', function(d){ 
                    return d.value;
                });/*
                .attr('marker-end', function(d) {
                    return 'url(#' + d.type + ')';
                });*/

            //create and initialize all markers on the paths
            svg.append('defs').selectAll('marker')
                .data(['suit', 'licensing', 'resolved'])
                .enter().append('marker')
                .attr('id', function(d) { return d; })
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 23)
                .attr('refY', -1,4)
                .attr('markerWidth',  7)
                .attr('markerHeight', 7)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M0,-5L10,0L0,5'); 

                  

            var r = d3.scale.sqrt().domain([valueMin,valueMax]).range([10,50]);
            //Create and initialize all nodes
            var circle = svg.append('g').selectAll('circle')
                .data(force.nodes())
                .enter().append('circle')
                .attr('r', function(d){
                    return r(d.value);
                })
                .attr('id', function(d) {
                    return d.id;
                });

            //Create and initialize all text (Name of nodes)
            var text = svg.append('g').selectAll('text')
                .data(force.nodes())
                .enter().append('text')
                .attr('x', '2em')
                .attr('y', '-0.8em')
                .text(function(d) {
                    return d.label;
                });

            //function to resize svg, display and graph display
              function resize() {
                width = window.innerWidth, height = window.innerHeight;
                $('#display').attr('width',$(window).width()).attr('height',$(window).height());
                force.size([width, height]).resume();
                
                $('svg').attr('width', width).attr('height', height);
              }



            //function which placed all nodes.
            function tick() {
                path.attr('d', linkArc);
                circle.attr('transform', transform);
                text.attr('transform', transform);
            }

            //Function which draw arcs for the paths
            function linkArc(d) {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = 0;

                return 'M' + d.source.x + ',' + d.source.y + 'A' + dr + ',' + dr + ' 0 0,1 ' + d.target.x + ',' + d.target.y;
            }

            //Function which manage movement of nodes
            function transform(d) {
                return 'translate(' + d.x + ',' + d.y + ')';
            }
        
}
