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
        // console.log('map nodes')
        this.nodes = nodes;
        this.simulation.nodes(this.nodes);

        // this.sourceTargetNodesLinks();
    }
    mapLinks(links){
        console.log('map links')
        this.links = links;
        // this.simulation.force("link", d3.forceLink().id(function(d) { return d['id']; }).distance(function(d){ return d['link_length']}))
        // this.simulation.force("link", d3.forceLink().id(function(d) { return d['id']; }))//.strength(10))
        // this.simulation.force("link", d3.forceLink().id(function(d) { return d['id']; }).distance(function(d) {return  d['link_length'];}).strength(1))
        this.sourceTargetNodesLinks();

       
        // console.log('map links')
        this.simulation.force("link").links(this.links);
    }
    updateDistance(){
        var that = this;
        // this.simulation.force("link", d3.forceLink().id(function(d) { return d['id']; }))
        // this.simulation.force("link", d3.forceLink().distance(function(d) {console.log(d); return 100;}).strength(0.1))
        this.simulation.force("link").links(this.links).distance(function(d) {return d['link_length'];}).strength(0.1);
        
       
        console.log('GOO', this.links[0]['link_length'])
    }
    map_links_nodes(nodes, links){
        // this.nodes = nodes;
        // this.links = links;

        // this.simulation.nodes(this.nodes);
        // this.simulation.force("link").links(this.links);
        // console.log('GOO', this.links)
        // this.simulation.force("link", d3.forceLink().id(function(d) { return d['id']; }).distance(function(d) {return  d['link_length'];}).strength(1))
    }
    initSimulation(){
        var that = this;
        // console.log('init simulation')
        this.simulation = d3.forceSimulation()
            .force("charge", d3.forceManyBody())//.strength(-10))//.distanceMin(50).distanceMax(500))
            // .force("collide", d3.forceCollide().strength(1).radius(function(d){ return d['r'] + 5; }).iterations(1))
            // .force("link", d3.forceLink().id(function(d) { return d['id']; }).distance(function(d) {return d.distance;}).strength(0.1))
            .force("link", d3.forceLink().id(function(d) { return d['id']; }))
            // .force("link", d3.forceLink().id(function(d) { return d['id']; }).distance(function(d){ return d['link_length']}))
            // .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(100).strength(1))
            // d3.forceLink().distance(function(d) {return d.distance;}).strength(0.1)
            // .velocityDecay(0.85)
            // .on("tick", that.onTick.call(that));
            .on("tick", function(){ that.onTick.call(that); });
            
        this.simulation.stop();
    }
    sourceTargetNodesLinks(){
        for (var i in this.links){
            var node1 = this.nodes.find((item)=>{ return item.id == this.links[i]['source'] });
            var node2 = this.nodes.find((item)=>{ return item.id == this.links[i]['target'] });

            this.links[i]['source'] = node1;
            this.links[i]['target'] = node2;

            this.links[i]['index'] = i;

            // console.log(this.links[i],node1)
        }
    }
    restartLayout(){
        // console.log('RESTA', this.nodes, this.links)
        this.simulation.alphaTarget(1).restart()
    }
    stopLayout(){
        this.simulation.stop();
    }
    onTick(){
        // console.log("TICK", this.nodes[0]);
        // this.simulation.stop();
        // console.log(this.nodes[0]['x'])
    }
    
}


