
module Sparkiz {



        export function force(div, width, height, color, alpha){
            return new Force(div, width, height, color, alpha);
        }
        export class Force{

            viz;
            sparkiz;

            constructor(div, width, height, color, alpha){
                this.viz = new Main(div,null, null, width, height, color, alpha);
                this.sparkiz = this.viz.sparkiz;
                return this;
            }
            nodes(nodes) {
                console.log(this)
                this.sparkiz.nodes = nodes;
                return this;
            }
            links(links) {
                this.sparkiz.links = links;
                for(var i=0 ; i<this.sparkiz.links.length ; i++) this.sparkiz.links[i].link_length = 90;
                return this;
            }
            create() {
                this.sparkiz.create();
                return this;
            }
            start(time) {
                this.sparkiz.launch_network(time);
                //this.viz.animate();
                this.viz.with_absolute_time();
                return this;
            }
            network(visual_attr, amount){
               
            }
            controls(bool) {
                if (bool == true) this.viz.add_controls_anim();
                return this;
            }
            zoom(bool) {
                if (bool == true) this.viz._UI.mouse_event();
                return this;
            }
            particle_mapping(visual_attr, callback){
                var value;
                /************************** COLOR FOR GATES  *************************/
                if (visual_attr.slice(0, 6) == 'color_'){
                    var gates_id = visual_attr.slice(6)               
                    for(var i=0 ; i<this.sparkiz.links.length ; i++){
                        if ( typeof(arguments[1]) == 'string'){value = new THREE.Color(arguments[1]);}
                        else{var a = callback(this.sparkiz.links[i], i);
                            value = new THREE.Color(a);}
                        this.sparkiz.links[i].gate_colors[gates_id] = value;
                    }
                    return this;
                }
                /************************** SIZE FOR GATES  *************************/
                if (visual_attr.slice(0, 5) == 'size_'){
                    var gates_id = visual_attr.slice(5)               
                    for(var i=0 ; i<this.sparkiz.links.length ; i++){
                        if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                        else{var a = callback(this.sparkiz.links[i], i);}
                        this.sparkiz.links[i].size[gates_id] = value;
                    }
                    return this;
                }
                /********************** VELOCITY FOR GATES  **************************/
                if (visual_attr.slice(0, 9) == 'velocity_'){
                    console.log("VELOCITY")
                    var gates_id = visual_attr.slice(9);               
                    for(var i=0 ; i<this.sparkiz.links.length ; i++){
                        if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                        else{var a = callback(this.sparkiz.links[i], i);}
                        this.sparkiz.links[i].gate_velocity[gates_id] = value;
                    }
                    return this;
                }

                switch(visual_attr) {
                    
                    case "color":
                        for(var i=0 ; i<this.sparkiz.links.length ; i++){
                            if ( typeof(arguments[1]) == 'string'){value = new THREE.Color(arguments[1]);}
                            else{var a = callback(this.sparkiz.links[i], i);
                                value = new THREE.Color(a);}
                            for(var k=0 ; k<10 ; k++) this.sparkiz.links[i].gate_colors[k] = value;
                        }
                        return this;
                    case "size":
                        for(var i=0 ; i<this.sparkiz.links.length ; i++){
                            if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                            else{value = callback(this.sparkiz.links[i], i);}
                            for(var k=0 ; k<10 ; k++) this.sparkiz.links[i].size[k] = value;
                        }
                        return this;
                    case "temporal_distribution":
                        for(var i=0 ; i<this.sparkiz.links.length ; i++){
                            if (arguments[1] instanceof Array){value = arguments[1];}
                            else{value = callback(this.sparkiz.links[i], i);}
                            this.sparkiz.links[i].temporal_distribution2 = value;
                        }
                        return this;
                    case "spatial_distribution":
                        for(var i=0 ; i<this.sparkiz.links.length ; i++){
                            if (arguments[1] instanceof Array){value = arguments[1];}
                            else{value = callback(this.sparkiz.links[i], i);}
                            this.sparkiz.links[i].spatial_distribution = value;
                            console.log(value);
                        }
                        return this;
                    case "frequency_pattern":
                        for(var i=0 ; i<this.sparkiz.links.length ; i++){
                            if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                            else{ value = callback(this.sparkiz.links[i], i);}
                            this.sparkiz.links[i].frequency_pattern = value;//value;
                        }
                        return this;
                    case "velocity":
                        for(var i=0 ; i<this.sparkiz.links.length ; i++){
                            if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                            else{value = callback(this.sparkiz.links[i], i);}
                            for(var k=0 ; k<10 ; k++)this.sparkiz.links[i].gate_velocity[k] = value;
                        }
                        return this;
                    case "wiggling":
                        for(var i=0 ; i<this.sparkiz.links.length ; i++){
                            if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                            else{value = callback(this.sparkiz.links[i], i);}
                            this.sparkiz.links[i].wiggling[0]  = value;
                        }
                        return this;
                    case "texture":
                        for(var i=0 ; i<this.sparkiz.links.length ; i++){
                            if ( typeof(arguments[1]) == 'string'){value = arguments[1];}
                            else{value = callback(this.sparkiz.links[i], i);}
                            this.sparkiz.load_particle_texture(i,  value);
                        }
                        return this;
                    
                    
                }
            }
            
            roads_mapping(visual_attr, callback){
                var value;
                switch(visual_attr) {
                    case "opacity":
                        for(var i=0 ; i<this.sparkiz.links.length ; i++){
                            if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                            else{value = callback(this.sparkiz.links[i], i);}
                            this.sparkiz.roads_opacity = value;
                            //console.log("OPACITY", value)
                        }

                        return this;
                    case "color":
                        for(var i=0 ; i<this.sparkiz.links.length ; i++){
                            if ( typeof(arguments[1]) == 'string'){value = new THREE.Color(arguments[1]);}
                            else{
                                var a = callback(this.sparkiz.links[i], i);
                                value = new THREE.Color(a);
                            }
                            this.sparkiz.roads_color = value;
                            //console.log("OPACITY", value)
                        }
                        
                        return this;
                }
            }
            links_mapping(visual_attr, callback){
                var value;
                switch(visual_attr) {
                    case "color":
                        for(var i=0 ; i<this.sparkiz.links.length ; i++){
                            if ( typeof(arguments[1]) == 'string'){value = new THREE.Color(arguments[1]);}
                            else{
                                var a = callback(this.sparkiz.links[i], i);
                                value = new THREE.Color(a);
                            }
                            this.sparkiz.tube[i].children[0].material.color.setHex(value.getHex());
                        }
                        return this;
                    case "size":
                        for(var i=0 ; i<this.sparkiz.links.length ; i++){
                            if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                            else{var value = callback(this.sparkiz.links[i], i);}
                            this.sparkiz.set_tube_width(i, value);
                        }
                        return this;
                    
                    
                }
            }
            layout(visual_attr, callback){
                var value;
                switch(visual_attr) {
                    case "linkDistance":
                        for(var i=0 ; i<this.sparkiz.links.length ; i++){
                            if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                            else{var value = callback(this.sparkiz.links[i], i);}
                            this.sparkiz.links[i].link_length = value;
                        }
                        return this;
                }
            }
            nodes_mapping(visual_attr, callback){
                var value;
                switch(visual_attr) {
                    case "color":
                        for(var i=0 ; i<this.sparkiz.nodes.length ; i++){
                            var color;
                            if ( typeof(arguments[1]) == 'string'){color = new THREE.Color(arguments[1]);}
                            else{
                                var a = callback(this.sparkiz.nodes[i], i);
                                color = new THREE.Color(a);
                            }
                            this.sparkiz.webGL_nodes[i].material.color = color;
                            //console.log("COLOR NODE", color)
                        }
                        
                        return this;
                    case "size":
                        for(var i=0 ; i<this.sparkiz.nodes.length ; i++){
                            if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                            else{value = callback(this.sparkiz.nodes[i], i);}
                            this.sparkiz.webGL_nodes[i].scale.set(value, value, value)
                        }
                        return this;
                    case "label":
                        for(var i=0 ; i<this.sparkiz.nodes.length ; i++){
                            if ( typeof(arguments[1]) == 'string'){value = arguments[1];}
                            else{value = callback(this.sparkiz.nodes[i], i);}
                            this.sparkiz.nodes[i].label_name = value;
                        }
                        return this;
                    case "label_size":
                        for(var i=0 ; i<this.sparkiz.nodes.length ; i++){
                            if ( typeof(arguments[1]) == 'number' || typeof(arguments[1]) == 'string'){value = parseFloat(arguments[1]);}
                            else{value = parseFloat(callback(this.sparkiz.nodes[i], i));}
                            this.sparkiz.nodes[i].label_size = value;
                        }
                        return this;
                    case "label_x":
                        for(var i=0 ; i<this.sparkiz.nodes.length ; i++){
                            if ( typeof(arguments[1]) == 'number' || typeof(arguments[1]) == 'string'){value = parseFloat(arguments[1]);}
                            else{value = parseFloat(callback(this.sparkiz.nodes[i], i));}
                            this.sparkiz.nodes[i].label_x = value;
                        }
                        return this;
                    case "label_y":
                        for(var i=0 ; i<this.sparkiz.nodes.length ; i++){
                            if ( typeof(arguments[1]) == 'number' || typeof(arguments[1]) == 'string'){value = parseFloat(arguments[1]);}
                            else{value = parseFloat(callback(this.sparkiz.nodes[i], i));}
                            this.sparkiz.nodes[i].label_y = value;
                        }
                        return this;
                    case "label_color":
                        for(var i=0 ; i<this.sparkiz.nodes.length ; i++){
                            var color;
                            if ( typeof(arguments[1]) == 'string'){color = new THREE.Color(arguments[1]);}
                            else{var a = callback(this.sparkiz.nodes[i], i);
                                color = new THREE.Color(a);}
                            this.sparkiz.nodes[i].label_color = color;
                        }
                        return this;
                    case "x":
                        for(var i=0 ; i<this.sparkiz.nodes.length ; i++){
                            if ( typeof(arguments[1]) == 'number' || typeof(arguments[1]) == 'string'){value = parseFloat(arguments[1]);}
                            else{value = parseFloat(callback(this.sparkiz.nodes[i], i));}
                            this.sparkiz.d3cola.stop();
                            this.sparkiz.nodes[i].x = value;
                            console.log("VALUE", value)
                        }
                        return this;
                   case "y":
                        //console.log("CHANGE VALUE")
                        for(var i=0 ; i<this.sparkiz.nodes.length ; i++){
                            if ( typeof(arguments[1]) == 'number' || typeof(arguments[1]) == 'string'){value = parseFloat(arguments[1]);}
                            else{value = parseFloat(callback(this.sparkiz.nodes[i], i));}
                            this.sparkiz.d3cola.stop();
                            this.sparkiz.nodes[i].y = value;
                        }
                        return this;
                    case "image":
                        //console.log("CHANGE VALUE")
                        for(var i=0 ; i<this.sparkiz.nodes.length ; i++){
                            if (typeof(arguments[1]) == 'string'){value = arguments[1];}
                            else{value = callback(this.sparkiz.nodes[i], i);}
                            this.sparkiz.load_texture_nodes(i, value);
                        }
                        return this;
                    
                    
                }
            }
        }
        

    
    /*export module layout {

        var graph; 

        export function force() {
            graph = new Main("#visFrame",null, null, 900, 900, "#a6cee3");
        }
        export function nodes(nodes) {
            graph.nodes = nodes;
        }
        export function links(links) {
            graph.links = links;
        }
        export function start() {
            graph.sparkiz.create();
        }

        
        
    }*/
    export class Shader{

        fragment;
        vertex;

        constructor(){
            this.set_fragment();
        }
               
        set_fragment()     {
            this.fragment="";
            this.fragment += "uniform sampler2D texture;";
            this.fragment += "    ";
            this.fragment += "varying float distance_with_arrival;";
            this.fragment += "varying float distance_with_departure;";
            this.fragment += "varying float my_opacity;";
            this.fragment += "varying vec3 vColor;";
            this.fragment += "varying float vRotation;";
            this.fragment += "varying float sprite_size;";
            this.fragment += "";
            this.fragment += "mat2 rotation(float x) {";
            this.fragment += "vec2 line_1 = vec2(cos(x), -sin(x));";
            this.fragment += "vec2 line_2 = vec2(sin(x), cos(x));";
            this.fragment += "";
            this.fragment += "return mat2(line_1,line_2); ";
            this.fragment += "}";
            this.fragment += "mat2 translation(float x, float y) {";
            this.fragment += "vec2 line_1 = vec2(1.0,x);";
            this.fragment += "vec2 line_2 = vec2(1.0,y);";
            this.fragment += "";
            this.fragment += "return mat2(line_1,line_2); ";
            this.fragment += "}";
            this.fragment += "mat2 changerEchelle(float sx, float sy) {";
            this.fragment += "vec2 line_1 = vec2(sx, 0.0);";
            this.fragment += "vec2 line_2 = vec2(0.0, sy);";
            this.fragment += "";
            this.fragment += "return mat2(line_1,line_2); ";
            this.fragment += "}";
            this.fragment += "void main() {";
            this.fragment += "float mid = 0.5;";
            this.fragment += "mat2 my_matrix = rotation(vRotation) ;";
            this.fragment += "vec2 rotated =  my_matrix * vec2(gl_PointCoord.x - mid, gl_PointCoord.y - mid) ;";
            this.fragment += "rotated.x = rotated.x + mid;";
            this.fragment += "rotated.y = rotated.y + mid;";
            this.fragment += "vec4 color = vec4(1.0,1.0,1.0, 1.0);";
            this.fragment += "vec2 new_coord =  my_matrix * gl_PointCoord;";
            this.fragment += "if (distance_with_arrival < (sprite_size \/ 2.0) * 1.0){";
            this.fragment += "";
            this.fragment += "if ( rotated.x > (distance_with_arrival \/ sprite_size)+0.5){color = vec4(1.0,1.0,1.0, 0.0);}";
            this.fragment += "}";
            this.fragment += "";
            this.fragment += "if (distance_with_departure < (sprite_size \/ 2.0) * 1.0){";
            this.fragment += "if ( rotated.x < 0.5-(distance_with_departure \/ sprite_size)){color = vec4(1.0,1.0,1.0, 0.0);}";
            this.fragment += "}";
            this.fragment += "vec4 rotatedTexture = texture2D( texture,  rotated) * color;";
            this.fragment += "gl_FragColor = vec4( vColor, my_opacity ) * rotatedTexture;";
            this.fragment += "";
            this.fragment += "}";


            this.vertex="";
            this.vertex += "";
            this.vertex += "";
            this.vertex += "";
            this.vertex += "uniform float time;";
            this.vertex += "uniform float uTime;";
            this.vertex += "";
            this.vertex += "varying float size_fadding;";
            this.vertex += "";
            this.vertex += "attribute float id;";
            this.vertex += "";
            this.vertex += "";
            this.vertex += "attribute float id_particle;";
            this.vertex += "attribute vec3 customColor;";
            this.vertex += "";
            this.vertex += "attribute float iteration;";
            this.vertex += "";
            this.vertex += "uniform int particles_number;";
            this.vertex += "";
            this.vertex += "";
            this.vertex += "uniform mat4 ProjectionMatrix;";
            this.vertex += "";
            this.vertex += "uniform int number_segmentation;";
            this.vertex += "";
            this.vertex += "varying float sprite_size;";
            this.vertex += "";
            this.vertex += "";
            this.vertex += "";
            this.vertex += "uniform vec2 path_quadratic[path_length];";
            this.vertex += "";
            this.vertex += "uniform int gate_position[10];";
            this.vertex += "uniform int temporal_delay[real_number_particles];";
            this.vertex += "uniform int varyingData;";
            this.vertex += "";
            this.vertex += "uniform vec3 gate_colors[10];";
            this.vertex += "";
            this.vertex += "uniform float velocity[10];";
            this.vertex += "uniform float size[10];";
            this.vertex += "uniform float opacity[10];";
            this.vertex += "uniform float wiggling[10];";
            this.vertex += "uniform int number_segmentation_pattern_fitting;";
            this.vertex += "";
            this.vertex += "varying vec3 vColor;";
            this.vertex += "varying float my_opacity;";
            this.vertex += "varying float distance_with_arrival;";
            this.vertex += "varying float distance_with_departure;";
            this.vertex += "float actual_velocity;";
            this.vertex += "";
            this.vertex += "varying float vRotation;";
            this.vertex += "int gate = 0;";
            this.vertex += "";
            this.vertex += "int MOD(int a, int b){";
            this.vertex += "";
            this.vertex += "int result = a \/ b;";
            this.vertex += "result = b * result;";
            this.vertex += "result = a - result;";
            this.vertex += "return result;";
            this.vertex += "}";
            this.vertex += "float rand(vec2 co){";
            this.vertex += "return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);";
            this.vertex += "}";
            this.vertex += "float distance(float x1, float y1, float x2, float y2){";
            this.vertex += "";
            this.vertex += "float longueur = sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));";
            this.vertex += "return longueur;";
            this.vertex += "}";
            this.vertex += "float fadeSize(float actualSize, float nextSize, int steps, int index){ ";
            this.vertex += "";
            this.vertex += "float temporarySize = ((nextSize - actualSize)\/ float(steps)) * float(index);";
            this.vertex += "return actualSize + temporarySize;";
            this.vertex += "";
            this.vertex += "}";
            this.vertex += "vec3 fadeRGB(vec3 oldColor, vec3 newColor, int steps, int index){";
            this.vertex += "";
            this.vertex += "vec3 my_color;";
            this.vertex += "float redStepAmount = ((newColor.x - oldColor.x) \/ float(steps)) * float(index);";
            this.vertex += "float greenStepAmount = ((newColor.y - oldColor.y) \/ float(steps)) * float(index);";
            this.vertex += "float blueStepAmount = ((newColor.z - oldColor.z) \/ float(steps)) * float(index);";
            this.vertex += "";
            this.vertex += "newColor.x = oldColor.x + redStepAmount;";
            this.vertex += "newColor.y = oldColor.y + greenStepAmount;";
            this.vertex += "newColor.z = oldColor.z + blueStepAmount;";
            this.vertex += "";
            this.vertex += "my_color = vec3(newColor.x ,newColor.y, newColor.z);";
            this.vertex += "";
            this.vertex += "return my_color;";
            this.vertex += "";
            this.vertex += "}";
            this.vertex += "float noise(vec2 p){";
            this.vertex += "vec2 ip = floor(p);";
            this.vertex += "vec2 u = fract(p);";
            this.vertex += "u = u*u*(3.0-2.0*u);";
            this.vertex += "";
            this.vertex += "float res = mix(";
            this.vertex += "mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),";
            this.vertex += "mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);";
            this.vertex += "return res*res;";
            this.vertex += "}";
            this.vertex += "vec2 bezier(int t,  vec2 p0,vec2 p1,vec2 p2,vec2 p3){";
            this.vertex += "";
            this.vertex += "highp float timer = float(t);";
            this.vertex += "";
            this.vertex += "highp float time = timer * 1.0\/(float(number_segmentation));";
            this.vertex += "";
            this.vertex += "float cX = 3.0 * (p1.x - p0.x);";
            this.vertex += "float bX = 3.0 * (p2.x - p1.x) - cX;";
            this.vertex += "float aX = p3.x - p0.x - cX - bX;";
            this.vertex += "";
            this.vertex += "float cY = 3.0 * (p1.y - p0.y);";
            this.vertex += "float bY = 3.0 * (p2.y - p1.y) - cY;";
            this.vertex += "float aY = p3.y - p0.y - cY - bY;";
            this.vertex += "";
            this.vertex += "float x = (aX * pow(time, 3.0)) + (bX * pow(time, 2.0)) + (cX * time) + p0.x;";
            this.vertex += "float y = (aY * pow(time, 3.0)) + (bY * pow(time, 2.0)) + (cY * time) + p0.y;";
            this.vertex += "";
            this.vertex += "vec2 result = vec2( x,y );";
            this.vertex += "";
            this.vertex += "return result;";
            this.vertex += "}";
            this.vertex += "mat4 rotation(float x) {";
            this.vertex += "vec4 line_1 = vec4(cos(x), -sin(x), 0.0, 0.0);";
            this.vertex += "vec4 line_2 = vec4(sin(x), cos(x), 0.0, 0.0);";
            this.vertex += "vec4 line_3 = vec4(0.0, 0.0, 1.0, 0.0);";
            this.vertex += "vec4 line_4 = vec4(0.0, 0.0, 0.0, 1.0);";
            this.vertex += "return mat4(line_1,line_2,line_3,line_4);";
            this.vertex += "}";
            this.vertex += "mat4 translation(float x, float y) {";
            this.vertex += "vec4 line_1 = vec4(1.0, 0.0, 0.0,  x);";
            this.vertex += "vec4 line_2 = vec4(0.0, 1.0, 0.0,  y);";
            this.vertex += "vec4 line_3 = vec4(0.0, 0.0, 1.0, 0.0);";
            this.vertex += "vec4 line_4 = vec4(0.0, 0.0, 0.0, 1.0);";
            this.vertex += "return mat4(line_1,line_2,line_3,line_4);";
            this.vertex += "}";
            this.vertex += "mat4 changerEchelle(float sx, float sy) {";
            this.vertex += "vec4 line_1 = vec4(sx, 0.0, 0.0, 0.0);";
            this.vertex += "vec4 line_2 = vec4(0.0, sy, 0.0, 0.0);";
            this.vertex += "vec4 line_3 = vec4(0.0, 0.0, 1.0, 0.0);";
            this.vertex += "vec4 line_4 = vec4(0.0, 0.0, 0.0, 1.0);";
            this.vertex += "return mat4(line_1,line_2,line_3,line_4);";
            this.vertex += "}";
            this.vertex += "void main() {";
            this.vertex += "";
            this.vertex += "vColor = customColor;";
            this.vertex += "vec3 newPosition = position;";
            this.vertex += "vec4 mvPosition;";
            this.vertex += "float ANGLE = 90.0;";
            this.vertex += "highp int id_faisceaux = int(id_particle);";
            this.vertex += "actual_velocity = velocity[0];";
            this.vertex += "float timer =  uTime;";
            this.vertex += "highp int my_time = int(timer);";
            this.vertex += "highp int velo = int(actual_velocity);";
            this.vertex += "my_time = my_time + temporal_delay[id_faisceaux];";
            this.vertex += "int index_old = MOD(my_time , number_segmentation_pattern_fitting);";
            this.vertex += "";
            this.vertex += "float virtual_index = float(index_old);";
            this.vertex += "virtual_index = virtual_index * actual_velocity;";
            this.vertex += "highp int index = int(virtual_index);";
            this.vertex += "";
            this.vertex += "";
            this.vertex += "";
            this.vertex += "";
            this.vertex += "";
            this.vertex += "";
            this.vertex += "";
            this.vertex += "float random = 0.0;";
            this.vertex += "";
            this.vertex += "vec4 path;";
            this.vertex += "vec4 path_next;";
            this.vertex += "";
            this.vertex += "highp int path_id = int(id) * (4);";
            this.vertex += "";
            this.vertex += "path = vec4( bezier(index, path_quadratic[path_id],path_quadratic[path_id+ 1],path_quadratic[path_id + 2],path_quadratic[path_id+3]), 1.0,1.0);";
            this.vertex += "path_next = vec4( bezier(index +1, path_quadratic[path_id],path_quadratic[path_id+ 1],path_quadratic[path_id + 2],path_quadratic[path_id+3]), 1.0,1.0);";
            this.vertex += "";
            this.vertex += "distance_with_arrival = distance(path.x, path.y, path_quadratic[path_id+3].x, path_quadratic[path_id+3].y);";
            this.vertex += "distance_with_departure = distance(path.x, path.y, path_quadratic[path_id].x, path_quadratic[path_id].y);";
            this.vertex += "";
            this.vertex += "float angle = atan(path_next.y - path.y, path_next.x - path.x );";
            this.vertex += "vRotation =  - angle;";
            this.vertex += "";
            this.vertex += "";
            this.vertex += "";
            this.vertex += "mat4 my_matrice =  translation(path.x + random,path.y+ random);";
            this.vertex += "";
            this.vertex += "vec4 positionEchelle = vec4(0.0,0.0,1.0,1.0) * my_matrice;";
            this.vertex += "";
            this.vertex += "";
            this.vertex += "mvPosition =  modelViewMatrix * positionEchelle;";
            this.vertex += "";
            this.vertex += "int index_thorique = index;";
            this.vertex += "";
            this.vertex += "for(int i = 0; i < 9; i++){";
            this.vertex += "if(index_thorique <= gate_position[i+1] && index_thorique > gate_position[i]){";
            this.vertex += "gate = i;";
            this.vertex += "}";
            this.vertex += "";
            this.vertex += "if(index_thorique >= gate_position[i+1] && index_thorique >= gate_position[i] &&";
            this.vertex += "gate_position[i+1] == 0 && gate_position[i] != 0){";
            this.vertex += "gate = i;";
            this.vertex += "}";
            this.vertex += "}";
            this.vertex += "";
            this.vertex += "vColor = vec3(gate_colors[gate].x ,gate_colors[gate].y, gate_colors[gate].z);";
            this.vertex += "vec3 vColorNext = vec3(gate_colors[gate+1].x ,gate_colors[gate+1].y, gate_colors[gate+1].z);";
            this.vertex += "size_fadding = size[gate];";
            this.vertex += "";
            this.vertex += "vColor = fadeRGB(vColor, vColorNext, gate_position[gate+1] - gate_position[gate], index_thorique - gate_position[gate]);";
            this.vertex += "size_fadding = fadeSize(size[gate], size[gate+1], gate_position[gate+1] - gate_position[gate], index_thorique - gate_position[gate]);";
            this.vertex += "";
            this.vertex += "my_opacity = opacity[gate];";
            this.vertex += "if (index >= number_segmentation  || index <= 0){my_opacity = 0.0;}";
            this.vertex += "";
            this.vertex += "gl_PointSize = size_fadding;";
            this.vertex += "sprite_size = gl_PointSize;";
            this.vertex += "";
            this.vertex += "gl_Position = projectionMatrix * mvPosition;";
            this.vertex += "";
            this.vertex += "";
            this.vertex += "}";
            this.vertex += "";


	

            



            

        }
    

    }


}