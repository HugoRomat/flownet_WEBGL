
import * as $ from 'jquery' 
import * as d3 from 'd3'
import * as THREE from 'three';

export class UI{
    UI_Canvas; 
    width_UI; 
    height_UI;
    sceneHUD;
    particleVis;
    mouse = {x:null, y:null};
    slider1 = null;
    slider2 = null;
    gate = null;
    mouse_raycaster; 

    temporary_object = null;
    panOffset = [0,0];
    mouseStart = [500,0];
    
    scene;
    renderer;
    raycaster;
    camera;
    state_machine;
    selected_object = [];
    div;
    callback;
    old_object;
    first_time = true;

    hasHilight = false;

    particles;

    constructor(visualisation, div, particles){
        // this.particleVis = particleVis;
        //this.state_machine = {state: "nothing"};
        this.state_machine = "hover";
        this.mouse_raycaster = {position :new THREE.Vector2() , beginning : false};
        this.div = div;
        this.scene = visualisation.scene; 
        this.camera = visualisation.camera;
        this.renderer = visualisation.renderer;
        this.raycaster = visualisation.raycaster;
        this.particles = particles;

        
        
        
        //this.get_top_bar_actions();

        //this.onclick_reduce_side_bar();
        this.mouse_event();
    }
    
    /* C"EST LA QUE J"EFFECTUE MON MOUVEMENT APRES SAVOIR CE QUI SE PASSE */
    update(){
        var self = this;
        if (self.state_machine == "drag" && self.temporary_object != undefined){
            if (self.temporary_object.name == "circle"){
                var pos = self.particleVis.getNode_position(self.temporary_object.userData.id);
                var x = pos.x + self.panOffset[0]/self.camera.zoom;
                var y = pos.y - self.panOffset[1]/self.camera.zoom;
                var link_id = self.particleVis.updateNode_position(self.temporary_object.userData.id,x,y);
                /* UPDATE TOUT LES TUBES */
                //self.ConfluentGraph.updateTube();
                /* UPDATE TOUS LES LINKS */
                //self.ConfluentGraph.updateLinks();
                /* UPDATE LE CHEMIN DES PARTICULES */
                //for (var i = 0; i< link_id.length; i++) {console.log(i);self.ConfluentGraph.updateParticles_Paths(link_id[i])}
                self.panOffset = [0,0];
            }
            
        }
        console.log()
        if (self.state_machine == "drag") {//&& self.temporary_object == undefined){
            //if (self.temporary_object == undefined){
                self.camera.position.x = self.camera.position.x - self.panOffset[0]/self.camera.zoom;
                self.camera.position.y = self.camera.position.y + self.panOffset[1]/self.camera.zoom;
                self.panOffset = [0,0];
                //self.callback_Pan();
            //}
        }
        else if (self.state_machine == "down" && self.temporary_object != undefined){
            if (self.temporary_object.userData.type == "country"){
                //console.log(self.temporary_object)

                if (self.old_object != undefined) self.old_object.material.color.set( 0xbdbdbd);
                self.callback(self.temporary_object);
                self.temporary_object.material.color.set( 0x000000 );
                self.old_object = self.temporary_object;
            }
            
        }
    }
    zoom(){}
    mouse_event(){
        var self = this;
        //self.mouse_raycaster.beginning == false;
        //var el = document.getElementById("visFrame");
        // console.log(self)
        // console.log("LAUNCH ZOOM")


        
       // window.addEventListener("mousewheel", mouseWheel, false);


       var canvas = document.getElementById(self.div.slice( 1 ));
        console.log("CANVAS", canvas)
        canvas.addEventListener("mousedown", mouseDown, false);
        // canvas.addEventListener("mouseup", mouseUp, false);
        // canvas.addEventListener("mousemove", mouseMove, false);
        // canvas.addEventListener("mousewheel", mouseWheel, false);


        //window.addEventListener('click', onMouseMove, false );
        //window.addEventListener('mousemove', onMouseMove, false );

        self.mouseStart = [500,0];
        var cameraStart = []
        
        var isMouseDown:boolean = false;
        
        
        function mouseDown(event){
            // event.preventDefault();
		    // event.stopPropagation();
            //console.log("HEIGHT", window.innerWidth);
            self.mouse.x = event.clientX;
            self.mouse.y = event.clientY;
            
            
            self.mouseStart = [event.clientX, event.clientY]
            //console.log(cameraStart, self.panOffset)

            self.state_machine = "down";
       
            //window.addEventListener("mouseup", mouseUp, false);
            // window.addEventListener("mousemove", mouseMove, false);
            // console.log(self.state_machine);
            // 
            self.mouse_raycaster.position.x = ( event.clientX / self.renderer.domElement.clientWidth ) * 2 - 1;
            self.mouse_raycaster.position.y = - ( event.clientY / self.renderer.domElement.clientHeight ) * 2 + 1;

            isMouseDown = true;
            // self.mouse_raycaster.beginning = false;
            self.temporary_object = self.get_intersections();
            //console.log( self.temporary_object)
            self.update()
        }
        // function mouseMove(event){
        //     // console.log(self.state_machine)
        //     //self.state_machine = "hover";
            
        //     if (self.state_machine == "down"){
        //         self.state_machine = "drag";
        //     }
        //     if (self.state_machine == "drag"){
        //         // event.preventDefault();
        //         // event.stopPropagation();
        //         self.panOffset = [event.clientX - self.mouseStart[0], event.clientY - self.mouseStart[1]]
        //         self.mouseStart = [event.clientX, event.clientY]
        //     }
        
        //     self.update()
        //     //self.mouse_raycaster.beginning = false;

            
        // }
        // function mouseUp(event){
        //     //console.log("HEY")
            
        //     if (self.state_machine == "drag"){
        //         self.state_machine = "drop";
        //         self.state_machine = "hover";
        //     }
        //     if (self.state_machine == "down"){
        //         self.state_machine = "hover";
        //     }
        //     self.update()
        //     //console.log(self.state_machine, self.temporary_object)
        // }
        // function mouseUp(event){
        //     console.log(self.temporary_object)
        //     self.temporary_object = null;
        //     isMouseDown = false;
        //     self.drag = false;
        //     console.log("UPP")
            
        // }
        // function mouseMove(event){
        //     //if(isMouseDown){
        //         panOffset = [event.clientX - mouseStart[0], event.clientY - mouseStart[1]]
        //         self.camera.position.x = cameraStart[0] - panOffset[0]/self.camera.zoom;
        //         self.camera.position.y = cameraStart[1] + panOffset[1]/self.camera.zoom;
        //         self.mouse_raycaster.beginning = false;
        //         //console.log("TOOO")
        //         //self.get_intersections();
        //         // render();    
        //     //}
        // }

        // function mouseWheel(event){
        //     //console.log("update")
        //     // event.preventDefault();
            
        //     // console.log(self.camera.zoom + event.wheelDelta/1000)
        //     if (self.camera.zoom + event.wheelDelta/1000 > 0.13){
        //         // self.camera.zoom += event.wheelDelta / 1000;
        //         // self.camera.verticesNeedUpdate = true;
        //         // var zoom = self.camera.position.z + ;
        //         // self.camera.translateZ( event.wheelDelta );
        //         self.camera.updateProjectionMatrix(); 

        //         // console.log(self.camera)
        //         // self.particles.updateProjectionMatrix(); 

        //         // console.log(self.particles)
        //         // self.particleVis.updateLabel_scale(self.camera.zoom);
        //     }
            
            
        //     //self.ConfluentGraph.updateParticles_Zoom(self.camera.projectionMatrix);
        //     //console.log(self.camera.zoom)
        //     //console.log(self.ConfluentGraph)
        //     // render();

        // }
        // function onMouseMove( event ) {
        //     //console.log("HEY")
        //     //if(event.clientX < window.innerWidth - 300){
        //     self.mouse_raycaster.beginning = false;
        //     event.preventDefault();
        //     self.mouse_raycaster.position.x = ( event.clientX / self.renderer.domElement.clientWidth ) * 2 - 1;
        //     self.mouse_raycaster.position.y = - ( event.clientY / self.renderer.domElement.clientHeight ) * 2 + 1;	

        //     if (isMouseDown == true){
        //         self.drag = true;
        //     }
        //     self.get_intersections();
            
        //    // }

        // }
    }
    setZoom(level){
        this.camera.zoom += level;
        this.camera.updateProjectionMatrix();
        this.particleVis.updateLabel_scale(this.camera.zoom);
    }
    get_intersections(){
        var self = this;
        // console.log(self.mouse_raycaster.beginning)
        var object;
        // if (self.mouse_raycaster.beginning == false){
           
            self.raycaster.setFromCamera( self.mouse_raycaster.position, self.camera );	
            //console.log(self.temporary_object)
            console.log(self.scene.children)
            var intersects = self.raycaster.intersectObjects( self.scene.children, true );
            console.log("RAYCASTING", intersects)
            if (intersects.length != 0){

                object = intersects[ 0 ].object;
                var type = object.parent.userData.type;
                var id = object.parent.userData.id;
                //console.log(object)

                switch(self.state_machine)
                {
                     case "click_infos":
                        if (type == "tube"  || type == "link"){
                            
                            self.update_graph(object.parent.userData.id);
                            //self.coloriate_tube(id);
                        }
                        break;
                    case "position_bar":
                        if (type == "tube"  || type == "link"){
                            var x = intersects[ 0 ].point.x;
                            var y = intersects[ 0 ].point.y;
                            var x1 = self.particleVis.links[id].source.x;
                            var y1 = self.particleVis.links[id].source.y;
                            var x2 = self.particleVis.links[id].target.x;
                            var y2 = self.particleVis.links[id].target.y;
                            var normal = self.get_normal_position(x,y, x1, y1, x2, y2, 5);
                            var segments = self.get_segments(normal[0].x,normal[0].y, x1, y1, x2, y2);
                            self.particleVis.create_gates( id, segments, normal[1].x,normal[1].y,normal[2].x,normal[2].y)
                            self.particleVis.updateParticles_Gates(id, segments);

                            //To update when we create a gate
                            if (self.gate != null ) { self.update_graph(object.parent.userData.id);}
                            //self.draw_circle(normal[0].x,normal[0].y);
                        }
                        //self.get_normal_position(x, y, x1, y1, x2, y2, distance)
                        break;
                    case "hover_tube":
                        if (type == "tube")
                        {
                            //console.log(object)
                            //self.coloriate_tube(id)
                            object.material.color.set( 0xE6E6E6 );
                            self.particleVis.links[id].width_tube = 5;
                            self.particleVis.updateTube();
                            
                        }
                    case "hoverNodes":
                            //console.log(object)
                            self.temporary_object = object;
                            
                            // if (self.drag == false) {

                            // }
                            //object.material.color.set( 0xE6E6E6 );
                        break;
                }
                
                
                
            }
            else{
                //DO NOTHING
                //_UI.delete_graph();
            }
            
        // }
        return object;
    }
    coloriate_tube(id){
        var self = this;

        var d = this.particleVis.tube[id];
        if (d.userData.id == id)
        {
            var e = d.children[0];
            if (self.selected_object != null){self.selected_object.material.color.set( 0xE6E6E6 );}
            self.selected_object = e;
            e.material.color.set( 0xff0000 );
        }
            

    }
    get_segments(x,y, x1, y1, x2, y2){

        var portionX = (x2 - x1) / 50;
        var X = x - x1;

        var result = Math.round(X / portionX);

        return result;
    }
    get_normal_position(x, y, x1, y1, x2, y2, distance){

            var array = [];
            var alpha = (y2-y1)/(x2-x1);

            var x_middle = x;
            var y_middle = y;

            var alpha = (y2 - y1) / (x2 - x1) ;
            var ordonne_origine = y2 - (alpha * x2);

            var alpha_normal = (x1 - x2) / (y2 - y1) ;
            var ordonne_origine_normal = y_middle - (alpha_normal * x_middle);

            var X = (ordonne_origine_normal - ordonne_origine) / (alpha - alpha_normal);
            var Y = alpha * X + ordonne_origine;
            array.push({x:X, y:Y});
 
            var X1 = X + Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2)) );
            var Y1 = alpha_normal * (X1) + ordonne_origine_normal;
            array.push({x:X1, y:Y1});

            var X2 = X - Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2)) );
            var Y2 = alpha_normal * (X2) + ordonne_origine_normal;
            array.push({x:X2, y:Y2});
            
            return array;

        }
        draw_circle(x, y){

            var material = new THREE.MeshBasicMaterial({
                color: 0xeeeeee
            });

            var segments = 50 ;    
            var circleGeometry = new THREE.CircleGeometry(0.5, segments );
            var circle = new THREE.Mesh( circleGeometry, material );

            circle.scale.set(1,1, 1);
            circle.name = "circle" ;
            circle.position.set(x,y, 1)
            this.scene.add( circle );   
        }
        update_graph(link_id){
    
        //$('#temporal_control').append("<hr>");
        //this.delete_UI();
        
        this.delete_graph();
        //d3.select('#sliderDiv').style("transform", "translate(0px, 0px)")
        //console.log(this.ConfluentGraph.links[link_id].spatial_distribution)

        // this.gate = new UIGate(this.particleVis, '#temporal_control', link_id);
    }
    delete_graph(){
        

        if (this.mouse.x < window.innerWidth - 300){
            d3.select("#temporal_control").selectAll("*").remove();
            d3.select("#general").selectAll("*").remove();
            //d3.select('#sliderDiv').style("transform", "translate(300px, 0px)")
        }

    }
    onclick_reduce_side_bar(){
        d3.select("#icon_reduce_bar")
            .on("click", function(){
                var active = d3.select(this).attr("active");

                if(active == "false"){
                    //Change the icon
                    d3.select(this).selectAll("*").remove();
                    d3.select(this).append("span").attr("class","fa fa-chevron-circle-left");
                    //Hide the slider bar
                    d3.select('#sliderDiv').style("transform", "translate(250px, 0px)")
                    d3.select(this).attr("active", "true");
                 }
                 else{
                    d3.select(this).selectAll("*").remove();
                    d3.select(this).append("span").attr("class","fa fa-chevron-circle-right");

                    d3.select('#sliderDiv').style("transform", "translate(0px, 0px)")
                    d3.select(this).attr("active", "false");
                 }
            })


    }


    get_top_bar_actions(){
        var self = this;
        $( "#bar_position" ).click(function() {
  	        self.state_machine.state = "position_bar";
            console.log("MODE ",self.state_machine.state);
            console.log(self.particleVis.links)
            //self.delete_slider();
        });
        $( "#mouse" ).click(function() {
  	        self.state_machine.state = "click_infos";
            console.log("MODE ",self.state_machine.state);
        });
        $( "#zoom_in" ).click(function() {
  	        // event.preventDefault();
            self.camera.zoom -= 0.1;
            self.camera.updateProjectionMatrix();
            // render();
        });
        $( "#zoom_out" ).click(function() {
  	        // event.preventDefault();
            self.camera.zoom += 0.1;
            self.camera.updateProjectionMatrix();
            // render();
        });
        
    }
    unhilightNeighborood(){
        if (this.hasHilight == true){
            this.particleVis.set_All_nodes_opacity(1);
            this.particleVis.setTubesNormalOpacity();
            this.particleVis.updateParticles_Opacity(1);
            this.particleVis.set_All_labels_opacity(1);

            //this.hasHilight = false;
        }
        this.hasHilight = false;
    }
    hilightNeighborood(node){
        this.hasHilight = true;
        // console.log(this.particleVis.nodes)
        this.particleVis.set_All_nodes_opacity(0.1);
        this.particleVis.set_All_tubes_opacity(0.05);
        this.particleVis.updateParticles_Opacity(0.1);
        this.particleVis.set_All_labels_opacity(0.1);

        for (var i = 0; i<this.particleVis.links.length; i++){
            var link = this.particleVis.links[i];
            var nodeSource = this.particleVis.links[i].source;
            var nodeTarget = this.particleVis.links[i].target;


            if (node.id == nodeSource.id || node.id == nodeTarget.id){
                // console.log(node.id , nodeSource.id, nodeTarget.id)
                this.particleVis.set_nodes_opacity(nodeSource.index, 1);
                this.particleVis.set_nodes_opacity(nodeTarget.index, 1);

                this.particleVis.set_tube_opacity(i, link.tube_opacity);
                this.particleVis.updateParticles_Gate_Opacity(i, 1)

                this.particleVis.set_label_opacity(nodeSource.index, 1);
                this.particleVis.set_label_opacity(nodeTarget.index, 1);
            }

        }
    }




        
}

