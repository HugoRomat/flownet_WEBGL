

class UI{
    UI_Canvas; 
    width_UI; 
    height_UI;
    sceneHUD;
    ConfluentGraph;
    mouse = {x:null, y:null};
    slider1 = null;
    slider2 = null;
    gate = null;
    mouse_raycaster; 

    scene;
    renderer;
    raycaster;
    camera;
    state_machine;
    selected_object = [];
    

    constructor(ConfluentGraph, scene,  camera, renderer, raycaster){
        this.ConfluentGraph = ConfluentGraph;
        this.state_machine = {state: "nothing"};
        this.mouse_raycaster = {position :new THREE.Vector2() , beginning : true};

        this.scene = scene; 
        this.camera = camera;
        this.renderer = renderer;
        this.raycaster = raycaster;

        //this.get_top_bar_actions();

        //this.onclick_reduce_side_bar();
        this.mouse_event();
    }
    update_graph(link_id){
    
        //$('#temporal_control').append("<hr>");
        //this.delete_UI();
        
        this.delete_graph();
        //d3.select('#sliderDiv').style("transform", "translate(0px, 0px)")
        //console.log(this.ConfluentGraph.links[link_id].spatial_distribution)
        this.gate = new UIGate(this.ConfluentGraph, '#temporal_control', link_id);
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
            console.log(self.ConfluentGraph.links)
            //self.delete_slider();
        });
        $( "#mouse" ).click(function() {
  	        self.state_machine.state = "click_infos";
            console.log("MODE ",self.state_machine.state);
        });
        $( "#zoom_in" ).click(function() {
  	        event.preventDefault();
            self.camera.zoom -= 0.1;
            self.camera.updateProjectionMatrix();
            // render();
        });
        $( "#zoom_out" ).click(function() {
  	        event.preventDefault();
            self.camera.zoom += 0.1;
            self.camera.updateProjectionMatrix();
            // render();
        });
        
    }
    mouse_event(){
        var self = this;
        //var el = document.getElementById("visFrame");
        // window.addEventListener("mousedown", mouseDown, false);
        // window.addEventListener("mouseup", mouseUp, false);
        //window.addEventListener("mousemove", mouseMove, false);

        
        // window.addEventListener("mousewheel", mouseWheel, false);

        //window.addEventListener('click', onMouseMove, false );
        //window.addEventListener('mousemove', onMouseMove, false );

        var mouseStart = [];
        var cameraStart = []
        var panOffset = [];
        var isMouseDown:boolean = false;
        

        function mouseDown(event){
            //console.log("HEIGHT", window.innerWidth);
            self.mouse.x = event.clientX;
            self.mouse.y = event.clientY;

            // if(event.clientY < 140)
            //     return;
            // if(event.clientX > window.innerWidth - 300)
            //     return;
            console.log(event.clientX);
            mouseStart= [event.clientX, event.clientY]
            cameraStart = [self.camera.position.x, self.camera.position.y];
            isMouseDown = true;
        }
        function mouseUp(event){
            isMouseDown = false;
        }
        function mouseMove(event){
            if(isMouseDown){
                panOffset = [event.clientX - mouseStart[0], event.clientY - mouseStart[1]]
                self.camera.position.x = cameraStart[0] - panOffset[0]/self.camera.zoom;
                self.camera.position.y = cameraStart[1] + panOffset[1]/self.camera.zoom;
                // render();    
            }
        }

        function mouseWheel(event){
            event.preventDefault();
            self.camera.zoom += event.wheelDelta/1000;
            self.camera.updateProjectionMatrix();

            self.ConfluentGraph.updateLabel_scale(self.camera.zoom);
            //self.ConfluentGraph.updateParticles_Zoom(self.camera.projectionMatrix);
            //console.log(self.camera.zoom)
            //console.log(self.ConfluentGraph)
            // render();

        }
        function onMouseMove( event ) {
            console.log("HEY")
            if(event.clientX < window.innerWidth - 300){
                self.mouse_raycaster.beginning = false;
                event.preventDefault();
                self.mouse_raycaster.position.x = ( event.clientX / self.renderer.domElement.clientWidth ) * 2 - 1;
                self.mouse_raycaster.position.y = - ( event.clientY / self.renderer.domElement.clientHeight ) * 2 + 1;	

                //self.get_intersections();
            }

        }
    }

    get_intersections(){
        var self = this;
        if (self.mouse_raycaster.beginning == false){
            self.raycaster.setFromCamera( self.mouse_raycaster.position, self.camera );	

            var intersects = self.raycaster.intersectObjects( self.scene.children, true );
            if (intersects.length != 0){

                var object = intersects[ 0 ].object;
                var type = object.parent.userData.type;
                var id = object.parent.userData.id;
                //console.log(object, type, id)

                switch(self.state_machine.state)
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
                            var x1 = self.ConfluentGraph.links[id].source.x;
                            var y1 = self.ConfluentGraph.links[id].source.y;
                            var x2 = self.ConfluentGraph.links[id].target.x;
                            var y2 = self.ConfluentGraph.links[id].target.y;
                            var normal = self.get_normal_position(x,y, x1, y1, x2, y2, 5);
                            var segments = self.get_segments(normal[0].x,normal[0].y, x1, y1, x2, y2);
                            self.ConfluentGraph.create_gates( id, segments, normal[1].x,normal[1].y,normal[2].x,normal[2].y)
                            self.ConfluentGraph.updateParticles_Gates(id, segments);

                            //To update when we create a gate
                            if (self.gate != null ) { self.update_graph(object.parent.userData.id);}
                            //self.draw_circle(normal[0].x,normal[0].y);
                        }
                        //self.get_normal_position(x, y, x1, y1, x2, y2, distance)
                        break;
                    case "hover_tube":
                        if (type == "tube")
                        {
                            console.log(object)
                            //self.coloriate_tube(id)
                            object.material.color.set( 0xE6E6E6 );
                            self.ConfluentGraph.links[id].width_tube = 5;
                            self.ConfluentGraph.updateTube();
                            
                        }
                        else { }
                        break;
                }
                
                
                
            }
            else{
                //DO NOTHING
                //_UI.delete_graph();
            }
            
        }
    }
    coloriate_tube(id){
        var self = this;

        var d = this.ConfluentGraph.tube[id];
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




        
}

