///<reference path="../utils/three.d.ts"/>
///<reference path="../utils/d3.d.ts"/>

///<reference path="../utils/networkcube.d.ts"/>


class Slider_Button{

    ConfluentGraph;
    link_id;
    container;
    id;
    gate;
    min;
    max;
    step;

    constructor(ConfluentGraph, container, link_id, gate, name){
        
        this.container = d3.select(container).append("div").attr("class","graph").attr("id",name);
        this.link_id = link_id;
        this.ConfluentGraph = ConfluentGraph;
        this.id = name;
        this.gate = gate;

        this.make_options();
        this.make_UI();
        
        

    }
    make_options(){
        switch(this.id)
        {
                case "velocity":
                this.min = 0.0;
                this.max = 1.9;
                this.step = 0.1;
                break;

                case "size":
                this.min = 10;
                this.max = 150;
                this.step = 10;
                break;

                case "opacity":
                this.min = 0;
                this.max = 1;
                this.step = 0.1;
                break;

                case "wiggling":
                this.min = 0;
                this.max = 1;
                this.step = 0.1;
                break;

                case "link_width":
                this.min = 0;
                this.max = 5;
                this.step = 0.1;
                break;
        }
    }
    make_UI(){
        this.make_slider();
    }
    make_slider(){
        var self = this;

        var alpha_selector = this.container.append('div')
            //.attr("id", this.id)
            .append('text')
            .text("Particle " + this.id + " : ");
        alpha_selector.append("input")
                .attr("type","range")
                .attr("min",self.min)
                .attr("max",self.max)
                .attr("step",self.step)
                .attr("id", "input_alpha")
                .attr("value", function() {
                    this.value = self.get_values();
                })
                .on("input", function() {
                    self.update_values(parseFloat(this.value));
                    d3.select("#label_input"+self.id).text(this.value);
                });
        alpha_selector.append('label')
            .attr("for","input_frame")
            .attr("id", "label_input"+self.id)
            .text(function() {
                    return self.get_values();
                })
    }
    update_values(value){
        var self = this;

        if (this.id == "velocity"){
            this.ConfluentGraph.updateParticles_Velocity(this.link_id, this.gate, value);
        }
        if (this.id == "size"){
            this.ConfluentGraph.updateParticles_Size(this.link_id, this.gate, value);
        }
        if (this.id == "opacity"){
            this.ConfluentGraph.updateParticles_Opacity(this.link_id, this.gate, value);
        }
        if (this.id == "wiggling"){
            this.ConfluentGraph.updateParticles_Wiggling(this.link_id, this.gate, value);
        }
        if (this.id == "link_width"){
            this.ConfluentGraph.updateLinks_width_gate(this.link_id, this.gate, value);
            self.ConfluentGraph.updateTube_width_gate(self.link_id,self.gate, value); 
        }
        
    }
    get_values(){
        var value = 0;
        var uniforms = this.ConfluentGraph.links[this.link_id].particleSystems.material.__webglShader.uniforms;
        if (this.id == "velocity"){
            value = uniforms.velocity.value[this.gate];
        }
        if (this.id == "size"){
            value = uniforms.size.value[this.gate];
        }
        if (this.id == "opacity"){
            value = uniforms.opacity.value[this.gate];
        }
        if (this.id == "wiggling"){
            value = uniforms.wiggling.value[this.gate];
        }
        if (this.id == "link_width"){
            value = this.ConfluentGraph.links[this.link_id].gate_infos[this.gate].factor;
        }
        return value;
    }


   
        
}

