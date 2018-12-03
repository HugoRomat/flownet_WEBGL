import * as d3 from 'd3'
import * as THREE from 'three';
import {Utilities} from '../Utilities'

export class Tracks{
    
    tracks = [];
    scene;
    utilities;
    curveSplines = [];
    number_max_gates = 20;

    constructor(scene){
        this.utilities = new Utilities();
        this.scene = scene;
    }
    data(data?){
        if (data == undefined) return this.tracks;
        this.tracks = data;
    }
    createTracks(){
        var path = [];
        var geometry, p;
        var splineObject;
        //console.log(this.tracks)
        // tracks
        for(var i=0 ; i<this.tracks.length ; i++){

            this.tracks[i].spatial_distribution = [];
            this.tracks[i].particleSystems = [];
            // this.tracks[i].number_paths_particule = 2;
            this.tracks[i].roads_opacity = 1;
            this.tracks[i].roads_color = "#FFFFFF";

            // console.log("SPACE", this.tracks[i].numberSpacedPoints)
            if (this.tracks[i].numberSpacedPoints == undefined) this.tracks[i].numberSpacedPoints = 5;

            this.tracks[i].name = "tracks";

            this.tracks[i].width_tube = 1;
            // this.tracks[i].gates = [];
            // this.tracks[i].gates.push({object:"null", position:0})

            var multi_line = new THREE.Object3D();

            // console.log(this.tracks[i])
            //ASSIGN RANDOM POSITION FOR THE BEGINNING OF MY APP
            this.tracks[i].source.x = Math.random()*100; 
            this.tracks[i].target.y = Math.random()*100; 
            this.tracks[i].source.x = Math.random()*100; 
            this.tracks[i].target.y = Math.random()*100; 


            path[0] = {x:this.tracks[i].source.x, y:this.tracks[i].source.y}
            path[1] = {x:this.tracks[i].target.x, y:this.tracks[i].target.y}
            var x1 = path[0].x;
            var y1 = path[0].y;
            var x2 = path[1].x;
            var y2 = path[1].y;
            
            var distance = this.utilities.get_distance(x1, y1, x2, y2);
            
            //aCHanger pour 50 si l'on veut
            this.tracks[i].number_segmentation = Math.floor(distance);
            //console.log(this.tracks[i].number_segmentation);

            
            //var position = this.get_normal_position(x1, y1, x2, y2, this.tracks[i].width_tube, this.number_paths_particule);
            var position = this.utilities.get_normal_position_border(x1, y1, x2, y2, this.tracks[i].width_tube, this.tracks[i].number_paths_particule);

            
            /*****************FOR THE MIDDLE LINE  **************/
            // create curves
            var points = []
            var curve = new THREE.SplineCurve([
                new THREE.Vector2(this.tracks[i].source.x, this.tracks[i].source.y),
                new THREE.Vector2(this.tracks[i].target.x, this.tracks[i].target.y),
                ]);
            this.tracks[i].spatial_distribution[0] = 0;
            var curveSplineMaterial = new THREE.LineBasicMaterial( { 
                color : this.tracks[i].roads_color,
                linewidth:  1,
                opacity: this.tracks[i].roads_opacity, 
                transparent: true
            });

            p = new THREE.Path( curve.getSpacedPoints( this.tracks[i].number_segmentation ) );
            geometry = p.createPointsGeometry( this.tracks[i].number_segmentation );
            splineObject = new THREE.Line( geometry, curveSplineMaterial );
            splineObject.name = "roads";
            multi_line.add(splineObject);

            /****************** FOR THE OTHER LINE ****************/
            for(var j=0 , f = 1; j < position.length - 1; j+=2, f++)
            {
                // create curves
                var points = []
                var curve = new THREE.SplineCurve([
                    new THREE.Vector2(position[j].x, position[j].y),
                    new THREE.Vector2(position[j+1].x, position[j+1].y),
                    ]);
                this.tracks[i].spatial_distribution[f] = 0;
                var curveSplineMaterial = new THREE.LineBasicMaterial( { 
                    color : this.tracks[i].roads_color,
                    linewidth:  1.8,
                    opacity: this.tracks[i].roads_opacity, 
                    transparent: true
                });

                p = new THREE.Path( curve.getSpacedPoints( this.tracks[i].number_segmentation ) );
                geometry = p.createPointsGeometry( this.tracks[i].number_segmentation );
                splineObject = new THREE.Line( geometry, curveSplineMaterial );
                multi_line.add(splineObject);
            }

            this.tracks[i].gate_infos = [{factor:1, position:0},{factor:1, position:this.tracks[i].number_segmentation}];
            multi_line.renderOrder = 5;
            multi_line.userData = {type: "link" , id: this.tracks[i]._id};
            multi_line.name = "tracks";
            //console.log(multi_line)
            this.curveSplines.push(multi_line)
            this.tracks[i].userData = { id: this.tracks[i]._id , number_particles :0};
            
            // for (var j = 0; j< this.number_max_gates;j++){
                
            //     this.tracks[i].gate_colors.push(new THREE.Vector3( 1.0, 1.0, 1.0 ))
            // } 
            // console.log(this.tracks[i].gate_colors, this.tracks[i].gate_position)

            this.scene.add(multi_line);               
        }
    }
    /********** PERMET D'UPDATER LES LIENS *********/
    updatetracks(){
            
        var path = [];
        // console.log("UPDATE tracks")
        
        for(var i=0 ; i<this.tracks.length ; i+=1)
        {
            this.tracks[i].path_quadratic = []

            // POUR EVITER D'AVOIR LES EDGES QUI NE SONT PAS SUR LES TUBES
            if (this.tracks[i].source.x == this.tracks[i].target.x) this.tracks[i].source.x += 0.01
            if (this.tracks[i].source.y == this.tracks[i].target.y) this.tracks[i].source.y += 0.01

            //console.log(this.tracks[i])
            //console.log(this.curveSplines[i])
            path[0] = {x:this.tracks[i].source.x, y:this.tracks[i].source.y}
            path[1] = {x:this.tracks[i].target.x, y:this.tracks[i].target.y}
            var x1 = path[0].x;
            var y1 = path[0].y;
            var x2 = path[1].x;
            var y2 = path[1].y;

            var distance = this.utilities.get_distance(x1, y1, x2, y2);
            this.tracks[i].number_segmentation = Math.round(distance) * 5;

            var segmentation = this.tracks[i].number_segmentation;
            var courbure = this.tracks[i].courbure;
            // console.log(segmentation, courbure)
            var middle_point = this.utilities.get_middle_position_normal(x1, y1, x2, y2, segmentation, courbure)

            

            var array = [new THREE.Vector2(this.tracks[i].source.x, this.tracks[i].source.y),
                    new THREE.Vector2(middle_point.x1, middle_point.y1),
                    new THREE.Vector2(middle_point.x2, middle_point.y2),
                    new THREE.Vector2(this.tracks[i].target.x, this.tracks[i].target.y)];
            this.tracks[i].path_quadratic[0]= array;
            var quadratic_path = [];
            var object = this.curveSplines[i].children[0];
            /** IL FAUT QUE LA LONGUEUR SOIT EGALE AU NOMBRE DE VERTICES CREER DANS CREATE tracks */
            /** -1 CAR JE RAJOUTE LE POINT DE LA FIN POUR FERMER L BOUCLE */
            var pas = 1.0 / (object.geometry.vertices.length - 1);
            for (var k=0; k<1; k+=pas){
                quadratic_path.push(new THREE.Vector3( this.utilities.bezier(k, array[0],array[1], array[2], array[3]).x, this.utilities.bezier(k, array[0],array[1], array[2], array[3]).y, 0));
            }
            quadratic_path.push(new THREE.Vector3(x2, y2, 0));
            var curveSplineMaterial = new THREE.LineBasicMaterial( { color : this.tracks[i].roads_color, linewidth:  1,opacity: this.tracks[i].roads_opacity, transparent: true});
            var p = new THREE.Path( quadratic_path);//curve.getSpacedPoints( this.tracks[i].number_segmentation) );
            var geometry = p.createPointsGeometry( 50 );
            object.material = curveSplineMaterial; 
            object.geometry.vertices = geometry.vertices;
            object.geometry.verticesNeedUpdate = true;
            
            /************************* POUR LES GATES  ****************************************/
            /******** AFIN QUE LA DERNIERE PORTE CORRESPONDE AU NOEUD FINAL  ******************/
            // for(var f = 1; f < this.tracks[i].gate_position.length - 1 ; f++){
            //     var number = Math.ceil((this.tracks[i].number_segmentation_pattern_fitting/ (this.number_max_gates - 1)) * f);
            //     // console.log(number)
            //     this.tracks[i].gate_position[f] = 0 //this.tracks[i].gate_position = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            // }
            // this.tracks[i].gate_position[this.number_max_gates - 1] = this.tracks[i].number_segmentation + Math.ceil(this.tracks[i].number_segmentation/ (this.number_max_gates - 1));
            

            /***** POUR LES LIENS EXTERIEURS */
            var position = this.utilities.get_normal_position_border(x1, y1, x2, y2, this.tracks[i].width_tube, this.tracks[i].number_paths_particule);
            // console.log("POSITION LIENS", x1, y1, x2, y2, this.tracks[i].width_tube, this.tracks[i].number_paths_particule)
            for(var j=0 , f = 1; j < position.length - 1; j+=2, f++)
            {
                var object = this.curveSplines[i].children[f];
                // console.log(object)
                var points = []

                var segmentation = this.tracks[i].number_segmentation;
                var courbure = this.tracks[i].courbure;
                var middle_point = this.utilities.get_middle_position_normal(position[j].x, position[j].y,position[j+1].x, position[j+1].y, segmentation, courbure)
                
                // console.log("middle point", middle_point)
                var array = [new THREE.Vector2(position[j].x, position[j].y),
                    new THREE.Vector2(middle_point.x1, middle_point.y1),
                    new THREE.Vector2(middle_point.x2, middle_point.y2),
                    new THREE.Vector2(position[j+1].x, position[j+1].y)];
                this.tracks[i].path_quadratic[f]= array;
                var quadratic_path = [];
                //console.log(object)
                var pas = 1.0 / (object.geometry.vertices.length - 1);
                //console.log("PAS", pas , object.geometry.vertices.length)
                for (var k=0; k<1; k+=pas){
                    quadratic_path.push(this.utilities.bezier(k, array[0],array[1], array[2], array[3]));
                }
                quadratic_path.push(new THREE.Vector3(array[3].x, array[3].y, 1));
                // this.tracks[i].spatial_distribution[f] = 0;
                var curveSplineMaterial = new THREE.LineBasicMaterial( {
                     color : this.tracks[i].roads_color,
                     linewidth:  1,
                     opacity: this.tracks[i].roads_opacity, 
                     transparent: true
                    });
                
                var p = new THREE.Path( quadratic_path);//curve.getSpacedPoints( this.tracks[i].number_segmentation) );
                var geometry = p.createPointsGeometry(20);
                object.material = curveSplineMaterial; 
                object.geometry.vertices = geometry.vertices;
                object.geometry.verticesNeedUpdate = true; 
            }
        }
    }
    
}


