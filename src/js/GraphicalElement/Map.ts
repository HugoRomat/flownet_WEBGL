import * as d3 from 'd3'
import * as THREE from 'three';
import {Utilities} from '../Utilities'

export class Map{

    scene;
    utilities;
    mapData;

    constructor(scene, projection, path, callback){
        this.utilities = new Utilities();
        this.scene = scene;

        this.draw_map(projection, path);
    }
    data(data?){
        if (data == undefined) return this.mapData;
        this.mapData = data;
    }
    draw_map(projection, path){
    
        var self = this;
        var array = []
    
        d3.json(path, function(error, world) {
        var countries = world['features'];
        //console.log(countries.length)
        for(var i=0 ; i<countries.length;i++){
                
                var d = countries[i];
                var name = d.id;
                //var name = d.properties.name;
                // console.log(d)
                if (name){
                    for(var k=0 ; k<d.geometry.coordinates.length;k++)
                    {   
                        // console.log(d.geometry.coordinates.length)
                        var f = d.geometry.coordinates[k];
                        
                        var geometry_line = new THREE.Geometry();
                        //console.log(f)
                        var array = [];
                        var type = d.geometry.type;
                        for(var j=0 ; j<f.length;j++)
                        { 
                            if (type == "MultiPolygon"){
                                //console.log("MULTIPOLYGON")
                                for(var l=0 ; l<f[j].length;l++){
                                    var coord = f[j][l];
                                    var x = coord[0]
                                    var y = coord[1]
                                    var coordinates =  projection([x,y]);
                                    var vector = new THREE.Vector2(coordinates[0], - coordinates[1]);
                                    var vector3 = new THREE.Vector3(coordinates[0], - coordinates[1], 0);
                                    geometry_line.vertices.push(vector3)
                                    array.push( vector);
                                }
                            }
                            else{
                                //console.log("HEYY")
                                var coord = f[j];
                                var x = coord[0]
                                var y = coord[1]
                                var coordinates =  projection([x,y]);
                                var vector = new THREE.Vector2(coordinates[0], - coordinates[1]);
                                var vector3 = new THREE.Vector3(coordinates[0], - coordinates[1], 0);
                                geometry_line.vertices.push(vector3)
                                array.push( vector);
                            }
                            
    
                        }
                        if (array.length > 0){
                            var material2 = new THREE.LineBasicMaterial( { color: 0XFFFFFF, linewidth: 1} );
                            var line = new THREE.Line( geometry_line, material2 );
                            self.scene.add( line );
    
                            // POUR LA COULEUR DES MESH
                            var curve = new THREE.SplineCurve(array);
                            var shape = new THREE.Shape(curve.getSpacedPoints( array.length * 2));
                            shape.autoClose = true;
                            var geometry = new THREE.ShapeGeometry( shape );
                            var material = new THREE.MeshBasicMaterial( { color: 0xbdbdbd, opacity: 0.4, transparent: true} );
                            var mesh = new THREE.Mesh( geometry,  material);
                            mesh.name = name;
                            mesh.userData = {"type" : "country"}
                            self.scene.add(mesh);
                        
                        
                        }
                        
                    }
    
                }
                
            }
    
        })
    
    
    }
    
}


