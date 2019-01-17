import * as d3 from 'd3'
import * as THREE from 'three';
import {Utilities} from '../Utilities'

export class Links{
    links = [];
    tube = [];
    utilities;
    number_roads = [];
    number_max_gates = 21;
    number_particles = 1;
    curveSplines = [];

    scene;



    constructor(scene){
        this.scene = scene;
        this.utilities = new Utilities();
        // this.mainClass = mainClass;
    }
    data(data?){
        if (data == undefined) return this.links;
        this.links = data;
    }
    updateTube() {
        console.log("UPDATE TUBE YO")
        var p, splineObject;
        var path = [];
        var x1, y1, x2, y2;

        var object, position, curve;
        var middle_point, point1, point2, quadratic_path1,quadratic_path2, pas;
        // console.log("Update", this.tube)
        //console.log(this.curveSplines.length)
        for(var i=0 ; i<this.tube.length ; i++)
        {   
            
            // console.log('LENGTH', this.links[i]['link_length']);
            path[0] = {x:this.links[i].source.x, y:this.links[i].source.y}
            path[1] = {x:this.links[i].target.x, y:this.links[i].target.y}
            //var number_segmentation = this.links[i]
            x1 = path[0].x;
            y1 = path[0].y;
            x2 = path[1].x;
            y2 = path[1].y;

            var distance = this.utilities.get_distance(x1, y1, x2, y2);
            this.links[i].number_segmentation = Math.round(distance) * 5;
            // console.log(this.links[i].number_segmentation)

            // console.log(distance)

            // console.log(x1, y1, x2, y2)
            
            object = this.tube[i].children[0];
            
            position = this.utilities.get_normal_position_border(x1, y1, x2, y2, this.links[i].width_tube, 1);
            // console.log(this.links[i].width_tube, position);
            /*********** 1er SEGMENT ********************************/
            curve = new THREE.SplineCurve([
                    new THREE.Vector2(position[0].x, position[0].y),
                    new THREE.Vector2(position[2].x, position[2].y)
            ]);
            // console.log(curve)
            /*********** 2 SEGMENT ********************************/
            var segmentation = this.links[i].number_segmentation;
            var courbure = this.links[i].courbure;
            var dist = this.utilities.get_distance(this.links[i].source.x, this.links[i].source.y, this.links[i].target.x, this.links[i].target.y)
            this.links[i].numberSpacedPoints = parseInt(dist/ 50.0);
            if (this.links[i].numberSpacedPoints < 10) this.links[i].numberSpacedPoints = 10;


            /**** 2 ------> 3 ******/
            // console.log(segmentation, courbure)
            // if (this.links[i].pointsInterpolation == null){
                middle_point = this.utilities.get_middle_position_normal(position[2].x, position[2].y,position[3].x, position[3].y, segmentation, courbure, this.links[i]['pointsInterpolation'],this.links[i])
                point1 = new THREE.Vector2(middle_point.x1, middle_point.y1);
                point2 = new THREE.Vector2(middle_point.x2, middle_point.y2);
            // }
            //SI AUCUN POINT d'INTERPOLATION
            // else {
            //     middle_point = this.utilities.get_middle_position_normal(position[2].x, position[2].y,position[3].x, position[3].y, segmentation, courbure)
            //     point1 = new THREE.Vector2(middle_point.x1, middle_point.y1);
            //     point2 = new THREE.Vector2(middle_point.x2, middle_point.y2);
            //     // point2 = new THREE.Vector2(middle_point.x1 + 100, middle_point.y1 + 100)//[0,0]//ew THREE.Vector2(middle_point.x2, middle_point.y2);
            // }

            console.log(this.links[i])

            quadratic_path1 = [];
            console.log(middle_point.x2, middle_point.y2)
            
            
            pas = 1.0 /  this.links[i].numberSpacedPoints;
            for (var k=0; k<1; k+=pas){
                quadratic_path1.push(this.utilities.bezier(k, position[2], point1, point2, position[3]));
            }
            /****** END ******/
            
            var curve3 = new THREE.SplineCurve([
                    new THREE.Vector2(position[3].x, position[3].y),
                    new THREE.Vector2(position[1].x, position[1].y)        
            ]);
            /**** 0 ------> 1 ******/

            // if (this.links[i].pointsInterpolation == null){
            //     middle_point = this.utilities.get_middle_position_normal(position[0].x, position[0].y,position[1].x, position[1].y, segmentation, courbure)
            //     point1 = new THREE.Vector2(middle_point.x1, middle_point.y1);
            //     point2 = new THREE.Vector2(middle_point.x1 + 100, middle_point.y1 + 100)
            // }
            // else{
            middle_point = this.utilities.get_middle_position_normal(position[0].x, position[0].y,position[1].x, position[1].y, segmentation, courbure)
            point1 = new THREE.Vector2(middle_point.x1, middle_point.y1);
            point2 = new THREE.Vector2(middle_point.x2, middle_point.y2);



            // var firstPoint = this.utilities.get_normal_position_border(position[1].x, position[1].y, this.links[i].pointsInterpolation[1][0], this.links[i].pointsInterpolation[1][1], 3, 1);
            
            // var material = new THREE.MeshBasicMaterial({color: 0x0000ff,transparent:true,opacity: 1});
            // var segments = 20 ;
            // var circleGeometry = new THREE.CircleGeometry(1, segments );
            // var circle = new THREE.Mesh( circleGeometry, material );
            // circle.scale.set(1,1,1);
            // circle.position.set(firstPoint[0]['x'], firstPoint[0]['y'], 1);
            // circle.name = "circle" ;
            // this.scene.add(circle);

            

            
            quadratic_path2 = [];
            for (var k=0; k<1; k+=pas){
                quadratic_path2.push(this.utilities.bezier(k, position[0],point1, point2,position[1]));
            }

            /****** END ******/



            quadratic_path2 = quadratic_path2.reverse();

            

            var curve_result = curve.getSpacedPoints( 1 ).concat(quadratic_path1).concat(curve3.getSpacedPoints( 1 )).concat(quadratic_path2) ;
            // console.log(curve_result)
            
            if(curve_result.length>2100){alert("DOit updater la taille du tableau contenant les vertices dans tube")}
            // for (var k=0; k<curve_result.length; k+=1){
            //     this.draw_circle(curve_result[k].x, curve_result[k].y);
            // }   
            //var geometry2 = null;
            // CHECK SI LES DEPART ARRIVE SON EGAUX
            // console.log("TUBE SIDES", y2, y1, x2, x1);
            if (y2 != y1 && x2 != x1){
                // console.log(curve_result)
                var shape = new THREE.Shape(curve_result);
                // console.log(shape)
                var geometry2 = new THREE.ShapeGeometry( shape );
                this.tube[i].children[0].geometry = geometry2;
                // console.log(this.links[i])
                this.tube[i].children[0].material.opacity = this.links[i].tube_opacity;
                this.tube[i].children[0].material.color = this.links[i].linkColor;

                // for (var a in geometry2.vertices) {
                //     this.tube[i].children[0].geometry.vertices[a].x = geometry2.vertices[a].x;
                //     this.tube[i].children[0].geometry.vertices[a].y = geometry2.vertices[a].y;
                // }
                
                // console.log(this.tube[i])
                this.tube[i].children[0].geometry.faces = geometry2.faces;
                //this.tube[i].children[0].geometry.computeBoundingSphere();
                //this.tube[i].children[0].geometry.verticesNeedUpdate=true;

                this.tube[i].children[0].geometry.elementsNeedUpdate = true;
                // this.tube[i].children[0].geometry.morphTargetsNeedUpdate = true;
                // this.tube[i].children[0].geometry.uvsNeedUpdate = true;
                // this.tube[i].children[0].geometry.normalsNeedUpdate = true;
                // this.tube[i].children[0].geometry.colorsNeedUpdate = true;
                // this.tube[i].children[0].geometry.tangentsNeedUpdate = true;

                //object.geometry.verticesNeedUpdate = true; 
                // object.geometry.__dirtyVertices = true;
                // object.geometry.dynamic = true;
            }
            
            //console.log("prout")
            //}
        }
        // console.log("FINISH UPDATE TUBE")
        //console.log(scene)
    }
    createTube(){
        var path = [];
        var geometry, p;
        var splineObject;
        var size;
        var curve, curve2, curve3, curve4;
        console.log('CREATE TUBE')
        // LINKS
        //console.log(this.links)
        for(var i=0 ; i<this.links.length ; i++)
        {
            this.links[i].width_tube = 1;
            this.links[i].linkColor = new THREE.Color('grey');
            this.links[i].tube_opacity = 1;
            this.links[i].spatial_distribution = [];
            this.links[i].pointsInterpolation = null;
            if (this.links[i].link_length == undefined) this.links[i].link_length = 200;

            //this.links[i].particleSystems = [];
            var octagon = new THREE.Object3D();
            var vertices = [];
            //console.log(this.links[i].source, this.links[i].target)
            //path[0] = {x:this.links[i].source.x, y:this.links[i].source.y}
            //path[1] = {x:this.links[i].target.x, y:this.links[i].target.y}
            path[0] = {x:5, y:28}
            path[1] = {x:12, y:35}
            var x1 = path[0].x;
            var y1 = path[0].y;
            var x2 = path[1].x;
            var y2 = path[1].y;
            //console.log(this.links[i]);
            //var position = this.get_normal_position(x1, y1, x2, y2, 3, 1);
            var position = this.utilities.get_normal_position_border(x1, y1, x2, y2, 3, 1);
            //console.log(position)
            //console.log(x1, y1, x2, y2)

            // 
            // 2-----------------------3
            // |                       |
            // 0-----------------------1
            // 
            /* MES EDGES SONT DROITES */
            curve = new THREE.SplineCurve([
                    new THREE.Vector2(position[0].x, position[0].y),
                    new THREE.Vector2(position[2].x, position[2].y)        
                ]);
            curve2 = new THREE.SplineCurve([
                    new THREE.Vector2(position[2].x, position[2].y),
                    new THREE.Vector2(position[3].x, position[3].y)        
                ]);
            curve3 = new THREE.SplineCurve([
                    new THREE.Vector2(position[3].x, position[3].y),
                    new THREE.Vector2(position[1].x, position[1].y)        
                ]);
            curve4 = new THREE.SplineCurve([
                    new THREE.Vector2(position[1].x, position[1].y),
                    new THREE.Vector2(position[0].x, position[0].y)        
                ]);
            //  console.log( this.links[i].numberSpacedPoints)
            var curve_result = curve.getSpacedPoints( 1 ).concat(curve2.getSpacedPoints(this.links[i].numberSpacedPoints)).concat(curve3.getSpacedPoints( 1 )).concat(curve4.getSpacedPoints( this.links[i].numberSpacedPoints)) ;
            //console.log("1", this.links.length);           
            
            //console.log(curve_result)
            var shape = new THREE.Shape(curve_result);
            
            //ICI BUG
            geometry = new THREE.ShapeGeometry( shape );
            //console.log(2)
            // console.log(this.links[i]);
            var material = new THREE.MeshBasicMaterial( { color: this.links[i].linkColor, opacity: this.links[i].tube_opacity, transparent: true } );
            //  material.opacity = 1;
                
                
            //var mesh = THREE.SceneUtils.createMultiMaterialObject( geometry, [ material] );
            var mesh = new THREE.Mesh( geometry,  material );
            mesh.frustumCulled = false;
            mesh.name = "tube"
            octagon.name = "tube" + i;
            octagon.userData = { type: "tube" , id :this.links[i]._id };
            octagon.add(mesh);


            this.scene.add(octagon);
            this.tube.push(octagon);
            console.log("PUSH TUBE")

        }
    }
    
}


