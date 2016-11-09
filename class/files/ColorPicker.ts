

class ColorPicker{

    ConfluentGraph;
    link_id;
    container;
    gate;



    constructor(ConfluentGraph, container, link_id, gate){
       this.container = d3.select(container).append("div").attr("class","graph").attr("id","picker");
       this.link_id = link_id;
       this.ConfluentGraph = ConfluentGraph;
       this.gate = gate;
       
       this.make_color_picker();
       this.listen_events();

    }
    retrieve_color_gate(){
        var uniforms = this.ConfluentGraph.links[this.link_id].particleSystems.material.__webglShader.uniforms;
        var c =  uniforms.gate_colors.value[this.gate];
        var v = new THREE.Vector3( c.x, c.y, c.z )
        v = v.multiplyScalar ( 255 );
        var color = "rgb("+v.x+","+v.y+","+v.z+")";
        console.log(color);
        return color;
    }
    make_color_picker(){
        console.log("YOOOOOOO")
        var self = this
        //create a color_picker_input
        this.container.append("text").text("Change color Gate :")
        this.container.append("input").attr("id","color_picker"); 
        $("#color_picker").spectrum({
            preferredFormat: "rgb",
            showInput: true, 
            color : self.retrieve_color_gate()

        });
    }
    listen_events(){
        var self = this;
        $("#color_picker").on('change', function(e, color) { 
            console.log(color.toRgb())
            var color = color.toRgb();
            self.ConfluentGraph.updateParticles_Color(self.link_id, color, self.gate);
            
        });
        
    }





        
}

