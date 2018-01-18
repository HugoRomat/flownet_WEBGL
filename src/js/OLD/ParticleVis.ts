import * as d3 from 'd3'
import {Shader} from './Shaders'
import * as THREE from 'three';
import * as $ from 'jquery' 
import * as topojson from 'topojson' 

import * as fontHelvetiker from './../font/helvetiker_bold.typeface.json'

import * as textureRectangle from './../images/rectangle_texture.png'

export class flownet{
    links;
    nodes;
    camera;

    vertex_shader;
    fragment_shader;


    webGL_nodes = []
    webGL_label = []

    d3cola = d3.forceSimulation()
        // .force("collide",d3.forceCollide( function(d){return d.r - 100000 }).iterations(16) )
        // .force("charge", d3.forceManyBody()-100000)
    // .force("center", d3.forceCenter(width / 2, height / 2));
    // d3cola = cola.d3adaptor()
    //         .avoidOverlaps(false)
            //.linkDistance(120)
            //.linkDistance(function (l) { return l.link_length })
            
    tube = [];
    curveSplines = [];
    particleSystems;

    scene;
    // When you change particles, change also temporal delay to number of particles (vertex shader)
    // number_particles = 20;
    number_particles = 1;
    courbure = 5;
    //number_paths_particule = 1; 
    number_roads = [];
    number_max_gates = 21;
    //roads_opacity = 1;
    //roads_color = 0x0000FF;

    //Function for the end of the graph
    callback;

    tube_width = 1;

    needUpdate = true;
    shader;

    FPS = 60;

constructor(nodes, links, interface_){

    this.links = links;
    this.nodes = nodes;
    this.scene = interface_.scene;
    this.camera = interface_.camera;
    
    // this.load_vertex_shaders();
    // this.load_fragment_shaders();

    //UPDATE LA SIZE DE COLA
    //this.d3cola.size([interface_.WIDTH, interface_.HEIGHT])

    //SI PROBLEME AVEC TEMPORAL IL FAUT AUGMENTER LE NOMBRE DANS LE TABLEAU
    //this.create();
    this.shader = new Shader();
    this.fragment_shader = this.shader.fragment;
    this.vertex_shader = this.shader.vertex
    //console.log(this.shader.fragment);


}
/**
* Permet de dessiner les USA a partir d'un GEOJSON FILE
* 
* @param  {d3.projection}   projection  projection d3 que l'on veut utiliser
*/
draw_us(projection){
    var array = [];
    var self = this;
    d3.json("data/us.json", function (error, us) {
            var us_counties = topojson.feature(us, us.objects.land);
            var land = us_counties.geometry.coordinates;
            for (var i = 0; i < land.length; i++) {
                array = [];
                for (var j = 0; j < land[i].length; j++) {
                    var country = land[i][j];
                    for (var k = 1; k < country.length - 1; k++) {
                        var x = country[k][0];
                        var y = country[k][1];
                        var coordinates = projection([x, y]);
                        var vector = new THREE.Vector2(coordinates[0], -coordinates[1]);
                        array.push(vector);
                    }
                }
                var curve = new THREE.SplineCurve(array);
                var shape = new THREE.Shape(curve.getSpacedPoints(150));
                var geometry = new THREE.ShapeGeometry(shape);
                var material = new THREE.MeshBasicMaterial({ color: 0x3498db, opacity: 0.5, transparent: true });
                var mesh = new THREE.Mesh(geometry, material);
                self.scene.add(mesh);
            }
        });
}
draw_map(projection, path){
    
    var self = this;
    var array = []

    d3.json(path, function(error, world) {
    var countries = world.features;
    //console.log(countries.length)
    for(var i=0 ; i<countries.length;i++){
            
            var d = countries[i];
            var name = d.id;
            //var name = d.properties.name;
            //console.log(name)
            if (name){
                for(var k=0 ; k<d.geometry.coordinates.length;k++)
                {   
                    //console.log(d.geometry.coordinates.length)
                    var f = d.geometry.coordinates[k];
                    
                    var geometry_line = new THREE.Geometry();
                    //console.log(f)
                    var array = [];
                    var type = d.geometry.type;
                    for(var j=0 ; j<f.length;j++)
                    { 
                        if (type == "MultiPolygon"){
                            //console.log("MULTIPOLYGON")
                            for(var l=0 ; l<f[j].length;l++){
                                var coord = f[j][l];
                                var x = coord[0]
                                var y = coord[1]
                                var coordinates =  projection([x,y]);
                                var vector = new THREE.Vector2(coordinates[0], - coordinates[1]);
                                var vector3 = new THREE.Vector3(coordinates[0], - coordinates[1], 0);
                                geometry_line.vertices.push(vector3)
                                array.push( vector);
                            }
                        }
                        else{
                            //console.log("HEYY")
                            var coord = f[j];
                            var x = coord[0]
                            var y = coord[1]
                            var coordinates =  projection([x,y]);
                            var vector = new THREE.Vector2(coordinates[0], - coordinates[1]);
                            var vector3 = new THREE.Vector3(coordinates[0], - coordinates[1], 0);
                            geometry_line.vertices.push(vector3)
                            array.push( vector);
                        }
                        

                    }
                    if (array.length > 0){
                        var material2 = new THREE.LineBasicMaterial( { color: 0XFFFFFF, linewidth: 0.1} );
                        var line = new THREE.Line( geometry_line, material2 );
                        self.scene.add( line );

                        // POUR LA COULEUR DES MESH
                        var curve = new THREE.SplineCurve(array);
                        var shape = new THREE.Shape(curve.getSpacedPoints( array.length * 2));
                        shape.autoClose = true;
                        var geometry = new THREE.ShapeGeometry( shape );
                        var material = new THREE.MeshBasicMaterial( { color: 0xbdbdbd} );
                        var mesh = new THREE.Mesh( geometry,  material);
                        mesh.name = name;
                        mesh.userData = {"type" : "country"}
                        self.scene.add(mesh);
                    
                    
                    }
                    
                }

            }
            
        }

    })


}
/**
* Permet de mapper les noeuds JSON d'entrée au noeud JSON du layout de colasrc
* Permet également de lancer le layout 
* Permet de déterminer une distance pour les liens 
*/
map_links_nodes(){
    this.d3cola
        .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(function(d) {return d.link_length}))
        // .force("link", d3.forceLink().distance(function(d) {return 1}).strength(0.1);
        .force("charge", d3.forceManyBody().strength(-1000))
    this.d3cola
        .nodes(this.nodes);
    this.d3cola.force("link")
        .links(this.links);

    // this.d3cola.nodes(this.nodes);
    // this.d3cola.links(this.links);

    // this.d3cola.linkDistance(function (l) { return l.link_length; })
    //console.log(this.links)
    this.d3cola.restart();
}
/*
* Permet de créer le network
* Création des noeuds
* Création des tubes
* Création des Liens
*/
create(){

    console.log(this.number_roads);
    // // Cree mes labels et noeuds a des places aleatoires
    this.createNodes();
    
    
    this.createTube();
    this.createLinks();
    //this.d3cola.linkDistance(function (l) { return l.link_length })
    //this.launch_network();

}
// launch_network2(time){
//         //ADD SPINNER
//         d3.select("#spinner").style("display","block");
//         d3.select("#number_nodes").append("h1").text(this.links.length + " Links & "+this.nodes.length + " Nodes");

//         window.setTimeout(()=>{  

//             this.d3cola.stop();

//             this.createLabel();
//             this.updateLinks();
            
//             this.updateTube();
//             this.updateNodes();

            

//             d3.select("#spinner").style("display","none");
//             this.needUpdate = false;
//             console.log(this.nodes);
//             console.log(this.links);
//             console.log(this.scene);
            
//             //console.log("FINIIIIIISH")
            
            

//         }, time)

//         console.log("FINISH UPDATE")
// }
/**
* Permet de lancer un update sans l'update des noeuds
* 
* 
*/
launch_network_without_computation(){
    console.log("no computation")
    this.createLabel();
    
    this.updateLinks();
    this.updateTube();
    this.updateNodes();
    this.fit_all_particles_to_frequence_temporal_distrib();
    this.createParticle();

    this.needUpdate = false;
    // J'execute mon callback a la fin de l'update de mes attributs.

    if (typeof(this.callback) === "function") {
        this.callback();
    }
}
/**
* Permet de lance le timer a un temps donné
* 
* @param  {float}   time  Temps a partir duquel on commence a dessiner.
*/
launch_network(time){
        //ADD SPINNER
        d3.select("#spinner").style("display","block");
        d3.select("#number_nodes").append("h1").text(this.links.length + " Links & "+this.nodes.length + " Nodes");
        
        // for (var i = 0, n = time; i < n; ++i) {
        //     this.d3cola.tick();
        //     // console.log("TICK")
        // }
        // console.log("ENDTICK")
        // window.setTimeout(()=>{  
        this.d3cola.stop();
        this.createLabel();
        
        this.updateLinks();
        this.updateTube();
        this.updateNodes();
        this.fit_all_particles_to_frequence_temporal_distrib();
        this.createParticle();
        d3.select("#spinner").style("display","none");
        this.needUpdate = false;
        
        // J'execute mon callback a la fin de l'update de mes attributs.

        if (typeof(this.callback) === "function") {
            this.callback();
        }
            
            

        // }, time)
    }
    /**
    * Permet de creer des gates a un endroit donnee sur mon edge
    * Ne marche pas avec le format pris pour l'instant CAD avec le temps
    */
    create_gates(id, segment, x1, y1, x2, y2){
        // NODES
        var material = new THREE.LineBasicMaterial({
            color: 0x0000ff,
            linewidth: 3,
            opacity: 1, 
            transparent: true 
        });
        material.opacity = 0.4;
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(x1,y1, 0));
        geometry.vertices.push(new THREE.Vector3(x2,y2, 0));

        var line = new THREE.Line(geometry, material);

        var _number = this.links[id].gates.length;
        this.links[id].gates.push({object:line, position:segment})
        
        var array = this.links[id].gate_infos;
        array.splice(array.length - 1, 0, {factor:1, position:segment});

        this.scene.add(line);
    }
    /**
    * Permet d'updater les labels de mes noeuds
    * @param  {int}   scale  Nouvelle echelle que l'on veut adopter
    */
    updateLabel_scale(scale){
        console.log("UPDATE SCALE LABEL")
        
        for(var i=0 ; i<this.webGL_label.length ; i++)
        {   
            this.webGL_label[i].scale.set(1/scale,1/scale,1/scale);
        }
    }
    createLabel(){
        var self = this;
        var loader = new THREE.FontLoader();
        var myFont = new THREE.Font(fontHelvetiker)
        // loader.load( '../static/font/helvetiker_bold.typeface.json', function ( font ) {
            // console.log()
            // console.log(font)
            // var mesh = new THREE.Font();
            
            for(var i=0 ; i<self.nodes.length ; i++)
            {
                if (self.nodes[i].label_name != null){
                    // console.log("YOO", self.nodes[i].label_name)
                    var textGeo = new THREE.TextGeometry( self.nodes[i].label_name, {
                        font: myFont,
                        size: self.nodes[i].label_size,
                        height: 5,
                        curveSegments: 12,
                        bevelThickness: 1,
                        bevelSize: 5,
                        bevelEnabled: false
                    })
                    var textMaterial = new THREE.MeshBasicMaterial({ color: self.nodes[i].label_color, transparent:true});

                    var mesh = new THREE.Mesh( textGeo, textMaterial );
                    self.webGL_label.push(mesh);
                    mesh.position.set( 0,0,1);
                    mesh.position.x = self.nodes[i].x + self.nodes[i].label_x;
                    mesh.position.y = self.nodes[i].y + self.nodes[i].label_y;;
                    mesh.name = "label";
                    mesh.name = "label" ;
                    mesh.userData = { id: self.nodes[i].id, index: self.nodes[i].index, type: "label" };
                    console.log("CREATE")
                    self.scene.add( mesh );
                }
            }
        // });
    }
    /**
     * Permet de créer mes noeuds avec les parametres renseigné avant
     */
    createNodes(){
        // NODES
        var n;
        this.webGL_nodes = [];
        var material;
        var circleGeometry;
        var circle;

        //console.log('webGL_nodes', this.webGL_nodes.length)
        for(var i=0 ; i<this.nodes.length ; i++)
        {
            //JE MET UN PX ET PY CAR LE LAYOUT TOURNE CONSTAMENT DONC EMPECHE MES NODES DE SE METTRE A JOUR
            this.nodes[i].label_name = null;
            this.nodes[i].label_size = 6;
            this.nodes[i].label_x = 0;
            this.nodes[i].label_y = 0;
            this.nodes[i].label_color = 0xff0000;
            this.nodes[i].opacity = 1;
            this.nodes[i].z = 0;
            // this.nodes[i].px = null;
            // this.nodes[i].py = null;

            material = new THREE.MeshBasicMaterial({
                //color: 0x0000ff,
                transparent:true,
                opacity: this.nodes[i].opacity
            });
            // instantiate a loader
            var segments = 30 ;
            circleGeometry = new THREE.CircleGeometry(1, segments );
            
            circle = new THREE.Mesh( circleGeometry, material );
            this.webGL_nodes.push(circle);
            circle.scale.set(1,1, 1);
            circle.position.set(10,10, 1);
            circle.name = "circle" ;
            circle.userData = { id: this.nodes[i].id,index: this.nodes[i].index, type: "node" };
            this.scene.add( circle );

            // SI L'ON VEUT AJOUTER DES CERCLES EN 3D

            /*var geometry = new THREE.SphereGeometry( 1, 32, 32 );
            var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
            var circle = new THREE.Mesh( geometry, material );
            this.webGL_nodes.push(circle);
            circle.scale.set(1,1, 1);
            circle.name = "circle" ;
            circle.userData = { id: i, type: "node" };
            this.scene.add( circle );*/
            
        }
    } 
    load_texture_nodes(index_node, path){
        //console.log(index_node)
        var self = this;
        var loader = new THREE.TextureLoader();
        loader.load(
                // resource URL
                path,
                function ( texture ) {
                    var material = new THREE.MeshBasicMaterial( { map: texture} );
                    //console.log("CA PASSE ICI", index_node)
                    //console.log(self.webGL_nodes[index_node])
                    self.webGL_nodes[index_node].material.map = material.map;
                    //self.webGL_nodes[index_node].material.transparent = true;
                    //self.webGL_nodes[index_node].material.opacity = 0;
                    self.webGL_nodes[index_node].material.needsUpdate = true;
                },
        );
    }
    update_values(){
        this.updateNodes();
        this.updateLabel();
        this.updateLinks();
        this.updateTube();
    } 
    update(){
        if (this.needUpdate == true){
            //console.log("Waiting for the end of layout computing")
        }
        else{
            //this.updateParticle();
            //console.log("Upate Particules") 
        }
    }
    createParticle(){
        for ( var j = 0;  j < this.links.length; j ++ ){
            //console.log(this.links[j])
            this.createParticles_webgl(this.links[j].number_particles, this.links[j].id);
            // permits to update the spatial and temporal after resizing links
            // this.updateParticles_SpatialDistribution(this.links[j].spatial_distribution, this.links[j]._id);
            // this.updateParticles_TemporalDistribution(this.links[j].temporal_distribution, this.links[j]._id, this.links[j].temporal_distribution.length)
        }
    }
    updateNodes(){
        console.log("YOOO UPDATE NODES")
        var self = this;
        //console.log(self.nodes[0])
        for(var i=0 ; i<self.nodes.length ; i++)
        {   
            
            if (self.nodes[i].px != null){self.nodes[i].x = self.nodes[i].px;}
            if (self.nodes[i].py != null){self.nodes[i].y = self.nodes[i].py;}
            if (self.nodes[i].pz != null){self.nodes[i].z = self.nodes[i].pz;}
            self.webGL_nodes[i].position.set(self.nodes[i].x,self.nodes[i].y,3)
            self.webGL_nodes[i].material.opacity = this.nodes[i].opacity;

            //self.updateNode_position(i,self.nodes[i].x,self.nodes[i].y);
            
            
        }
        //console.log(self.nodes[0])
    }
    updateNodes_Original(){
        console.log("YOOO UPDATE NODES")
        for(var i=0 ; i<this.nodes.length ; i++)
        {   
            
            this.webGL_nodes[i].position.set(this.nodes[i].x, this.nodes[i].y, 1)
        }
    }
    
    updateLabel(){
        console.log("UPDATE LABEL")
        for(var i=0 ; i<this.webGL_label.length ; i++)
        {       
            console.log("LABEL", this.webGL_label[i])
            this.webGL_label[i].position.x = this.nodes[i].x + 10;
            this.webGL_label[i].position.y = this.nodes[i].y;
        }
    }
    updateTube(){
        console.log("UPDATE TUBE")
        var p, splineObject;
        var path = [];
        var x1, y1, x2, y2;

        var object, position, curve;
        var middle_point, point1, point2, quadratic_path1,quadratic_path2, pas;
        console.log("Update", this.tube)
        //console.log(this.curveSplines.length)
        for(var i=0 ; i<this.tube.length ; i++)
        {   
            // console.log(this.links[i].source.x)
            
            path[0] = {x:this.links[i].source.x, y:this.links[i].source.y}
            path[1] = {x:this.links[i].target.x, y:this.links[i].target.y}
            //var number_segmentation = this.links[i]
            x1 = path[0].x;
            y1 = path[0].y;
            x2 = path[1].x;
            y2 = path[1].y;

            console.log(x1, y1, x2, y2)
            
            object = this.tube[i].children[0];
            
            position = this.get_normal_position_border(x1, y1, x2, y2, this.links[i].width_tube, 1);
            console.log(this.links[i].width_tube, position);
            /*********** 1er SEGMENT ********************************/
            curve = new THREE.SplineCurve([
                    new THREE.Vector2(position[0].x, position[0].y),
                    new THREE.Vector2(position[2].x, position[2].y)
            ]);
            // console.log(curve)
            /*********** 2 SEGMENT ********************************/
            middle_point = this.get_middle_position_normal(position[2].x, position[2].y,position[3].x, position[3].y, i)
            point1 = new THREE.Vector2(middle_point.x1, middle_point.y1);
            point2 = new THREE.Vector2(middle_point.x2, middle_point.y2);
            quadratic_path1 = [];
            // console.log(this.links[i].numberSpacedPoints)
            

            var dist = this.get_distance(this.links[i].source.x, this.links[i].source.y, this.links[i].target.x, this.links[i].target.y)
            this.links[i].numberSpacedPoints = parseInt(dist/ 50);

            if (this.links[i].numberSpacedPoints < 10) this.links[i].numberSpacedPoints = 10;
            // console.log( this.links[i].numberSpacedPoints)

            pas = 1.0 /  this.links[i].numberSpacedPoints;
            // console.log("PAS", pas)
            for (var k=0; k<1; k+=pas){
                quadratic_path1.push(this.bezier(k, position[2],point1, point2,position[3]));
            }
            
            /*********** 3 SEGMENT ********************************/
            var curve3 = new THREE.SplineCurve([
                    new THREE.Vector2(position[3].x, position[3].y),
                    new THREE.Vector2(position[1].x, position[1].y)        
            ]);
            console.log(curve)
            /*********** 4 SEGMENT ********************************/
            middle_point = this.get_middle_position_normal(position[0].x, position[0].y,position[1].x, position[1].y, i)
            point1 = new THREE.Vector2(middle_point.x1, middle_point.y1);
            point2 = new THREE.Vector2(middle_point.x2, middle_point.y2);
            quadratic_path2 = [];
            for (var k=0; k<1; k+=pas){
                quadratic_path2.push(this.bezier(k, position[0],point1, point2,position[1]));
            }
            quadratic_path2 = quadratic_path2.reverse();


            var curve_result = curve.getSpacedPoints( 1 ).concat(quadratic_path1).concat(curve3.getSpacedPoints( 1 )).concat(quadratic_path2) ;

            
            if(curve_result.length>2100){alert("DOit updater la taille du tableau contenant les vertices dans tube")}
            // for (var k=0; k<curve_result.length; k+=1){
            //     this.draw_circle(curve_result[k].x, curve_result[k].y);
            // }   
            //var geometry2 = null;
            // CHECK SI LES DEPART ARRIVE SON EGAUX
            //console.log("TUBE SIDES");
            if (y2 != y1 && x2 != x1){
                // console.log(curve_result)
                var shape = new THREE.Shape(curve_result);
                // console.log(shape)
                var geometry2 = new THREE.ShapeGeometry( shape );
                this.tube[i].children[0].geometry = geometry2;
                // console.log(this.links[i])
                this.tube[i].children[0].material.opacity = this.links[i].tube_opacity;

                // for (var a in geometry2.vertices) {
                //     this.tube[i].children[0].geometry.vertices[a].x = geometry2.vertices[a].x;
                //     this.tube[i].children[0].geometry.vertices[a].y = geometry2.vertices[a].y;
                // }
                

                this.tube[i].children[0].geometry.faces = geometry2.faces;
                //this.tube[i].children[0].geometry.computeBoundingSphere();
                //this.tube[i].children[0].geometry.verticesNeedUpdate=true;

                this.tube[i].children[0].geometry.elementsNeedUpdate = true;
                // this.tube[i].children[0].geometry.morphTargetsNeedUpdate = true;
                // this.tube[i].children[0].geometry.uvsNeedUpdate = true;
                // this.tube[i].children[0].geometry.normalsNeedUpdate = true;
                // this.tube[i].children[0].geometry.colorsNeedUpdate = true;
                // this.tube[i].children[0].geometry.tangentsNeedUpdate = true;

                //object.geometry.verticesNeedUpdate = true; 
                // object.geometry.__dirtyVertices = true;
                // object.geometry.dynamic = true;
            }
            
            //console.log("prout")
            //}
        }
        console.log("FINISH UPDATE TUBE")
        //console.log(scene);

    }
    createTube(){
        var path = [];
        var geometry, p;
        var splineObject;
        var size;
        var curve, curve2, curve3, curve4;
        // LINKS
        //console.log(this.links)
        for(var i=0 ; i<this.links.length ; i++)
        {
            //this.links[i].particleSystems = [];
            var octagon = new THREE.Object3D();
            var vertices = [];
            //console.log(this.links[i].source, this.links[i].target)
            //path[0] = {x:this.links[i].source.x, y:this.links[i].source.y}
            //path[1] = {x:this.links[i].target.x, y:this.links[i].target.y}
            path[0] = {x:5, y:28}
            path[1] = {x:12, y:35}
            var x1 = path[0].x;
            var y1 = path[0].y;
            var x2 = path[1].x;
            var y2 = path[1].y;
            //console.log(this.links[i]);
            //var position = this.get_normal_position(x1, y1, x2, y2, 3, 1);
            var position = this.get_normal_position_border(x1, y1, x2, y2, 3, 1);
            //console.log(position)
            //console.log(x1, y1, x2, y2)
            /* MES EDGES SONT DROITES */
            curve = new THREE.SplineCurve([
                    new THREE.Vector2(position[0].x, position[0].y),
                    new THREE.Vector2(position[2].x, position[2].y)        
                ]);
            curve2 = new THREE.SplineCurve([
                    new THREE.Vector2(position[2].x, position[2].y),
                    new THREE.Vector2(position[3].x, position[3].y)        
                ]);
            curve3 = new THREE.SplineCurve([
                    new THREE.Vector2(position[3].x, position[3].y),
                    new THREE.Vector2(position[1].x, position[1].y)        
                ]);
            curve4 = new THREE.SplineCurve([
                    new THREE.Vector2(position[1].x, position[1].y),
                    new THREE.Vector2(position[0].x, position[0].y)        
                ]);
            //  console.log( this.links[i].numberSpacedPoints)
                var curve_result = curve.getSpacedPoints( 1 ).concat(curve2.getSpacedPoints(this.links[i].numberSpacedPoints)).concat(curve3.getSpacedPoints( 1 )).concat(curve4.getSpacedPoints( this.links[i].numberSpacedPoints)) ;
                //console.log("1", this.links.length);           
                
                //console.log(curve_result)
                var shape = new THREE.Shape(curve_result);
            
            //ICI BUG
                geometry = new THREE.ShapeGeometry( shape );
                //console.log(2)
                //console.log("3");
                var material = new THREE.MeshBasicMaterial( { color: 0x3498db, opacity: this.links[i].tube_opacity, transparent: true } );
            //  material.opacity = 1;
                
                
            //var mesh = THREE.SceneUtils.createMultiMaterialObject( geometry, [ material] );
            var mesh = new THREE.Mesh( geometry,  material );
            mesh.frustumCulled = false;
            mesh.name = "tube"
            octagon.name = "tube" + i;
            octagon.userData = { type: "tube" , id :this.links[i]._id };
            octagon.add(mesh);


            this.scene.add(octagon);
            this.tube.push(octagon);
            console.log("PUSH TUBE")

        }
    }
    createLinks(){
        var path = [];
        var geometry, p;
        var splineObject;
        //console.log(this.links)
        // LINKS
        for(var i=0 ; i<this.links.length ; i++){

            
            this.links[i].particleSystems = [];
            this.links[i].number_segmentation = 50;
            this.links[i].number_segmentation_pattern_fitting = 50;
            
            this.links[i].spatial_distribution = [];
            this.links[i].temporal_distribution2 = [0.0];
            //this.links[i].velocity = [];
            this.links[i].gate_opacity = [];
            this.links[i].wiggling_gate = [];
            this.links[i].size = [];
            this.links[i].gate_position = [];
            this.links[i].roads_opacity = 0;
            this.links[i].roads_color = 1;
            this.links[i].number_paths_particule = this.number_roads[i];
            this.links[i].gate_colors = [];

            this.links[i].courbure = 5;

            this.links[i].texture = textureRectangle; 
            this.links[i].number_particles = this.number_particles;
            this.links[i].coefficient_number_particles = 1;
            this.links[i].gates = [];
            this.links[i].id = i;
            this.links[i].frequency_pattern = 1.0;
            this.links[i].temporal_distribution = [];
            this.links[i].path_quadratic = [];
            this.links[i].tube_opacity = 1;

            // console.log("SPACE", this.links[i].numberSpacedPoints)
            if (this.links[i].numberSpacedPoints == undefined) this.links[i].numberSpacedPoints = 5;

            this.links[i].name = "links";
            
            this.links[i].width_tube = 1;
            this.links[i].gates.push({object:"null", position:0})

            var multi_line = new THREE.Object3D();

            //ASSIGN RANDOM POSITION FOR THE BEGINNING OF MY APP
            this.links[i].source.x = Math.random()*100; 
            this.links[i].target.y = Math.random()*100; 
            this.links[i].source.x = Math.random()*100; 
            this.links[i].target.y = Math.random()*100; 


            path[0] = {x:this.links[i].source.x, y:this.links[i].source.y}
            path[1] = {x:this.links[i].target.x, y:this.links[i].target.y}
            var x1 = path[0].x;
            var y1 = path[0].y;
            var x2 = path[1].x;
            var y2 = path[1].y;
            
            var distance = this.get_distance(x1, y1, x2, y2);
            
            //aCHanger pour 50 si l'on veut
            this.links[i].number_segmentation = Math.floor(distance);
            //console.log(this.links[i].number_segmentation);

            
            //var position = this.get_normal_position(x1, y1, x2, y2, this.links[i].width_tube, this.number_paths_particule);
            var position = this.get_normal_position_border(x1, y1, x2, y2, this.links[i].width_tube, this.links[i].number_paths_particule);

            
            /*****************FOR THE MIDDLE LINE  **************/
            // create curves
            var points = []
            var curve = new THREE.SplineCurve([
                new THREE.Vector2(this.links[i].source.x, this.links[i].source.y),
                new THREE.Vector2(this.links[i].target.x, this.links[i].target.y),
                ]);
            this.links[i].spatial_distribution[0] = 0;
            var curveSplineMaterial = new THREE.LineBasicMaterial( { 
                color : this.links[i].roads_color,
                linewidth:  1,
                opacity: this.links[i].roads_opacity, 
                transparent: true
            });

            p = new THREE.Path( curve.getSpacedPoints( this.links[i].number_segmentation ) );
            geometry = p.createPointsGeometry( this.links[i].number_segmentation );
            splineObject = new THREE.Line( geometry, curveSplineMaterial );
            splineObject.name = "roads";
            multi_line.add(splineObject);

            /****************** FOR THE OTHER LINE ****************/
            for(var j=0 , f = 1; j < position.length - 1; j+=2, f++)
            {
                // create curves
                var points = []
                var curve = new THREE.SplineCurve([
                    new THREE.Vector2(position[j].x, position[j].y),
                    new THREE.Vector2(position[j+1].x, position[j+1].y),
                    ]);
                this.links[i].spatial_distribution[f] = 0;
                var curveSplineMaterial = new THREE.LineBasicMaterial( { 
                    color : this.links[i].roads_color,
                    linewidth:  1.8,
                    opacity: this.links[i].roads_opacity, 
                    transparent: true
                });

                p = new THREE.Path( curve.getSpacedPoints( this.links[i].number_segmentation ) );
                geometry = p.createPointsGeometry( this.links[i].number_segmentation );
                splineObject = new THREE.Line( geometry, curveSplineMaterial );
                multi_line.add(splineObject);
            }

            this.links[i].gate_infos = [{factor:1, position:0},{factor:1, position:this.links[i].number_segmentation}];
            multi_line.renderOrder = 5;
            multi_line.userData = {type: "link" , id: this.links[i]._id};
            multi_line.name = "links";
            //console.log(multi_line)
            this.curveSplines.push(multi_line)
            this.links[i].userData = { id: this.links[i]._id , number_particles :0};
            

            this.links[i].temporal_distribution = Array.apply(null, Array(this.number_particles)).map(Number.prototype.valueOf,0);
            //this.links[i].velocity = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 1.0);
            this.links[i].gate_opacity = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 1.0);
            this.links[i].wiggling_gate = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 0.0);
            this.links[i].size = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 40.0);
        /********************* NOMBRE MAXIMUM DE PORTE JE RAJOUTE +1 CAR JE VEUX MA DERNIERE PORTE POUR MON DERNIER POINTS  */
            this.links[i].gate_position = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 0);
            this.links[i].gate_velocity = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 1.0);
            this.links[i].gate_colors = [];//Array(this.links[i].gate_position).fill(new THREE.Vector3( 1.0, 1.0, 1.0 )); 
            
            for (var j = 0; j< this.number_max_gates;j++){
                
                this.links[i].gate_colors.push(new THREE.Vector3( 1.0, 1.0, 1.0 ))
            } 
            // console.log(this.links[i].gate_colors, this.links[i].gate_position)

            this.scene.add(multi_line);               
        }
    }
    /********** PERMET D'UPDATER LES LIENS *********/
    updateLinks(){
            
        var path = [];
        console.log("UPDATE LINKS")
        
        for(var i=0 ; i<this.links.length ; i+=1)
        {
            this.links[i].temporal_distribution = []

            // POUR EVITER D'AVOIR LES EDGES QUI NE SONT PAS SUR LES TUBES
            if (this.links[i].source.x == this.links[i].target.x) this.links[i].source.x += 0.01
            if (this.links[i].source.y == this.links[i].target.y) this.links[i].source.y += 0.01

            //console.log(this.links[i])
            //console.log(this.curveSplines[i])
            path[0] = {x:this.links[i].source.x, y:this.links[i].source.y}
            path[1] = {x:this.links[i].target.x, y:this.links[i].target.y}
            var x1 = path[0].x;
            var y1 = path[0].y;
            var x2 = path[1].x;
            var y2 = path[1].y;

            var distance = this.get_distance(x1, y1, x2, y2);
            this.links[i].number_segmentation = Math.round(distance) * 5;


            var middle_point = this.get_middle_position_normal(x1, y1, x2, y2, i)

            

            var array = [new THREE.Vector2(this.links[i].source.x, this.links[i].source.y),
                    new THREE.Vector2(middle_point.x1, middle_point.y1),
                    new THREE.Vector2(middle_point.x2, middle_point.y2),
                    new THREE.Vector2(this.links[i].target.x, this.links[i].target.y)];
            this.links[i].path_quadratic[0]= array;
            var quadratic_path = [];
            var object = this.curveSplines[i].children[0];
            /** IL FAUT QUE LA LONGUEUR SOIT EGALE AU NOMBRE DE VERTICES CREER DANS CREATE LINKS */
            /** -1 CAR JE RAJOUTE LE POINT DE LA FIN POUR FERMER L BOUCLE */
            var pas = 1.0 / (object.geometry.vertices.length - 1);
            for (var k=0; k<1; k+=pas){
                quadratic_path.push(new THREE.Vector3( this.bezier(k, array[0],array[1], array[2], array[3]).x, this.bezier(k, array[0],array[1], array[2], array[3]).y, 0));
            }
            quadratic_path.push(new THREE.Vector3(x2, y2, 0));
            var curveSplineMaterial = new THREE.LineBasicMaterial( { color : this.links[i].roads_color, linewidth:  1,opacity: this.links[i].roads_opacity, transparent: true});
            var p = new THREE.Path( quadratic_path);//curve.getSpacedPoints( this.links[i].number_segmentation) );
            var geometry = p.createPointsGeometry( 50 );
            object.material = curveSplineMaterial; 
            object.geometry.vertices = geometry.vertices;
            object.geometry.verticesNeedUpdate = true;
            
            /************************* POUR LES GATES  ****************************************/
            /******** AFIN QUE LA DERNIERE PORTE CORRESPONDE AU NOEUD FINAL  ******************/
            // for(var f = 1; f < this.links[i].gate_position.length - 1 ; f++){
            //     var number = Math.ceil((this.links[i].number_segmentation_pattern_fitting/ (this.number_max_gates - 1)) * f);
            //     // console.log(number)
            //     this.links[i].gate_position[f] = 0 //this.links[i].gate_position = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            // }
            // this.links[i].gate_position[this.number_max_gates - 1] = this.links[i].number_segmentation + Math.ceil(this.links[i].number_segmentation/ (this.number_max_gates - 1));
            

            /***** POUR LES LIENS EXTERIEURS */
            var position = this.get_normal_position_border(x1, y1, x2, y2, this.links[i].width_tube, this.links[i].number_paths_particule);
            //console.log("POSITION LIENS", position[0])
            for(var j=0 , f = 1; j < position.length - 1; j+=2, f++)
            {
                var object = this.curveSplines[i].children[f];
                //console.log(object)
                var points = []

                
                var middle_point = this.get_middle_position_normal(position[j].x, position[j].y,position[j+1].x, position[j+1].y, i)
                //console.log("middle point", middle_point)
                var array = [new THREE.Vector2(position[j].x, position[j].y),
                    new THREE.Vector2(middle_point.x1, middle_point.y1),
                    new THREE.Vector2(middle_point.x2, middle_point.y2),
                    new THREE.Vector2(position[j+1].x, position[j+1].y)];
                this.links[i].path_quadratic[f]= array;
                var quadratic_path = [];
                //console.log(object)
                var pas = 1.0 / (object.geometry.vertices.length - 1);
                //console.log("PAS", pas , object.geometry.vertices.length)
                for (var k=0; k<1; k+=pas){
                    quadratic_path.push(this.bezier(k, array[0],array[1], array[2], array[3]));
                }
                quadratic_path.push(new THREE.Vector3(array[3].x, array[3].y, 1));
                var curveSplineMaterial = new THREE.LineBasicMaterial( { color : this.links[i].roads_color,linewidth:  1,opacity: this.links[i].roads_opacity, transparent: true});
                var p = new THREE.Path( quadratic_path);//curve.getSpacedPoints( this.links[i].number_segmentation) );
                var geometry = p.createPointsGeometry(20);
                object.material = curveSplineMaterial; 
                object.geometry.vertices = geometry.vertices;
                object.geometry.verticesNeedUpdate = true; 
            }
        }
    }
    updateTube_width_gate(link_id, gate, value){

        var self = this;

        // Set new value to the gate
        var array_gates = this.links[link_id].gate_infos;
        var array_tube = [];

        //Check each gate and each line
        for(var i=0 ; i < 2 ; i++){
            var array_spline = [];
            for(var j=0 ; j < array_gates.length ; j++){
                var position = this.get_normal_position(this.links[link_id].source.x, this.links[link_id].source.y,this.links[link_id].target.x, this.links[link_id].target.y, array_gates[j].position, this.links[link_id].width_tube * array_gates[j].factor, 1)
                array_spline.push(new THREE.Vector2(position[i].x, position[i].y))
            }
            var curve = new THREE.SplineCurve(array_spline);
            var p = new THREE.Path( curve.getSpacedPoints( 50 ) );
            var geometry = p.createPointsGeometry( 50 );
            var array_vertices = [];
            for(var j=0 ; j < geometry.vertices.length ; j++){
                array_vertices.push(new THREE.Vector2(geometry.vertices[j].x, geometry.vertices[j].y))
            }
            array_tube.push(array_vertices);
        }
        //Create the array of line contituing the tube
        array_tube[0].reverse();  
        //Merge the line to obtain a mesh
        var curve1 = new THREE.SplineCurve([
                        new THREE.Vector2(array_tube[0][50].x, array_tube[0][50].y),
                        new THREE.Vector2(array_tube[1][0].x, array_tube[1][0].y)        
                ]);
            
        var curve2 = new THREE.SplineCurve([
                        new THREE.Vector2(array_tube[1][50].x, array_tube[1][50].y),
                        new THREE.Vector2(array_tube[0][0].x, array_tube[0][0].y)        
                ]);
        var curve_result = curve1.getSpacedPoints( 50 ).concat(array_tube[1]).concat(curve2.getSpacedPoints( 50 )).concat(array_tube[0]) ;
        console.log(curve_result)

        //var selectedObject = scene.getObjectByName("tube" + link_id);
        //scene.remove( selectedObject );     

        // create the new tube
        var octagon = new THREE.Object3D();
        octagon.name = "tube" + link_id;
        var object = this.tube[link_id].id;
        //Update the mesh
        var shape = new THREE.Shape(curve_result);
        var geometry2 = new THREE.ShapeGeometry( shape ); 
        var material = new THREE.MeshLambertMaterial( { color: 0x3498db, opacity: 1 } );
        material.transparent = true;
        material.opacity = 1;
        
        var mesh = new THREE.Mesh( geometry2,  material );
        
        mesh.material.depthTest = false;
        mesh.renderOrder = 9999;
        octagon.userData = { type: "tube" , id :link_id };
        octagon.add(mesh);
        
        for (var a in geometry2.vertices) {
                this.tube[link_id].children[0].geometry.vertices[a].x = geometry2.vertices[a].x;
                this.tube[link_id].children[0].geometry.vertices[a].y = geometry2.vertices[a].y;
        }
            this.tube[link_id].children[0].geometry.faces = geometry2.faces;
            this.tube[link_id].children[0].geometry.computeBoundingSphere();
            this.tube[link_id].children[0].geometry.verticesNeedUpdate=true;

            this.tube[link_id].children[0].geometry.elementsNeedUpdate = true;
            this.tube[link_id].children[0].geometry.morphTargetsNeedUpdate = true;
            this.tube[link_id].children[0].geometry.uvsNeedUpdate = true;
            this.tube[link_id].children[0].geometry.normalsNeedUpdate = true;
            this.tube[link_id].children[0].geometry.colorsNeedUpdate = true;
            this.tube[link_id].children[0].geometry.tangentsNeedUpdate = true;
            //render();
        //this.tube[link_id] = octagon;
        //this.tube[link_id].children[0].geometry = geometry2;
        //scene.add(octagon);
        //this.tube[link_id].children[0].geometry.verticesNeedUpdate = true;

    }
    updateLinks_width_gate(link_id, gate, value){
        var array_gates = this.links[link_id].gate_infos;
        array_gates[gate].factor = value;
        for(var i=0 ; i < 12 ; i++){
            var array_spline = [];

            for(var j=0 ; j < array_gates.length ; j++){
                //console.log(array_gates[j].position)
                var position = this.get_normal_position(this.links[link_id].source.x, this.links[link_id].source.y,this.links[link_id].target.x, this.links[link_id].target.y, array_gates[j].position, this.links[link_id].width_tube * array_gates[j].factor, this.links[link_id].number_paths_particule)
                array_spline.push(position[i])
            }

            var object = this.curveSplines[link_id].children[i];
            var curve = new THREE.SplineCurve(array_spline);
            var p = new THREE.Path( curve.getSpacedPoints( 50 ) );
            var geometry = p.createPointsGeometry( 50 );
            object.geometry.vertices = geometry.vertices;
            object.geometry.verticesNeedUpdate = true;

            this.links[link_id].curvePath[i] = curve.getSpacedPoints(50 );
            
        }
        this.updateParticles_Paths(link_id);
    }
    
    
    updateParticles_Paths(link_id){

        var number_particles = this.links[link_id].userData.number_particles
        //console.log(this.links[link_id], link_id)
        var uniforms = this.links[link_id].particleSystems.material.__webglShader.uniforms;
        
        /*for ( var i = 0; i < this.number_paths_particule * 2 ; i ++ ){
            var path = "path" + (i+1);
            uniforms[path].value = this.links[link_id].curvePath[i];
        }*/
        var path_quadratic = [];
        for (var i = 0; i< this.links[link_id].path_quadratic.length; i++){
            path_quadratic = path_quadratic.concat(this.links[link_id].path_quadratic[i]);

        }

        // var path2 = [];
        // for (var i = 0; i< this.links[link_id].curvePath.length; i++){
        //     path2 = path2.concat(this.links[link_id].curvePath[i]);
        // }
        uniforms.path_quadratic.value = path_quadratic;
        console.log("PATHS",uniforms.path_quadratic)
    }
    updateParticles_Texture(link_id,  value){

        var number_particles = this.links[link_id].userData.number_particles
        var uniforms = this.links[link_id].particleSystems.material.__webglShader.uniforms;
        uniforms.texture.value = new THREE.TextureLoader().load( "../../static/images/" + value) 
        uniforms.texture.name = value;
        console.log("TEXTURE",uniforms.texture.value)
    }
    updateParticles_Velocity(link_id, gate, value){

        var number_particles = this.links[link_id].userData.number_particles
        var uniforms = this.links[link_id].particleSystems.material.__webglShader.uniforms;
        uniforms.gate_velocity.value[gate] = value;
        console.log("VELOCITY",uniforms.gate_velocity.value)
    }
    updateParticles_Wiggling(link_id, gate, value){

        var number_particles = this.links[link_id].userData.number_particles
        var uniforms = this.links[link_id].particleSystems.material.__webglShader.uniforms;
        uniforms.wiggling_gate.value[gate] = value;
        console.log("WIGGLING",uniforms.wiggling_gate.value)
    }
    updateParticles_Zoom(value){
        //var number_particles = this.links[i].number_particles;
        for ( var i = 0; i < this.links.length  ; i ++ ){
            var uniforms = this.links[i].particleSystems.material.__webglShader.uniforms;
            console.log(uniforms)
            console.log(value)
            uniforms.ProjectionMatrix.value = value;
            //console.log("ZOOM",uniforms.projectionMatrix.value)
        }
    }
    /** UPDATE LA OPACITE DES PARTICULES */
    updateParticle_Opacity(link_id, gate, value){

        var uniforms = this.links[link_id].particleSystems.material.__webglShader.uniforms;
        uniforms.gate_opacity.value[gate] = value;
        // console.log("OPACITY",uniforms.opacity.value)
    }
    updateParticles_Gate_Opacity(link_id, value){

        for ( var j = 0;  j < 21; j ++ ){
            var uniforms = this.links[link_id].particleSystems.material.__webglShader.uniforms;
            uniforms.gate_opacity.value[j] = value;
        }
        
    }
    updateParticles_Opacity(value){
        for ( var i = 0;  i < this.links.length; i ++ ){
            for ( var j = 0;  j < 21; j ++ ){
                var uniforms = this.links[i].particleSystems.material.__webglShader.uniforms;
                uniforms.gate_opacity.value[j] = value;
            }
        }
    }
    /** UPDATE LA TAILLE DES PARTICULES */
    updateParticle_Size(link_id, gate, value){

        //var number_particles = this.links[link_id].userData.number_particles
        var uniforms = this.links[link_id].particleSystems.material.__webglShader.uniforms;
        uniforms.size.value[gate] = value;
        console.log("SIZE",uniforms.size.value)
    }
    updateParticles_Size(value){
        for ( var i = 0;  i < this.links.length; i ++ ){
            for ( var j = 0;  j < 21; j ++ ){
                var uniforms = this.links[i].particleSystems.material.__webglShader.uniforms;
                uniforms.size.value[j] = value;
            }
        }
    }
    updateParticles_SpatialDistribution(spatial_distribution, link){
        console.log(spatial_distribution)
        // Le tableau est un tableau ou chaque particule contient l'id du faisceau
        // J'ai donc a mettre l'id du faisceau la ou ca m'arrange
        var f = 0;
        //console.log("SPATIAL",spatial_distribution)
        for ( var j = 0;  j < this.links.length; j ++ ){

            if (this.links[j]._id == link){
                var particule_number = 0;
                var faisceau = 0;
                //console.log(this.links[j].particleSystems.geometry.attributes.id)
                    for ( var i = 0; i < spatial_distribution.length; i ++ ){
                    for ( var k = 0; k< spatial_distribution[i]; k ++ ){

                        this.links[j].particleSystems.geometry.attributes.id.array[particule_number] = faisceau ;
                        particule_number ++;
                    }
                    faisceau ++;
                }
                this.links[j].particleSystems.geometry.attributes.id.needsUpdate = true;
            }
        }
    }
    /**** LORSQUE C'EST LE EN SPECIFICATION DE L'EDGE = [0,0,0,0,1,1]  ***/
    array_SpatialDistribution_items(number, i){
        var array = []
        //console.log("SPATIAL_DISTRIBUTION", this.links[i].spatial_distribution)
        /* JE FAIS CA CAR LE NOMBRE DE PARTICULES EST PROPORTIONNEL AU NOMBRE DU SPATIAL */
        var array_length = number/ this.links[i].spatial_distribution.length;

        for ( var k = 0; k< array_length; k ++ ){
            array = array.concat(this.links[i].spatial_distribution);
        }
        return array;

    }
    /**** LORSQUE C'EST LE EN NOMBRE SUR EDGE = [4,2] ***/
    array_SpatialDistribution(spatial_distribution, indice){

        var f = 0;
        var array = Array.apply(null, Array(spatial_distribution.length)).map(Number.prototype.valueOf,0.0);
        var particule_number = 0;
        var faisceau = 0;
        for ( var i = 0; i < spatial_distribution.length; i ++ ){
            for ( var k = 0; k< spatial_distribution[i]; k ++ ){
                array[particule_number] = faisceau ;
                particule_number ++;
            }
            faisceau ++;
        }
        return array[indice]
        
    }
    updateParticles_number_segmentation_pattern_fitting(){
        for ( var j = 0; j < this.links.length; j ++ ){
            var number_particles = this.links[j].userData.number_particles
            var uniforms = this.links[j].particleSystems.material.__webglShader.uniforms;
                uniforms.temporal_delay.value = this.links[j].number_segmentation_pattern_fitting;

            }
    }
    /*
    updateParticles_TemporalDistribution3(){
        for ( var j = 0; j < this.links.length; j ++ ){
        var number_particles = this.links[j].userData.number_particles
        var uniforms = this.links[j].particleSystems.material.__webglShader.uniforms;

            for ( var i = 0; i < this.links[j].temporal_distribution.length; i ++ ){
                uniforms.temporal_delay.value[i] = this.links[j].temporal_distribution[i];
            }
        }
    }
    */
    /*
    // Pour updater avec des valeurs
    updateParticles_TemporalDistribution(temporal_distribution, link, number_values){
    
        var number_particles = this.links[link].userData.number_particles
        var uniforms = this.links[link].particleSystems.material.__webglShader.uniforms;

            for ( var i = 0; i < temporal_distribution.length; i ++ ){
                uniforms.temporal_delay.value[i] = Math.floor( - temporal_distribution[i]);
            }
    }
    */
    /*updateParticles_TemporalDistribution2(temporal_distribution, link, number_values){
        // a 60 FPS, 1 secondes = 60 frame
        // Une periode correspond a trois frames : 3 secondes
        var f = 0;
        var number_particles = this.links[link].userData.number_particles
        var uniforms = this.links[link].particleSystems.material.__webglShader.uniforms;
        //uniforms.temporal_delay.value = [];
        //console.log("OLD", (number_particles * gate))
        var links_number = 0;
        for ( var i = 0; i < temporal_distribution.length; i ++ ){
            for ( var k = 0; k < temporal_distribution[i]; k ++ ){
                //console.log(k,temporal_distribution[i])
                var temporal =  (-50 / number_values) * i 
                uniforms.temporal_delay.value[links_number] = Math.floor( temporal);
                // if((number_particles * gate) + links_number < (number_particles * gate) + number_particles){
                //     //console.log("ITERATION", (number_particles * gate) + links_number)
                //     //uniforms.temporal_delay.value[(number_particles * gate) + links_number] = (-50 / number_values) * i;
                // }
                links_number++;
            }
        }

        //console.log("TEMPORAL",uniforms.temporal_delay)

    }*/
    updateParticles_Color(id_link, color, gate){
        var number_particles = this.links[id_link].userData.number_particles
        //console.log(color)
        // var color_array = this.links[id_link].particleSystems.geometry.attributes.customColor.array;
        // for ( var i = 0, i3 = 0; i < number_particles; i ++, i3 += 3 ) {
        //     color_array[ i3 + 0 ] = color.r / 255;
        // 	color_array[ i3 + 1 ] = color.g / 255;
        // 	color_array[ i3 + 2 ] = color.b / 255;
        // }
        // this.links[id_link].particleSystems.geometry.attributes.customColor.needsUpdate = true;
        //console.log("HEY", color_array)
        var uniforms = this.links[id_link].particleSystems.material.__webglShader.uniforms;
        var indice = 0;
        //uniforms.gate_colors.value[gate] = new THREE.Vector3( color.r / 255, color.g / 255, color.b / 255 );
        uniforms.gate_colors.value[gate] = new THREE.Vector3( color.r , color.g , color.b  );
            
        

    }
    /**
     * Permet d'updater la position de mes gates
     * Permet d'avancer ou de reculer la position de toutes mes particules
     * @param {Number} id_link id du lien
     * @param {Array} gate array des index ou se trouve mes edges
     */
    updateParticles_Gates(id_link, gate){

        var uniforms = this.links[id_link].particleSystems.material.__webglShader.uniforms;
        var indice = 0;
        for ( var j = 1;  j < uniforms.gate_position.value.length; j ++ ){
            if (uniforms.gate_position.value[j] == 0){
                uniforms.gate_position.value[j] = gate;
                break;
            }
        }
    }
    /**
     * Permet d'updater mes particules en choisissant la frame ou elle devrait se trouver
     * Permet d'avancer ou de reculer la position de toutes mes particules
     * @param {Number} number_frame frame ou elle doivent se trouver
     */
    updateParticle(number_frame){
        var numParticles; 
        var my_frame = 0;
        for ( var j = 0;  j < this.links.length; j ++ ){     
            if (this.links[j].particleSystems.length != 0 && this.links[j].particleSystems.material.__webglShader != undefined){
                var uniforms = this.links[j].particleSystems.material.__webglShader.uniforms;
                uniforms.uTime.value = number_frame;
            }
        }
    }        
    /**
     * Fonction permettant de créer mes particules en WebGL
     * Plusieurs attributs sont créé et sont ensuite passé a mes shaders pour les dessiner.
     * @param {Number} particles Nombre de particules sur le lien    
     * @param {Number} link_id   Id du lien contenant les particules 
     */
    createParticles_webgl(particles, link_id){

        // console.log(particles, link_id)
        console.log("CREATE PARTICLES", particles, link_id)
        var self = this;

        /**
         * Initialisation des variables
         */
        var temporal = this.links[link_id].temporal_distribution;
        var gate_velocity = this.links[link_id].gate_velocity;
        var gate_opacity = this.links[link_id].gate_opacity;
        var wiggling_gate = this.links[link_id].wiggling_gate;
        var size = this.links[link_id].size;
        var gate_position = this.links[link_id].gate_position;
        var gate_colors = this.links[link_id].gate_colors;
        var number_segmentation = this.links[link_id].number_segmentation;
        var number_segmentation_pattern_fitting = this.links[link_id].number_segmentation_pattern_fitting;
        var path_quadratic = [];
        for (var i = 0; i< this.links[link_id].path_quadratic.length; i++){
            path_quadratic = path_quadratic.concat(this.links[link_id].path_quadratic[i]);
        }
        var spatial = this.array_SpatialDistribution_items(particles, link_id);
        var texture = new THREE.TextureLoader().load( this.links[link_id].texture );
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        var number = 0;
        var posistion_gate_after_speed = [];

        

        /**
         * PERMET DE DETERMINER LA NOUVELLE POSITION DES GATES POUR PRENDRE EN COMPTE LA VITESSE
         */
        // for (var i =0; i<gate_position.length; i ++){
        //     posistion_gate_after_speed.push(number);
        //     number = number + parseInt(gap_two_gates / (gate_velocity[i]));
        // }

        
        

        /**
         * Met a jour le tableau contenant la position des gates.
         * en fonction de la vitesse de mes élèments
         */

        var number = 0;
        var offsetGate = 0;
        var posistion_gate_after_speed = [];
        // GAP = un espace

        
        var gap = number_segmentation_pattern_fitting / (this.number_max_gates);
        
        for (var i =0; i< (this.number_max_gates -1); i ++){
            posistion_gate_after_speed.push(number);
            number = number + parseInt(gap/(gate_velocity[i])) 
        }
        posistion_gate_after_speed.push(number_segmentation_pattern_fitting)
        // console.log("GATE SPEED", posistion_gate_after_speed)
        var gap_two_gates = posistion_gate_after_speed[3] - posistion_gate_after_speed[2];//(gate_position[1] - gate_position[0]);

        // console.log("GATE POSITION", posistion_gate_after_speed)
        
        // console.log("gap Gates", gap_two_gates)



        /**
         * Je met a jour le tableau des offset.
         * Car quand j'augmente la distance, une particules va plus vite qu'une particule allant a une vitesse normale
         * Permet de ne pas calculer tout ca dans le shader.
         */
            
        var offsetArray = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 0);
        var offset = 0;
        // var offsetArray2 = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 0);
        
        for (var i = 0; i< this.number_max_gates-1; i ++){
            // console.log("Valeurs que je dois avoir", posistion_gate_after_speed[i] * gate_velocity[i])
            // console.log(offset)
            // console.log(" =============== OFFSET", (posistion_gate_after_speed[i] * gate_velocity[i]) - offset, i);

            var normalValuesAtGates = posistion_gate_after_speed[i] * gate_velocity[i];
            var offsetBetweenGates = posistion_gate_after_speed[i+1] - posistion_gate_after_speed[i];
            offsetArray[i] = (posistion_gate_after_speed[i] * gate_velocity[i]) - offset;
            offset += offsetBetweenGates * gate_velocity[i];


        }
        // console.log("TEMPORAL", temporal)

        /* Détermines mes uniforms pour les transmettre au shaders */
        var uniforms = {
            "path_quadratic" :  { type: "v2v", value: path_quadratic },
            "temporal_delay" : { type: "iv1", value: temporal },
            "gate_velocity" : { type: "iv1", value: gate_velocity },
            "size" : { type: "fv1", value: size },
            "gate_opacity" : { type: "fv1", value: gate_opacity },
            "wiggling_gate" : { type: "fv1", value: wiggling_gate },
            "gap_two_gates" : { type: "iv1", value: gap_two_gates },
            "gate_position" : { type: "iv1", value: posistion_gate_after_speed },
            "gate_colors" : { type: "v3v", value: gate_colors },
            "particles_number" : { type: "iv1", value: particles },  
            "number_segmentation" : { type: "iv1", value: number_segmentation }, 
            "offsetArray": { type: "iv1", value: offsetArray },
            "number_segmentation_pattern_fitting" : { type: "iv1", value: number_segmentation_pattern_fitting },  
            uTime: { type: "f", value: 1.0 },
            time: { type: "f", value: 1.0 },
            delta: { type: "f", value: 0.0 },
            "ProjectionMatrix": { type: "m4", value: self.camera.projectionMatrix },
            texture: { value: texture, name:this.links[link_id].texture }

        };
        /************ 2 car les liens exterieur, 1 le lien du milieu, *4 pour DEBUT-POINT DE CONTROLE1- POINT DE CONTROLE2 - ARRIVEE */
        var path_length = ((2 * this.links[link_id].number_paths_particule)+1) * 4;

        /* Determination d'un shader material qui fait le lien entre mon programme et mes shaders */
        var shaderMaterial = new THREE.ShaderMaterial( {
            uniforms:       uniforms,
            vertexShader:   '#define path_length '+ path_length + 
            '\n' + '#define real_number_particles '+ this.links[link_id].temporal_distribution.length + 
            '\n' + '#define number_max_gates '+ this.number_max_gates + 
            '\n' + self.vertex_shader,
            fragmentShader: self.fragment_shader,
            transparent:    true
        });

        // console.log(path_length , this.number_max_gates, this.links[link_id].temporal_distribution.length)
        
        /* Met les attributs des particules */
        var radius = 50;
        var geometry = new THREE.BufferGeometry();
        var positions = new Float32Array( particles * 3 );
        var colors = new Float32Array( particles * 3 );
        var my_velocity = new Float32Array( particles );
        var id = new Float32Array( particles );
        var id_particle = new Float32Array( particles );
        var paths = new Float32Array( particles * 4);
        var iterations = new Float32Array( particles );   
        var color = new THREE.Color();

        for ( var i = 0, i3 = 0; i < particles; i ++, i3 += 3 ) {
            /* Position des textures de particules */
            positions[ i3 + 0 ] = 0 * radius;
            positions[ i3 + 1 ] = 0 * radius;
            positions[ i3 + 2 ] = 0 * radius;

            colors[ i3 + 0 ] = 1; //this.hslToRgb(1,1,0.5)[0];
            colors[ i3 + 1 ] = 1; //this.hslToRgb(1,1,0.5)[1];
            colors[ i3 + 2 ] = 0; //this.hslToRgb(1 ,1,0.5)[2];

            my_velocity[ i ] = 1.0;
            iterations[i] = 0.0;
            //Id de la particule, Sert à mettre du delay
            id_particle[i] = i
            /* DANS LE CAS OU ON VEUT DEFINIR LE NOMBRE DIRECTEMENT SUR CHAQUE EDGE */
            id[i] = spatial[i]

        }
        /* Ajout des attributs */
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
        //Actual state of velocity
        geometry.addAttribute( 'actual_velocity', new THREE.BufferAttribute( my_velocity, 1 ) );
        geometry.addAttribute( 'id', new THREE.BufferAttribute( id, 1) );
        geometry.addAttribute( 'id_particle', new THREE.BufferAttribute( id_particle, 1) );
        geometry.addAttribute( 'iteration', new THREE.BufferAttribute( iterations, 1 ) );

        this.particleSystems = new THREE.Points( geometry, shaderMaterial );
        this.particleSystems.name = "particle_system" + link_id;

        this.links[link_id].particleSystems = this.particleSystems;
        this.links[link_id].userData.number_particles = particles;
        
        //Initialize the temporal distribution 
        // this.links[link_id].temporal_distribution[0] = [];
        // this.links[link_id].temporal_distribution[0][0] = particles;
        // this.links[link_id].temporal_distribution[0][1] = 0;

        // Moving Camera = CPU -- Moving vertices is GPU
        // Because the Camera (CPU) knows nothing about the vertex displacements int the vertex shader
        this.particleSystems.frustumCulled = false;        
        this.scene.add(this.particleSystems);
        return this.particleSystems;   
    }
    delete_entity_by_type(tag_data){
        for(var i=0 ; i<this.scene.children.length ; i++){
            var object = this.scene.children[i];
            if (object.userData.type == tag_data){this.scene.remove(object);}
        }
    }
    /*
    * Permet de récuperer le milieu du segment selectionné
    * 
    * @param  {x1}   Premier point
    * @param  {y1}   Premier point
    * @param  {x2}   Deuxième point
    * @param  {y2}   Deuxième point
    * @param  {link_id}   Id du lien 
    * @return {object}    Objet contenant les abscisses et ordonnées d'une barre
    */  
    get_middle_position_normal(x1, y1, x2, y2, link_id){
        
        // POUR EVITER D'AVOIR UNE DIVISON PAR 0
        if (y1 == y2) y1 = y2 + 1;
        var segmentation = this.links[link_id].number_segmentation;
        var divide = Math.round(segmentation/3);
        var euclidean_distance = Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2 - y1,2));
        
        //console.log("COURBURE", this.links[link_id])
        //console.log("EUCLIDEN DISTANCE", euclidean_distance)
        var distance = euclidean_distance / this.links[link_id].courbure;
        var alpha = (y2-y1)/(x2-x1);
        var signe = -1;
        if ( y2<y1 ){signe = 1;}
        //if ( x2<x1 ){signe = 1;}

        var x_middle = (((x2-x1)/segmentation)*divide) + x1;
        var y_middle = (((y2-y1)/segmentation)*divide) + y1;
        var alpha_normal = (x1 - x2) / (y2 - y1) ;
        var ordonne_origine_normal = y_middle - (alpha_normal * x_middle);
        var X1 = x_middle + (signe * Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2))));
        var Y1 = alpha_normal * (X1) + ordonne_origine_normal;
        
        //console.log("AFTER",X1, Y1)
        var x_middle = (((x2-x1)/segmentation)*divide*2) + x1;
        var y_middle = (((y2-y1)/segmentation)*divide*2) + y1;
        var alpha_normal = (x1 - x2) / (y2 - y1) ;
        var ordonne_origine_normal = y_middle - (alpha_normal * x_middle);
        var X2 = x_middle + (signe * Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2))));
        var Y2 = alpha_normal * (X2) + ordonne_origine_normal;

        return {x1:X1,y1:Y1, x2:X2,y2:Y2 };
    }
    
    /*
        * Recupere toutes les positions pour les roads
        * Calcule en fonction du nombre en entrée l'espacement nécéssaire entre chaque road d'un tube
        * @param   {distance}  distance    distance = taille du tube sur une moitie
        * @param   {number}  _number       nombre de liens a tracer
        * 
        * @return  {Array}           Position of the normal point
        */
    get_normal_position_border(x1, y1, x2, y2, distance, _number){
    
        var fix_distance = distance;

        var array = [];
        // POUR EVITER D'AVOIR UNE DIVISON PAR 0
        if (y1 == y2) y1 = y2 + 5;
        if (x1 == x2) x1 = x2 + 5;

        var alpha = (y2-y1)/(x2-x1);
        var alpha_normal = (x1 - x2) / (y2 - y1);
        

        for(var i=0 ; i< _number ; i++){
            
            var x_middle = x1;
            var y_middle = y1;
            var ordonne_origine_normal = y_middle - (alpha_normal * x_middle);
            var X1 = x_middle + Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2)) );
            var Y1 = alpha_normal * (X1) + ordonne_origine_normal;

            var X2 = x_middle - Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2)) );
            var Y2 = alpha_normal * (X2) + ordonne_origine_normal;
            
            var x_middle = x2;
            var y_middle = y2;
            var alpha_normal = (x1 - x2) / (y2 - y1);
            
            var ordonne_origine_normal = y_middle - (alpha_normal * x_middle);
            var X3 = x_middle + Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2)) );
            var Y3 = alpha_normal * (X3) + ordonne_origine_normal;

            var X4 = x_middle - Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2)) );
            var Y4 = alpha_normal * (X4) + ordonne_origine_normal;

            array.push({x:X1, y:Y1});
            array.push({x:X3, y:Y3});
            array.push({x:X2, y:Y2});
            array.push({x:X4, y:Y4});
            distance = distance - (fix_distance / _number);

        }
        return array;

    }
    /** 
     * Dessine un cercle pour debugger
     *
     * @param   {x}  abscisse
     * @param   {y}  ordonnée       
     * 
     */
    draw_circle(x, y){

        var material = new THREE.MeshBasicMaterial({
            color: 0x4286f4
        });

        var segments = 50 ;    
        var circleGeometry = new THREE.CircleGeometry(10, segments );
        var circle = new THREE.Mesh( circleGeometry, material );

        circle.scale.set(0.5,0.5, 1);
        circle.name = "circle" ;
        circle.position.set(x,y, 1)
        this.scene.add( circle );   
    }
    /**
     * Converts an HSL color value to RGB.
     * Assumes h, s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * @param   {number}  h       The hue
     * @param   {number}  s       The saturation
     * @param   {number}  l       The lightness
     * @return  {Array}           The RGB representation
     */
    hslToRgb(h, s, l){
        var r, g, b;

        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            var hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    /**
     * Converts a pourcentage to a gradient de couleur du vert au rouge
     * @param : pourcentage sur 100
     */
    getColor(percent){
        var r = percent<50 ? 255 : Math.floor(255-(percent*2-100)*255/100);
        var g = percent>50 ? 255 : Math.floor((percent*2)*255/100);
        //return 'rgb('+r+','+g+',0)';
        if (r < 0 ){ return new THREE.Vector3( 1,0,0 ) }
        return new THREE.Vector3( r/255.0, g/255.0,  0 )
    }
    /**
     * Permet de loader mes vertex shader a partir d'un fichier exterieur
     * @return : vertex shader plain text
     */
    load_vertex_shaders(){
        var self = this;
        $.ajax({
            async: false,
            url: 'shaders/vertex.js',
            success: function (data) {
                self.vertex_shader = data;
                //console.log("data", data)
            },
            dataType: 'html'
        });
        
    }
    /**
     * Permet de loader mes fragment shader a partir d'un fichier exterieur
     * @return : vertex shader plain text
     */
    load_fragment_shaders(){
        var self = this;
        $.ajax({
                async: false,
                url : "shaders/fragment.js",
                success: function (data) {
                self.fragment_shader = data;
            },
            dataType: 'html'
        });  
    }
    /**
     * Permet de récupérer le milieu entre deux points
     */
    get_middle(x1, y1, x2, y2)
    {

        var middle_X = ((x2 - x1)/2) + x1;
        var middle_Y = ((y2 - y1)/2) + y1;

        return {x:middle_X, y:middle_Y};
    }
    /* Get the distance between two points */
    get_distance(x1, y1, x2, y2){
        var a = x1 - x2
        var b = y1 - y2

        var c = Math.sqrt( a*a + b*b );
        //console.log(c)
        return c;
    }
    /* Get a framework for the mapping of the temporal and spatial */
    fit_temporal_distribution(link_id){
        //J'update car j'ai change la disposition de mes noeuds donc de mes liens egalement
        //this.updateLinks();
        var delay = 0;
        var iteration = (this.links[link_id].number_segmentation )/ this.links[link_id].number_particles;
        //console.log(iteration)
        for(var j=0 ; j<this.links[link_id].number_particles; j++){
            this.links[link_id].temporal_distribution[j] = delay;
            delay += iteration;
        }
            
        this.links[link_id].spatial_distribution[0] = this.links[link_id].number_particles;
    }
    /* Make a temporal and spatial repartition fitting with a STANDARD model */
    fit_all_temporal_distribution(){
        //J'update car j'udpate le nombre de particules et je dois trouver. 
        //this.updateLinks();
        for (var i = 0;i<this.links.length; i++){
            
            var delay = 0;
            var iteration = (this.links[i].number_segmentation)/ this.links[i].number_particles;
            //console.log(iteration)
            for(var j=0 ; j<this.links[i].number_particles; j++){
                this.links[i].temporal_distribution[j] = delay;
                delay += iteration;
            }
                
            this.links[i].spatial_distribution[0] = this.links[i].number_particles;
        }
    }
    fit_all_particles_to_frequence_temporal_distrib(){
        for(var i=0 ; i<this.links.length ; i++){
            console.log("FIT I", i)   
            this.fit_to_frequence_temporal_distrib(i);
        }
    }
    /**
     * Create a function to specify the number of particles, frequence of pattern, and temporal distribution per EDGES
     * Permet de faire une frequence en secondes
     * @param {Number} link_id 
     * @param {Number} speed 
     * @param {Number} between [0,100] frequence_patttern
     * @param {array} between [0,100] temporal_distribution
     */
    

    fit_to_frequence_temporal_distrib(id){
        
        //.slice();

        // Je recois une frequence exprimant quand j'envoi chaque pattern (exprimé en secondes)
        // J'ai 60 fps donc je multiplie par 60 pour avoir l'equivalent en frame
        var frequence_patttern = this.links[id].frequency_pattern;
        // console.log(frequence_patttern)
        var temporal_distribution = this.links[id].temporal_distribution2;
        var speed = 10//this.links[id].gate_velocity[0];
        frequence_patttern = this.FPS * frequence_patttern; 

        
        //Je multiplie par frequence pattern pour partir d'une echelle sur [O,1] en entrée vers [0,-frequence_patttern]
        //Négatif pour que ca parte vers l'arriere
        //Divise par speed pour que cela soit proportionnel si l'on change la vitesse
        var temporal_dis = [];
        for (var i = 0;i<temporal_distribution.length; i++){
            temporal_dis.push(temporal_distribution[i] * -frequence_patttern);
        }

        //Motifs = Je prend la plus grande partie d'un lien
        //Si mon lien fait 130, je prend le multiple le plus haut de frequence pattern (si=80, je prend 160)

        // MOTIFS +1 POUR AVOIR LA PLACE DE LE DECALER ET DE FAIRE DES ANIM AU DEBUT
        var offsetDueToBeginning = 0.11 * this.links[id].number_segmentation
        var motifs = Math.ceil((this.links[id].number_segmentation + offsetDueToBeginning)/frequence_patttern);
        // console.log("motifs", motifs)

        //console.log("MOTIFS", motifs, this.links[id].number_segmentation)
        this.links[id].number_particles = motifs * temporal_distribution.length;  

        // Motifs qui fitte en termes de une seconde pour un motif)
        this.links[id].number_segmentation_pattern_fitting = (motifs * frequence_patttern);

        // console.log("FITTING", this.links[id].number_segmentation_pattern_fitting)
        // console.log("REMOVE", 0.1 * this.links[id].number_segmentation)
        // console.log("NB SEG", this.links[id].number_segmentation)
        // console.log("NUMBER PARTICLES", motifs, this.links[id].number_segmentation, frequence_patttern, this.links[id].number_segmentation_pattern_fitting)
        // console.log("FREQUENCE PATTERN", frequence_patttern, speed)
        var total_for_pattern = 0;
        var id_particle = 0;
        var delay = 0;
        for(var k=1 ; k < motifs+1; k++){
            total_for_pattern = 0
            //J'ajoute frequence pattern a chaque nouveau pattern
            delay = frequence_patttern * (k - 1)

            for(var j=0 ; j<temporal_distribution.length; j++){
                //Pour chaque element du tableau donnée, j'ajoute frequence_pattern + le delay.
                this.links[id].temporal_distribution[id_particle] = (delay + temporal_dis[j]);
                // console.log()
                total_for_pattern += delay +temporal_dis[j];
                id_particle +=1;
            }
        }      
        // console.log("FIIIIIT", this.links[id]) 
        this.links[id].number_particles = this.links[id].temporal_distribution.length;

        // console.log("TEMPORAL", this.links[id].temporal_distribution, this.links[id].number_particles, motifs)
        // console.log("Fitting", this.links[id].number_segmentation_pattern_fitting,  this.links[id].number_segmentation)
        // console.log("VELOCITY", this.links[id].gate_velocity)
    }
    
    /* Get the maximum value of an attribute */
    get_max_of_attributes(attribute_name){
        var max_value = this.links[0].attr(attribute_name);
        for (var i = 1;i<this.links.length; i++){
            var attr_value = this.links[i].attr(attribute_name);
            if (attr_value > max_value){ max_value = attr_value;}
        }
        return max_value;
    }
        /* Get the minimum value of an attribute */
    get_min_of_attributes(attribute_name){
        var min_value = this.links[0].attr(attribute_name);
        for (var i = 1;i<this.links.length; i++){
            var attr_value = this.links[i].attr(attribute_name);
            if (attr_value < min_value){ min_value = attr_value;}
        }
        return min_value;
    }
    /***** Sert a updater la densite de particules sur un lien  *****/
    updateNumber_of_particles(i, coefficient){
        this.links[i].coefficient_number_particles = coefficient;
    }
    updateNode_color(i , color:THREE.Color ){
        //console.log(this.webGL_nodes[i])
        this.webGL_nodes[i].material.color = color;
        //this.webGL_nodes[i].scale.set(scale, scale, scale)   
    }
    updateNodes_color(color:THREE.Color){
        for(var i=0 ; i<this.nodes.length ; i++)
        { 
            this.webGL_nodes[i].material.color = color;
        }   
    }
    getNode_position(i){
        return this.webGL_nodes[i].position;
    }
    updateNode_position(i, x, y){
        var array_links = []
        this.webGL_nodes[i].position.set(x, y,3);
        for(var j=0 ; j<this.links.length ; j++)
        {   var l = this.links[j];
            if (l.source.id == i){l.source.x =x;l.source.y =y;array_links.push(j)}
            if (l.target.id == i){l.target.x =x;l.target.y =y;array_links.push(j)}
        } 
        return array_links;
    }
    updateNodes_scale(scale){
        for(var i=0 ; i<this.nodes.length ; i++)
        { 
            this.webGL_nodes[i].scale.set(scale, scale, scale)
        }   
    }
    updateNode_scale(i, scale){
        this.webGL_nodes[i].scale.set(scale, scale, scale)
    }
    set_tube_width(id, width){
        this.links[id].width_tube = width;
    }
    set_tube_color(id, color, opacity){
        // To fit with the format of material three.js
        color = color.replace("#", "0x")
        this.tube[id].children[0].material.color.setHex( color );
        this.tube[id].children[0].material.opacity = opacity;
    }
    set_All_labels_opacity(opacity){
        for(var i=0 ; i<this.webGL_label.length ; i++)
        {   
            
            this.webGL_label[i].material.opacity = opacity;
            // console.log(this.webGL_label[i], opacity)
        }
    }
    set_label_opacity(i, opacity){
        
        this.webGL_label[i].material.opacity = opacity;
        // console.log(this.webGL_label[i], opacity)
        
    }
    set_nodes_opacity(id, opacity){
        // To fit with the format of material three.js
        this.webGL_nodes[id].material.opacity = opacity;
    }
    set_All_nodes_opacity(opacity){
        for(var i=0 ; i<this.webGL_nodes.length ; i++)
        {
            this.webGL_nodes[i].material.opacity = opacity;
        }
    }
    set_All_tubes_opacity(opacity){
        for(var i=0 ; i<this.tube.length ; i++)
        {
            this.tube[i].children[0].material.opacity = opacity;
        }
    }
    set_tube_opacity(id, opacity){
        // To fit with the format of material three.js
        this.tube[id].children[0].material.opacity = opacity;
    }
    setTubesNormalOpacity(){
        for(var i=0 ; i<this.tube.length ; i++)
        {
            this.tube[i].children[0].material.opacity = this.links[i].tube_opacity;
        }
    }

    set_tubes_color(color){
        for(var i=0 ; i<this.links.length ; i++)
        {
            this.tube[i].children[0].material.color.setHex( color );
        }
    }
    set_tubes_width(width){
        for(var i=0 ; i<this.links.length ; i++)
        {
                this.links[i].width_tube = width;
        }
    }
    set_links_color(id,  opacity){
        for(var j=0 ; j<this.curveSplines[id].children.length ; j++)
        { 
            this.curveSplines[id].children[j].material.opacity = opacity;
        }
    }
    load_particle_texture(link_id,  value){
        this.links[link_id].texture = value;
    }
    bezier(t, p0, p1, p2, p3){
        var cX = 3 * (p1.x - p0.x),
            bX = 3 * (p2.x - p1.x) - cX,
            aX = p3.x - p0.x - cX - bX;
                
        var cY = 3 * (p1.y - p0.y),
            bY = 3 * (p2.y - p1.y) - cY,
            aY = p3.y - p0.y - cY - bY;
                
        var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
        var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;
                
        return {x: x, y: y};
    }
    get_nodes(){
        var array = [];
        for(var j=0 ; j<this.nodes.length ; j++)
        { 
            array.push({"x":this.nodes[j].x, "y":-this.nodes[j].y, "fixed": true})
        }
        return array;
        
    }
    get_links(){
        var array = [];
        for(var j=0 ; j<this.links.length ; j++)
        { 
            array.push({
                "id" : j, 
                "source":this.links[j].source.index, 
                "target" : this.links[j].target.index, 

                "frequencyParticule" : this.links[j].frequency_pattern, 
                "speedParticule" : this.links[j].gate_velocity,
                "sizeParticule" : this.links[j].size,  
                "colorParticule" : this.links[j].gate_colors,
                "transparencyParticule" : this.links[j].gate_opacity, 
                "wigglingParticule" : this.links[j].wiggling_gate,
                "temporal" : this.links[j].temporal_distribution2,

                "colorLink" : this.tube[j].children[0].material.color,
                "sizeLink" : this.links[j].width_tube,
                "opacityLink" : this.links[j].tube_opacity,
            })

                       

            //             this.links[i].gate_opacity = [];
            // this.links[i].size = [];
            // this.links[i].gate_position = [];
            // this.links[i].roads_opacity = 0;
            // this.links[i].roads_color = 1;
            // this.links[i].number_paths_particule = this.number_roads[i];
            // this.links[i].gate_colors = [];

            // this.links[i].courbure = 5;

            // this.links[i].texture = textureRectangle; 
            // this.links[i].number_particles = this.number_particles;
            // this.links[i].coefficient_number_particles = 1;
            // this.links[i].gates = [];
            // this.links[i].id = i;
            // this.links[i].frequency_pattern = 1.0;
            // this.links[i].temporal_distribution = [];
            // this.links[i].path_quadratic = [];
            // this.links[i].tube_opacity = 1;

        }
        //console.log("ARRAY", array)
        return array;
        
    }
    clockwiseSorting(input, basic) {
        var base = Math.atan2(input[basic][1], input[basic][0]);
        return input.sort(function(a, b) {
            return Math.atan2(b[1], b[0]) - Math.atan2(a[1], a[0]) + (Math.atan2(b[1], b[0]) > base ? - 2 * Math.PI : 0) + (Math.atan2(a[1], a[0]) > base ? 2 * Math.PI : 0);
        });
    };
}


