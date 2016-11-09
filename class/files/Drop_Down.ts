

class Drop_Down{

    ConfluentGraph;
    link_id;
    container;
    id;
    gate;
    min;
    max;
    data;

    constructor(ConfluentGraph, container, link_id,  name){
        
        this.container = d3.select(container).append("div").attr("class","graph").attr("id",name);
        this.link_id = link_id;
        this.ConfluentGraph = ConfluentGraph;
        this.id = name;



        this.make_options();
        this.make_UI();
        

    }
    make_options(){
        switch(this.id)
        {
                case "texture":
                this.data = [ 
                        {name:" --- Select the particle form --- ", URL:""},
                        {name:"square", URL:"square_texture.png"}, 
                        {name:"circle", URL:"circle_texture.png"},
                        {name:"rectangle", URL:"rectangle_texture.png"},
                        {name:"star", URL:"star_texture.png"},
                        {name:"informations", URL:"informations_texture.png"},
                        {name:"triangle", URL:"triangle_texture.png"},
                        {name:"arrow", URL:"arrow_texture.png"}
                    ];
                break;
        }
    }
    make_UI(){
        this.make_slider();
    }
    make_slider(){
        var self = this;

        var select = this.container.append('div')
            .append("select")
            .on("change", function() { self.update_values(this.value) });

        select.selectAll("option")
            .data(this.data)
            .enter().append("option")
            .attr("value", function(d) { return d.URL; })
            .text(function(d) { return d.name; });

    }
    update_values(value){
        var self = this;
        if (this.id == "texture"){
            this.ConfluentGraph.updateParticles_Texture(this.link_id, value);
        }
        
    }
    get_values(){
        var value = 0;
        var uniforms = this.ConfluentGraph.links[this.link_id].particleSystems.material.__webglShader.uniforms;
        if (this.id == "texture"){
            value = uniforms.texture.name;
        }
        
        return value;
    }


   
        
}

