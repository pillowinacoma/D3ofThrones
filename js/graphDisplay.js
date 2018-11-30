var datas = [];
var deletedData = [];
var wid = d3.scale;
var r = d3.scale;




var charList;
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
        let nodeMinMax = nodes.reduce((accumulator, currentValue) => {
            return [
                Math.min(currentValue.value, accumulator[0]),
                Math.max(currentValue.value, accumulator[1])
            ];
        }, [Number.MAX_VALUE, Number.MIN_VALUE]);
        data.min = nodeMinMax[0];
        data.max = nodeMinMax[1];

        const source = data.nodes.find(node => node.id == link.source);
        const target = data.nodes.find(node => node.id == link.target);
        link.source = source;
        link.target = target;
    });

    data.nodes = nodes;
    datas.push(data);
    const linkMax = data.links.sort((link1,link2)=>(link2.value-link1.value))[0];
    const linkMin = data.links.sort((link1,link2)=>(link1.value-link2.value))[0];
    data.linkMax = linkMax.value;
    data.linkMin = linkMin.value;

    if (datas.length == length){
        displayButton();
    }

}

function displayButton(){

    //$("nav").append('');
    $('#range').prop('min','0').prop('max', datas.length-1);
    $('#range').val(0);
    $('#range').on('input',function(){
        let data = datas[this.value];
        //$("#nbrelations").attr('value', data.nodes.length) ;

        display(data);
    })
    $("#nbrelations").on('change',function(){
        filterNodes(this.value);
    });

    $("#nbrelations").val(100);
    display(datas[0]);
}


function filterNodes(value){
    //console.log(deletedData);
    let data = datas[$('#range').val()];
    let nodes = data.nodes;
    let links = data.links;    
    let nodesDeleted = [];
    let nbValue = Math.round(value*(nodes.length)/100);
    nodes.sort((nodeA,nodeB) => (nodeB.value - nodeA.value));
    nodesDeleted = nodes.slice(nbValue, nodes.length-deletedData.length);
    console.log("nodeDeleted :"+nodesDeleted.length,"deletedData.length"+deletedData.length, "nbValue"+nbValue )
    if(nodesDeleted.length > 0){
        console.log("oui")
        nodesDeleted.map(function(node){
            node.r = $("#"+node.id).attr("r");
            $('#text'+node.id).attr("display","none");
            linksDeleted = links.filter((link) => (node.label == link.target.label || node.label == link.source.label));
            linksDeleted.map(function(link){

                var id = setInterval(frame, 5);

                var path = document.getElementById(link.source.id + '-' + link.target.id)
                var width = 1;
                function frame() {
                    if (width <= 0 ) {
                        clearInterval(id);
                    } else {
                        width =  width - 0.2;
                        path.style.opacity = width;    
                    }
                }
            });
            var id = setInterval(frame, 5);
            var rayon = $("#"+node.id).attr("r")
            function frame() {
                if ($("#"+node.id).attr("r") <= 0 ) {
                    clearInterval(id);
                } else {
                    rayon --;
                    $("#"+node.id).attr("r", rayon)     
                }
            }
            deletedData.push(node);
        });
    } else if(nbValue+deletedData.length > nodes.length){
        let node = deletedData.pop();
        console.log(node);
        var rayon = 0;
        //var id = setInterval(frame, 5);
        $("#"+node.id).attr("r", node.r)

/*            function frame() {
                if ($("#"+node.id).attr("r") <= node.value ) {
                    clearInterval(id);
                } else {
                    console.log("+")
                    rayon ++;
                    $("#"+node.id).attr("r", rayon)     
                }
            }*/
    }
   

/*  let data = datas[$('#range').val()];
    let nodes = data.nodes;
    let links = data.links;
    let nodesDeleted = [];
    let bufferData = {
        node : {},
        links : []

    };
    let nbValue = Math.round(value*(nodes.length + deletedData.length)/100);
    if (nbValue > nodes.length) {
        let nodeToAdd = deletedData.pop();

        nodes.push(nodeToAdd.node);
        nodeToAdd.links.map(function(link){
            links.push(link);
        });
    }else{
        nodes.sort((nodeA,nodeB) => (nodeB.value - nodeA.value));
        nodesDeleted = nodes.slice(nbValue, nodes.length);

        if(nodesDeleted.length != 0){

            nodesDeleted.map(function(node){
                bufferData.node = node;
                bufferData.links = links.filter((link) => (node.label == link.target.label || node.label == link.source.label));
                deletedData.push(bufferData);
            });
            nodes = nodes.slice(0,nbValue);
            links = links.filter(function(link){
                let test = nodes.filter((node) => (node.label == link.target.label || node.label == link.source.label) );
                if (test.length > 1) {
                    return link;
                }
            });
            data.nodes = nodes;
            data.links = links;

        }
    }*//*
    display(data);*/
    //nodes.sort((nodeA,nodeB) => (nodeA.value - nodeB.value) )
}

function display(data){
    //Width of the window
    var width = $(window).width();
    var height = $(window).height();
    //nodes = filterNodes(nodes);

            createCharList(data);
            //Call to the function resize() on resize of the window
            d3.select(window).on('resize', resize);
            d3.select('g').remove();
            //Initialize force relation inside the graph
            var force = d3.layout.force()
            .nodes(data.nodes)
            .links(data.links)
            .size([width-width/4, height-height/4])
            .linkDistance(200)
            .charge(-1000)
            .gravity(.1)
            .on('tick', tick)
            .start();

            //Create and initialize the svg for graph
            var svg = d3.select('svg')
            .attr('width', width)
            .attr('height', height).append('g');


            wid = d3.scale.linear().domain([data.linkMin,data.linkMax]).range([2,6]);
            r = d3.scale.sqrt().domain([data.min,data.max]).range([20,50]);            
            var vTobv = d3.scale.linear().domain([data.linkMin,data.linkMax]).range([-0.4,2]);
            var nodeColor = d3.scale.linear().domain([data.min,data.max]).range([-0.4,2]);


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
                })
            .attr('stroke',function(d) {
                return(bvToD3Rgb(vTobv(d.value)));
                //return d3.rgb(10,52,180);
            })
            .attr('stroke-width',function(d){
              return wid(d.value);
            })
            .attr('class','selected');


            //Create and initialize all nodes
            var circle = svg.selectAll('circle')
            .data(data.nodes);

            circle.exit()
            .remove();

            circle.enter()
            .append('circle')
            .attr('r', function(d){
                return r(d.value);
            })
            .attr('id', function(d) {
                return d.id;
            })
            .attr('class','selected')
            .attr('fill',function(d) {
                return bvToD3Rgb(vTobv(d.value));
            })
            .on("click",function(d){
              var neighbourLinks = [],
                  neighbours = [],
                  currNode;
              for(var i = 0 ; i < data.links.length ; i++){
                if(data.links[i].source.id == d.id || data.links[i].target.id == d.id){
                    neighbourLinks.push(data.links[i]);
                }
              }
              for (var i = 0; i < neighbourLinks.length; i++) {
                for(var j = 0 ; j < data.nodes.length ; j++){
                  if((data.nodes[j].label == neighbourLinks[i].source.label || data.nodes[j].label == neighbourLinks[i].target.label) && (data.nodes[j].label != d.label)){
                      neighbours.push(data.nodes[j]);
                  }else if((data.nodes[j].label == d.label)){
                      currNode = data.nodes[j];
                  }
                }
              }
              var selectLinks = d3.selectAll('path');
              var selectCircles = d3.selectAll('circle');
              if(d3.select('#'+d.id).attr('class') != 'mainSelection'){
                selectCircles.attr('class','unselected');
                selectLinks.attr('class','unselected');
                neighbours.forEach(function(b) {
                    var c1 = $('#'+b.id).attr('class','selected');
                });
                neighbourLinks.forEach(function(b) {
                    var c2 = $('#'+b.source.id+"-"+b.target.id).attr('class','selected');
                });
                    var c3 = $('#'+currNode.id).attr('class','mainSelection');
              }
              else{
                selectCircles.attr('class','selected');
                selectLinks.attr('class','selected');
              }
            })
            .call(force.drag);

            //Create and initialize all text (Name of nodes)
            var text = svg.selectAll('text')
            .data(data.nodes);
            text.exit()
            .remove();

            text.enter().append('text')
            .transition()
            .duration(500)
            .attr('x', '2em')
            .attr('y', '-0.8em')
            .attr('id', function(d) {
                return "text"+d.id;
            })
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
function createCharList(list) {
  charList = d3.select('#characterList')
          .selectAll('input')
          .data(list.nodes);
  charList.exit().remove();
  charList.enter()
          .append('input')
          .attr('type','button')
          .attr('value',function(d) {
              return d.label;
          })
          .attr('name',function(d) {
              return d.label;
          });
}
