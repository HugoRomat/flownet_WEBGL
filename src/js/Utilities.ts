import * as d3 from 'd3'
import * as THREE from 'three';

export class Utilities{

    constructor(){
    }
    clockwiseSorting(input, basic) {
        var base = Math.atan2(input[basic][1], input[basic][0]);
        return input.sort(function(a, b) {
            return Math.atan2(b[1], b[0]) - Math.atan2(a[1], a[0]) + (Math.atan2(b[1], b[0]) > base ? - 2 * Math.PI : 0) + (Math.atan2(a[1], a[0]) > base ? 2 * Math.PI : 0);
        });
    }
    bezier(t, p0, p1, p2, p3){
        var cX = 3 * (p1.x - p0.x),
            bX = 3 * (p2.x - p1.x) - cX,
            aX = p3.x - p0.x - cX - bX;
                
        var cY = 3 * (p1.y - p0.y),
            bY = 3 * (p2.y - p1.y) - cY,
            aY = p3.y - p0.y - cY - bY;
                
        var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
        var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;
                
        return {x: x, y: y};
    }
    get_middle(x1, y1, x2, y2)
    {

        var middle_X = ((x2 - x1)/2) + x1;
        var middle_Y = ((y2 - y1)/2) + y1;

        return {x:middle_X, y:middle_Y};
    }
    /* Get the distance between two points */
    get_distance(x1, y1, x2, y2){
        var a = x1 - x2
        var b = y1 - y2

        var c = Math.sqrt( a*a + b*b );
        //console.log(c)
        return c;
    }
    lineGenerator(arr){
        return d3.line()
          .x(function (d) { return d['x'] + 400})
          .y(function (d) { return -d['y'] + 450})
          .curve(d3.curveLinear)(arr)
    }
    /**
     * COMPUTE Two point for one point
     * @param x1 C
     * @param y1 
     * @param x2 
     * @param y2 
     * @param segmentation 
     * @param courbure 
     */
    get_middle_position_normal(x1, y1, x2, y2, segmentation,  courbure, pointsToInterpolate, link){
        

        // console.log(link)
        // var SourceX = link.source.x;
        // var SourceY = link.source.y;

        // var TargetX = link.target.x;
        // var TargetY = link.target.y;

       

       /* if (pointsToInterpolate != null){

            var diffX = x1 - SourceX;
            var diffY = y1 - SourceY;

            console.log(diffX, diffY)
            // POUR EVITER D'AVOIR UNE DIVISON PAR 0
            if (y1 == y2) y1 = y2 + 1;
            // var segmentation = this.links[link_id].number_segmentation;
            var divide = Math.round(segmentation/3);
            var euclidean_distance = Math.sqrt(Math.pow(TargetX - SourceX,2) + Math.pow(TargetY - SourceY,2));
            
            //console.log("COURBURE", this.links[link_id])
            //console.log("EUCLIDEN DISTANCE", euclidean_distance)
            var distance = euclidean_distance / courbure;
            var alpha = (TargetY - SourceY)/(TargetX - SourceX);
            var signe = -1;
            if ( y2<y1 ){signe = 1;}
            //if ( x2<x1 ){signe = 1;}

           
            // var alpha_normal = (x1 - x2) / (y2 - y1) ;
            // var ordonne_origine_normal = y_middle - (alpha_normal * x_middle);
            // var X1 = x_middle + (signe * Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2))));
            // var Y1 = alpha_normal * (X1) + ordonne_origine_normal;
            // if (diffX < -2){
            //     var x_middle = (((TargetX-SourceX)/segmentation)*divide) + SourceX;
            //     var y_middle = (((TargetY-SourceY)/segmentation)*divide) + SourceY;
            //     var alpha_normal = (SourceX - TargetX) / (TargetY - SourceY) ;
            //     var ordonne_origine_normal = y_middle - (alpha_normal * x_middle);
            //     var X1 = x_middle + (signe * Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2))));
            //     var Y1 = alpha_normal * (X1) + ordonne_origine_normal;


            //     var x_middle = (((TargetX-SourceX)/segmentation)*divide*2) + SourceX;
            //     var y_middle = (((TargetY-SourceY)/segmentation)*divide*2) + SourceY;
            //     var alpha_normal = (SourceX - TargetX) / (TargetY - SourceY) ;
            //     var ordonne_origine_normal = y_middle - (alpha_normal * x_middle);
            //     var X2 = x_middle + (signe * Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2))));
            //     var Y2 = alpha_normal * (X2) + ordonne_origine_normal;
            // }
            // else{
                var X1 = pointsToInterpolate[0][0];
                var Y1 = pointsToInterpolate[0][1];

                var X2 = pointsToInterpolate[1][0];
                var Y2 = pointsToInterpolate[1][1];
    
                console.log(X1, Y1)
            // }
            
            //console.log("AFTER",X1, Y1)
            // var x_middle = (((x2-x1)/segmentation)*divide*2) + x1;
            // var y_middle = (((y2-y1)/segmentation)*divide*2) + y1;
            // var alpha_normal = (x1 - x2) / (y2 - y1) ;
            // var ordonne_origine_normal = y_middle - (alpha_normal * x_middle);
            // var X2 = x_middle + (signe * Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2))));
            // var Y2 = alpha_normal * (X2) + ordonne_origine_normal;

            return {x1:X1+diffX,y1:Y1+diffY, x2:X2+diffX,y2:Y2+diffY };
        }
        else{*/
            // POUR EVITER D'AVOIR UNE DIVISON PAR 0
            if (y1 == y2) y1 = y2 + 1;
            // var segmentation = this.links[link_id].number_segmentation;
            var divide = Math.round(segmentation/3);
            var euclidean_distance = Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2 - y1,2));
            
            //console.log("COURBURE", this.links[link_id])
            //console.log("EUCLIDEN DISTANCE", euclidean_distance)
            var distance = euclidean_distance / courbure;
            var alpha = (y2-y1)/(x2-x1);
            var signe = -1;
            if ( y2<y1 ){signe = 1;}
            //if ( x2<x1 ){signe = 1;}

            var x_middle = (((x2-x1)/segmentation)*divide) + x1;
            var y_middle = (((y2-y1)/segmentation)*divide) + y1;
            var alpha_normal = (x1 - x2) / (y2 - y1) ;
            var ordonne_origine_normal = y_middle - (alpha_normal * x_middle);
            var X1 = x_middle + (signe * Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2))));
            var Y1 = alpha_normal * (X1) + ordonne_origine_normal;
            
            //console.log("AFTER",X1, Y1)
            var x_middle = (((x2-x1)/segmentation)*divide*2) + x1;
            var y_middle = (((y2-y1)/segmentation)*divide*2) + y1;
            var alpha_normal = (x1 - x2) / (y2 - y1) ;
            var ordonne_origine_normal = y_middle - (alpha_normal * x_middle);
            var X2 = x_middle + (signe * Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2))));
            var Y2 = alpha_normal * (X2) + ordonne_origine_normal;

            return {x1:X1,y1:Y1, x2:X2,y2:Y2 };
        // }
    }
    /*
        * Recupere toutes les positions pour les roads
        * Calcule en fonction du nombre en entrée l'espacement nécéssaire entre chaque road d'un tube
        * @param   {distance}  distance    distance = taille du tube sur une moitie
        * @param   {number}  _number       nombre de liens a tracer
        * 
        * @return  {Array}           Position of the normal point
        */
        get_normal_position_border(x1, y1, x2, y2, distance, _number){
    
            var fix_distance = distance;
    
            var array = [];
            // POUR EVITER D'AVOIR UNE DIVISON PAR 0
            if (y1 == y2) y1 = y2 + 5;
            if (x1 == x2) x1 = x2 + 5;
    
            var alpha = (y2-y1)/(x2-x1);
            var alpha_normal = (x1 - x2) / (y2 - y1);
            
    
            for(var i=0 ; i< _number ; i++){
                
                var x_middle = x1;
                var y_middle = y1;
                var ordonne_origine_normal = y_middle - (alpha_normal * x_middle);
                var X1 = x_middle + Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2)) );
                var Y1 = alpha_normal * (X1) + ordonne_origine_normal;
    
                var X2 = x_middle - Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2)) );
                var Y2 = alpha_normal * (X2) + ordonne_origine_normal;
                
                var x_middle = x2;
                var y_middle = y2;
                var alpha_normal = (x1 - x2) / (y2 - y1);
                
                var ordonne_origine_normal = y_middle - (alpha_normal * x_middle);
                var X3 = x_middle + Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2)) );
                var Y3 = alpha_normal * (X3) + ordonne_origine_normal;
    
                var X4 = x_middle - Math.sqrt( Math.pow(distance,2)/(1+ Math.pow(alpha_normal, 2)) );
                var Y4 = alpha_normal * (X4) + ordonne_origine_normal;
    
                array.push({x:X1, y:Y1});
                array.push({x:X3, y:Y3});
                array.push({x:X2, y:Y2});
                array.push({x:X4, y:Y4});
                distance = distance - (fix_distance / _number);
    
            }
            return array;
    
        }
}


