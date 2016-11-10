///<reference path="../utils/three.d.ts"/>
///<reference path="../utils/d3.d.ts"/>
///<reference path="../utils/jquery.d.ts"/>
///<reference path="../utils/networkcube.d.ts"/>

class Main{

    graph;
    nodes;
    links;
    interface_;
    particleVis;
    _UI;
    mapping;

    frame =0;
    refreshIntervalId;

    actual_frame = 0;
    currentFPS;
    then = Date.now();
    startTime = this.then;
    fps = 60;
    fpsInterval = 1000 / this.fps;
    delta;


    


    timerInterval = {};
    

    
    constructor(div,nodes, links ,width,height,bg_color){
    //constructor(div,graph,width,height,bg_color){

        //this.graph = graph;
        // this.nodes = this.graph.nodes().toArray();
        // this.links = this.graph.links().toArray();
        this.links = links;
        this.nodes = nodes;
        console.log(this.links)
        this.interface_ = new Visualisation(div, width, height, bg_color);
        this.particleVis = new ParticleVis(this.nodes, this.links, this.interface_);
        this._UI = new UI(this.particleVis, this.interface_.scene, this.interface_.camera, this.interface_.renderer, this.interface_.raycaster);
        

        this.mapping = new Mapping(this.particleVis);
        console.log("LAUNCH")
        //this.launch_animation(500);
        //this.self_adjusting_timer();
        this.animate(); 
        //this.calculate_FPS()
    }

    stop_renderer(){
        var self = this;

        clearInterval(this.refreshIntervalId);

        cancelAnimationFrame(this.refreshIntervalId);
        this.refreshIntervalId = undefined;

    }
    render(){
        //Update mes particule de une case
        this.particleVis.update();
        //Render l'interface graphique
        this.interface_.renderer.render(this.interface_.scene, this.interface_.camera);
    }
    /* Timer with setTimeout */
    launch_animation(frame_rating){
        var self = this;
        this.refreshIntervalId = setInterval(function() {
            self.render();
            self.frame++;
            }, frame_rating);
    }
    /* Timer with request animation frame */
    animate() {
        var self = this;
        this.refreshIntervalId = requestAnimationFrame(self.animate.bind(self));
        self.render();
        //stuff for animating goes here
        self.frame++;
        
    }
    calculate_FPS(){
        var self = this;
        //window.setInterval(this.gameLoop, 1000);
        setInterval(function() {
            //var now = Date.now();
            //var elapsed = now - self.then;
            var difference = self.frame - self.actual_frame;
            console.log("FPS ", difference/10);
            self.particleVis.FPS = 1;
            self.particleVis.fit_all_particles_to_frequence_temporal_distrib();
            self.particleVis.updateParticles_TemporalDistribution3();
            self.actual_frame = self.frame;

            }, 10000);
    }

    /* Self Adjusting Timer */
    self_adjusting_timer() {
        var self = this;
        requestAnimationFrame(this.self_adjusting_timer.bind(this));
        
        var now = Date.now();
        var elapsed = now - this.then;
        // if enough time has elapsed, draw the next frame
        if (elapsed > this.fpsInterval) {
            // Get ready for next frame by setting then=now, but...
            // Also, adjust for fpsInterval not being multiple of 16.67
            this.then = now - (elapsed % this.fpsInterval);
            var sinceStart = now - this.startTime;
            self.currentFPS = Math.round(1000 / (sinceStart / ++this.frame) * 100) / 100;
            //console.log(currentFps)
            self.render();
            // draw stuff here
        }
    }
    draw() {
        
        
        requestAnimationFrame(this.draw.bind(this));

        
        this.render();
        this.frame++;
        this.delta = (new Date().getTime() - this.then)/1000;
        this.then = new Date().getTime();
        
        //console.log(1/this.delta)

    }
 
}