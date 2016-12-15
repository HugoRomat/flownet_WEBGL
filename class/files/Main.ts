///<reference path="../utils/three.d.ts"/>
///<reference path="../utils/d3.d.ts"/>
///<reference path="../utils/jquery.d.ts"/>
///<reference path="../utils/networkcube.d.ts"/>
module Sparkiz {

    
    export class Main{

        graph;
        nodes;
        links;
        interface_;
        sparkiz;
        _UI;
        mapping;
        controls;

        frame =0;
        refreshIntervalId;

        actual_frame = 0;
        currentFPS;
        then = Date.now();
        startTime = this.then;
        fps = 60;
        fpsInterval = 1000 / this.fps;
        delta;
        delta2;
        delay_time_due_to_stop = Date.now();

        timerInterval = {};
        div;

        
        constructor(div,nodes, links ,width,height,bg_color, alpha){
        //constructor(div,graph,width,height,bg_color){
            this.div = div;
            //this.graph = graph;
            // this.nodes = this.graph.nodes().toArray();
            // this.links = this.graph.links().toArray();
            this.links = links;
            this.nodes = nodes;
            console.log(this.links)
            this.interface_ = new Visualisation(div, width, height, bg_color, alpha);
            this.sparkiz = new Sparkiz(this.nodes, this.links, this.interface_);

            this._UI = new UI(this.sparkiz, this.interface_.scene, this.interface_.camera, this.interface_.renderer, this.interface_.raycaster);
            
            //this.controls = new THREE.OrbitControls( this.interface_.camera, this.interface_.renderer.domElement);
            
			

            this.mapping = new Mapping(this.sparkiz);


            console.log("LAUNCH")
            //this.launch_animation(500);
            //this.self_adjusting_timer();
            //this.animate(); 
            //this.calculate_FPS()
        }
        stop_renderer(){
            var self = this;
            this.delay_time_due_to_stop = Date.now();

            clearInterval(this.refreshIntervalId);
            cancelAnimationFrame(this.refreshIntervalId);
            //this.refreshIntervalId = undefined;
        }
        start_renderer(){
            //Date a laquelle je reprend le timer
            var delta = (new Date().getTime() - this.delay_time_due_to_stop); 
            //Je recupere le temps du debut et je raccourci celui-ci en l'augmentant
            this.then = this.then + delta;

            //DELETE POUR EVITER D'EN LNCER DEUX
            clearInterval(this.refreshIntervalId);
            cancelAnimationFrame(this.refreshIntervalId);
            this.with_absolute_time();
            
        }
                    
        with_absolute_time(){
            var self = this;
            this.delay_time_due_to_stop = new Date().getTime();
            //this.then
            //self._UI.update();
            //window.setInterval(this.gameLoop, 1000);
            //var now = Date.now();
            //var elapsed = now - self.then;
            this.delta = (new Date().getTime() - this.then)/1000;
            var number_frame = 60 * this.delta;
            //console.log(this.delta * 60)
            this.refreshIntervalId = requestAnimationFrame(self.with_absolute_time.bind(self));
            self.render(number_frame);
            //stuff for animating goes here
            self.frame++;

        }
        render(number_frame){
            //Update mes particule de une case
            //this.sparkiz.update();
            this.sparkiz.updateParticle(number_frame);
            //this.controls.update();
            //Render l'interface graphique
            this.interface_.renderer.render(this.interface_.scene, this.interface_.camera);
        }
        add_controls_anim(){

            var self = this;
            var play = document.createElement("button");
            play.name = "play";
            play.type = "button";
            play.value = "play";
            play.id = "play";
            play.style.position = "absolute";
            play.style.left = "0px";
            play.innerHTML = "play";
            var pause = document.createElement("button");
            pause.name = "pause";
            pause.type = "button";
            pause.value = "pause";
            pause.id = "pause";
            pause.style.position = "absolute";
            pause.style.left = "40px";
            pause.innerHTML = "pause";
            pause.onclick = function() { self.stop_renderer();};
            play.onclick = function() { self.start_renderer();};
            var new_container = self.div.substring(1);
            document.getElementById(new_container).appendChild(play);
            document.getElementById(new_container).appendChild(pause);
        
        }
        /* Timer with setTimeout */
        /*launch_animation(frame_rating){
            var self = this;
            this.refreshIntervalId = setInterval(function() {
                self.render();
                self.frame++;
                }, frame_rating);
        }
        */
        /* Timer with request animation frame */
        /* animate() {
            var self = this;
            this.refreshIntervalId = requestAnimationFrame(self.animate.bind(self));
            self.render();
            //stuff for animating goes here
            self.frame++;
            
        }
        /* calculate_FPS(){
            var self = this;
            //window.setInterval(this.gameLoop, 1000);
            setInterval(function() {
                //var now = Date.now();
                //var elapsed = now - self.then;
                var difference = self.frame - self.actual_frame;
                console.log("FPS ", difference/10);
                self.sparkiz.FPS = 1;
                self.sparkiz.fit_all_particles_to_frequence_temporal_distrib();
                self.sparkiz.updateParticles_TemporalDistribution3();
                self.actual_frame = self.frame;

                }, 10000);
        }

        /* Self Adjusting Timer */
        /* self_adjusting_timer() {
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

        }*/
    
    }
}