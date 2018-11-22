var datas = [];
var force;
var deletedData = [];


$(document).ready(function() {
    getFile();

});

function getFile(){
    $.ajax({
       url : './php/getFile.php',
       type : 'GET',
       dataType : 'json',

       success : function(result, statut){
            getData(result);
       },

       error : function(resultat, statut, erreur){
            console.log("Statut :", statut, " erreur :", erreur);
       }

    });
}



/*function getData(url) {


    var promises = url.map(function(file){
        let value = d3.json("data/"+file,function(data){
            file = file.replace(/_D3.json/,"")
            data.name = file;
            return data;
        });
        return value;
    })
    Promise.all(promises).then(function(results) {
        debugger;
        console.log(results)
    })
}*/

function getData(files){
    files.map(function(file, index){
        d3.json("data/"+file,function(data){
            file = file.replace(/_D3.json/,"");
            data.name = file;
            loadEnded(data,files.length);

        });
    });


    //console.log(datas);
}

function loadEnded(data,length){
    // All nodes of this value
    nodes = [];

    //Parse all links in order to create a new data
    data.links.map(function(link){
        //Parse all nodes in order to associate all nodes to take only nodes related with others
        data.nodes.map(function(node){
            if ((node.id == link.source || node.id == link.target) && nodes.indexOf(node) === -1) {
                //Take all link connected to this node in order to estimate his value
                var linkSorted = data.links.filter(link => (link.source == node.id || link.target == node.id));
                node.value = linkSorted.reduce(((x , link) => (x += link.value)),0);
                nodes.push(node);
            }

        });
        let test = nodes.reduce((accumulator, currentValue) => {
            return [
                Math.min(currentValue.value, accumulator[0]), 
                Math.max(currentValue.value, accumulator[1])
            ];
        }, [Number.MAX_VALUE, Number.MIN_VALUE]);
        data.min = test[0];
        data.max = test[1];

        const source = data.nodes.find(node => node.id == link.source);
        const target = data.nodes.find(node => node.id == link.target);
        link.source = source;
        link.target = target;   

    });
    data.nodes = nodes;
    datas.push(data);


    if (datas.length == length){
        displayButton();
    }

}

function displayButton(){

    $("nav").append('<input type="range" step="1" id="range" value=0>');
    $('#range').prop('min','0').prop('max', datas.length-1);
    $('#range').on('input',function(){
        let data = datas[this.value];
        $("#nbrelations").val(data.nodes.length);
        //$("#nbrelations").attr('value', data.nodes.length) ;

        display(data);
    })
    $("#nbrelations").on('change',function(){
        filterNodes();
    });

    $("#nbrelations").val(datas[0].nodes.length);
    display(datas[0]);
}


function filterNodes(){
    let data = datas[$('#range').val()];
/*    console.log(datas[$('#range').val()]);
    console.log(data);*/
    var nodes = data.nodes;
    var links = data.links;
    //const filter = getFilter();

    nodes.sort((nodeA,nodeB) => (nodeB.value - nodeA.value));
    nodes = nodes.slice(0,$("#nbrelations").val());

    links = links.filter(function(link){
        console.log(link)
        let test = nodes.filter((node) => (node.label == link.target.label || node.label == link.source.label) );
        if (test.length > 1) {
            return link;
        }
    });
    data.nodes = nodes;
    data.links = links;
    display(data);
    //nodes.sort((nodeA,nodeB) => (nodeA.value - nodeB.value) )
}



function display(data){
    //Width of the window
    var width = $(window).width();
    var height = $(window).height();
    //nodes = filterNodes(nodes);


            //Call to the function resize() on resize of the window
            d3.select(window).on('resize', resize);
            d3.select('g').remove();
            //Initialize force relation inside the graph
            force = d3.layout.force()
            .nodes(data.nodes)
            .links(data.links)
            .size([width, height])
            .linkDistance(200)
            .charge(-1000)
            .on('tick', tick)
            .start();

            //Create and initialize the svg for graph
            var svg = d3.select('svg')
            .attr('width', width)
            .attr('height', height)
                /*.call(d3.behavior.zoom().on('zoom', function () {
                svg.attr('transform', 'translate(' + d3.event.translate + ')' + ' scale(' + d3.event.scale + ')')
            }))*/
            .append('g'); 


            //Create and initialize all paths
            var path = svg.selectAll('path')
            .data(data.links);

            path.exit()
            .remove();

            path.enter().append('path')
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



            var r = d3.scale.sqrt().domain([data.min,data.max]).range([20,50]);
            //Create and initialize all nodes
            var circle = svg.append('g').selectAll('circle')
            .data(data.nodes);

            circle.exit()
            .remove();

            circle.enter().append('circle')
            .attr('r', function(d){
                return r(d.value);
            })
            .attr('id', function(d) {
                return d.id;
            })
            .call(force.drag);                ;

            //Create and initialize all text (Name of nodes)
            var text = svg.append('g').selectAll('text')
            .data(data.nodes);
            text.exit()
            .remove();

            text.enter().append('text')
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
