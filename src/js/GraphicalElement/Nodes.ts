import * as d3 from 'd3'
import * as THREE from 'three';
import {Utilities} from '../Utilities'
import * as fontHelvetiker from './../../font/helvetiker_bold.typeface.json'

export class Nodes{
    
    nodes;
    webglNodes = [];
    webGLLabel = [];
    scene;

    constructor(scene){
       this.scene = scene;
    }
    
    data(data?){
        if (data == undefined) return this.nodes;
        this.nodes = data;
    }
    createLabel(){
        var self = this;
        var loader = new THREE.FontLoader();
        var myFont = new THREE.Font(fontHelvetiker)
        
        for(var i=0 ; i<self.nodes.length ; i++)
        {
            // console.log("YOO", self.nodes[i])
            if (self.nodes[i].label_name != null){
                
                var textGeo = new THREE.TextGeometry( self.nodes[i].label_name, {
                    font: myFont,
                    size: self.nodes[i].label_size || 200,
                    height: 1,
                    curveSegments: 12,
                    bevelThickness: 1,
                    bevelSize: 5,
                    bevelEnabled: false
                })
                var textMaterial = new THREE.MeshBasicMaterial({ color: self.nodes[i].label_color, transparent:true});

                var mesh = new THREE.Mesh( textGeo, textMaterial );
                self.webGLLabel.push(mesh);
                mesh.position.set(0,0,1);
                mesh.position.x = self.nodes[i].x + self.nodes[i].label_x;
                mesh.position.y = self.nodes[i].y + self.nodes[i].label_y;;
                mesh.name = "label";
                mesh.name = "label" ;
                mesh.userData = { id: self.nodes[i].id, index: self.nodes[i].index, type: "label" };
                console.log("CREATE")
                self.scene.add( mesh );
            }
        }

    }   
    load_texture_nodes(index_node, path){
        //console.log(index_node)
        var self = this;
        var loader = new THREE.TextureLoader();
        loader.load(
                // resource URL
                path,
                function ( texture ) {
                    var material = new THREE.MeshBasicMaterial( { map: texture} );
                    //console.log("CA PASSE ICI", index_node)
                    //console.log(self.webGL_nodes[index_node])
                    self.webglNodes[index_node].material.map = material.map;
                    //self.webGL_nodes[index_node].material.transparent = true;
                    //self.webGL_nodes[index_node].material.opacity = 0;
                    self.webglNodes[index_node].material.needsUpdate = true;
                },
        );
    }
    updateNodes(){
        // console.log("UPDATE NODES", this.webglNodes)
        var self = this;
        // console.log("GOOOO", self.nodes[0])
        for(var i=0 ; i<this.nodes.length ; i++)
        {   
            // console.log(this.nodes[i])
        //     if (this.nodes[i].px != null){this.nodes[i].x = this.nodes[i].px;}
        //     if (this.nodes[i].py != null){this.nodes[i].y = this.nodes[i].py;}
        //     if (this.nodes[i].pz != null){this.nodes[i].z = this.nodes[i].pz;}

        // console.log(this.nodes[i])
            if (this.nodes[i]['texture'] != undefined) this.load_texture_nodes(i, this.nodes[i]['texture']);
            this.webglNodes[i].position.set(this.nodes[i].x,this.nodes[i].y, 3);
            this.webglNodes[i].scale.set(this.nodes[i].scale,this.nodes[i].scale, 3)
            this.webglNodes[i].material.opacity = this.nodes[i].opacity; 
            this.webglNodes[i].material.color = this.nodes[i].color;
        }
    }
    /**
     * Permet de créer mes noeuds avec les parametres renseigné avant
     */
    createNodes(){
        // console.log("CREATE NODES");
        // NODES
        var n;
        // this.webGL_nodes = [];
        var material;
        var circleGeometry;
        var circle;

        //console.log('webGL_nodes', this.webGL_nodes.length)
        for(var i=0 ; i<this.nodes.length ; i++)
        {
            //JE MET UN PX ET PY CAR LE LAYOUT TOURNE CONSTAMENT DONC EMPECHE MES NODES DE SE METTRE A JOUR
            this.nodes[i].label_name = null;
            this.nodes[i].label_size = 6;
            this.nodes[i].label_x = 0;
            this.nodes[i].label_y = 0;
            this.nodes[i].label_color = "#FFFFFF";
            this.nodes[i].opacity = 1;
            this.nodes[i].z = 0;
            this.nodes[i].color = "#FFFFFF";
            this.nodes[i].scale = 1;

            // this.nodes[i].px = null;
            // this.nodes[i].py = null;

            material = new THREE.MeshBasicMaterial({
                //color: 0x0000ff,
                transparent:true,
                opacity: this.nodes[i].opacity
            });
            // instantiate a loader
            var segments = 20 ;
            circleGeometry = new THREE.CircleGeometry(1, segments );
            
            circle = new THREE.Mesh( circleGeometry, material );
            
            circle.scale.set(10,10, 10);
            circle.position.set(10,10, 1);
            circle.name = "circle" ;
            circle.userData = { id: this.nodes[i].id,index: this.nodes[i].index, type: "node" };
            // console.log("CREATE", circle)
            this.scene.add(circle);
            this.webglNodes.push(circle);
        }
    } 
}


