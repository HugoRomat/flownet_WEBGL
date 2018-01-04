import * as THREE from 'three';

export class Visualisation {

    camera;
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
            0.0001, 100000)
        
        
        //this.camera = new THREE.PerspectiveCamera(40,this.WIDTH/this.HEIGHT,1,10000);
        this.camera.position.z = 900;

        // this.camera.aspect = this.WIDTH / this.HEIGHT;
        // this.camera.updateProjectionMatrix();
    
        // this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.scene = new THREE.Scene();
        this.light = new THREE.DirectionalLight(0xffffff);
        this.light.position.set(0, 1, 1).normalize();



        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true });
        
        //Pour avoir la meme taille de particule partout
        this.renderer.setPixelRatio( 1 );
        this.renderer.setSize(this.WIDTH,this.HEIGHT)

        // console.log("pixel", window.devicePixelRatio )
        //this.renderer.setClearColor( 0x34495e , 1);
        this.renderer.setClearColor( this.bg_color , this.alpha);
        //this.renderer.sortObjects = true;

        //$(this.div_element).append(this.renderer.domElement);
        var new_container = this.div_element.substring(1);
        document.getElementById(new_container).appendChild(this.renderer.domElement);
        //console.log("HEY",this.div_element)
        
        this.raycaster = new THREE.Raycaster();


    }


}

