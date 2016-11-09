///<reference path="../utils/three.d.ts"/>
///<reference path="../utils/d3.d.ts"/>

///<reference path="../utils/networkcube.d.ts"/>


class SliderButton{
    private static ID = 0;

    SLIDER_WIDTH;
    SLIDER_HIGHT;
    SIZE;
    confluent_graph;
    my_link = 1;
    particle = 100;
    values;
    svg;
    slider;

    id;
    type;
    title;
    container;
    number_values_temporal = 8;
    gate_id;


    constructor(confluent_graph, container, link_id, particle, values, gate_id, number_values, type){
        this.confluent_graph = confluent_graph;
        this.SLIDER_WIDTH = 400;
        this.SLIDER_HIGHT = 150;

        this.gate_id = gate_id;
        this.my_link = link_id;
        this.particle = particle;
        this.values = values;
        this.number_values_temporal = number_values;
        this.type = type;
        this.container = d3.select(container).append("div").attr("class","graph").attr("id","graph");
        //create a unique ID foreach slider
        this.id = SliderButton.ID;
        SliderButton.ID++;

        var self = this; 
        
        this.title = this.particle + ' particles / Link n° ' + self.my_link;

        this.makeSliderVertical( this.SLIDER_WIDTH, this.SLIDER_HIGHT, this.values, function(value){
            console.log("VALUE", value)
            
            var temporal_distribution = value;
            if (self.type == "temporal")
            {
                //J'update le temps auquel apparaissent mes particules
                // de la forme [10,10,0,0]
                //console.log(self.confluent_graph.links[self.my_link].temporal_distribution, this.gate_id)
                
                
                //console.log("1", self.confluent_graph.links[self.my_link].temporal_distribution, self.gate_id);
                self.confluent_graph.links[self.my_link].temporal_distribution = value;
                //console.log("2", self.confluent_graph.links[self.my_link].temporal_distribution);
                //console.log("TEMPORAL", self.confluent_graph.links[self.my_link].temporal_distribution)
                //self.confluent_graph.links[self.my_link].number_temporal_distribution = value.length;
                self.confluent_graph.updateParticles_TemporalDistribution(self.gate_id, temporal_distribution, self.my_link, self.number_values_temporal);

            }
            else{
                
                self.confluent_graph.links[self.my_link].spatial_distribution = value;
                self.confluent_graph.updateParticles_SpatialDistribution(temporal_distribution, self.my_link);

            }
            //console.log("update", self.confluent_graph.links[self.my_link].spatial_distribution, self.confluent_graph.links[self.my_link].temporal_distribution)
            self.update_graph(value);
        })
    }
    update_graph(value){

        //console.log(value.length,this.number_values_temporal)
        // Complete le tableau pour le nombre de slider
        //console.log(value, this.number_values_temporal)
        if (value.length != this.number_values_temporal){
            var array = [];
            for (var i=0;i<this.number_values_temporal;i++){
                array[i] = 0;
            }
            array[0]=this.particle;
            value = array;
        }
        //console.log(value, this.number_values_temporal)
        
        this.svg.selectAll("*").remove();
        this.container.selectAll("select").remove();

        //console.log("Value for graph", value)
        this.slider.set(value);
        this.slider.appendTo(this.svg);
        
        //update mon result dans mes links
        //this.confluent_graph.links[this.my_link].temporal_distribution = value;

    }
    
    makeSliderVertical(width, height,  values, f:Function){
        var self = this;

        console.log("spatial", self.confluent_graph.links[self.my_link].spatial_distribution)
        // Complete le tableau pour le nombre de slider
        //console.log(values, this.number_values_temporal)
        //console.log("MAKE GRAPH", values, this.number_values_temporal)
        if (values.length != this.number_values_temporal){
            var array = [];
            for (var i=0;i<this.number_values_temporal;i++){
                array[i] = 0;
            }
            array[0]=this.particle;
            values = array;
        }
        //console.log("MAKE GRAPH", values, this.number_values_temporal)

        //console.log(values)
        //var number_slider = 5;
        var max_per_slider = this.particle;

        //console.log("MI ID ID", this.id);
        this.slider = new MySlider(this.id, 50, 10, width, height,  0, max_per_slider, 1, this.number_values_temporal);

         this.container.append('text')
                .text(this.type + " distribution :")

        this.svg = this.container.append('svg')
            .attr('width', width)
            .attr('height', height);

        this.slider.set(values);
        this.slider.appendTo(this.svg);
        this.slider.setDragEndCallBack(f);

        // Make a selection with the number of temporal distribution we want
        if (self.type == "temporal")
        {
            var data = [2,3,4,5,6,7,8,9,10];
            var yo = this.container.append('text').text("Number of cycle : ");
            
            var select = this.container.append('select')
                .on('change',onchange)
            var options = select
                .selectAll('option')
                .data(data).enter()
                .append('option')
                    .text(function (d) { return d; });
        
            function onchange() {
                //console.log(self);
                //console.log(this.options[this.selectedIndex].value);
                self.number_values_temporal = parseInt(this.options[this.selectedIndex].value);
                self.update_graph(values);
            };
        }
        

    }
}

