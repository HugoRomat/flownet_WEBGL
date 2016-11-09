///<reference path="../utils/three.d.ts"/>
///<reference path="../utils/d3.d.ts"/>
///<reference path="../utils/jquery.d.ts"/>
///<reference path="../utils/networkcube.d.ts"/>

class Mapping{

    confluentGraph;
    particle_size_scale = d3.scale.linear().domain([0,0]).range([20,150]);
    particle_color_scale = d3.scale.linear().domain([0,0]).interpolate(d3.interpolateHcl).range([ d3.rgb('#000000'),d3.rgb("#0051FF")])

    node_color_scale = d3.scale.category10();
    
    particle_parameter_color;
    particle_parameter_size;
    
    node_parameter_color;
    node_parameter_size;

    tube_parameter_color;
    tube_parameter_width;

    constructor(confluentGraph){

        this.confluentGraph = confluentGraph;

    }
    mapping_object(my_object){
        console.log("OBJECT", my_object);
        var object = my_object
        switch(object["selector"]) {
            case "nodes":
                console.log("NODES")
                switch(object["parameters"]) {
                    //PAS UTILE CAR SCALE DE COLOR
                    case "color":
                        this.node_parameter_color = "#"+object["value"];
                        //console.log("COLOR", "#"+object["value"], this.node_parameter_color)
                        //this.confluentGraph.updateNodes_color(new THREE.Color( "#"+object["value"]));
                        break;
                    
                    case "size":
                        this.node_parameter_size = object["value"];
                        break;

                }
                break;
            case "tube":
                console.log("TUBE")
                switch(object["parameters"]) {
                    case "color":
                        console.log("COLOR")
                        this.tube_parameter_color = "#"+object["value"];
                        //this.confluentGraph.set_tubes_color(new THREE.Color( "#"+object["value"]));
                        break;
                    case "size":
                        console.log("UPDATE SIZE")
                        this.tube_parameter_width = object["value"];
                        //this.confluentGraph.set_tubes_width(object["value"]);
                        break;

                }
                break;
            case "mapping_particles":
                console.log("MAPPING")
                switch(object["parameters"]) {
                    case "color":
                        this.particle_parameter_color = object["value"];
                        break;
                    case "size":
                        this.particle_parameter_size = object["value"];
                        break;

                }
                break;
            case "mapping_nodes":
                console.log("MAPPING")
                switch(object["parameters"]) {
                    case "color":
                        //this.node_parameter_color = object["value"];
                        break;


                }
                break;
            case "particles":
                console.log("PARTICLES")
                switch(object["parameters"]) {
                    case "color":
                        console.log("COLOR")
                        this.particle_color_scale.range([d3.rgb('#000000'), "#"+object["value"]]);
                        break;
                }
                break;

        }
    }
    launch_mapping(){
        var nodes = this.confluentGraph.nodes;
        var links = this.confluentGraph.links;

        //Recupere les maximum pour les mettre sur les input des echelles
        var max_particle_color = this.confluentGraph.get_max_of_attributes(this.particle_parameter_color);
        var max_particle_size = this.confluentGraph.get_max_of_attributes(this.particle_parameter_size);

        this.particle_color_scale.domain([0, max_color]);
        this.particle_size_scale.domain([0, max_size]);

        for (var i = 0;i<links.length; i++){
            //console.log(links[i]);
            //console.log(this.parameter_color)
            //links[i].gate_colors[0] = new THREE.Color(this.parameter_color);
            this.confluentGraph.set_tube_color(i, this.tube_parameter_color, 1);
            this.confluentGraph.set_tube_width(i, this.tube_parameter_width);

            // var attr_size = parseFloat(links[i].attr(this.particle_parameter_size));
            // links[i].size[0] = this.particle_size_scale(attr_size);

            // var attr_color = parseFloat(links[i].attr(this.particle_parameter_color));
            // links[i].gate_colors[0] = new THREE.Color(this.particle_color_scale(attr_color));
        }

        for (var i =0; i<nodes.length;i++){
            //console.log(this.node_parameter_color)
            this.confluentGraph.updateNode_color(i , new THREE.Color(this.node_parameter_color))
            this.confluentGraph.updateNode_scale(i, this.node_parameter_size);
            // var attr_color = parseFloat(nodes[i].attr(this.node_parameter_color)) ;
            // //console.log(new THREE.Color(this.node_color_scale(attr_color)))
            // this.confluentGraph.updateNode_color(i, new THREE.Color(attr_color));
        }
        // for (var i =0; i<nodes.length;i++){
        //     var attr_color = parseFloat(nodes[i].attr(this.node_parameter_color)) ;
        //     console.log(new THREE.Color(this.node_color_scale(attr_color)))
        //     this.confluentGraph.updateNode_color(i, new THREE.Color(this.node_color_scale(attr_color)),1);
        // }

    }
    map_from_array(array){
        //Piur chaque selector
        for (var i=0; i< array.length; i++){
            this.mapping_object(array[i]);
        }
    }

}