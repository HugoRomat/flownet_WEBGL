///<reference path="../utils/three.d.ts"/>
///<reference path="../utils/d3.d.ts"/>
///<reference path="../utils/topojson.d.ts"/>

///<reference path="../utils/networkcube.d.ts"/>

///<reference path="../colasrc/d3adaptor.ts"/>
///<reference path="../colasrc/layout.ts"/>
///<reference path="../colasrc/descent.ts"/>
///<reference path="../colasrc/powergraph.ts"/>
///<reference path="../colasrc/linklengths.ts"/>
///<reference path="../colasrc/vpsc.ts"/>
///<reference path="../colasrc/rectangle.ts"/>
///<reference path="../colasrc/shortestpaths.ts"/>
///<reference path="../colasrc/geom.ts"/>

module Sparkiz {



export class Sparkiz{
    links;
    nodes;
    camera;

    vertex_shader;
    fragment_shader;


    webGL_nodes = []
    webGL_label = []

    d3cola = cola.d3adaptor()
            .avoidOverlaps(false)
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
    number_paths_particule = 1; 

    number_max_gates = 10;
    roads_opacity = 1;
    roads_color = 0x0000FF;

    

    tube_width = 1;

    needUpdate = true;
    shader;

    FPS = 60;
    /*********** FOR PARTICLES *************/
    // temporal = Array.apply(null, Array(this.number_particles)).map(Number.prototype.valueOf,0);
    // velocity = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 1.0);
    // opacity = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf,1.0);
    // wiggling = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf,0.0);
    // size = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf,40.0);
    // gate_position = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // gate_colors = Array(this.gate_position.length).fill(new THREE.Vector3( 1.0, 1.0, 1.0 ));  
    

    constructor(nodes, links, interface_){

        this.links = links;
        this.nodes = nodes;
        this.scene = interface_.scene;
        this.camera = interface_.camera;
       
        this.load_vertex_shaders();
        this.load_fragment_shaders();

        //SI PROBLEME AVEC TEMPORAL IL FAUT AUGMENTER LE NOMBRE DANS LE TABLEAU
        //this.create();
        //  this.shader = new Shader();
        //  this.fragment_shader = this.shader.fragment;
        //  this.vertex_shader = this.shader.vertex
        //console.log(this.shader.fragment);


    }
    draw_map(projection){
        
        var array = []
        var self = this;
         d3.json("./data/us.json", function(error, us) {
            var us_counties = topojson.feature(us, us.objects.land);
            var land = us_counties.geometry.coordinates;
            for(var i=0 ; i<land.length ; i++)
            {   
               array = []
               for(var j=0 ; j<land[i].length ; j++)
                {   
                    var country = land[i][j];
                    for(var k=1 ; k<country.length - 1;k++)
                    {   
                        var x = country[k][0]
                        var y = country[k][1]
                        var coordinates =  projection([x,y]);
                        var vector = new THREE.Vector2(coordinates[0], - coordinates[1]);
                        array.push(vector)
                    }
                }
                var curve = new THREE.SplineCurve(array);
                var shape = new THREE.Shape(curve.getSpacedPoints( 150 ));
                var geometry = new THREE.ShapeGeometry( shape );
                var material = new THREE.MeshLambertMaterial( { color: 0x3498db, opacity: 0.1, transparent: true } );
                var mesh = new THREE.Mesh( geometry,  material );
                self.scene.add(mesh);
            }
        });

    }
    create(){
        //console.log(this.links)
        //console.log(this.links[0])
        

        this.d3cola.nodes(this.nodes);
        this.d3cola.links(this.links);


        this.d3cola.linkDistance(function (l) { return l.link_length; })
        //console.log(this.links)
        this.d3cola.start();
        // //console.log(this.links[0])
        // console.log("DEBUT")

        
        // // var projection = d3.geo.mercator()
        // //             .scale(900)
        // //this.draw_map(projection);

        
        
        // // Cree mes labels et noeuds a des places aleatoires
        this.createNodes();
        this.createTube();
        this.createLinks();
        
        
        //this.d3cola.linkDistance(function (l) { return l.link_length })
       
        

        

        
        //this.launch_network();

    }
    launch_network(time){
            //ADD SPINNER
            d3.select("#spinner").style("display","block");
            d3.select("#number_nodes").append("h1").text(this.links.length + " Links & "+this.nodes.length + " Nodes");

            window.setTimeout(()=>{  
                //Stop le layout 
                //console.log(this.nodes[0])
                this.d3cola.stop();
                //callback();
                //this.nodes[0].x = 10;
                //console.log(this.nodes[0])
                
                this.updateNodes();
                //this.updateLabel();
                this.createLabel();
                this.updateLinks();
                this.updateTube();

                //this.change_nodes_for_images();
                //this.updateLabel();
                this.fit_all_particles_to_frequence_temporal_distrib();
            
                this.createParticle();
                d3.select("#spinner").style("display","none");
                this.needUpdate = false;
                console.log(this.nodes);
                console.log(this.links);
                console.log(this.scene);
                

                

            }, time)

            console.log("FINISH UPDATE")
        }
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
            // this.links[id].temporal_distribution[_number] = [];
            // this.links[id].temporal_distribution[_number][0] = this.links[id].userData.number_particles;
            // this.links[id].temporal_distribution[_number][1] = 0;
            this.links[id].gates.push({object:line, position:segment})
            
            var array = this.links[id].gate_infos;
            array.splice(array.length - 1, 0, {factor:1, position:segment});
            //console.log(array)
            this.scene.add(line);
        }
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
            loader.load( 'helvetiker_bold.typeface.json', function ( font ) {
                //console.log(self.nodes[i].label)
                var mesh = new THREE.Font();
                for(var i=0 ; i<self.nodes.length ; i++)
                {
                    if (self.nodes[i].label_name != null){
                        //console.log("YOO", self.nodes[i].label_name)
                        var textGeo = new THREE.TextGeometry( self.nodes[i].label_name, {
                            font: font,
                            size: self.nodes[i].label_size,
                            height: 5,
                            curveSegments: 12,
                            bevelThickness: 1,
                            bevelSize: 5,
                            bevelEnabled: false
                        })
                        var textMaterial = new THREE.MeshBasicMaterial({ color: self.nodes[i].label_color});
                        var mesh = new THREE.Mesh( textGeo, textMaterial );
                        //self.webGL_label.push(mesh);
                        mesh.position.set( 0,0,1);
                        mesh.position.x = self.nodes[i].x + self.nodes[i].label_x;
                        mesh.position.y = self.nodes[i].y + self.nodes[i].label_y;;
                        mesh.name = "label" ;
                        console.log("CREATE")
                        self.scene.add( mesh );
                    }
                }
			});
        }
        createNodes(){
            // NODES
            var n;
            //console.log(this.scene)
            //for(var i=0 ; i<this.webGL_nodes.length ; i++){
            //    this.scene.remove(this.webGL_nodes[i]);
            //}
            this.webGL_nodes = [];
            //console.log('webGL_nodes', this.webGL_nodes.length)
            for(var i=0 ; i<this.nodes.length ; i++)
            {
                //JE MET UN PX ET PY CAR LE LAYOUT TOURNE CONSTAMENT DONC EMPECHE MES NODES DE SE METTRE A JOUR
                this.nodes[i].label_name = null;
                this.nodes[i].label_size = 6;
                this.nodes[i].label_x = 0;
                this.nodes[i].label_y = 0;
                this.nodes[i].label_color = 0xff0000;
                // this.nodes[i].px = null;
                // this.nodes[i].py = null;

                var material = new THREE.MeshBasicMaterial({
                    //color: 0x0000ff,
                    transparent:true
                });
                // instantiate a loader
                var segments = 64 ;
                var circleGeometry = new THREE.CircleGeometry(1, segments );
                
                var circle = new THREE.Mesh( circleGeometry, material );
                this.webGL_nodes.push(circle);
                circle.scale.set(1,1, 1);
                circle.position.set(10,10, 1);
                circle.name = "circle" ;
                circle.userData = { id: i, type: "node" };
                this.scene.add( circle );

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
            for(var i=0 ; i<self.nodes.length ; i++)
            {   
                if (self.nodes[i].px != null){self.nodes[i].x = self.nodes[i].px;}
                if (self.nodes[i].py != null){self.nodes[i].y = self.nodes[i].py;}
                self.webGL_nodes[i].position.set(self.nodes[i].x,self.nodes[i].y,1)
            }
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
            //console.log("Update", this.tube)
            //console.log(this.curveSplines.length)
            for(var i=0 ; i<this.tube.length ; i++)
            {
                //console.log(i)
                path[0] = {x:this.links[i].source.x, y:this.links[i].source.y}
                path[1] = {x:this.links[i].target.x, y:this.links[i].target.y}
                //var number_segmentation = this.links[i]
                var x1 = path[0].x;
                var y1 = path[0].y;
                var x2 = path[1].x;
                var y2 = path[1].y;

                var object = this.tube[i].children[0];
                //console.log("HEY")
                var position = this.get_normal_position_border(x1, y1, x2, y2, this.links[i].width_tube, 1);

                /*********** 1er SEGMENT ********************************/
                var curve = new THREE.SplineCurve([
                        new THREE.Vector2(position[0].x, position[0].y),
                        new THREE.Vector2(position[2].x, position[2].y)
                ]);
                /*********** 2 SEGMENT ********************************/
                var middle_point = this.get_middle_position_normal(position[2].x, position[2].y,position[3].x, position[3].y, i)
                var point1 = new THREE.Vector2(middle_point.x1, middle_point.y1);
                var point2 = new THREE.Vector2(middle_point.x2, middle_point.y2);
                var quadratic_path1 = [];
                var pas = 1.0 /  this.links[i].number_segmentation;
                for (var k=0; k<1; k+=0.01){
                    quadratic_path1.push(this.bezier(k, position[2],point1, point2,position[3]));
                }
                  
                /*********** 3 SEGMENT ********************************/
                var curve3 = new THREE.SplineCurve([
                        new THREE.Vector2(position[3].x, position[3].y),
                        new THREE.Vector2(position[1].x, position[1].y)        
                ]);
                /*********** 4 SEGMENT ********************************/
                var middle_point = this.get_middle_position_normal(position[0].x, position[0].y,position[1].x, position[1].y, i)
                var point1 = new THREE.Vector2(middle_point.x1, middle_point.y1);
                var point2 = new THREE.Vector2(middle_point.x2, middle_point.y2);
                var quadratic_path2 = [];
                for (var k=0; k<1; k+=0.01){
                    quadratic_path2.push(this.bezier(k, position[0],point1, point2,position[1]));
                }
                quadratic_path2 = quadratic_path2.reverse();
                var curve_result = curve.getSpacedPoints( 50 ).concat(quadratic_path1).concat(curve3.getSpacedPoints( 50 )).concat(quadratic_path2) ;
                if(curve_result.length>2100){alert("DOit updater la taille du tableau contenant les vertices dans tube")}
                // for (var k=0; k<curve_result.length; k+=1){
                //     this.draw_circle(curve_result[k].x, curve_result[k].y);
                // }   

                var shape = new THREE.Shape(curve_result);
                var geometry2 = new THREE.ShapeGeometry( shape );
                
                for (var a in geometry2.vertices) {
                    this.tube[i].children[0].geometry.vertices[a].x = geometry2.vertices[a].x;
                    this.tube[i].children[0].geometry.vertices[a].y = geometry2.vertices[a].y;
                }
                this.tube[i].children[0].geometry.faces = geometry2.faces;
                this.tube[i].children[0].geometry.computeBoundingSphere();
                this.tube[i].children[0].geometry.verticesNeedUpdate=true;

                this.tube[i].children[0].geometry.elementsNeedUpdate = true;
                this.tube[i].children[0].geometry.morphTargetsNeedUpdate = true;
                this.tube[i].children[0].geometry.uvsNeedUpdate = true;
                this.tube[i].children[0].geometry.normalsNeedUpdate = true;
                this.tube[i].children[0].geometry.colorsNeedUpdate = true;
                this.tube[i].children[0].geometry.tangentsNeedUpdate = true;

                object.geometry.verticesNeedUpdate = true; 
                object.geometry.__dirtyVertices = true;
                object.geometry.dynamic = true;
                    
                //}
            }
            //console.log(scene);

        }
        createTube(){
            var path = [];
            var geometry, p;
            var splineObject;
            var size;
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
                var curve = new THREE.SplineCurve([
                        new THREE.Vector2(position[0].x, position[0].y),
                        new THREE.Vector2(position[2].x, position[2].y)        
                 ]);
                 var curve2 = new THREE.SplineCurve([
                        new THREE.Vector2(position[2].x, position[2].y),
                        new THREE.Vector2(position[3].x, position[3].y)        
                 ]);
                 var curve3 = new THREE.SplineCurve([
                        new THREE.Vector2(position[3].x, position[3].y),
                        new THREE.Vector2(position[1].x, position[1].y)        
                 ]);
                 var curve4 = new THREE.SplineCurve([
                        new THREE.Vector2(position[1].x, position[1].y),
                        new THREE.Vector2(position[0].x, position[0].y)        
                 ]);

                 var curve_result = curve.getSpacedPoints( 50 ).concat(curve2.getSpacedPoints( 100 )).concat(curve3.getSpacedPoints( 50 )).concat(curve4.getSpacedPoints( 100 )) ;
                 //console.log("1", this.links.length);           
                 
                 //console.log(curve_result)
                 var shape = new THREE.Shape(curve_result);
                
                //ICI BUG
                 geometry = new THREE.ShapeGeometry( shape );
                 //console.log(2)
                 //console.log("3");
                 var material = new THREE.MeshBasicMaterial( { color: 0x3498db, opacity: 1, transparent: true } );
                 material.opacity = 1;
                 
                 
                //var mesh = THREE.SceneUtils.createMultiMaterialObject( geometry, [ material] );
                var mesh = new THREE.Mesh( geometry,  material );
  
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
                this.links[i].opacity = [];
                this.links[i].wiggling = [];
                this.links[i].size = [];
                this.links[i].gate_position = [];

                this.links[i].gate_colors = [];

                this.links[i].texture = "images/rectangle_texture.png"; 
                this.links[i].number_particles = this.number_particles;
                this.links[i].coefficient_number_particles = 1;
                this.links[i].gates = [];
                this.links[i].id = i;
                this.links[i].frequency_pattern = 1.0;
                this.links[i].temporal_distribution = [];
                this.links[i].path_quadratic = [];

                this.links[i].name = "links";
                
                this.links[i].width_tube = this.tube_width;
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
                var position = this.get_normal_position_border(x1, y1, x2, y2, this.links[i].width_tube, this.number_paths_particule);

                /*****************FOR THE MIDDLE LINE  **************/
                // create curves
                var points = []
                var curve = new THREE.SplineCurve([
                    new THREE.Vector2(this.links[i].source.x, this.links[i].source.y),
                    new THREE.Vector2(this.links[i].target.x, this.links[i].target.y),
                    ]);
                this.links[i].spatial_distribution[0] = 0;
                var curveSplineMaterial = new THREE.LineBasicMaterial( { 
                    color : this.roads_color,
                    linewidth:  1,
                    opacity: this.roads_opacity, 
                    transparent: true
                });

                p = new THREE.Path( curve.getSpacedPoints( this.links[i].number_segmentation ) );
                geometry = p.createPointsGeometry( this.links[i].number_segmentation );
                splineObject = new THREE.Line( geometry, curveSplineMaterial );
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
                        color : this.roads_color,
                        linewidth:  1.8,
                        opacity: this.roads_opacity, 
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
                this.curveSplines.push(multi_line)
                this.links[i].userData = { id: this.links[i]._id , number_particles :0};
                

                this.links[i].temporal_distribution = Array.apply(null, Array(this.number_particles)).map(Number.prototype.valueOf,0);
                //this.links[i].velocity = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 1.0);
                this.links[i].opacity = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf,1.0);
                this.links[i].wiggling = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf,0.0);
                this.links[i].size = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf,40.0);
                this.links[i].gate_position = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                this.links[i].gate_velocity = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
                this.links[i].gate_colors = Array(this.links[i].gate_position).fill(new THREE.Vector3( 1.0, 1.0, 1.0 )); 
                
                for (var j = 0; j< this.number_max_gates;j++){
                    this.links[i].gate_colors.push(new THREE.Vector3( 1.0, 1.0, 1.0 ))
                } 

                this.scene.add(multi_line);               
            }
        }
        updateLinks(){
                
            var path = [];
            //console.log(this.curveSplines.length)
            for(var i=0 ; i<this.links.length ; i+=1)
            {
                
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
                var curveSplineMaterial = new THREE.LineBasicMaterial( { color : this.roads_color,linewidth:  1,opacity: this.roads_opacity, transparent: true});
                var p = new THREE.Path( quadratic_path);//curve.getSpacedPoints( this.links[i].number_segmentation) );
                var geometry = p.createPointsGeometry( 50 );
                object.material = curveSplineMaterial; 
                object.geometry.vertices = geometry.vertices;
                object.geometry.verticesNeedUpdate = true;

                /************************* POUR LES GATES  ****************************************/
                /******** AFIN QUE LA DERNIERE PORTE CORRESPONDE AU NOEUD FINAL  ******************/
                for(var f = 1; f < this.links[i].gate_position.length - 1 ; f++){
                    this.links[i].gate_position[f] = Math.ceil((this.links[i].number_segmentation/ 9) * f) //this.links[i].gate_position = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                }
                this.links[i].gate_position[10] = this.links[i].number_segmentation + Math.ceil(this.links[i].number_segmentation/ 9);
                

                /***** POUR LES LIENS EXTERIEURS */
                var position = this.get_normal_position_border(x1, y1, x2, y2, this.links[i].width_tube, this.number_paths_particule);
                for(var j=0 , f = 1; j < position.length - 1; j+=2, f++)
                {
                    var object = this.curveSplines[i].children[f];
                    //console.log(object.geometry.vertices)
                    var points = []
                    var middle_point = this.get_middle_position_normal(position[j].x, position[j].y,position[j+1].x, position[j+1].y, i)
                    var array = [new THREE.Vector2(position[j].x, position[j].y),
                        new THREE.Vector2(middle_point.x1, middle_point.y1),
                        new THREE.Vector2(middle_point.x2, middle_point.y2),
                        new THREE.Vector2(position[j+1].x, position[j+1].y)];
                    this.links[i].path_quadratic[f]= array;
                    var quadratic_path = [];
                    var pas = 1.0 / (object.geometry.vertices.length - 1);
                    //console.log("PAS", pas , object.geometry.vertices.length)
                    for (var k=0; k<1; k+=pas){
                        quadratic_path.push(this.bezier(k, array[0],array[1], array[2], array[3]));
                    }
                    quadratic_path.push(new THREE.Vector3(array[3].x, array[3].y, 1));
                    var curveSplineMaterial = new THREE.LineBasicMaterial( { color : this.roads_color,linewidth:  1,opacity: this.roads_opacity, transparent: true});
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
                    var position = this.get_normal_position(this.links[link_id].source.x, this.links[link_id].source.y,this.links[link_id].target.x, this.links[link_id].target.y, array_gates[j].position, this.links[link_id].width_tube * array_gates[j].factor, this.number_paths_particule)
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
            uniforms.texture.value = new THREE.TextureLoader().load( "images/" + value) 
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
            uniforms.wiggling.value[gate] = value;
            console.log("WIGGLING",uniforms.wiggling.value)
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
        updateParticles_Opacity(link_id, gate, value){

            var number_particles = this.links[link_id].userData.number_particles
            var uniforms = this.links[link_id].particleSystems.material.__webglShader.uniforms;
            uniforms.opacity.value[gate] = value;
            console.log("OPACITY",uniforms.opacity.value)
        }
        updateParticles_Size(link_id, gate, value){

            var number_particles = this.links[link_id].userData.number_particles
            var uniforms = this.links[link_id].particleSystems.material.__webglShader.uniforms;
            uniforms.size.value[gate] = value;
            console.log("SIZE",uniforms.size.value)
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
        
        updateParticles_TemporalDistribution3(){
            for ( var j = 0; j < this.links.length; j ++ ){
            var number_particles = this.links[j].userData.number_particles
            var uniforms = this.links[j].particleSystems.material.__webglShader.uniforms;

                for ( var i = 0; i < this.links[j].temporal_distribution.length; i ++ ){
                    uniforms.temporal_delay.value[i] = this.links[j].temporal_distribution[i];
                }
            }
        }
        // Pour updater avec des valeurs
        updateParticles_TemporalDistribution(temporal_distribution, link, number_values){
        
            var number_particles = this.links[link].userData.number_particles
            var uniforms = this.links[link].particleSystems.material.__webglShader.uniforms;

                for ( var i = 0; i < temporal_distribution.length; i ++ ){
                    uniforms.temporal_delay.value[i] = Math.floor( - temporal_distribution[i]);
                }
        }
        updateParticles_TemporalDistribution2(temporal_distribution, link, number_values){
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

        }
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
        //UPdate la position de la porte
        updateParticles_Gates(id_link, gate){

            var uniforms = this.links[id_link].particleSystems.material.__webglShader.uniforms;
            var indice = 0;
            for ( var j = 1;  j < uniforms.gate_position.value.length; j ++ ){
                if (uniforms.gate_position.value[j] == 0){
                    uniforms.gate_position.value[j] = gate;
                    break;
                }
            }
            
            console.log("GATE",uniforms.gate_position)
            console.log("Temporal",uniforms.temporal_delay)

        }
        /************* J'UPDATE LE TEMPS **********/
        updateParticle(number_frame){
            var numParticles; 
            var my_frame = 0;

            //console.log(this.links[3].particleSystems.material.__webglShader.uniforms.temporal_delay);
        
            for ( var j = 0;  j < this.links.length; j ++ ){
                
                if (this.links[j].particleSystems.length != 0 && this.links[j].particleSystems.material.__webglShader != undefined){

                    var uniforms = this.links[j].particleSystems.material.__webglShader.uniforms;
                    uniforms.uTime.value = number_frame;
                    
                    
                }
            }
            
        }
        createParticles_webgl(particles, link_id){
            console.log("CREATE PARTICLES", particles, link_id)
            var self = this;
            //console.log(this.links,particles, link_id)


            var temporal = this.links[link_id].temporal_distribution;
            var gate_velocity = this.links[link_id].gate_velocity;
            var opacity = this.links[link_id].opacity;
            var wiggling = this.links[link_id].wiggling;
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
            //console.log("GATE POSITION", gate_position)
            //console.log(path_quadratic)
            // for (var i = 0; i< path_quadratic.length; i++){
            //     this.draw_circle(path_quadratic[i].x,path_quadratic[i][1])
            //     console.log(path_quadratic[i].x,path_quadratic[i][1])
            // }
                            
            //console.log(path_quadratic)
            /************** INITIAIZATION OF PARAMETER *************/
            //var temporal = Array.apply(null, Array(particles)).map(Number.prototype.valueOf,0);
            //var velocity = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 1.0);
            //var opacity = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf,1.0);
            //var wiggling = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf,0.0);
            
            //var size = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf,40.0);
            //var gate_position = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            // var gate_colors = [];

            // for (var i = 0; i< gate_position.length; i++){
            //     gate_colors.push(new THREE.Vector3( 1.0, 1.0, 1.0 ))
            // }
            
            //temporal = [5,10,15,20,25,30,35,40]

            //console.log("YOOOOO", self.camera)
            //console.log(this.links[link_id].curvePath[11], this.links[link_id].curvePath[0])
            //console.log(path_quadratic)

            var texture = new THREE.TextureLoader().load( this.links[link_id].texture );
            texture.minFilter = THREE.LinearMipMapLinearFilter;
			texture.magFilter = THREE.LinearFilter;
            
            console.log("GATE POSITION", gate_position);
            var number = 0;
            var posistion_gate_after_speed = [];

            /*************** PERMET DE DETERMINER LA NOUVELLE POSITION DES GATES POUR PRENDRE EN COMPTE LA VITESSE *************/
            var gap_two_gates = parseInt(gate_position[1] - gate_position[0]);
            for (var i =0; i<gate_position.length; i ++){
                posistion_gate_after_speed.push(number);
                number = number + parseInt(gap_two_gates / (gate_velocity[i]));
            }
            posistion_gate_after_speed[posistion_gate_after_speed.length - 1] = gate_position[gate_position.length - 1];
            posistion_gate_after_speed[posistion_gate_after_speed.length - 2] = gate_position[gate_position.length - 2];

            console.log("gate_velocity", gate_velocity);
            console.log("posistion_gate_after_speed", posistion_gate_after_speed);
            
            //console.log(number_segmentation_pattern_fitting)
            var uniforms = {
                "path_quadratic" :  { type: "v2v", value: path_quadratic },
                "temporal_delay" : { type: "iv1", value: temporal },
                "gate_velocity" : { type: "iv1", value: gate_velocity },
                "size" : { type: "fv1", value: size },
                "opacity" : { type: "fv1", value: opacity },
                "wiggling" : { type: "fv1", value: wiggling },
                "gap_two_gates" : { type: "iv1", value: gap_two_gates },
                "gate_position" : { type: "iv1", value: posistion_gate_after_speed },
                "gate_colors" : { type: "v3v", value: gate_colors },
                "particles_number" : { type: "iv1", value: particles },  
                "number_segmentation" : { type: "iv1", value: number_segmentation },  
                "number_segmentation_pattern_fitting" : { type: "iv1", value: number_segmentation_pattern_fitting },  
                         


				//color: { value: new THREE.Color( 0xffffff ) },
                uTime: { type: "f", value: 1.0 },
                time: { value: 1.0 },
				delta: { value: 0.0 },
                //zoom: { type: "f", value : self.camera.zoom},
                "ProjectionMatrix": { type: "m4", value: self.camera.projectionMatrix },
				texture: { value: texture, name:this.links[link_id].texture }

			};
            
            var path_length = ((2 * this.number_paths_particule) +1) * 4;

            //console.log(this.links[link_id].temporal_distribution)
			var shaderMaterial = new THREE.ShaderMaterial( {

				uniforms:       uniforms,
				vertexShader:   '#define path_length '+ path_length + 
                '\n' + '#define real_number_particles '+ this.links[link_id].temporal_distribution.length + 
                '\n' + self.vertex_shader,

				fragmentShader: self.fragment_shader,

				//blending:       THREE.AdditiveBlending,
				//depthTest:      false,
				transparent:    true

			});
            
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
                //console.log(i)
                /* Position des textures de particules */
                positions[ i3 + 0 ] = 0* radius;
				positions[ i3 + 1 ] = 0* radius;
				positions[ i3 + 2 ] = 0* radius;


                colors[ i3 + 0 ] = 1; //this.hslToRgb(1,1,0.5)[0];
				colors[ i3 + 1 ] = 1; //this.hslToRgb(1,1,0.5)[1];
				colors[ i3 + 2 ] = 0; //this.hslToRgb(1 ,1,0.5)[2];

				my_velocity[ i ] = 1.0;

                iterations[i] = 0.0;

                //Id de la particule, Sert à mettre du delay
                id_particle[i] = i

                //Sert a localiser la particule sur le faisceau
                //Ne sert a rien dans ce cas la.
                //id[i] = this.links[link_id].spatial_distribution[i];
                
                /* DANS LE CAS OU ON VEUT DEFINIR LE NOMBRE DIRECTEMENT SUR CHAQUE EDGE */
                //console.log(spatial[i])
                id[i] = spatial[i]

                //console.log(this.links[link_id].spatial_distribution)
                //console.log(this.array_SpatialDistribution(this.links[link_id].spatial_distribution, i))
                //console.log(id[i])
                //console.log(i%12);

			}
            //console.log(id_particle)

			geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
            //geometry.addAttribute( 'radius', new THREE.BufferAttribute( radius, 1 ) );
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

            //console.log("NUMBER_PARTICLES0", particles)
            //console.log("particle created");
            //console.log(this.particleSystems)
            return this.particleSystems;   
        }
        delete_entity_by_type(tag_data){
            for(var i=0 ; i<this.scene.children.length ; i++){
                var object = this.scene.children[i];
                if (object.userData.type == tag_data){this.scene.remove(object);}
            }
        }
        /* PPOUR LE RAYON DE COURBURE : COURBE DE BEZIER */
        get_middle_position_normal(x1, y1, x2, y2, link_id){
            
            var segmentation = this.links[link_id].number_segmentation;
            var divide = Math.round(segmentation/3);
            var euclidean_distance = Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2 - y1,2));
            //console.log(euclidean_distance)
            var distance = euclidean_distance/this.courbure;
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

            var x_middle = (((x2-x1)/segmentation)*divide*2) + x1;
            var y_middle = (((y2-y1)/segmentation)*divide*2) + y1;
            var alpha_normal = (x1 - x2) / (y2 - y1) ;
            var ordonne_origine_normal = y_middle - (alpha_normal * x_middle);
            var X2 = x_middle + (signe * Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2))));
            var Y2 = alpha_normal * (X2) + ordonne_origine_normal;
            
            
            return {x1:X1,y1:Y1, x2:X2,y2:Y2 };
        }
        get_normal_position(x1, y1, x2, y2, gate, distance, _number){
        /**
         * Recupere la position normale du milieu d'un segment
         *
         * @param   {number}  distance       distance between a point and the line
         * @param   {number}  _number       number of points in my array 
         * 
         * @return  {Array}           Position of the normal point
         */
            var fix_distance = distance;

            var array = [];
            var alpha = (y2-y1)/(x2-x1);
            
            var x_middle = (((x2-x1)/50)*gate) + x1;
            var y_middle = (((y2-y1)/50)*gate) + y1;
            //this.draw_circle(x_middle, y_middle)

            var alpha_normal = (x1 - x2) / (y2 - y1) ;
            var ordonne_origine_normal = y_middle - (alpha_normal * x_middle);

            for(var i=0 ; i< _number ; i++){
                
                var X1 = x_middle + Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2)) );
                var Y1 = alpha_normal * (X1) + ordonne_origine_normal;
                array.push({x:X1, y:Y1});

                var X2 = x_middle - Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2)) );
                var Y2 = alpha_normal * (X2) + ordonne_origine_normal;
                array.push({x:X2, y:Y2});

                distance = distance - (fix_distance / this.number_paths_particule);
                //console.log(distance)
            }
            return array;

        }
        get_normal_position_border(x1, y1, x2, y2, distance, _number){
        /**
         * Recupere la position normale du milieu d'un segment
         *
         * @param   {number}  distance       distance between a point and the line
         * @param   {number}  _number       number of points in my array 
         * 
         * @return  {Array}           Position of the normal point
         */
            var fix_distance = distance;

            var array = [];
            var alpha = (y2-y1)/(x2-x1);
            var alpha_normal = (x1 - x2) / (y2 - y1);

            for(var i=0 ; i< _number ; i++){
                
                var x_middle = x1;
                var y_middle = y1;
                var ordonne_origine_normal = y_middle - (alpha_normal * x_middle);
                var X1 = x_middle + Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2)) );
                var Y1 = alpha_normal * (X1) + ordonne_origine_normal;
                //this.draw_circle(X1, Y1);
                var X2 = x_middle - Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2)) );
                var Y2 = alpha_normal * (X2) + ordonne_origine_normal;
                //this.draw_circle(X2, Y2);

                var x_middle = x2;
                var y_middle = y2;
                var alpha_normal = (x1 - x2) / (y2 - y1);
                var ordonne_origine_normal = y_middle - (alpha_normal * x_middle);
                var X3 = x_middle + Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2)) );
                var Y3 = alpha_normal * (X3) + ordonne_origine_normal;
                //this.draw_circle(X3, Y3);
                var X4 = x_middle - Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2)) );
                var Y4 = alpha_normal * (X4) + ordonne_origine_normal;
                //this.draw_circle(X4, Y4);
                
                array.push({x:X1, y:Y1});
                array.push({x:X3, y:Y3});
                array.push({x:X2, y:Y2});
                array.push({x:X4, y:Y4});

                //console.log("YOO", distance, fix_distance, (fix_distance *2 )/ ((this.number_paths_particule*2)-1));
                distance = distance - ((fix_distance *2 )/ ((this.number_paths_particule*2)-1));
                //distance = distance - 1.80;
                //distance = distance - ((fix_distance )/ (this.number_paths_particule));
                
            }

            //console.log(array)
            return array;

        }
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
         * @parameter : pourcentage sur 100
         */
        getColor(percent){
            var r = percent<50 ? 255 : Math.floor(255-(percent*2-100)*255/100);
            var g = percent>50 ? 255 : Math.floor((percent*2)*255/100);
            //return 'rgb('+r+','+g+',0)';
            if (r < 0 ){ return new THREE.Vector3( 1,0,0 ) }
            return new THREE.Vector3( r/255.0, g/255.0,  0 )
        }
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
        /* Get the middle of a segment */
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
                //console.log("FIT I", i)   
                this.fit_to_frequence_temporal_distrib(i);
            }
        }
        /**
         * Create a function to specify the number of particles, frequence of pattern, and temporal distribution
         * @param {Number} link_id 
         * @param {Number} speed 
         * @param {Number} between [0,100] frequence_patttern
         * @param {array} between [0,100] temporal_distribution
         */
        
        fit_to_frequence_temporal_distrib(id){
            
            //console.log("SEGMENTATION", this.links[id].number_segmentation)
            // temporal_distribution = [0, 0.5, 0.7];
            // Je recois une frequence exprimant quand j'envoi chaque pattern (exprimé en secondes)
            // J'ai 60 fps donc je multiplie par 60 pour avoir l'equivalent en frame
            var frequence_patttern = this.links[id].frequency_pattern;
            var temporal_distribution = this.links[id].temporal_distribution2;
            var speed = this.links[id].gate_velocity[0];
            frequence_patttern = this.FPS * frequence_patttern; 

            //console.log(frequence_patttern, temporal_distribution);

            //console.log(frequence_patttern, temporal_distribution)

            //Je multiplie par frequence pattern pour partir d'une echelle sur [O,1] en entrée vers [0,-frequence_patttern]
            //Négatif pour que ca parte vers l'arriere
            //Divise par speed pour que cela soit proportionnel si l'on change la vitesse
            var temporal_dis = [];
            for (var i = 0;i<temporal_distribution.length; i++){
                temporal_dis.push(temporal_distribution[i] * -frequence_patttern / speed);
            }
            //console.log("TEMPORAL DIS", temporal_dis)
            //Motifs = Je prend la plus grande partie d'un lien
            //Si mon lien fait 130, je prend le multiple le plus haut de frequence pattern (si=80, je prend 160)
            var motifs = Math.ceil(this.links[id].number_segmentation/frequence_patttern)
            //console.log("motifs",  motifs)
            //console.log("temporal distrib",  this.links[id].temporal_distribution2)
            this.links[id].number_particles = motifs * temporal_distribution.length;
            
            this.links[id].number_segmentation_pattern_fitting = motifs*frequence_patttern;
            //console.log("pattern_fitting", this.links[id].number_segmentation_pattern_fitting)
            //console.log()
            //console.log(this.links[id].number_particles,this.links[id].number_segmentation,  this.links[id].number_segmentation_pattern_fitting)
            

            var total_for_pattern = 0;
            var id_particle = 0;
            var delay = 0;
            for(var k=1 ; k < motifs+1; k++){
                total_for_pattern = 0
                //J'ajoute frequence pattern a chaque nouveau pattern
                delay = -frequence_patttern * (k - 1)
                //console.log(delay)
                //console.log(temporal_distribution)
                for(var j=0 ; j<temporal_distribution.length; j++){
                    //Pour chaque element du tableau donnée, j'ajoute frequence_pattern + le delay.
                    this.links[id].temporal_distribution[id_particle] = delay + temporal_dis[j];

                    //console.log(delay + temporal_dis[j])
                    //console.log(this.links[id].temporal_distribution[id_particle])
                    total_for_pattern += delay +temporal_dis[j];
                    id_particle +=1;
                }
            }       
            
            //Le nombre de particule sur quelle edge  
            //console.log(this.links[id].spatial_distribution)        
            //this.links[id].spatial_distribution[0] = this.links[id].number_particles ;
            //this.links[id].spatial_distribution[1] = this.links[id].number_particles/2;
            //console.log("TEMPORAL", id, this.links[id].temporal_distribution)
            this.links[id].number_particles = this.links[id].temporal_distribution.length;

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
            this.webGL_nodes[i].position.set(x, y,1);
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
                array.push({"id" : j, 
                            "source":this.links[j].source.index, 
                            "target" : this.links[j].target.index, 
                            "frequency" : this.links[j].frequency_pattern, 
                            "speed" : this.links[j].speed, 
                            "temporal" : this.links[j].temporal_distribution2,
                            "rank":[]})

            }
            //console.log("ARRAY", array)
            return array;
            
        }


    }
}
