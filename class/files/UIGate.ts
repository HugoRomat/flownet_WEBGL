

class UIGate{
   
    container;
    link_id;
    confluent_graph;
    slider1;
    slider2;
    colorpicker;
    informations;
    link_appearance;
    velocity;
    opacity;
    size;
    wiggling;
    informations_general;
    link_width;
    texture;

    constructor(confluent_graph, container, link_id){
        this.container = d3.select(container);
        this.link_id = link_id;
        this.confluent_graph = confluent_graph;

        
        this.delete_UI();
        this.make_UI_general();
        this.make_UI();
        
    }
    update_UI(){
        this.delete_UI();
        this.change_appearanceLink();
        this.make_graphs(0);
    }
    make_array(length){
        var array = [];
        for (var i = 0;i<length ; i++){
            array[i] = i;
        }
        return array;
    } 
    delete_UI(){
        console.log("DELETE");
        this.container.selectAll(".graph").remove();
        d3.select("#general").selectAll(".graph").remove();
    }   
    make_UI(){
        //Ajoute le changement de couleur/width/link_opacity pour chaque tube
        this.change_appearanceLink();

        var self = this;
        //console.log(this.confluent_graph.links[this.link_id].gates)
        var array_data = this.confluent_graph.links[this.link_id].gates;
        var length = this.confluent_graph.links[this.link_id].gates.length
        var data = this.make_array(length);

        var selection = this.container.append('div')
            .attr("id", "select")
            .append('text')
            .text("Gate n° : ");

        
         var select = selection.append('select')
             .on('change',onchange)
        var options = select.selectAll('option')
            .data(data).enter()
            .append('option')
                .text(function (d) { return d; });

        self.make_graphs(0);
        function onchange() {
            
             var value = this.options[this.selectedIndex].value;
             self.delete_UI();
             self.change_appearanceLink();
             self.make_graphs(value);

         };
    }
    make_graphs(value){
        //value is the number of gates

        var number_particles = this.confluent_graph.links[this.link_id].userData.number_particles;
        var temporal_distribution = this.confluent_graph.links[this.link_id].temporal_distribution;
        var spatial_distribution = this.confluent_graph.links[this.link_id].spatial_distribution;
        //console.log("TEMPORAL", temporal_distribution, spatial_distribution)

        var number_temporal = this.confluent_graph.links[this.link_id].temporal_distribution.length;

        //console.log(this.confluent_graph.links[this.link_id].temporal_distribution)
        //console.log(temporal_distribution)
    
        if (value == 0){
            this.slider1 = new SliderButton(this.confluent_graph, "#temporal_control", this.link_id, number_particles, temporal_distribution,value, number_temporal, "temporal");
            this.slider2 = new SliderButton(this.confluent_graph, "#temporal_control", this.link_id, number_particles, spatial_distribution,value, 12, "spatial");
            this.velocity = new Slider_Button(this.confluent_graph, "#temporal_control", this.link_id, value, "velocity");
        }
        
        this.colorpicker = new ColorPicker(this.confluent_graph, "#temporal_control", this.link_id, value);
        this.link_width = new Slider_Button(this.confluent_graph, "#temporal_control", this.link_id, value,"link_width");
        this.opacity = new Slider_Button(this.confluent_graph, "#temporal_control", this.link_id, value, "opacity");
        this.size = new Slider_Button(this.confluent_graph, "#temporal_control", this.link_id, value,"size");
        this.wiggling = new Slider_Button(this.confluent_graph, "#temporal_control", this.link_id, value,"wiggling");
        
        
        
        
    }
    change_appearanceLink(){
        this.informations = new UIInformations(this.confluent_graph, "#general", this.link_id);
        this.link_appearance = new LinkAppearance(this.confluent_graph, "#general", this.link_id);
        this.texture = new Drop_Down(this.confluent_graph, "#temporal_control", this.link_id, "texture");
    }
    make_UI_general(){

        //d3.select("#general").append("div").append("span").attr("class","fa fa-mouse-pointer");
        this.informations_general = new UIInformations_general(this.confluent_graph, "#general");
    }
}

