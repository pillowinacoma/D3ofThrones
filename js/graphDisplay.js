var datas = [];
var deletedData = [];
var r = d3.scale;
var nodesGraveYard = [];



var charList;
$(document).ready(function() {
    const dir = "data/"
    getFile(dir);


});

function getFile(dir){

    $.ajax({
     url : './php/getFile.php',
     type : 'GET',
     dataType : 'json',
      data : 'dir=' + dir,
    success : function(result, statut){
        getData(result,dir);
    },

    error : function(resultat, statut, erreur){
        console.log("Statut :", statut, " erreur :", erreur);
    }

});
}

function getData(files,dir){
    files.map(function(file, index){
        d3.json(dir+file,function(data){
            file = file.replace(/_D3.json/,"");
            data.name = file;
            loadEnded(data,files.length);

        });
    });

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

    $('#range').prop('min','0').prop('max', datas.length-1);
    $('#range').val(0);

    $('#range').on('input',function(){
        let data = datas[this.value];

        $("#range-slider_p").html(data.name);

        display(data);
        setTimeout(function(){ filterNodes($("#nbrelations").val(), false); }, 300);

    })
    $("#nbrelations").on('change',function(){
        if(this.value <= 100 && this.value >= 0){
            filterNodes(this.value,true);
        }
        else{
            if (this.value > 100) {
                this.value = 100;
                filterNodes(100,true);


            }else if (this.value < 0) {
                this.value = 0;
                filterNodes(1,true);
            }


        }
    });
    $("#range-slider_p").html(datas[0].name);
    $("#nbrelations").val(100);
    display(datas[0]);
}


function filterNodes(value, isSameGraph){
    if(!isSameGraph){
        if(deletedData.length > 0){
            deletedData = [];
        }

    }

    let data = datas[$('#range').val()];
    let nodes = data.nodes;
    let links = data.links;
    let nodesDeleted = [];

    let nbValue = Math.round(value*(nodes.length)/100);
    nodes = nodes.sort((nodeA,nodeB) => (nodeB.value - nodeA.value));

    nodesDeleted = nodes.slice(nbValue, nodes.length-deletedData.length);
    nodesDeleted = nodesDeleted.reverse();
    if(nodesDeleted.length > 0){
        nodesDeleted.map(function(node){

            let bufferData = {
                node : {},
                links : []
            };
            bufferData.node = node;
            linksDeleted = links.filter((link) => ((node.label == link.target.label || node.label == link.source.label)));

            linksDeleted.map(function(link){
                if(!($('#'+link.source.id + '-' + link.target.id).hasClass('hide'))){
                    $('#'+link.source.id + '-' + link.target.id).addClass('hide');
                    $('#'+link.source.id + '-' + link.target.id).removeClass('not_hide_path');
                    bufferData.links.push(link);
                    var path = document.getElementById(link.source.id + '-' + link.target.id);
                }
            });
            $('#text'+node.id).attr("display","none");
            d3.select('#charListButton'+node.id).style('display','none');
            $("#"+node.id).addClass("hide_node");
            $("#"+node.id).removeClass("not_hide");
            var id = setInterval(frame, 5);
            var rayon = $("#"+node.id).attr("r");

            function frame() {
                if ($("#"+node.id).attr("r") <= 0 ) {
                    clearInterval(id);
                } else {
                    rayon --;
                    $("#"+node.id).attr("r", rayon)
                }
            }
            deletedData.push(bufferData);
        });
    }
    else if(nbValue+deletedData.length > nodes.length){
        while($(".not_hide").length != nbValue){
            aNode = deletedData.pop();
            let node = aNode.node;
            $('#text'+node.id).attr("display","flex");
            $("#"+node.id).addClass("not_hide");
            d3.select('#charListButton'+node.id).style('display','flex');


            $("#"+node.id).removeClass("hide_node");
            var rayon = 0;

            $("#"+node.id).attr("r", r(node.value));
            aNode.links.map(function(link){
                $("#"+link.source.id + '-' + link.target.id).removeClass('hide');
                $("#"+link.source.id + '-' + link.target.id).addClass('not_hide_path');

            });
        }
    }

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
        .gravity(.15)
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
        .attr('class',"not_hide_path")
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
        .attr('class','selected')
        ;


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
        .attr('class','selected not_hide')
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
      var selectLinks = d3.selectAll('path:not(.deadLinks)');
      var selectCircles = d3.selectAll('circle:not(.deadNode)');
          //console.log(selectCircles[0].map(obj=>obj.__data__.label));
          if(d3.select('#'+d.id).attr('class') != 'mainSelection' && !d3.select('#'+d.id).classed('deadNode')){
            selectCircles.attr('class','unselected');
            selectLinks.attr('class','unselected');
            neighbours.forEach(function(b) {
                var c1 = $('#'+b.id+':not(.deadNode)').attr('class','selected');
            });
            neighbourLinks.forEach(function(b) {
                var c2 = $('#'+b.source.id+"-"+b.target.id+':not(.deadLinks)').attr('class','selected');
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
        text.classed('deadNode',function(d){
          return false;
        })
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
        var q = document.querySelectorAll('#characterList input');
        q.forEach(function(d) {
            d.remove();
        })
        charList = d3.select('#characterList')
        .selectAll('#characterList input')
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
      })
        .attr('id',function(d) {
          return "charListButton"+d.id;
      })
        .attr('class',function(d) {
          return "unselectedButton";
      })
        .sort(function(a,b) {
          return d3.ascending(a.label,b.label);
      })
        .on("mouseover",function (d) {
          var targetedCircle = d3.select('circle[id='+d.id+']').classed('hoveredCircle',true);
      })
        .on("mouseout",function (d) {
          var targetedCircle = d3.select('circle[id='+d.id+']').classed('hoveredCircle',false);
      })
        .on("click",function(d) {
            var result = "";
            foundButton = d3.select("#charListButton"+d.id);
            foundButton.attr('class',function(d) {
                if((d3.select("#charListButton"+d.id)).attr('class') === 'unselectedButton'){
                  result = "selectedButton";
                  hideNodes(d.id);
              //console.log(nodesGraveYard.map(obj=>obj.theNode[0][0].__data__.label));
          }
          else{
              result = "unselectedButton";
              showNodes(d.id);
              ///console.log(nodesGraveYard.map(obj=>obj.theNode[0][0].__data__.label));
          }
          return result;
      })
        });
    }
    function hideNodes(nodeId) {
        var theNode = d3.select('circle[id='+nodeId+']');
        var theLinks = d3.selectAll('path[id*='+nodeId+']');
        var tmpObj = {theNode,theLinks};
        nodesGraveYard.push(tmpObj);
        nodesGraveYard.forEach(function(obj) {
            obj.theNode.classed("deadNode",true);
            obj.theLinks.classed("deadLinks",true);
        });
        d3.select('text[id=\'text'+nodeId+'\']').classed('deadNode',function(){
            return d3.select('circle[id=\''+nodeId+'\']').classed('deadNode');
        });
    }
    function showNodes(nodeId) {
        var theNode = d3.select('circle[id='+nodeId+']');
        var theLinks = d3.selectAll('path[id^=\''+nodeId+'-\'],path[id$=\'-'+nodeId+'\']');
        var tmpObj = {theNode,theLinks};
        nodesGraveYard = nodesGraveYard.filter(function(obj) {
            return tmpObj.theNode[0][0].id !== obj.theNode[0][0].id;
        });
        d3.selectAll('circle.deadNode').classed('deadNode',function(d) {
          return d.id !== tmpObj.theNode[0][0].id ;
      });
        theLinks[0].map(function(obj) {
          d3.select('path.deadLinks[id=\''+obj.id+'\']').classed('deadLinks',function(d) {
            if(d3.select('circle[id=\''+d.source.id+'\']').classed('deadNode') || d3.select('circle[id=\''+d.target.id+'\']').classed('deadNode')){
              return true;
          }
          return false;
      });
          d3.select('path.deadLinks[id=\''+obj.id+'\']').classed('selected',function(){
              //return false;
              return !(d3.select('path.deadLinks[id=\''+obj.id+'\']').classed('deadLinks'));
          });
      });

      d3.select('text[id=\'text'+nodeId+'\']').classed('deadNode',function(){
          return d3.select('circle[id=\''+nodeId+'\']').classed('deadNode');
      });
    }
