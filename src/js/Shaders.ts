
import * as THREE from 'three';
import {Main} from './Main'





// console.log("HEYY", cypher)

export function force(div, width, height, color, alpha){
    return new Force(div, width, height, color, alpha);
}
export class Force{

    viz;
    sparkiz;

    constructor(div, width, height, color, alpha){
        //console.log("I HAVE CREATED A MAIN")
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
    create_layout(){
        this.sparkiz.map_links_nodes();
        return this;
    }
    create_WEBGL_element() {
        this.sparkiz.create();
        return this;
    }
    start_particle_delay(delay) {
        this.viz.then -= delay;
        //this.viz.with_absolute_time();
        return this;
    }
    start(time) {
        if (time != undefined) this.sparkiz.launch_network(time);
        if (time == undefined) this.sparkiz.launch_network_without_computation();
        //this.viz.animate();
        this.viz.with_absolute_time();

        return this;
    }
    startAPIparticule_oneitem(time) {
        this.sparkiz.launch_network2(time);
        //this.viz.animate();
        this.viz.with_absolute_time();
        return this;
    }
    stop(){
        this.viz.stop_renderer();
        return this;
    }
    pause(){
        this.viz.pause_renderer();
        return this;
    }
    network(visual_attr, amount){
        
    }
    controls(bool) {
        if (bool == true) this.viz.add_controls_anim();
        return this;
    }
    zoom(bool) {
        // console.log("LAUNCH ZOOM", bool)
        if (bool == true) this.viz._UI.mouse_event();
        return this;
    }
    setZoom(value){
        this.viz._UI.setZoom(value);
        return this;
    }
    on(parameter, callback){
        
        switch(parameter) {
            
            case "end":
                this.sparkiz.callback = callback;
                return this;
        }
        
    }
    particles(visual_attr, callback, gate){
        // console.log("GATE", gate)

        if (gate != undefined && gate > 1){console.log("Gate shoub be comprise between 0 and 1 ..."); return false;}
        var value;
        var gate_position;
        if (gate != undefined){ gate = Math.round(gate * 20) }
        //console.log("gate",Math.round(gate * 20))
        // /************************** COLOR FOR GATES  *************************/
        // if (visual_attr.slice(0, 6) == 'color_'){
        //     var gates_id = visual_attr.slice(6)               
        //     for(var i=0 ; i<this.sparkiz.links.length ; i++){
        //         if ( typeof(arguments[1]) == 'string'){value = new THREE.Color(arguments[1]);}
        //         else{a = callback(this.sparkiz.links[i], i);
        //             value = new THREE.Color(a);}
        //         this.sparkiz.links[i].gate_colors[gates_id] = value;
        //     }
        //     return this;
        // }
        // /************************** SIZE FOR GATES  *************************/
        // if (visual_attr.slice(0, 5) == 'size_'){
        //     var gates_id = visual_attr.slice(5)               
        //     for(var i=0 ; i<this.sparkiz.links.length ; i++){
        //         if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
        //         else{value = callback(this.sparkiz.links[i], i);}
        //         this.sparkiz.links[i].size[gates_id] = value;
        //     }
            
        //     return this;
        // }
        // /********************** VELOCITY FOR GATES  **************************/
        // if (visual_attr.slice(0, 9) == 'velocity_'){
        //     console.log("VELOCITY")
        //     var gates_id = visual_attr.slice(9);               
        //     for(var i=0 ; i<this.sparkiz.links.length ; i++){
        //         if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
        //         else{value = parseFloat(callback(this.sparkiz.links[i], i));}
        //         //this.sparkiz.links[i].gate_velocity[gates_id] = value + 1;
        //         this.sparkiz.links[i].gate_velocity[gates_id] = value;
        //     }
        //     return this;
        // }

        // /********************** OPACITY FOR GATES  **************************/
        // if (visual_attr.slice(0, 8) == 'opacity_'){
        //     var gates_id = visual_attr.slice(8);               
        //     for(var i=0 ; i<this.sparkiz.links.length ; i++){
        //         if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
        //         else{var value = callback(this.sparkiz.links[i], i);}
        //         this.sparkiz.links[i].gate_opacity[gates_id] = value;
        //     }
        //     return this;
        // }
        // /********************** WIGGLING FOR GATES  **************************/
        // if (visual_attr.slice(0, 9) == 'wiggling_'){
        //     var gates_id = visual_attr.slice(9);               
        //     for(var i=0 ; i<this.sparkiz.links.length ; i++){
        //         if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
        //         else{var value = callback(this.sparkiz.links[i], i);}
        //         this.sparkiz.links[i].wiggling_gate[gates_id] = value;
        //     }
        //     return this;
        // }
        


        switch(visual_attr) {
            
            case "color":

                for(var i=0 ; i<this.sparkiz.links.length ; i++){
                    if ( typeof(arguments[1]) == 'string'){value = new THREE.Color(arguments[1]);}
                    else{var a = callback(this.sparkiz.links[i], i);
                        value = new THREE.Color(a);}
                    if (gate == undefined){gate_position = 0} 
                    if (gate != undefined){gate_position = gate} 
                    for(var k = gate_position ; k< this.sparkiz.number_max_gates ; k++) { this.sparkiz.links[i].gate_colors[k] = value; }
                }
                return this;
            case "size":
                //console.log("SIZE", arguments[1],visual_attr,typeof(arguments[1]), gate )
                for(var i=0 ; i<this.sparkiz.links.length ; i++){
                    if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                    else{value = callback(this.sparkiz.links[i], i);}
                    if (gate == undefined){gate_position = 0} 
                    if (gate != undefined){gate_position = gate} 
                    for(var k = gate_position ; k< this.sparkiz.number_max_gates ; k++) { this.sparkiz.links[i].size[k] = value; }
                }
                return this;

            case "opacity":
                for(var i=0 ; i<this.sparkiz.links.length ; i++){
                    if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                    else{value = callback(this.sparkiz.links[i], i);}
                    if (gate == undefined){gate_position = 0} 
                    if (gate != undefined){gate_position = gate} 
                    for(var k = gate_position ; k< this.sparkiz.number_max_gates ; k++) { this.sparkiz.links[i].gate_opacity[k] = value; }
                }
                return this;

            case "speed":
                for(var i=0 ; i<this.sparkiz.links.length ; i++){
                    if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                    else{value = callback(this.sparkiz.links[i], i);}
                    if (gate == undefined){ gate_position = 0 } 
                    if (gate != undefined){ gate_position = gate } 
                    //for(var k=0 ; k<this.sparkiz.number_max_gates ; k++) this.sparkiz.links[i].gate_velocity[k] = value + 1;
                    for(var k = gate_position ; k< this.sparkiz.number_max_gates ; k++) {this.sparkiz.links[i].gate_velocity[k] = value; }
                }
                return this;
            case "wiggling":
                //console.log(arguments[1],visual_attr,typeof(arguments[1]) )
                for(var i=0 ; i<this.sparkiz.links.length ; i++){
                    if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                    else{value = callback(this.sparkiz.links[i], i);}
                    if (gate == undefined){gate_position = 0} 
                    if (gate != undefined){gate_position = gate} 
                    //for(var k=0 ; k<this.sparkiz.number_max_gates ; k++) this.sparkiz.links[i].wiggling[k]  = value;
                    for(var k = gate_position ; k< this.sparkiz.number_max_gates ; k++) { this.sparkiz.links[i].wiggling_gate[k] = value; }
                }
                return this;


            case "pattern":
                for(var i=0 ; i<this.sparkiz.links.length ; i++){
                    if (arguments[1] instanceof Array){value = arguments[1];}
                    else{value = callback(this.sparkiz.links[i], i);}
                    this.sparkiz.links[i].temporal_distribution2 = value;
                }
                return this;
            case "track":
                for(var i=0 ; i<this.sparkiz.links.length ; i++){
                    if (arguments[1] instanceof Array){value = arguments[1];}
                    else{value = callback(this.sparkiz.links[i], i);}
                    this.sparkiz.links[i].spatial_distribution = value;
                    //console.log(value);
                }
                return this;
            case "frequency":
                for(var i=0 ; i<this.sparkiz.links.length ; i++){
                    if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                    else{ value = callback(this.sparkiz.links[i], i);}
                    //AFIN DE METTRE LA FREQUENCE
                    // console.log("FREQUENCR", value, arguments)
                    this.sparkiz.links[i].frequency_pattern = 1/parseFloat(value);
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
    
    tracks(visual_attr, callback){
        var value;
        switch(visual_attr) {
            case "opacity":
                for(var i=0 ; i<this.sparkiz.links.length ; i++){
                    if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                    else{value = callback(this.sparkiz.links[i], i);}
                    this.sparkiz.links[i].roads_opacity = value;
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
                    this.sparkiz.links[i].roads_color = value;
                    //console.log("OPACITY", value)
                }
                
                return this;
            case "count":
                for(var i=0 ; i<this.sparkiz.links.length ; i++){
                    if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                    else{value = callback(this.sparkiz.links[i], i);}
                    this.sparkiz.number_roads.push(value);
                    //this.sparkiz.links[i].number_paths_particule = value;
                    //console.log("OPACITY", value)
                }
                
                return this;
        }
    }
    link_properties(visual_attr, callback){
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
                    this.sparkiz.links[i].width_tube = value;
                    //this.sparkiz.set_tube_width(i, value);
                }
                return this;

            case "curvature":
                for(var i=0 ; i<this.sparkiz.links.length ; i++){
                    if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                    else{var value = callback(this.sparkiz.links[i], i);}
                    this.sparkiz.links[i].courbure = value;
                    // console.log("links", this.sparkiz.links[i])
                }
                return this;


            // case "courbure":
            //     value = arguments[1];
            //     this.sparkiz.courbure = value;
            //     return this;

            case "opacity":
                for(var i=0 ; i<this.sparkiz.links.length ; i++){
                    if (typeof(arguments[1]) == 'number'){value = arguments[1];}
                    else{ var value = callback(this.sparkiz.links[i], i);}
                    // this.sparkiz.tube[i].children[0].material.opacity = value;
                    this.sparkiz.links[i].tube_opacity = value;
                    // console.log(value)
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
    numberSegmentation(visual_attr, callback){
        var value;
        switch(visual_attr) {
            case "numberSpacedPoints":
                for(var i=0 ; i<this.sparkiz.links.length ; i++){
                    if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                    else{var value = callback(this.sparkiz.links[i], i);}
                    this.sparkiz.links[i].numberSpacedPoints = value;
                }
                return this;
        }
    }
    node_properties(visual_attr, callback){
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
            case "z":
                //console.log("CHANGE VALUE")
                for(var i=0 ; i<this.sparkiz.nodes.length ; i++){
                    if ( typeof(arguments[1]) == 'number' || typeof(arguments[1]) == 'string'){value = parseFloat(arguments[1]);}
                    else{value = parseFloat(callback(this.sparkiz.nodes[i], i));}
                    this.sparkiz.d3cola.stop();
                    this.sparkiz.nodes[i].z = value;
                    //console.log("VALUE", value)
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

import * as VS from './../shaders/particule.vert'
import * as FS from './../shaders/particule.frag'

export class Shader{

fragment;
vertex;

constructor(){
    this.set_fragment();
}
        
set_fragment()     {
    this.fragment = FS;
    this.vertex = VS;
    //this.fragment = "\n            uniform sampler2D texture;\n      \n\n            varying float distance_with_arrival;\n            varying float distance_with_departure;\n            varying float my_opacity;\n            varying vec3 vColor;\n\n            varying float vRotation;\n\n            varying float sprite_size;\n\n            varying float segmentation;\n            varying float index_;\n\n\n\n            mat2 rotation(float x) {\n              vec2 line_1 = vec2(cos(x), -sin(x));\n              vec2 line_2 = vec2(sin(x), cos(x));\n\n              return mat2(line_1,line_2); \n            }\n            mat2 translation(float x, float y) {\n              vec2 line_1 = vec2(1.0,x);\n              vec2 line_2 = vec2(1.0,y);\n\n              return mat2(line_1,line_2); \n            }\n            mat2 changerEchelle(float sx, float sy) {\n              vec2 line_1 = vec2(sx, 0.0);\n              vec2 line_2 = vec2(0.0, sy);\n\n              return mat2(line_1,line_2); \n            }\n\n\n            void main() {\n\n                float mid = 0.5;\n                mat2 my_matrix = rotation(vRotation) ;\n                vec2 rotated =  my_matrix * vec2(gl_PointCoord.x - mid, gl_PointCoord.y - mid) ;\n                rotated.x = rotated.x + mid;\n                rotated.y = rotated.y + mid;\n\n\n\n                vec4 color = vec4(1.0,1.0,1.0, 1.0);\n\n                vec2 new_coord =  my_matrix * gl_PointCoord;\n\n\n                if (distance_with_arrival < (sprite_size \/ 2.0) && index_ < segmentation){\n                  if ( rotated.x - 0.5 > (distance_with_arrival \/ sprite_size)){\n                    color = vec4(1.0,1.0,1.0, 0.0);\n                  }\n                }\n\n                if (distance_with_arrival < (sprite_size \/ 2.0) && index_ >= segmentation){\n                  if (rotated.x >= 0.5 - (distance_with_arrival \/ sprite_size)){\n                    color = vec4(1.0,1.0,1.0, 0.0);\n                  }\n                }\n\n                if (distance_with_arrival > (sprite_size \/ 2.0) && index_ > segmentation){\n                    color = vec4(1.0,1.0,1.0, 0.0);\n                }\n\n                if (distance_with_departure < (sprite_size \/ 2.0) && index_ < 0.0){\n                  if ( rotated.x + 0.5 > (distance_with_departure \/ sprite_size)){\n                    color = vec4(1.0,1.0,1.0, 0.0);\n                  }\n                }\n                if (distance_with_departure < (sprite_size \/ 2.0) && index_ >= 0.0){\n                  if ( rotated.x <= 0.5-(distance_with_departure \/ sprite_size)){\n                    color = vec4(1.0,1.0,1.0, 0.0);\n                  }\n                }\n\n                if (distance_with_departure > (sprite_size \/ 2.0) && index_ < 0.0){\n                  color = vec4(1.0,1.0,1.0, 0.0);\n                }\n\n\n                vec4 rotatedTexture = texture2D( texture,  rotated) * color;\n\n                gl_FragColor = vec4( vColor, my_opacity ) * rotatedTexture;\n\n\n            }";
    //this.vertex = "\n\n\n            uniform float time;\n            uniform float uTime;\n\n\t\t\tvarying float size_fadding;\n      \n\t\t\tattribute float id;\n\n            attribute float id_particle;\n\t\t\tattribute vec3 customColor;\n\n            attribute float iteration;\n\n            uniform int particles_number;\n\n\n            uniform mat4 ProjectionMatrix;\n\n            uniform int number_segmentation;\n            uniform float gap_two_gates;\n\n            varying float sprite_size;\n\n            varying float segmentation;\n            varying float index_;\n\n            uniform vec2 path_quadratic[path_length];\n\n            uniform int gate_position[number_max_gates];\n            uniform float size[number_max_gates];\n            uniform float gate_opacity[number_max_gates];\n            uniform float wiggling_gate[number_max_gates];\n            uniform vec3 gate_colors[number_max_gates];\n            uniform float gate_velocity[number_max_gates];\n\n            uniform int temporal_delay[real_number_particles];\n            uniform int varyingData;\n\n            \n\n            \n            uniform int number_segmentation_pattern_fitting;\n\n\t\t\t varying vec3 vColor;\n            varying float my_opacity;\n            varying float distance_with_arrival;\n            varying float distance_with_departure;\n            float actual_velocity;\n\n\n\n            varying float vRotation;\n            int gate = 0;\n\n            int MOD(int a, int b){\n\n                int result = a \/ b;\n                result = b * result;\n                result = a - result;\n                return result;\n            }\n            float rand(vec2 co){\n                return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\n            }\n            float distance(float x1, float y1, float x2, float y2){\n\n                float longueur = sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));\n                return longueur;\n            }\n            int determine_which_gate(int index_thorique){\n\n                for(int i = 0; i < number_max_gates - 1; i++){\n                    int actual_gate_pos = gate_position[i] ;\n                    int next_gate_pos = gate_position[i+1] ;\n                    if(index_thorique <= next_gate_pos && index_thorique > actual_gate_pos){\n                        gate = i;\n                    }\n  \n                    if(index_thorique >= next_gate_pos && index_thorique >= actual_gate_pos &&\n                        next_gate_pos == 0 && actual_gate_pos != 0){\n                        gate = i;\n                    }\n                }\n                return gate;\n            }\n            float delay_to_other_particle(int gate){\n                float difference_gate_before = 0.0;\n\n                if (gate == 20){\n                    for(int i = 0; i < 20; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 19){\n                    for(int i = 0; i < 19; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 18){\n                    for(int i = 0; i < 18; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 17){\n                    for(int i = 0; i < 17; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 16){\n                    for(int i = 0; i < 16; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 15){\n                    for(int i = 0; i < 15; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 14){\n                    for(int i = 0; i < 14; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 13){\n                    for(int i = 0; i < 13; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 12){\n                    for(int i = 0; i < 12; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 11){\n                    for(int i = 0; i < 11; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 10){\n                    for(int i = 0; i < 10; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 9){\n                    for(int i = 0; i < 9; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 8){\n                    for(int i = 0; i < 8; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 7){\n                    for(int i = 0; i < 7; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 6){\n                    for(int i = 0; i < 6; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 5){\n                    for(int i = 0; i < 5; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 4){\n                    for(int i = 0; i < 4; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 3){\n                    for(int i = 0; i < 3; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 2){\n                    for(int i = 0; i < 2; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 1){\n                    for(int i = 0; i < 1; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 0){\n                    for(int i = 0; i < 0; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                return difference_gate_before;\n            }\n            float fadeSize(float actualSize, float nextSize, int steps, int index){ \n\n                float temporarySize = ((nextSize - actualSize)\/ float(steps)) * float(index);\n                return actualSize + temporarySize;\n\n            }\n            vec3 fadeRGB(vec3 oldColor, vec3 newColor, int steps, int index){\n\n                vec3 my_color;\n                float redStepAmount = ((newColor.x - oldColor.x) \/ float(steps)) * float(index);\n                float greenStepAmount = ((newColor.y - oldColor.y) \/ float(steps)) * float(index);\n                float blueStepAmount = ((newColor.z - oldColor.z) \/ float(steps)) * float(index);\n                \n                newColor.x = oldColor.x + redStepAmount;\n                newColor.y = oldColor.y + greenStepAmount;\n                newColor.z = oldColor.z + blueStepAmount;\n\n                my_color = vec3(newColor.x ,newColor.y, newColor.z);\n\n                return my_color;\n\n            }\n            float noise(vec2 p){\n                vec2 ip = floor(p);\n                vec2 u = fract(p);\n                u = u*u*(3.0-2.0*u);\n\n                float res = mix(\n                    mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),\n                    mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);\n                return res*res;\n            }\n            vec2 bezier(int t, vec2 p0,vec2 p1,vec2 p2,vec2 p3){\n\n                highp float timer = float(t);\n\n                highp float time = timer * 1.0\/(float(number_segmentation));\n\n                float cX = 3.0 * (p1.x - p0.x);\n                float bX = 3.0 * (p2.x - p1.x) - cX;\n                float aX = p3.x - p0.x - cX - bX;\n\n                float cY = 3.0 * (p1.y - p0.y);\n                float bY = 3.0 * (p2.y - p1.y) - cY;\n                float aY = p3.y - p0.y - cY - bY;\n\n                float x = (aX * pow(time, 3.0)) + (bX * pow(time, 2.0)) + (cX * time) + p0.x;\n                float y = (aY * pow(time, 3.0)) + (bY * pow(time, 2.0)) + (cY * time) + p0.y;\n\n                vec2 result = vec2( x,y );\n\n                return result;\n            }\n            mat4 rotation(float x) {\n              vec4 line_1 = vec4(cos(x), -sin(x), 0.0, 0.0);\n              vec4 line_2 = vec4(sin(x), cos(x), 0.0, 0.0);\n              vec4 line_3 = vec4(0.0, 0.0, 1.0, 0.0);\n              vec4 line_4 = vec4(0.0, 0.0, 0.0, 1.0);\n\n              return mat4(line_1,line_2,line_3,line_4);\n            }\n            mat4 translation(float x, float y) {\n              vec4 line_1 = vec4(1.0, 0.0, 0.0,  x);\n              vec4 line_2 = vec4(0.0, 1.0, 0.0,  y);\n              vec4 line_3 = vec4(0.0, 0.0, 1.0, 0.0);\n              vec4 line_4 = vec4(0.0, 0.0, 0.0, 1.0);\n\n              return mat4(line_1,line_2,line_3,line_4);\n            }\n            mat4 changerEchelle(float sx, float sy) {\n              vec4 line_1 = vec4(sx, 0.0, 0.0, 0.0);\n              vec4 line_2 = vec4(0.0, sy, 0.0, 0.0);\n              vec4 line_3 = vec4(0.0, 0.0, 1.0, 0.0);\n              vec4 line_4 = vec4(0.0, 0.0, 0.0, 1.0);\n\n              return mat4(line_1,line_2,line_3,line_4);\n            }\n\n\t\t\tvoid main() {\n\n\t\t\t\tvColor = customColor;\n\t\t\t\tvec3 newPosition = position;\n                vec4 mvPosition;\n\t\t\t\tfloat ANGLE = 90.0;\n\n\n                highp int id_faisceaux = int(id_particle);\n                actual_velocity = float(gate_velocity[0]);\n\n                float timer =  uTime;\n                highp int my_time = int(timer);\n\n        \n                my_time = my_time + temporal_delay[id_faisceaux];\n           \n                int index_old = MOD(my_time , number_segmentation_pattern_fitting);\n                \n\n       \n                float virtual_index = float(index_old);\n                virtual_index = virtual_index; \n                highp int index2 = int(virtual_index);\n\n       \n              gate = determine_which_gate(index2);\n\n\n\n                float multiplicateur = 1.0;\n                if (gate_velocity[gate] == 1.0){multiplicateur = 0.0;}\n\n                float difference = 0.0;\n                float difference_gate_before = 0.0;\n                \n                if (gate_velocity[gate]!= 1.0){\n                    difference = float(gate_position[gate]) * multiplicateur * (gate_velocity[gate] - 1.0);\n                }\n                difference_gate_before = delay_to_other_particle(gate);\n\n                \n                float new_index = ( float(index2) * gate_velocity[gate] ) - difference + difference_gate_before;\n                highp int index = int(new_index);\n\n                \n\n                vec4 path;\n                vec4 path_next;\n                highp int path_id = int(id) * (4);\n\n                \n                path = vec4( bezier(index, path_quadratic[path_id],path_quadratic[path_id+ 1],path_quadratic[path_id + 2],path_quadratic[path_id+3]), 1.0,1.0);\n                path_next = vec4( bezier(index +1, path_quadratic[path_id],path_quadratic[path_id+ 1],path_quadratic[path_id + 2],path_quadratic[path_id+3]), 1.0,1.0);\n\n                \n                distance_with_arrival = distance(path.x, path.y, path_quadratic[path_id+3].x, path_quadratic[path_id+3].y);\n                distance_with_departure = distance(path.x, path.y, path_quadratic[path_id].x, path_quadratic[path_id].y);\n                float random = noise(vec2( index , index )) * wiggling_gate[gate];\n                float angle = atan(path_next.y - path.y, path_next.x - path.x );\n                vRotation =  - angle;\n\n\n\n                \n\n\n                mat4 my_matrice =  translation(path.x + random,path.y+ random);\n                vec4 positionEchelle = vec4(0.0,0.0,1.0,1.0) * my_matrice;\n                mvPosition =  modelViewMatrix * positionEchelle;\n\n\n\n\n                size_fadding = size[gate];\n                my_opacity = gate_opacity[gate];\n                \n                vColor = vec3(gate_colors[gate].x ,gate_colors[gate].y, gate_colors[gate].z);\n                \n                if (size[gate] != size[gate+1]){\n                   size_fadding = fadeSize(size[gate], size[gate+1], gate_position[gate+1] - gate_position[gate], index - gate_position[gate]);\n                }\n                \n                if (gate_opacity[gate] != gate_opacity[gate+1]){\n                   my_opacity = fadeSize(gate_opacity[gate], gate_opacity[gate+1], gate_position[gate+1] - gate_position[gate], index - gate_position[gate]);\n                }\n\n                index_ = float(index);\n                segmentation = float(number_segmentation);\n\n                if (index >= number_segmentation || index <= 0){my_opacity = 0.0;}\n                    \n                gl_PointSize = size_fadding;\n                sprite_size = gl_PointSize;\n\n                gl_Position = projectionMatrix * mvPosition;\n\n\n            }\n";
    //this.vertex = "\n\n\n            uniform float time;\n            uniform float uTime;\n\n\t\t\tvarying float size_fadding;\n      \n\t\t\tattribute float id;\n\n            attribute float id_particle;\n\t\t\tattribute vec3 customColor;\n\n            attribute float iteration;\n\n            uniform int particles_number;\n\n\n            uniform mat4 ProjectionMatrix;\n\n            uniform int number_segmentation;\n            uniform float gap_two_gates;\n\n            varying float sprite_size;\n\n            varying float segmentation;\n            varying float index_;\n\n            uniform vec2 path_quadratic[path_length];\n\n            uniform int gate_position[number_max_gates];\n            uniform float size[number_max_gates];\n            uniform float gate_opacity[number_max_gates];\n            uniform float wiggling_gate[number_max_gates];\n            uniform vec3 gate_colors[number_max_gates];\n            uniform float gate_velocity[number_max_gates];\n\n            uniform int temporal_delay[real_number_particles];\n            uniform int varyingData;\n\n            \n\n            \n            uniform int number_segmentation_pattern_fitting;\n\n\t\t\t varying vec3 vColor;\n            varying float my_opacity;\n            varying float distance_with_arrival;\n            varying float distance_with_departure;\n            float actual_velocity;\n\n\n\n            varying float vRotation;\n            int gate = 0;\n\n            int MOD(int a, int b){\n\n                int result = a \/ b;\n                result = b * result;\n                result = a - result;\n                return result;\n            }\n            float rand(vec2 co){\n                return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\n            }\n            float distance(float x1, float y1, float x2, float y2){\n\n                float longueur = sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));\n                return longueur;\n            }\n            int determine_which_gate(int index_thorique){\n\n                for(int i = 0; i < number_max_gates - 1; i++){\n                    int actual_gate_pos = gate_position[i] ;\n                    int next_gate_pos = gate_position[i+1] ;\n                    if(index_thorique <= next_gate_pos && index_thorique > actual_gate_pos){\n                        gate = i;\n                    }\n  \n                    if(index_thorique >= next_gate_pos && index_thorique >= actual_gate_pos &&\n                        next_gate_pos == 0 && actual_gate_pos != 0){\n                        gate = i;\n                    }\n                }\n                return gate;\n            }\n            float delay_to_other_particle(int gate){\n                float difference_gate_before = 0.0;\n\n                if (gate == 20){\n                    for(int i = 0; i < 20; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 19){\n                    for(int i = 0; i < 19; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 18){\n                    for(int i = 0; i < 18; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 17){\n                    for(int i = 0; i < 17; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 16){\n                    for(int i = 0; i < 16; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 15){\n                    for(int i = 0; i < 15; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 14){\n                    for(int i = 0; i < 14; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 13){\n                    for(int i = 0; i < 13; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 12){\n                    for(int i = 0; i < 12; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 11){\n                    for(int i = 0; i < 11; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 10){\n                    for(int i = 0; i < 10; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 9){\n                    for(int i = 0; i < 9; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 8){\n                    for(int i = 0; i < 8; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 7){\n                    for(int i = 0; i < 7; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 6){\n                    for(int i = 0; i < 6; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 5){\n                    for(int i = 0; i < 5; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 4){\n                    for(int i = 0; i < 4; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 3){\n                    for(int i = 0; i < 3; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 2){\n                    for(int i = 0; i < 2; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 1){\n                    for(int i = 0; i < 1; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                else if (gate == 0){\n                    for(int i = 0; i < 0; i++){\n                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates \/ gate_velocity[i]);\n                    }\n                }\n                return difference_gate_before;\n            }\n            float fadeSize(float actualSize, float nextSize, int steps, int index){ \n\n                float temporarySize = ((nextSize - actualSize)\/ float(steps)) * float(index);\n                return actualSize + temporarySize;\n\n            }\n            vec3 fadeRGB(vec3 oldColor, vec3 newColor, int steps, int index){\n\n                vec3 my_color;\n                float redStepAmount = ((newColor.x - oldColor.x) \/ float(steps)) * float(index);\n                float greenStepAmount = ((newColor.y - oldColor.y) \/ float(steps)) * float(index);\n                float blueStepAmount = ((newColor.z - oldColor.z) \/ float(steps)) * float(index);\n                \n                newColor.x = oldColor.x + redStepAmount;\n                newColor.y = oldColor.y + greenStepAmount;\n                newColor.z = oldColor.z + blueStepAmount;\n\n                my_color = vec3(newColor.x ,newColor.y, newColor.z);\n\n                return my_color;\n\n            }\n            float noise(vec2 p){\n                vec2 ip = floor(p);\n                vec2 u = fract(p);\n                u = u*u*(3.0-2.0*u);\n\n                float res = mix(\n                    mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),\n                    mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);\n                return res*res;\n            }\n            vec2 bezier(int t, vec2 p0,vec2 p1,vec2 p2,vec2 p3){\n\n                highp float timer = float(t);\n\n                highp float time = timer * 1.0\/(float(number_segmentation));\n\n                float cX = 3.0 * (p1.x - p0.x);\n                float bX = 3.0 * (p2.x - p1.x) - cX;\n                float aX = p3.x - p0.x - cX - bX;\n\n                float cY = 3.0 * (p1.y - p0.y);\n                float bY = 3.0 * (p2.y - p1.y) - cY;\n                float aY = p3.y - p0.y - cY - bY;\n\n                float x = (aX * pow(time, 3.0)) + (bX * pow(time, 2.0)) + (cX * time) + p0.x;\n                float y = (aY * pow(time, 3.0)) + (bY * pow(time, 2.0)) + (cY * time) + p0.y;\n\n                vec2 result = vec2( x,y );\n\n                return result;\n            }\n            mat4 rotation(float x) {\n              vec4 line_1 = vec4(cos(x), -sin(x), 0.0, 0.0);\n              vec4 line_2 = vec4(sin(x), cos(x), 0.0, 0.0);\n              vec4 line_3 = vec4(0.0, 0.0, 1.0, 0.0);\n              vec4 line_4 = vec4(0.0, 0.0, 0.0, 1.0);\n\n              return mat4(line_1,line_2,line_3,line_4);\n            }\n            mat4 translation(float x, float y) {\n              vec4 line_1 = vec4(1.0, 0.0, 0.0,  x);\n              vec4 line_2 = vec4(0.0, 1.0, 0.0,  y);\n              vec4 line_3 = vec4(0.0, 0.0, 1.0, 0.0);\n              vec4 line_4 = vec4(0.0, 0.0, 0.0, 1.0);\n\n              return mat4(line_1,line_2,line_3,line_4);\n            }\n            mat4 changerEchelle(float sx, float sy) {\n              vec4 line_1 = vec4(sx, 0.0, 0.0, 0.0);\n              vec4 line_2 = vec4(0.0, sy, 0.0, 0.0);\n              vec4 line_3 = vec4(0.0, 0.0, 1.0, 0.0);\n              vec4 line_4 = vec4(0.0, 0.0, 0.0, 1.0);\n\n              return mat4(line_1,line_2,line_3,line_4);\n            }\n\n\t\t\tvoid main() {\n\n\t\t\t\tvColor = customColor;\n\t\t\t\tvec3 newPosition = position;\n                vec4 mvPosition;\n\t\t\t\tfloat ANGLE = 90.0;\n\n\n                highp int id_faisceaux = int(id_particle);\n                actual_velocity = float(gate_velocity[0]);\n\n                float timer =  uTime;\n                highp int my_time = int(timer);\n\n        \n                my_time = my_time + temporal_delay[id_faisceaux];\n           \n                int index_old = MOD(my_time , number_segmentation_pattern_fitting);\n                \n\n       \n                float virtual_index = float(index_old);\n                virtual_index = virtual_index; \n                highp int index2 = int(virtual_index);\n\n       \n              gate = determine_which_gate(index2);\n\n\n\n                float multiplicateur = 1.0;\n                if (gate_velocity[gate] == 1.0){multiplicateur = 0.0;}\n\n                float difference = 0.0;\n                float difference_gate_before = 0.0;\n                \n                if (gate_velocity[gate]!= 1.0){\n                    difference = float(gate_position[gate]) * multiplicateur * (gate_velocity[gate] - 1.0);\n                }\n                difference_gate_before = delay_to_other_particle(gate);\n\n                \n                float new_index = ( float(index2) * gate_velocity[gate] ) - difference + difference_gate_before;\n                highp int index = int(new_index);\n\n                \n\n                vec4 path;\n                vec4 path_next;\n                highp int path_id = int(id) * (4);\n\n                \n                path = vec4( bezier(index, path_quadratic[path_id],path_quadratic[path_id+ 1],path_quadratic[path_id + 2],path_quadratic[path_id+3]), 1.0,1.0);\n                path_next = vec4( bezier(index +1, path_quadratic[path_id],path_quadratic[path_id+ 1],path_quadratic[path_id + 2],path_quadratic[path_id+3]), 1.0,1.0);\n\n                \n                distance_with_arrival = distance(path.x, path.y, path_quadratic[path_id+3].x, path_quadratic[path_id+3].y);\n                distance_with_departure = distance(path.x, path.y, path_quadratic[path_id].x, path_quadratic[path_id].y);\n                float random = noise(vec2( index , index )) * wiggling_gate[gate];\n                float angle = atan(path_next.y - path.y, path_next.x - path.x );\n                vRotation =  - angle;\n\n\n\n                \n\n\n                mat4 my_matrice =  translation(path.x + random,path.y+ random);\n                vec4 positionEchelle = vec4(0.0,0.0,1.0,1.0) * my_matrice;\n                mvPosition =  modelViewMatrix * positionEchelle;\n\n\n\n\n                size_fadding = size[gate];\n                my_opacity = gate_opacity[gate];\n                \n                vColor = vec3(gate_colors[gate].x ,gate_colors[gate].y, gate_colors[gate].z);\n                \n                if (size[gate] != size[gate+1]){\n                   size_fadding = fadeSize(size[gate], size[gate+1], gate_position[gate+1] - gate_position[gate], index - gate_position[gate]);\n                }\n                \n\n                index_ = float(index);\n                segmentation = float(number_segmentation);\n\n                if (index >= number_segmentation || index <= 0){my_opacity = 0.0;}\n                    \n                gl_PointSize = size_fadding;\n                sprite_size = gl_PointSize;\n\n                gl_Position = projectionMatrix * mvPosition;\n\n\n            }\n";
    // this.fragment = 'uniform sampler2D texture;'+
    // '        '+
    // ''+
    // '            varying float distance_with_arrival;'+
    // '            varying float distance_with_departure;'+
    // '            varying float my_opacity;'+
    // '            varying vec3 vColor;'+
    // ''+
    // '            varying float vRotation;'+
    // ''+
    // '            varying float sprite_size;'+
    // ''+
    // '            varying float segmentation;'+
    // '            varying float index_;'+
    // ''+
    // ''+
    // ''+
    // '            mat2 rotation(float x) {'+
    // '              vec2 line_1 = vec2(cos(x), -sin(x));'+
    // '              vec2 line_2 = vec2(sin(x), cos(x));'+
    // ''+
    // '              return mat2(line_1,line_2); '+
    // '            }'+
    // '            mat2 translation(float x, float y) {'+
    // '              vec2 line_1 = vec2(1.0,x);'+
    // '              vec2 line_2 = vec2(1.0,y);'+
    // ''+
    // '              return mat2(line_1,line_2); '+
    // '            }'+
    // '            mat2 changerEchelle(float sx, float sy) {'+
    // '              vec2 line_1 = vec2(sx, 0.0);'+
    // '              vec2 line_2 = vec2(0.0, sy);'+
    // ''+
    // '              return mat2(line_1,line_2); '+
    // '            }'+
    // ''+
    // ''+
    // '            void main() {'+
    // ''+
    // '                float mid = 0.5;'+
    // '                mat2 my_matrix = rotation(vRotation) ;'+
    // '                vec2 rotated =  my_matrix * vec2(gl_PointCoord.x - mid, gl_PointCoord.y - mid) ;'+
    // '                rotated.x = rotated.x + mid;'+
    // '                rotated.y = rotated.y + mid;'+
    // ''+
    // ''+
    // ''+
    // ''+
    // '                vec4 color = vec4(1.0,1.0,1.0, 1.0);'+
    // ''+
    // '                vec2 new_coord =  my_matrix * gl_PointCoord;'+
    // ''+
    // ''+
    // ''+
    // '               if (distance_with_arrival < (sprite_size * 2.0) && index_ < segmentation + (0.1 * segmentation)){'+
    // '                  if ( rotated.x - 0.5 > (distance_with_arrival / sprite_size)){'+
    // '                    color = vec4(1.0,0.0,0.0, 0.0);'+
    // '                  }'+
    // '                }'+
    // ''+
    // '                if (distance_with_arrival < (sprite_size * 2.0) && index_ >= segmentation + (0.1 * segmentation)){'+
    // '                  if (rotated.x >= 0.5 - (distance_with_arrival / sprite_size)){'+
    // '                    color = vec4(0.0,1.0,0.0, 0.0);'+
    // '                  }'+
    // '                }'+
    // '                if (distance_with_arrival > (sprite_size / 2.0) && index_ >= segmentation + (0.1 * segmentation)){'+
    // '                    color = vec4(1.0,0.0,0.0, 0.0);'+
    // '                }'+
    // ''+
    // '             '+
    // '               if (distance_with_departure < (sprite_size / 2.0) && index_ < 0.0 + (0.1 * segmentation)){'+
    // '                  if ( rotated.x - 0.5 < (distance_with_departure / sprite_size)){'+
    // '                    color = vec4(1.0,0.0,0.0, 0.0);'+
    // '                  }'+
    // '                }'+
    // '                if (distance_with_departure < (sprite_size / 2.0) && index_ >= 0.0 + (0.1 * segmentation)){'+
    // '                  if ( rotated.x <= 0.5 - (distance_with_departure / sprite_size)){'+
    // '                    color = vec4(0.0,1.0,0.0, 0.0);'+
    // '                  }'+
    // '                }'+
    // ''+
    // '                if (distance_with_departure >= (sprite_size / 2.0) && index_ <= 0.0 + (0.1 * segmentation)){'+
    // '                  color = vec4(1.0,0.0,0.0, 0.0);'+
    // '                }'+
    // ''+
    // ''+
    // '                '+
    // ''+
    // '                vec4 rotatedTexture = texture2D( texture,  rotated) * color;'+
    // ''+
    // '                gl_FragColor = vec4( vColor, my_opacity ) * rotatedTexture;'+
    // ''+
    // ''+
    // ''+
    // ''+
    // '            }';
        
    
        
    
    // this.vertex = 'uniform float time;'+
    // '            uniform float uTime;'+
    // '            float size_fadding;'+
    // '            attribute float id;'+
    // '            attribute float id_particle;'+
    // '            attribute vec3 customColor;'+
    // '            attribute float iteration;'+
    // '            uniform int particles_number;'+
    // '            uniform mat4 ProjectionMatrix;'+
    // '            uniform int number_segmentation;'+
    // '            uniform float gap_two_gates;'+
    // '            varying float sprite_size;'+
    // '            varying float segmentation;'+
    // '            varying float index_;'+
    // '            uniform vec2 path_quadratic[path_length];'+
    // '            uniform int gate_position[number_max_gates];'+
    // '            uniform float size[number_max_gates];'+
    // '            uniform float gate_opacity[number_max_gates];'+
    // '            uniform float wiggling_gate[number_max_gates];'+
    // '            uniform vec3 gate_colors[number_max_gates];'+
    // '            uniform float gate_velocity[number_max_gates];'+
    // '            uniform int temporal_delay[real_number_particles];'+
    // '            uniform int offsetArray[number_max_gates];'+
    // '            uniform int number_segmentation_pattern_fitting;'+
    // '            varying vec3 vColor;'+
    // '            varying float my_opacity;'+
    // '            varying float distance_with_arrival;'+
    // '            varying float distance_with_departure;'+
    // '            float actual_velocity;'+
    // ''+
    // '     '+
    // ''+
    // '            varying float vRotation;'+
    // '            int gate = 0;'+
    // ''+
    // '            int MOD(int a, int b){'+
    // '         '+
    // '                int result = a / b;'+
    // '                result = b * result;'+
    // '                result = a - result;'+
    // '                return result;'+
    // '            }'+
    // '            float rand(vec2 co){'+
    // '                return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);'+
    // '            }'+
    // '            float distance(float x1, float y1, float x2, float y2){'+
    // ''+
    // '                float longueur = sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));'+
    // '                return longueur;'+
    // '            }'+
    // '            int determine_which_gate(int index_thorique){'+
    // ''+
    // '                for(int i = 0; i < number_max_gates - 1; i++){'+
    // '                    int actual_gate_pos = gate_position[i] ;'+
    // '                    int next_gate_pos = gate_position[i+1] ;'+
    // '                    if(index_thorique <= next_gate_pos && index_thorique > actual_gate_pos){'+
    // '                        gate = i;'+
    // '                    }'+
    // '                '+
    // '                    if(index_thorique >= next_gate_pos && index_thorique >= actual_gate_pos &&'+
    // '                        next_gate_pos == 0 && actual_gate_pos != 0){'+
    // '                        gate = i;'+
    // '                    }'+
    // '                }'+
    // '                return gate;'+
    // '            }'+
    // ''+
    // '            float fadeSize(float actualSize, float nextSize, int steps, int index){ '+
    // ''+
    // '                float temporarySize = ((nextSize - actualSize)/ float(steps)) * float(index);'+
    // '                return actualSize + temporarySize;'+
    // ''+
    // '            }'+
    // '            float fadeOpacity(float actualSize, float nextSize, int steps, int index){ '+
    // ''+
    // '                float temporarySize = ((nextSize - actualSize)/ float(steps)) * float(index);'+
    // '                return actualSize + temporarySize;'+
    // ''+
    // '            }'+
    // '            vec3 fadeRGB(vec3 oldColor, vec3 newColor, int steps, int index){'+
    // ''+
    // '                vec3 my_color;'+
    // '                float redStepAmount = ((newColor.x - oldColor.x) / float(steps)) * float(index);'+
    // '                float greenStepAmount = ((newColor.y - oldColor.y) / float(steps)) * float(index);'+
    // '                float blueStepAmount = ((newColor.z - oldColor.z) / float(steps)) * float(index);'+
    // '                '+
    // '                newColor.x = oldColor.x + redStepAmount;'+
    // '                newColor.y = oldColor.y + greenStepAmount;'+
    // '                newColor.z = oldColor.z + blueStepAmount;'+
    // ''+
    // '                my_color = vec3(newColor.x ,newColor.y, newColor.z);'+
    // ''+
    // '                return my_color;'+
    // ''+
    // '            }'+
    // '            float noise(vec2 p){'+
    // '                vec2 ip = floor(p);'+
    // '                vec2 u = fract(p);'+
    // '                u = u*u*(3.0-2.0*u);'+
    // ''+
    // '                float res = mix('+
    // '                    mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),'+
    // '                    mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);'+
    // '                return res*res;'+
    // '            }'+
    // '            vec2 bezier(int t, vec2 p0,vec2 p1,vec2 p2,vec2 p3){'+
    // ''+
    // '                highp float timer = float(t);'+
    // ''+
    // '                highp float time = (timer * 1.0/(float(number_segmentation) )) - 0.1;'+
    // ''+
    // '                float cX = 3.0 * (p1.x - p0.x);'+
    // '                float bX = 3.0 * (p2.x - p1.x) - cX;'+
    // '                float aX = p3.x - p0.x - cX - bX;'+
    // ''+
    // '                float cY = 3.0 * (p1.y - p0.y);'+
    // '                float bY = 3.0 * (p2.y - p1.y) - cY;'+
    // '                float aY = p3.y - p0.y - cY - bY;'+
    // ''+
    // '                float x = (aX * pow(time, 3.0)) + (bX * pow(time, 2.0)) + (cX * time) + p0.x;'+
    // '                float y = (aY * pow(time, 3.0)) + (bY * pow(time, 2.0)) + (cY * time) + p0.y;'+
    // ''+
    // '                vec2 result = vec2( x,y );'+
    // ''+
    // '                return result;'+
    // '            }'+
    // '            mat4 rotation(float x) {'+
    // '              vec4 line_1 = vec4(cos(x), -sin(x), 0.0, 0.0);'+
    // '              vec4 line_2 = vec4(sin(x), cos(x), 0.0, 0.0);'+
    // '              vec4 line_3 = vec4(0.0, 0.0, 1.0, 0.0);'+
    // '              vec4 line_4 = vec4(0.0, 0.0, 0.0, 1.0);'+
    // ''+
    // '              return mat4(line_1,line_2,line_3,line_4);'+
    // '            }'+
    // '            mat4 translation(float x, float y) {'+
    // '              vec4 line_1 = vec4(1.0, 0.0, 0.0,  x);'+
    // '              vec4 line_2 = vec4(0.0, 1.0, 0.0,  y);'+
    // '              vec4 line_3 = vec4(0.0, 0.0, 1.0, 0.0);'+
    // '              vec4 line_4 = vec4(0.0, 0.0, 0.0, 1.0);'+
    // ''+
    // '              return mat4(line_1,line_2,line_3,line_4);'+
    // '            }'+
    // '            mat4 changerEchelle(float sx, float sy) {'+
    // '              vec4 line_1 = vec4(sx, 0.0, 0.0, 0.0);'+
    // '              vec4 line_2 = vec4(0.0, sy, 0.0, 0.0);'+
    // '              vec4 line_3 = vec4(0.0, 0.0, 1.0, 0.0);'+
    // '              vec4 line_4 = vec4(0.0, 0.0, 0.0, 1.0);'+
    // ''+
    // '              return mat4(line_1,line_2,line_3,line_4);'+
    // '            }'+
    // ''+
    // '            void main() {'+
    // ''+
    // '                vColor = customColor;'+
    // '                vec3 newPosition = position;'+
    // '                vec4 mvPosition;'+
    // '                float ANGLE = 90.0;'+
    // ''+
    // ''+
    // '          '+
    // '                highp int id_faisceaux = int(id_particle);'+
    // '                actual_velocity = float(gate_velocity[0]);'+
    // ''+
    // '                float timer =  uTime;'+
    // '                highp int my_time = int(timer);'+
    // ''+
    // '         '+
    // '                my_time = my_time + temporal_delay[id_faisceaux];'+
    // '     '+
    // '                int index_old = MOD(my_time , number_segmentation_pattern_fitting);'+
    // '   '+
    // '                float virtual_index = float(index_old);'+
    // '                virtual_index = virtual_index;'+
    // '                highp int index2 = int(virtual_index);'+
    // ''+
    // ''+
    // '                gate = determine_which_gate(index2);'+
    // ''+
    // ''+
    // ''+
    // '                float multiplicateur = 1.0;'+
    // '                if (gate_velocity[gate] == 1.0){multiplicateur = 0.0;}'+
    // ''+
    // '                float difference = 0.0;'+
    // '                float difference_gate_before = 0.0;'+
    // '                '+
    // ''+
    // '                float new_index = (float(index2) * gate_velocity[gate]) - float(offsetArray[gate]);'+
    // '                highp int index = int(new_index);'+
    // ''+
    // '                '+
    // ''+
    // '      '+
    // ''+
    // '                vec4 path;'+
    // '                vec4 path_next;'+
    // ''+
    // '                highp int path_id = int(id) * (4);'+
    // ''+
    // ''+
    // '                path = vec4( bezier(index, path_quadratic[path_id],path_quadratic[path_id+ 1],path_quadratic[path_id + 2],path_quadratic[path_id+3]), 1.0,1.0);'+
    // '                path_next = vec4( bezier(index +1, path_quadratic[path_id],path_quadratic[path_id+ 1],path_quadratic[path_id + 2],path_quadratic[path_id+3]), 1.0,1.0);'+
    // ''+
    // '                '+
    // ''+
    // '                distance_with_arrival = distance(path.x, path.y, path_quadratic[path_id+3].x, path_quadratic[path_id+3].y);'+
    // '                distance_with_departure = distance(path.x, path.y, path_quadratic[path_id].x, path_quadratic[path_id].y);'+
    // ''+
    // '                float random = noise(vec2( index , index )) * wiggling_gate[gate];'+
    // ''+
    // '                float angle = atan(path_next.y - path.y, path_next.x - path.x );'+
    // '                vRotation =  - angle;'+
    // ''+
    // ''+
    // ''+
    // ''+
    // ''+
    // '                mat4 my_matrice =  translation(path.x + random,path.y+ random);'+
    // '                vec4 positionEchelle = vec4(0.0,0.0,1.0,1.0) * my_matrice;'+
    // '       '+
    // '                mvPosition =  modelViewMatrix * positionEchelle;'+
    // ''+
    // '                size_fadding = size[gate];'+
    // '                my_opacity = gate_opacity[gate];'+
    // '                '+
    // '                '+
    // '                '+
    // ''+
    // '                if (size[gate] != size[gate+1]){'+
    // '                   size_fadding = fadeSize(size[gate], size[gate+1], gate_position[gate+1] - gate_position[gate], index - gate_position[gate]);'+
    // '                }'+
    // ''+
    // '                '+
    // '                vColor = vec3(gate_colors[gate].x ,gate_colors[gate].y, gate_colors[gate].z);'+
    // ''+
    // '                index_ = float(index);'+
    // '                segmentation = float(number_segmentation);'+
    // '                '+
    // '                gl_PointSize = size_fadding;'+
    // '                sprite_size = gl_PointSize;'+
    // ''+
    // '                gl_Position = projectionMatrix * mvPosition;'+
    // ''+
    // ''+
    // '}';
        
    




    



    

}


}