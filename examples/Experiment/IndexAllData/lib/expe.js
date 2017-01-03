
function d3_graph(nodes_tab, links_tab, offset_x){
    //console.log("HEEEEEEEYYYY JE SUIS LA ")
    var self = this;
    this.color = d3.scale.category10();
    this.scale = d3.scale.linear()
                    .domain([0, 5])
                    .range([50, 180]);

    this.alphabet = 'abcdefghijklmnopqrstuvwxyz';

    //Tableau contenant seulement les id des tooltip
    this.edge_id_group = [];
    //populate the edge_id_group tableau du nombre de liens
    for (var j=0; j< links_tab.length; j++){this.edge_id_group.push([]); }


    //console.log(this.edge_id_group)
    //Tableau contenant les data des tooltips
    this.tooltip_array = [];
    this.iteration_tag = 0;

    /**************** D3 PART ***************/

    this.width = 900,
    this.height = 900;
    //offset for positioning circle
    this.x_offset = 500;
    this.y_offset = 400;

    this.size_first_image = offset_x + 50;

    this.node_array = nodes_tab;
    this.edge_array = links_tab;

    //console.log("TABSSS", nodes_tab, links_tab)

    this.drag = d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", function () { self.dragstarted(); })
      .on("drag", function () { self.dragged(); })
      .on("dragend",function () {  self.dragended(); });

    this.force = d3.layout.force()
        .size([this.width, this.height]);

    this.force
      .nodes(this.node_array)
      .links(this.edge_array)
      .start();


    this.svg = d3.select("svg")
        .attr("width", this.width)
        .attr("height", this.height);

    this.link = this.svg.selectAll(".links")
        .data(this.edge_array)
      .enter().append("svg:path")
        .attr("class", "links")
        .attr("id", function(d) { return "link"+d.id;})

    this.node = this.svg.selectAll(".node")
      .data(this.node_array)
    .enter().append("circle")
      .attr("class", "node")
      .attr("fill", "black")
      .attr("r", 10)
      .attr("cx", function(d) { return (d.x + self.x_offset);})
      .attr("cy", function(d) { return (d.y + self.y_offset );})
      // .attr("cx", function(d,i) {console.log(d.x); return (d.x * 20) + 100; })
      // .attr("cy", function(d) { return (d.y*20) + 400;})
      // .call(this.drag);

      // Define the div for the tooltip
      self.populate_tag();






    this.force.on("tick", function() {
        //self.link.attr("d", function(d) { return draw_curve((d.source.x+self.x_offset), d.source.y +self.y_offset, (d.target.x+self.x_offset), d.target.y+self.y_offset);});
        self.link.attr("d", function(d) {
            var path = draw_curve((d.source.x+self.x_offset), d.source.y +self.y_offset, (d.target.x+self.x_offset), d.target.y+self.y_offset);
            return "M" + path[0].x + "," + path[0].y + "Q" + path[1].x + "," + path[1].y +" " + path[2].x + "," + path[2].y;
        });
        //self.div.attr("transform", "translate(" + 10 + "," + 10 + ")")
        // self.div.attr("cx", function(d, i) {return 10;});
        // self.div.attr("cy", function(d, i) {return 10;});
        // self.div.attr("r", function (d) { return 10; })
        // self.div.style("fill", function(d) { return "blue"; });

        self.force.stop();
    });
}
function is_in_array(array,obj){
  for (var i=0; i< array.length; i++){
    var _array = array[i];
    for (var j=0; j< _array.length; j++){
      if (_array[j] == obj){return [i,j]; }
    }
  }
}
/* Sert a ajouter les tag dans leurs slot */
d3_graph.prototype.populate_tag = function(){
  var self = this;

  this.div = this.svg.selectAll(".tool")
      .data(this.tooltip_array)
  .enter().append("g")
      .attr("transform", function(d, i) {return "translate(" + 10 + "," + self.scale(d.group) + ")";})
      .attr("class", "tool")
      .attr("fill-rule","evenodd")
      .attr("group",function(d, i) { return d.group;})
      .attr("id", function(d, i) { return "tooltipdiv"+i;})
      .call(this.drag)

    this.div.append("svg:path")
      //.style("stroke", "black")  // colour the line
      .style("fill", function(d, i) { return self.color(d.group);})
      //.attr("d", "M0,0 L10,-10 L30,-10 L30,10 L10,10z  M6,0 a2 2 0 1 1 0 0.0001 z")
      //.attr("d", "M0,0 L10,-10  h15   a5,5 0 0 1 5,5   v10   a5,5 0 0 1 -5,5   h-15   L10,10z    M6,0 a2 2 0 1 1 0 0.0001 z ")
      .attr("d", "M10,-10 h10   a5,5 0 0 1 5,5   v10   a5,5 0 0 1 -5,5   h-10   l-10,-8   a4,4 0 0 1 0,-4z  m-7,10 a2 2 0 1 1 0 0.0001 z ")
//l-10,-10

    this.div.append("text")
        .text(function(d, i) { return self.alphabet[d.group];})
        .attr("x", 13)
        .attr("y", 4 )
        .attr("fill", "black" )
        .attr("font-family", "Lato")
        .attr("font-size", "15px")

}
/* Permet de reuperer les tags classes dans le tableau et de les mettre dans l'attribut rank */
/*
edge_id_group = tableau virtuel contenant les tgs sur l'edge en question

*/
d3_graph.prototype.convert_to_group = function(){
  for (var i=0; i< this.edge_id_group.length; i++){
    var _array = this.edge_id_group[i];
    for (var j=0; j< _array.length; j++){
      var group = d3.select('#'+_array[j]).attr("group");
      this.edge_array[i].rank.push(group);
    }

  }
}
/* Regarde qu'elle edge est la plus proche */
d3_graph.prototype.is_close_to_edge = function(x,y) {
  var self = this;

  var group = d3.select(this.dragObj).attr("group");
  var id = d3.select(this.dragObj).attr("id");
  var touch = {"x":10, "y":self.scale(group)};

  this.link.each(function(d, i) {
      //console.log(i)
      var pathEl = d3.select('#link'+i).node();
      var TotalLength = pathEl.getTotalLength();
      //DISTANCE MINIMALE POUR EVITER RETOUR AU SLOT
      var minimum = 20;
      for (var j=0; j< TotalLength; j++)
      {
          var point = pathEl.getPointAtLength(j);
          var distance = get_distance(point.x, point.y, x, y)
          if (distance < minimum){
            minimum = distance;
            //SERT A SAVOIR SI LETIQUETTE NA PAS ETE UTILISE AILLEURS ET SI OUI LA SUPPRIMER DE CE AILLEURS
            var position = is_in_array(self.edge_id_group, id);
            if (position != undefined){self.edge_id_group[position[0]].splice(position[1], 1);}


            /**** REMOVE OTHER TAG PRESENT ON THE EDGE *******/
            var others_tag = self.edge_id_group[i];
            for (var k=0; k < others_tag.length; k++)
            {
                console.log("OTHER TAG", others_tag[k])
                var gr = d3.select('#'+ others_tag[k]).attr("group");
                var yo = {"x":10, "y":self.scale(gr)};
                d3.select('#'+ others_tag[k])
                  .transition()
                  .duration(400)
                  .attr("transform", "translate(" + yo.x + "," + yo.y + ")");

            }
            self.edge_id_group[i] = []

            /**************************************************/

            //PUSH THE ETIQUETTE DANS LA BONNE EDGE
            self.edge_id_group[i].push(id);
            console.log("GROUP", self.edge_id_group[i])

            touch.x = point.x;
            touch.y = point.y;
            //break;
          }
      }
    });
    console.log(self.edge_id_group)
    // TRANSLATE THE ETIQUETTE AU BON POINT TROUVE
    // SINON RETOURNE AU SLOT
    d3.select(this.dragObj)
      .transition()
      .duration(300)
      .attr("transform", "translate(" + touch.x + "," + touch.y + ")");
}

d3_graph.prototype.dragstarted = function() {
  this.dragObj = d3.event.sourceEvent.target;
  this.dragObj = this.dragObj.parentNode;
  //console.log(this.dragObj)
  d3.event.sourceEvent.stopPropagation();
  d3.select(this.dragObj).classed("dragging", true);
}

d3_graph.prototype.dragged = function() {
  //console.log(d3.event.sourceEvent)
  // d3.select(this.dragObj).attr("cx", d3.event.sourceEvent.pageX - this.size_first_image - 5 );
  // d3.select(this.dragObj).attr("cy", d3.event.sourceEvent.pageY - 85);
  var X = d3.event.sourceEvent.pageX - this.size_first_image - 5;
  var Y = d3.event.sourceEvent.pageY - 85 ;
  d3.select(this.dragObj).attr("transform", "translate(" + X + "," + Y + ")")

  // d3.select(this.dragObj).attr("cx", d3.event.sourceEvent.pageX - this.size_first_image - 5 );
  // d3.select(this.dragObj).attr("cy", d3.event.sourceEvent.pageY - 85);
}

d3_graph.prototype.dragended = function(d) {
  d3.select(this.dragObj).classed("dragging", false);
  // var X = d3.select(this.dragObj).attr("cx");
  // var Y = d3.select(this.dragObj).attr("cy");

  // var translate = d3.transform(d3.select(this.dragObj).attr("transform")).translate;
  // var X = translate[0];
  // var Y = translate[1];
  var X = d3.event.sourceEvent.pageX - this.size_first_image - 5;
  var Y = d3.event.sourceEvent.pageY - 85;
  //console.log(X2, Y2, X,Y)
  this.is_close_to_edge(X,Y);
}
d3_graph.prototype.has_all_edge = function(){
  for (var i=0; i< this.edge_array.length; i++){
    if (this.edge_array[i].rank.length == 0){
      return false;
    }
  }
  return true;
}



function get_orienttion(Ax, Ay, Bx, By){
  var signe = -1;
  if ( Ax<Bx ){signe = 1;}
  if ( Ay>By ){signe *= -1;}

  return signe;
}

function draw_curve(Ax, Ay, Bx, By) {

    //console.log(Ax, Ay, Bx, By)
    M = get_distance(Ax, Ay, Bx, By) / 4;
    var signe = -1;
    //if ( Ax<Bx ){signe = 1;}
    //if ( Ay>By ){signe *= -1;}
    //if ( By<Ay ){signe *= -1;}
    M *= signe;
    // side is either 1 or -1 depending on which side you want the curve to be on.
    // Find midpoint J
    var Jx = Ax + (Bx - Ax) / 2
    var Jy = Ay + (By - Ay) / 2

    // We need a and b to find theta, and we need to know the sign of each to make sure that the orientation is correct.
    var a = Bx - Ax
    var asign = (a < 0 ? -1 : 1)
    var b = By - Ay
    var bsign = (b < 0 ? -1 : 1)
    var theta = Math.atan(b / a)

    // Find the point that's perpendicular to J on side
    var costheta = asign * Math.cos(theta)
    var sintheta = asign * Math.sin(theta)

    // Find c and d
    var c = M * sintheta
    var d = M * costheta

    // Use c and d to find Kx and Ky
    var Kx = Jx - c
    var Ky = Jy + d

    return [{"x":Ax,"y": Ay}, {"x":Kx, "y":Ky}, {"x":Bx, "y":By}]
    //return "M" + Ax + "," + Ay +
    //       "Q" + Kx + "," + Ky +
     //      " " + Bx + "," + By
}
/* Get the distance between two points */
function get_distance(x1, y1, x2, y2){
    var a = x1 - x2
    var b = y1 - y2

    var c = Math.sqrt( a*a + b*b );
    //console.log(c)
    return c;
}
