import * as d3 from 'd3'
import * as THREE from 'three';
import {Utilities} from '../Utilities'
import * as VS from './../../shaders/particule.vert'
import * as FS from './../../shaders/particule.frag'

import * as textureRectangle from './../../images/rectangle_texture.png'

export class Particles{

    utilities;
    scene;
    particles = [];
    number_max_gates = 21;
    FPS = 60;
    camera;

    constructor(scene, camera){
        this.utilities = new Utilities();
        this.scene = scene;
        this.camera = camera;
    }
    data(data?){
        if (data == undefined) return this.particles;
        this.particles = data;
    }
    getMaxGates(){
        return this.number_max_gates;
    }
    createParticles(){
        for(var i=0 ; i<this.particles.length ; i++){

            this.particles[i].particleSystems = [];
            this.particles[i].number_segmentation = 50;
            this.particles[i].number_segmentation_pattern_fitting = 50;
            
            this.particles[i].frequency_pattern = 1.0;
            // this.particles[i].spatial_distribution = [];
            this.particles[i].temporal_distribution2 = [0.0];
            this.particles[i].gate_opacity = [];
            this.particles[i].wiggling_gate = [];
            this.particles[i].size = [];
            this.particles[i].gate_position = [];
            this.particles[i].gate_colors = [];
            this.particles[i].number_particles = 1;
            this.particles[i].texture = textureRectangle; 

            // this.number_particles = 1;
            this.particles[i].temporal_distribution = Array.apply(null, Array(this.particles[i].number_particles)).map(Number.prototype.valueOf,0);
            //this.links[i].velocity = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 1.0);
            this.particles[i].gate_opacity = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 1.0);
            this.particles[i].wiggling_gate = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 0.0);
            this.particles[i].size = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 10.0);
        /********************* NOMBRE MAXIMUM DE PORTE JE RAJOUTE +1 CAR JE VEUX MA DERNIERE PORTE POUR MON DERNIER POINTS  */
            this.particles[i].gate_position = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 0);
            this.particles[i].gate_velocity = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 1.0);
            this.particles[i].gate_colors = [];//Array(this.links[i].gate_position).fill(new THREE.Vector3( 1.0, 1.0, 1.0 )); 
            
            for (var j = 0; j< this.number_max_gates;j++){
                
                this.particles[i].gate_colors.push(new THREE.Vector3( 1.0, 1.0, 1.0 ))
            } 
        }
        
    }
    fit_all_particles_to_frequence_temporal_distrib(){
        for(var i=0 ; i<this.particles.length ; i++){
            console.log("FIT I", i)   
            this.fit_to_frequence_temporal_distrib(i);
        }
    }
    fit_to_frequence_temporal_distrib(id){
        
        //.slice();
        // Je recois une frequence exprimant quand j'envoi chaque pattern (exprimé en secondes)
        // J'ai 60 fps donc je multiplie par 60 pour avoir l'equivalent en frame
        var frequence_patttern = this.particles[id].frequency_pattern;
        // console.log(frequence_patttern)
        var temporal_distribution = this.particles[id].temporal_distribution2;
        var speed = 10//this.links[id].gate_velocity[0];
        frequence_patttern = this.FPS * frequence_patttern; 
        //Je multiplie par frequence pattern pour partir d'une echelle sur [O,1] en entrée vers [0,-frequence_patttern]
        //Négatif pour que ca parte vers l'arriere
        //Divise par speed pour que cela soit proportionnel si l'on change la vitesse
        var temporal_dis = [];
        for (var i = 0;i<temporal_distribution.length; i++){
            temporal_dis.push(temporal_distribution[i] * -frequence_patttern);
        }

        var gateSpeed = this.particles[id].gate_velocity;
        var motifs = 0;
        for(var i = 0; i< this.particles[id].gate_velocity.length; i++){
            var lengthBetweenTwoGates = ((this.particles[id].number_segmentation/5)/this.particles[id].gate_velocity.length);
            // console.log(lengthBetweenTwoGates / (gateSpeed[i]*12.5))
            var numberSecondToArrive = lengthBetweenTwoGates / (gateSpeed[i] * 12);
            // console.log(numberSecondToArrive)
            var numberPatterEdge = numberSecondToArrive * (1 / this.particles[id].frequency_pattern);
            motifs += numberPatterEdge;
        }
        // console.log(this.particles[id].number_segmentation/5, motifs)
        // JE RAJOUTE UN POUR PAR QUE CA PARTE
        motifs = Math.ceil(motifs);
        // motifs = 71;
        // console.log("MOTIFS", motifs)
        this.particles[id].number_particles = motifs * temporal_distribution.length;  

        // Motifs qui fitte en termes de une seconde pour un motif)
        this.particles[id].number_segmentation_pattern_fitting = (motifs * frequence_patttern);

        // console.log("FITTING", this.links[id].number_segmentation_pattern_fitting)
        // console.log("REMOVE", 0.1 * this.links[id].number_segmentation)
        // console.log("NB SEG", this.links[id].number_segmentation)
        // console.log("NUMBER PARTICLES", motifs, this.links[id].number_segmentation, frequence_patttern, this.links[id].number_segmentation_pattern_fitting)
        // console.log("FREQUENCE PATTERN", frequence_patttern, speed)
        var total_for_pattern = 0;
        var id_particle = 0;
        var delay = 0;
        for(var k=1 ; k < motifs+1; k++){
            total_for_pattern = 0
            //J'ajoute frequence pattern a chaque nouveau pattern
            delay = frequence_patttern * (k -1)//- 1)

            for(var j=0 ; j<temporal_distribution.length; j++){
                //Pour chaque element du tableau donnée, j'ajoute frequence_pattern + le delay.
                this.particles[id].temporal_distribution[id_particle] = (delay + temporal_dis[j]);
                // console.log()
                total_for_pattern += delay + temporal_dis[j];
                id_particle +=1;
            }
        }      
        // console.log("FIIIIIT", this.links[id]) 
        this.particles[id].number_particles = this.particles[id].temporal_distribution.length;

        // console.log("TEMPORAL", this.links[id].temporal_distribution, this.links[id].number_particles, motifs)
        // console.log("Fitting", this.links[id].number_segmentation_pattern_fitting,  this.links[id].number_segmentation)
        // console.log("VELOCITY", this.links[id].gate_velocity)
    }
    updateParticles(){
        for ( var j = 0;  j < this.particles.length; j ++ ){
            //console.log(this.links[j])
            this.createParticles_webgl(this.particles[j].number_particles, this.particles[j].id);
            // permits to update the spatial and temporal after resizing links
            // this.updateParticles_SpatialDistribution(this.links[j].spatial_distribution, this.links[j]._id);
            // this.updateParticles_TemporalDistribution(this.links[j].temporal_distribution, this.links[j]._id, this.links[j].temporal_distribution.length)
        }
    }

    createParticles_webgl(particles, link_id){

        // console.log(particles, link_id)
        console.log("CREATE PARTICLES", particles, link_id)
        var self = this;

        /**
         * Initialisation des variables
         */
        var temporal = this.particles[link_id].temporal_distribution;
        var gate_velocity = this.particles[link_id].gate_velocity;
        var gate_opacity = this.particles[link_id].gate_opacity;
        var wiggling_gate = this.particles[link_id].wiggling_gate;
        var size = this.particles[link_id].size;
        var gate_position = this.particles[link_id].gate_position;
        var gate_colors = this.particles[link_id].gate_colors;
        var number_segmentation = this.particles[link_id].number_segmentation;
        var number_segmentation_pattern_fitting = this.particles[link_id].number_segmentation_pattern_fitting;
        var path_quadratic = [];
        for (var i = 0; i< this.particles[link_id].path_quadratic.length; i++){
            path_quadratic = path_quadratic.concat(this.particles[link_id].path_quadratic[i]);
        }
        var spatial = this.array_SpatialDistribution_items(particles, link_id);
        var texture = new THREE.TextureLoader().load( this.particles[link_id].texture );
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        var number = 0;
        var posistion_gate_after_speed = [];
        /**
         * Met a jour le tableau contenant la position des gates.
         * en fonction de la vitesse de mes élèments
         */

        var number = 0;
        var offsetGate = 0;
        var posistion_gate_after_speed = [];
        // GAP = un espace
        var gap = number_segmentation / (this.number_max_gates);
        // POUR RAJOUTER L'ESPACE QUE MA SPEED PREND
        for (var i =0; i< (this.number_max_gates -1); i ++){
            posistion_gate_after_speed.push(number);
            number = number + (gap/(gate_velocity[i])); 
        }
        posistion_gate_after_speed.push(number_segmentation)

        
        /**
         * Je met a jour le tableau des offset.
         * Car quand j'augmente la distance, une particules va plus vite qu'une particule allant a une vitesse normale
         * Permet de ne pas calculer tout ca dans le shader.
         */
            
        var offsetArray = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 0);
        var offset = 0;
        // console.log("OFFSET", offsetArray)
        // var offsetArray2 = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 0);
        
        for (var i = 0; i< this.number_max_gates - 1; i ++){
            var normalValuesAtGates = posistion_gate_after_speed[i] * gate_velocity[i];
            var offsetBetweenGates = posistion_gate_after_speed[i+1] - posistion_gate_after_speed[i];
            offsetArray[i] = (posistion_gate_after_speed[i] * gate_velocity[i]) - offset;
            offset += offsetBetweenGates * gate_velocity[i];
        }

        // console.log(posistion_gate_after_speed, offsetArray)
        // console.log("TEMPORAL", offsetArray)
        /* Détermines mes uniforms pour les transmettre au shaders */
        var uniforms = {
            "gapTwoGates": { type: "i", value: gap },
            "path_quadratic" :  { type: "v2v", value: path_quadratic },
            "temporal_delay" : { type: "iv1", value: temporal },
            "gate_velocity" : { type: "iv1", value: gate_velocity },
            "size" : { type: "fv1", value: size },
            "gate_opacity" : { type: "fv1", value: gate_opacity },
            "wiggling_gate" : { type: "fv1", value: wiggling_gate },
            "gate_position" : { type: "iv1", value: posistion_gate_after_speed },
            "gate_colors" : { type: "v3v", value: gate_colors },
            "particles_number" : { type: "iv1", value: particles },  
            "number_segmentation" : { type: "iv1", value: number_segmentation }, 
            "offsetArray": { type: "iv1", value: offsetArray },
            "number_segmentation_pattern_fitting" : { type: "iv1", value: number_segmentation_pattern_fitting },  
            uTime: { type: "f", value: 1.0 },
            time: { type: "f", value: 1.0 },
            delta: { type: "f", value: 0.0 },
            // "ProjectionMatrix": { type: "m4", value: self.camera.projectionMatrix },
            texture: { value: texture, name: this.particles[link_id].texture }

        };
        /************ 2 car les liens exterieur, 1 le lien du milieu, *4 pour DEBUT-POINT DE CONTROLE1- POINT DE CONTROLE2 - ARRIVEE */
        var path_length = ((2 * this.particles[link_id].number_paths_particule)+1) * 4;

        /* Determination d'un shader material qui fait le lien entre mon programme et mes shaders */
        var shaderMaterial = new THREE.ShaderMaterial( {
            uniforms:       uniforms,
            vertexShader:   '#define path_length '+ path_length + 
            '\n' + '#define real_number_particles '+ this.particles[link_id].temporal_distribution.length + 
            '\n' + '#define number_max_gates '+ this.number_max_gates + 
            '\n' + VS,
            fragmentShader: FS,
            transparent:    true
        });

        // console.log(path_length , this.number_max_gates, this.links[link_id].temporal_distribution.length)
        
        /* Met les attributs des particules */
        var radius = 50;
        var geometry = new THREE.BufferGeometry();
        var positions = new Float32Array( particles * 3 );
        var colors = new Float32Array( particles * 3 );
        var my_velocity = new Float32Array( particles );
        var id = new Float32Array( particles );
        var id_particle = new Float32Array( particles );
        var paths = new Float32Array( particles * 4);
        var iterations = new Float32Array( particles );   
        var color = new THREE.Color();

        for ( var i = 0, i3 = 0; i < particles; i ++, i3 += 3 ) {
            /* Position des textures de particules */
            positions[ i3 + 0 ] = 0 * radius;
            positions[ i3 + 1 ] = 0 * radius;
            positions[ i3 + 2 ] = 0 * radius;

            colors[ i3 + 0 ] = 1; //this.hslToRgb(1,1,0.5)[0];
            colors[ i3 + 1 ] = 1; //this.hslToRgb(1,1,0.5)[1];
            colors[ i3 + 2 ] = 0; //this.hslToRgb(1 ,1,0.5)[2];
            my_velocity[ i ] = 1.0;
            iterations[i] = 0.0;
            //Id de la particule, Sert à mettre du delay
            id_particle[i] = i
            /* DANS LE CAS OU ON VEUT DEFINIR LE NOMBRE DIRECTEMENT SUR CHAQUE EDGE */
            id[i] = spatial[i]

        }
        /* Ajout des attributs */
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
        //Actual state of velocity
        geometry.addAttribute( 'actual_velocity', new THREE.BufferAttribute( my_velocity, 1 ) );
        geometry.addAttribute( 'id', new THREE.BufferAttribute( id, 1) );
        geometry.addAttribute( 'id_particle', new THREE.BufferAttribute( id_particle, 1) );
        geometry.addAttribute( 'iteration', new THREE.BufferAttribute( iterations, 1 ) );

        var particleSystems = new THREE.Points( geometry, shaderMaterial );
        particleSystems.name = "particle_system" + link_id;
        particleSystems.frustumCulled = false;  
        
        this.particles[link_id].particleSystems = particleSystems;
        this.particles[link_id].userData.number_particles = particles;

              
        this.scene.add(particleSystems);
        return particleSystems;   
    }
     /**** LORSQUE C'EST LE EN SPECIFICATION DE L'EDGE = [0,0,0,0,1,1]  ***/
     array_SpatialDistribution_items(number, i){
        var array = []
        //console.log("SPATIAL_DISTRIBUTION", this.links[i].spatial_distribution)
        /* JE FAIS CA CAR LE NOMBRE DE PARTICULES EST PROPORTIONNEL AU NOMBRE DU SPATIAL */
        var array_length = number / this.particles[i].spatial_distribution.length;
        // console.log(this.particles[i].spatial_distribution)
        for ( var k = 0; k < array_length; k ++ ){
            array = array.concat(this.particles[i].spatial_distribution);
        }
        return array;
    }

}
