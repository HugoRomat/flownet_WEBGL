import * as d3 from 'd3'
import * as THREE from 'three';

import {Nodes} from './GraphicalElement/Nodes'
import {Links} from './GraphicalElement/Links'

export class LayoutManager{

    
    simulation
    nodes = [] 
    links = [];

    constructor(){
        this.initSimulation()
    }
    mapNodes(nodes){
        this.nodes = nodes;
        this.simulation.nodes(this.nodes);
    }
    mapLinks(links){
        this.links = links;
        this.simulation.force("link").links(this.links);
    }
    map_links_nodes(nodes, links){
        this.nodes = nodes;
        this.links = links;

        this.simulation.nodes(this.nodes);
        this.simulation.force("link").links(this.links);
    }
    initSimulation(){
        var that = this;
        this.simulation = d3.forceSimulation()
            .force("charge", d3.forceManyBody().strength(-200).distanceMin(50).distanceMax(500))
            // .force("collide", d3.forceCollide().strength(1).radius(function(d){ return d['r'] + 5; }).iterations(1))
            .force("link", d3.forceLink().id(function(d) { return d['id']; }).distance(200))
            // .velocityDecay(0.85)
            // .on("tick", that.onTick.call(that));
            // .on("tick", function(){ that.onTick.call(that); });
    }
    onTick(){
        // console.log("TICK");
        // console.log(this.nodes[0]['x'])
    }
    
}


