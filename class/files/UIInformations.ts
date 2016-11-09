///<reference path="../utils/three.d.ts"/>
///<reference path="../utils/d3.d.ts"/>

///<reference path="../utils/networkcube.d.ts"/>


class UIInformations{
    ConfluentGraph;
    link_id;
    container;
    gate;
   
    constructor(ConfluentGraph, container, link_id){
       this.container = d3.select(container).append("div").attr("class","graph").attr("id","informations");
       this.link_id = link_id;
       this.ConfluentGraph = ConfluentGraph;
  

       this.make_infos();
    }
    make_infos(){
        var number_particles = this.ConfluentGraph.links[this.link_id].userData.number_particles;
        this.container.append("div").text("Informations :");
        this.container.append("div").text("Links n° " + this.link_id)
        this.container.append("div").text(number_particles + " particles")
    }
}

