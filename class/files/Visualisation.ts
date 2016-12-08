///<reference path="../utils/three.d.ts"/>
///<reference path="../utils/d3.d.ts"/>
///<reference path="../utils/jquery.d.ts"/>
///<reference path="../utils/networkcube.d.ts"/>

class Visualisation {

        camera:THREE.OrthographicCamera;
        scene:THREE.Scene;
        light:THREE.Light;
        renderer:THREE.WebGLRenderer;
        raycaster:THREE.Raycaster;

        WIDTH;// = window.innerWidth;
        HEIGHT;// = window.innerHeight;
        div_element;
        bg_color = 0xffffff;
        alpha;
        

        constructor(div_element, width, height, bg_color, alpha){
            this.WIDTH = width;
            this.HEIGHT = height;
            this.div_element = div_element;
            this.bg_color = bg_color;
            this.alpha = alpha;
            this.init();
        } 
        init(){
            this.camera = new THREE.OrthographicCamera(
                this.WIDTH/-2,
                this.WIDTH/2,
                this.HEIGHT/2,
                this.HEIGHT/-2,
                1, 5000)
            //this.camera = new THREE.PerspectiveCamera(75,this.WIDTH/this.HEIGHT,1,5000);
            this.camera.position.z = 1000;

            var self = this;
            // var i =100;
            // setInterval(function() {
            //     console.log(i);
            //     self.camera.position.z = i;
            //     //self.camera.updateProjectionMatrix();
            //     i=i-1;
            // }, 200);
            // for ( var i = 1000; i >0; i -- ){
                
            //     this.camera.position.set(0,0,i);
            // }
            this.scene = new THREE.Scene();
            this.light = new THREE.DirectionalLight(0xffffff);
            this.light.position.set(0, 1, 1).normalize();



            this.renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true, alpha: true });
            this.renderer.setSize(this.WIDTH,this.HEIGHT)


            //this.renderer.setClearColor( 0x34495e , 1);
            this.renderer.setClearColor( this.bg_color , this.alpha);
            this.renderer.sortObjects = true;

            //$(this.div_element).append(this.renderer.domElement);
            var new_container = this.div_element.substring(1);
            document.getElementById(new_container).appendChild(this.renderer.domElement);
            //console.log("HEY",this.div_element)
            
            this.raycaster = new THREE.Raycaster();


        }
    

    }

