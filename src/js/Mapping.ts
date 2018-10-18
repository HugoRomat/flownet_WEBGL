import * as d3 from 'd3'
import * as THREE from 'three';


import {Nodes} from './GraphicalElement/Nodes'
import {Links} from './GraphicalElement/Links'
import {Tracks} from './GraphicalElement/Tracks'
import {Particles} from './GraphicalElement/Particles'
import { LayoutManager } from './LayoutManager';
import { Visualisation } from './Visualisation';
import { UI } from './UI';
import { Map } from './GraphicalElement/Map';

export class Mapping{

    
    linksObject;
    nodesObject;
    layoutManager;
    visualisation;
    particlesObject;
    tracksObject;
    UI;
    mapDrawing;


    constructor(div, width, height, color, alpha, visualisation){
        //console.log("I HAVE CREATED A MAIN")
        // this.viz = new Main(div,null, null, width, height, color, alpha);
        // this.sparkiz = this.viz.sparkiz;
        if (visualisation == undefined) this.visualisation = new Visualisation(div, width, height, color, alpha, this);
        else {
            this.visualisation = visualisation;
        } 

        this.linksObject = new Links(this.visualisation.scene);
        this.nodesObject = new Nodes(this.visualisation.scene);
        this.tracksObject = new Tracks(this.visualisation.scene);
        this.particlesObject = new Particles(this.visualisation.scene, this.visualisation.camera);
        this.layoutManager = new LayoutManager();
        this.UI = new UI(this.visualisation, div, this.particlesObject);

        return this;
    }
    nodes(nodes) {
        this.nodesObject.data(nodes);
        this.layoutManager.mapNodes(nodes);
        return this;
    }
    links(links) {
        this.linksObject.data(links);
        this.tracksObject.data(links);
        this.particlesObject.data(links);
        this.layoutManager.mapLinks(links);
        // for(var i=0 ; i<this.sparkiz.links.length ; i++) this.sparkiz.links[i].link_length = 90;
        return this;
    }
    // create_layout(){
    //     var dataNodes = this.nodesObject.data();
    //     var dataLinks = this.linksObject.data();
    //     // console.log(dataNodes, dataLinks)
    //     this.layoutManager.map_links_nodes(dataNodes, dataLinks);

    //     return this;
    // }
    create_WEBGL_element() {
        
        if (this.visualisation.scene.children.length == 0){
            console.log("ADD ELEMENTS", this.visualisation.scene.children.length)
            this.nodesObject.createNodes();
            this.linksObject.createTube();
            this.tracksObject.createTracks();
            this.particlesObject.createParticles()
        }
        

        return this;
    }
    // start_particle_delay(delay) {
    //     this.viz.then -= delay;
    //     //this.viz.with_absolute_time();
    //     return this;
    // }
    start_particle_delay(delay) {
        this.visualisation.then -= delay;
        //this.viz.with_absolute_time();
        return this;
    }
    update() {
        this.nodesObject.createLabel();
        this.tracksObject.updatetracks();
        this.nodesObject.updateNodes();
        this.linksObject.updateTube();
        this.particlesObject.fit_all_particles_to_frequence_temporal_distrib();
        this.particlesObject.updateParticles();
        return this;
    }
    start(time) {
        var that = this;
        if (time != undefined) {
            this.layoutManager.restartLayout();
        }
        else time = 0;
        
        setTimeout(function(){ 
            that.nodesObject.createLabel();
            that.tracksObject.updatetracks();
            that.nodesObject.updateNodes();
            that.linksObject.updateTube();
            that.particlesObject.fit_all_particles_to_frequence_temporal_distrib();
            that.particlesObject.updateParticles();
            that.visualisation.animate();
        }, time);
        return this;
    }
    startAPIparticule_oneitem(time) {
        // this.sparkiz.launch_network2(time);
        // //this.viz.animate();
        // this.viz.with_absolute_time();
        return this;
    }
    map(projection, path, callback){
        this.mapDrawing = new Map(this.visualisation.scene, projection, path, callback);
        return this
    }
    particles(visual_attr, callback, gate){
        // console.log("GATE", gate)
        this.create_WEBGL_element();
        if (gate != undefined && gate > 1){console.log("Gate shoub be comprise between 0 and 1 ..."); return false;}
        var value;
        var gate_position;
        if (gate != undefined){ 
            this.particlesObject.isGates = true;
            gate = Math.round(gate * 20) 
        }
        var particles = this.particlesObject.data();
        var maxGates = this.particlesObject.getMaxGates();
        // console.log(particles)
        switch(visual_attr) {
            
            case "color":
                for(var i=0 ; i<particles.length ; i++){
                    if ( typeof(arguments[1]) == 'string'){
                        arguments[1].replace("#", "0x");
                        value = new THREE.Color(arguments[1]);
                    }
                    else{
                        var a = callback(particles[i], i);
                        a.replace("#", "0x");
                        value = new THREE.Color(a);
                    }
                    if (gate == undefined){gate_position = 0} 
                    if (gate != undefined){gate_position = gate} 
                    for(var k = gate_position ; k< maxGates ; k++) { 
                        // console.log(arguments[1], value)
                        particles[i].gate_colors[k] = value; 
                    }
                }
                return this;
            case "size":
                //console.log("SIZE", arguments[1],visual_attr,typeof(arguments[1]), gate )
                for(var i=0 ; i<particles.length ; i++){
                    if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                    else{value = callback(particles[i], i);}
                    if (gate == undefined){gate_position = 0} 
                    if (gate != undefined){gate_position = gate} 
                    for(var k = gate_position ; k< maxGates ; k++) { particles[i].size[k] = value; }
                }
                return this;

            case "opacity":
                for(var i=0 ; i<particles.length ; i++){
                    if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                    else{value = callback(particles[i], i);}
                    if (gate == undefined){gate_position = 0} 
                    if (gate != undefined){gate_position = gate} 
                    for(var k = gate_position ; k< maxGates ; k++) { particles[i].gate_opacity[k] = value; }
                }
                return this;

            case "speed":
                for(var i=0 ; i<particles.length ; i++){
                    if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                    else{value = callback(particles[i], i);}
                    if (gate == undefined){ gate_position = 0 } 
                    if (gate != undefined){ gate_position = gate } 
                    //for(var k=0 ; k<this.sparkiz.number_max_gates ; k++) this.sparkiz.links[i].gate_velocity[k] = value + 1;
                    for(var k = gate_position ; k< maxGates ; k++) {particles[i].gate_velocity[k] = value/12; }
                }
                return this;
            case "wiggling":
                //console.log(arguments[1],visual_attr,typeof(arguments[1]) )
                for(var i=0 ; i<particles.length ; i++){
                    if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                    else{value = callback(particles[i], i);}
                    if (gate == undefined){gate_position = 0} 
                    if (gate != undefined){gate_position = gate} 
                    //for(var k=0 ; k<this.sparkiz.number_max_gates ; k++) this.sparkiz.links[i].wiggling[k]  = value;
                    for(var k = gate_position ; k< maxGates ; k++) { particles[i].wiggling_gate[k] = value; }
                }
                return this;


            case "pattern":
                for(var i=0 ; i<particles.length ; i++){
                    if (arguments[1] instanceof Array){value = arguments[1];}
                    else{value = callback(particles[i], i);}
                    particles[i].temporal_distribution2 = value;
                }
                return this;
            case "track":
                for(var i=0 ; i<particles.length ; i++){
                    if (arguments[1] instanceof Array){value = arguments[1];}
                    else{value = callback(particles[i], i);}
                    // console.log(value)
                    particles[i].spatial_distribution = value;
                    //console.log(value);
                }
                return this;
            case "frequency":
                for(var i=0 ; i<particles.length ; i++){
                    if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                    else{ value = callback(particles[i], i);}
                    //AFIN DE METTRE LA FREQUENCE
                    // console.log("FREQUENCR", value, arguments)
                    particles[i].frequency_pattern = 1/parseFloat(value);
                }
                return this;
            
            case "texture":
                for(var i=0 ; i<particles.length ; i++){
                    if ( typeof(arguments[1]) == 'string'){value = arguments[1];}
                    else{value = callback(particles[i], i);}
                    particles[i].texture = value;
                }
                return this;
            
            
        }
    }
    
    tracks(visual_attr, callback){
        var value;
        
        var tracks = this.tracksObject.data();
        switch(visual_attr) {
            case "opacity":
                for(var i=0 ; i<tracks.length ; i++){
                    if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                    else{value = callback(tracks[i], i);}
                    tracks[i].roads_opacity = value;
                    //console.log("OPACITY", value)
                }

                return this;
            case "color":
                for(var i=0 ; i<tracks.length ; i++){
                    if ( typeof(arguments[1]) == 'string'){value = new THREE.Color(arguments[1]);}
                    else{
                        var a = callback(tracks[i], i);
                        value = new THREE.Color(a);
                    }
                    tracks[i].roads_color = value;
                    //console.log("OPACITY", value)
                }
                
                return this;
            case "count":
                for(var i=0 ; i<tracks.length ; i++){
                    if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                    else{value = callback(tracks[i], i);}
                    tracks[i].number_paths_particule = value;
                    //this.sparkiz.links[i].number_paths_particule = value;
                    //console.log("OPACITY", value)
                }
                
                return this;
        }
    }
    link_properties(visual_attr, callback){
        var value;
        this.create_WEBGL_element();
        var links = this.linksObject.data();
        

        // conso
        switch(visual_attr) {
            case "color":
                for(var i=0 ; i<links.length ; i++){
                    if ( typeof(arguments[1]) == 'string'){value = new THREE.Color(arguments[1]);}
                    else{
                        var a = callback(links[i], i);
                        value = new THREE.Color(a);
                        
                    }
                    // console.log(value)
                    links[i].linkColor = value;
                    // console.log(value.getHex())
                    
                    // this.sparkiz.tube[i].children[0].material.color.setHex(value.getHex());
                }
                return this;
            case "size":
                for(var i=0 ; i<links.length ; i++){
                    if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                    else{var value = callback(links[i], i);}
                    links[i].width_tube = value;
                    //this.sparkiz.set_tube_width(i, value);
                }
                return this;

            case "curvature":
                for(var i=0 ; i<links.length ; i++){
                    if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                    else{var value = callback(links[i], i);}
                    links[i].courbure = value;
                    // console.log("links", this.sparkiz.links[i])
                }
                return this;


            // case "courbure":
            //     value = arguments[1];
            //     this.sparkiz.courbure = value;
            //     return this;

            case "opacity":
                for(var i=0 ; i<links.length ; i++){
                    if (typeof(arguments[1]) == 'number'){value = arguments[1];}
                    else{ var value = callback(links[i], i);}
                    // this.sparkiz.tube[i].children[0].material.opacity = value;
                    links[i].tube_opacity = value;
                    // console.log(value)
                }
                return this;
            
            
        }
    }
    layout(visual_attr, callback){
        var value;
        switch(visual_attr) {
            case "linkDistance":
                var links = this.linksObject.data();
                for(var i=0 ; i<links.length ; i++){
                    if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                    else{var value = callback(links[i], i);}
                    links[i].link_length = value;
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
        this.create_WEBGL_element();
        var nodes = this.nodesObject.data();
        // console.log("MES MOEUDS", nodes)
        switch(visual_attr) {
            case "color":
                for(var i=0 ; i<nodes.length ; i++){
                    var color;
                    if ( typeof(arguments[1]) == 'string'){color = new THREE.Color(arguments[1]);}
                    else{
                        var a = callback(nodes[i], i);
                        color = new THREE.Color(a);
                    }
                    nodes[i].color = color;
                    //console.log("COLOR NODE", color)
                }
                
                return this;
            case "size":
                for(var i=0 ; i<nodes.length ; i++){
                    if ( typeof(arguments[1]) == 'number'){value = arguments[1];}
                    else{value = callback(nodes[i], i);}
                    nodes[i].scale = value;
                }
                return this;
            case "label":
                for(var i=0 ; i<nodes.length ; i++){
                    if ( typeof(arguments[1]) == 'string'){value = arguments[1];}
                    else{value = callback(nodes[i], i);}
                    nodes[i].label_name = value;
                }
                return this;
            case "label_size":
                for(var i=0 ; i<nodes.length ; i++){
                    if ( typeof(arguments[1]) == 'number' || typeof(arguments[1]) == 'string'){value = parseFloat(arguments[1]);}
                    else{value = parseFloat(callback(nodes[i], i));}
                    nodes[i].label_size = value;
                }
                return this;
            case "label_x":
                for(var i=0 ; i<nodes.length ; i++){
                    if ( typeof(arguments[1]) == 'number' || typeof(arguments[1]) == 'string'){value = parseFloat(arguments[1]);}
                    else{value = parseFloat(callback(nodes[i], i));}
                    nodes[i].label_x = value;
                }
                return this;
            case "label_y":
                for(var i=0 ; i<nodes.length ; i++){
                    if ( typeof(arguments[1]) == 'number' || typeof(arguments[1]) == 'string'){value = parseFloat(arguments[1]);}
                    else{value = parseFloat(callback(nodes[i], i));}
                    nodes[i].label_y = value;
                }
                return this;
            case "label_color":
                for(var i=0 ; i<nodes.length ; i++){
                    var color;
                    if ( typeof(arguments[1]) == 'string'){color = new THREE.Color(arguments[1]);}
                    else{var a = callback(nodes[i], i);
                        color = new THREE.Color(a);}
                        nodes[i].label_color = color;
                }
                return this;
            case "x":
                for(var i=0 ; i<nodes.length ; i++){
                    if ( typeof(arguments[1]) == 'number' || typeof(arguments[1]) == 'string'){value = parseFloat(arguments[1]);}
                    else{value = parseFloat(callback(nodes[i], i));}
                    // this.sparkiz.d3cola.stop();
                    // console.log(nodes[i].x, value)
                    nodes[i].x = value;
                    // console.log(nodes[i].x)
                }
                return this;
            case "y":
                //console.log("CHANGE VALUE")
                for(var i=0 ; i<nodes.length ; i++){
                    if ( typeof(arguments[1]) == 'number' || typeof(arguments[1]) == 'string'){value = parseFloat(arguments[1]);}
                    else{value = parseFloat(callback(nodes[i], i));}
                    // this.sparkiz.d3cola.stop();
                    nodes[i].y = value;
                }
                return this;
            case "z":
                //console.log("CHANGE VALUE")
                for(var i=0 ; i<nodes.length ; i++){
                    if ( typeof(arguments[1]) == 'number' || typeof(arguments[1]) == 'string'){value = parseFloat(arguments[1]);}
                    else{value = parseFloat(callback(nodes[i], i));}
                    // this.sparkiz.d3cola.stop();
                    nodes[i].z = value;
                    // console.log("VALUE", value)
                }
                return this;
            case "image":
                //console.log("CHANGE VALUE")
                for(var i=0 ; i<nodes.length ; i++){
                    if (typeof(arguments[1]) == 'string'){value = arguments[1];}
                    else{value = callback(nodes[i], i);}
                    nodes[i].load_texture_nodes(i, value);
                }
                return this;
        }
    }
}


