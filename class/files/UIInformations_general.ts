

class UIInformations_general{
    ConfluentGraph;
    link_id;
    container;
    gate;
   
    constructor(ConfluentGraph, container){
       this.container = d3.select(container).append("div").attr("class","graph").attr("id","general_infos");
       this.ConfluentGraph = ConfluentGraph;
  
       this.make_header();
       this.make_color_picker();
       this.make_slider_frame();

       this.change_color();
    }
    change_color(){

        var self = this;
        $("#color_bg_selector").on('change', function(e, color) { 
            console.log(color)
            var my_color = new THREE.Color();
            my_color.r = color._r /255;
            my_color.g = color._g /255;
            my_color.b = color._b /255;

            //console.log("COLOR IS ",typeof(my_color))
            //var color_three = new THREE.Color( my_color );
            renderer.setClearColor( my_color, 1 );
        });

    }
    make_header(){
        this.container.append('div')
            .attr("id", "header_general_properties")
            .append('text')
            .text(" General Properties : ");

    }
    make_color_picker(){
        var self = this;
        this.container.append("text").text("Background Color : ")
        this.container.append("input").attr("id","color_bg_selector"); 
        $("#color_bg_selector").spectrum({
            preferredFormat: "hsl",
            showInput: true,
            color : 0x00000

        });
    }












    make_slider_frame(){
        var self = this;

        var alpha_selector = this.container.append('div')
            .attr("id", "frame_rate")
            .append('text')
            .text("Frame rate : ");

        alpha_selector.append("input")
                .attr("type","range")
                .attr("min","0")
                .attr("max","500")
                .attr("id", "input_frame")
                .attr("value", function() {
                    this.value = frame_rate;
                })
                .on("input", function() {
                    clearInterval(refreshIntervalId);
                    launch_animation(this.value)
                    d3.select("#label_input_frame").text(this.value);
                    frame_rate = this.value;
                });

         alpha_selector.append('label')
            .attr("for","input_frame")
            .attr("id", "label_input_frame")
            .text(frame_rate);

       /* var checkbox = this.container.append('div')
            .attr("id", "frame_rate_normal")
            
        checkbox.append('text')
            .text("Normal Frame Rate : ");

        var yo = checkbox.append("input")
            .attr("type", "checkbox")
            .attr("id", "checkbox_normal_frame")
            .attr('checked',true)
            .on("click", function(d){
                console.log(this.id)
   
                yo.attr("checked", false);
                //d3.select("#checkbox_normal_frame");
            });*/
    

        

    }
}
