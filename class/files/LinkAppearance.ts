

class LinkAppearance{

    ConfluentGraph;
    link_id;
    container;

    constructor(ConfluentGraph, container, link_id){
        
        this.container = d3.select(container).append("div").attr("class","graph").attr("id","link");
        this.link_id = link_id;
        this.ConfluentGraph = ConfluentGraph;

        this.make_UI();
        this.change_color();

    }
    change_color(){

        var self = this;
        $("#color_picker_link").on('change', function(e, color) { 
            //console.log(color.toHex())
            var my_color = color.toHex();
            my_color = "0x" + my_color;
            //console.log(self.ConfluentGraph.tube[self.link_id].children[0])
            self.ConfluentGraph.tube[self.link_id].children[0].material.color.setHex( my_color );
        });

    }
    make_alpha_gates(){
        var self = this;

        var alpha_selector = this.container.append('div')
            .attr("id", "alpha_gates_selector")
            .append('text')
            .text("Gates alpha : ");
        alpha_selector.append("input")
                .attr("type","range")
                .attr("min","0")
                .attr("max","1")
                .attr("step","0.01")
                .attr("id", "input_alpha")
                .attr("value", function() {
                    var gates = self.ConfluentGraph.links[self.link_id].gates;
                    if (gates[1] != undefined){this.value = gates[1].object.material.opacity;}
                })
                .on("input", function() {
                    //console.log("MY Gates", self.ConfluentGraph.links[self.link_id].gates)
                    var gates = self.ConfluentGraph.links[self.link_id].gates;
                    for (var i=1; i < gates.length; i++){
                        gates[i].object.material.opacity = this.value;
                    }
                    d3.select("#alpha_gates").text(this.value);
                });
        alpha_selector.append('label')
            .attr("for","input_frame")
            .attr("id", "alpha_gates")
            .text(function() {
                    var gates = self.ConfluentGraph.links[self.link_id].gates;
                    if (gates[1] != undefined){return gates[1].object.material.opacity;}
                })
    }
    make_alpha_tube_picker(){
        var self = this;

        var alpha_selector = this.container.append('div')
            .attr("id", "alpha_tube_selector")
            .append('text')
            .text("Tube alpha : ");
        alpha_selector.append("input")
                .attr("type","range")
                .attr("min","0")
                .attr("max","1")
                .attr("step","0.01")
                .attr("id", "input_alpha")
                .attr("value", function() {
                    this.value = self.ConfluentGraph.tube[self.link_id].children[0].material.opacity;
                })
                .on("input", function() {
                    console.log("MY TUBE", self.ConfluentGraph.tube[self.link_id])
                    self.ConfluentGraph.tube[self.link_id].children[0].material.opacity = this.value;
                    d3.select("#alpha_tube").text(this.value);
                });
        alpha_selector.append('label')
            .attr("for","input_frame")
            .attr("id", "alpha_tube")
            .text(function() {
                    return self.ConfluentGraph.tube[self.link_id].children[0].material.opacity;
                })
    }
    make_alpha_links_picker(){
        var self = this;

        var alpha_selector = this.container.append('div')
            .attr("id", "alpha_links_selector")
            .append('text')
            .text("Links alpha : ");
        alpha_selector.append("input")
                .attr("type","range")
                .attr("min","0")
                .attr("max","1")
                .attr("step","0.01")
                .attr("id", "input_alpha")
                .attr("value", function() {
                    this.value = self.ConfluentGraph.curveSplines[self.link_id].children[0].material.opacity;
                })
                .on("input", function() {
                    var lines = self.ConfluentGraph.curveSplines[self.link_id].children;
                    for (var i = 0; i< lines.length; i++){
                        lines[i].material.opacity = this.value;
                    }
                    d3.select("#alpha_links").text(this.value);
                });
        alpha_selector.append('label')
            .attr("for","input_frame")
            .attr("id", "alpha_links")
            .text(function() {
                    return self.ConfluentGraph.curveSplines[self.link_id].children[0].material.opacity;
                })
    }
    make_color_picker(){
        var self = this;
        //console.log(self.ConfluentGraph.tube[this.link_id].children[0].material.color.getHSL());
        //console.log(self.ConfluentGraph.tube[this.link_id].children[0].material);
        var color = self.ConfluentGraph.tube[this.link_id].children[0].material.color.getHSL();
        console.log("MY COLOR IS ", color);

        this.container.append("text").text("Tube Color :")
        this.container.append("input").attr("id","color_picker_link"); 
        $("#color_picker_link").spectrum({
            preferredFormat: "hsl",
            showInput: true, 
            color : "hsl(" + color.h * 100 + "," + color.s * 100 + ","+ color.l * 100 + ")",

        });
       
    }
    change_tube_width(){
        var self = this;

        var alpha_selector = this.container.append('div')
            .attr("id", "width_links")
            .append('text')
            .text("Width Links : ");
        alpha_selector.append("input")
                .attr("type","range")
                .attr("min","0")
                .attr("max","10")
                .attr("step","0.5")
                .attr("id", "input_width")
                .attr("value", function() {
                    this.value = self.ConfluentGraph.links[self.link_id].width_tube;
                })
                .on("input", function() {
                    
                    // Adjust the width of the tube
                    self.ConfluentGraph.links[self.link_id].width_tube = parseFloat(this.value);
                    self.ConfluentGraph.updateLinks();

                    self.ConfluentGraph.updateParticles_Paths(self.link_id);
                    self.ConfluentGraph.updateTube();
                    d3.select("#tube_width").text(this.value);
                    // self.ConfluentGraph.createParticle()
                });
        alpha_selector.append('label')
            .attr("for","input_frame")
            .attr("id", "tube_width")
            .text(function() {
                    return self.ConfluentGraph.links[self.link_id].width_tube;
                })
    }
    make_header(){
        this.container.append('div')
            .attr("id", "header_tube_properties")
            .append('text')
            .text(" Tube Properties : ");

    }
    make_UI(){

        this.make_header();
        this.make_color_picker();
        this.make_alpha_tube_picker();
        this.make_alpha_links_picker();
        this.change_tube_width();
        this.make_alpha_gates();

    }

   
        
}

