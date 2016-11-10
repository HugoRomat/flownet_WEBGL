


            uniform float time;
            uniform float uTime;

			//attribute float size;
            //Correspond au numero du chemin surlequel je suis
			attribute float id;

            //Correspond à l'ID de la particule
            attribute float id_particle;
			attribute vec3 customColor;

            attribute float iteration;
            //attribute float actual_velocity;
            uniform int particles_number;

            //uniform float zoom;

            uniform mat4 ProjectionMatrix;

            uniform int number_segmentation;

            varying float sprite_size;

            // Si les liens avaient 50 cases alors on aurait 51 * 12
            // Vu que je ne sais pas combien de cases ils ont je fait 200 * 12
            //uniform vec2 path_general[ path_length ]; // 200 * 12 ==800

            uniform vec2 path_quadratic[path_length];

            uniform int gate_position[10];
            uniform int temporal_delay[20]; // NUMBER OF PARTICLES
            uniform int varyingData;

            uniform vec3 gate_colors[10];

            uniform float velocity[10];
            uniform float size[10];
            uniform float opacity[10];
            uniform float wiggling[10];
            uniform int number_segmentation_pattern_fitting;

			      varying vec3 vColor;
            varying float my_opacity;
            varying float distance_with_arrival;
            varying float distance_with_departure;
            float actual_velocity;

            varying float vRotation;
            int gate = 0;

            int MOD(int a, int b){
                //Formule du modulo : a - (b * (a \ b))
                int result = a / b;
                result = b * result;
                result = a - result;
                return result;
            }
            float rand(vec2 co){
                return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
            }
            float distance(float x1, float y1, float x2, float y2){

                float longueur = sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
                return longueur;
            }
            float noise(vec2 p){
                vec2 ip = floor(p);
                vec2 u = fract(p);
                u = u*u*(3.0-2.0*u);

                float res = mix(
                    mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
                    mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
                return res*res;
            }
            vec2 bezier(int t,  vec2 p0,vec2 p1,vec2 p2,vec2 p3){

                highp float timer = float(t);
                //Pour avoir un timer qui va de 0 a 1
                //highp float time = timer * 1.0/float(number_segmentation);
                highp float time = timer * 1.0/(float(number_segmentation));

                float cX = 3.0 * (p1.x - p0.x);
                float bX = 3.0 * (p2.x - p1.x) - cX;
                float aX = p3.x - p0.x - cX - bX;

                float cY = 3.0 * (p1.y - p0.y);
                float bY = 3.0 * (p2.y - p1.y) - cY;
                float aY = p3.y - p0.y - cY - bY;

                float x = (aX * pow(time, 3.0)) + (bX * pow(time, 2.0)) + (cX * time) + p0.x;
                float y = (aY * pow(time, 3.0)) + (bY * pow(time, 2.0)) + (cY * time) + p0.y;

                vec2 result = vec2( x,y );

                return result;
            }
            mat4 rotation(float x) {
              vec4 line_1 = vec4(cos(x), -sin(x), 0.0, 0.0);
              vec4 line_2 = vec4(sin(x), cos(x), 0.0, 0.0);
              vec4 line_3 = vec4(0.0, 0.0, 1.0, 0.0);
              vec4 line_4 = vec4(0.0, 0.0, 0.0, 1.0);

              return mat4(line_1,line_2,line_3,line_4);
            }
            mat4 translation(float x, float y) {
              vec4 line_1 = vec4(1.0, 0.0, 0.0,  x);
              vec4 line_2 = vec4(0.0, 1.0, 0.0,  y);
              vec4 line_3 = vec4(0.0, 0.0, 1.0, 0.0);
              vec4 line_4 = vec4(0.0, 0.0, 0.0, 1.0);

              return mat4(line_1,line_2,line_3,line_4);
            }
            mat4 changerEchelle(float sx, float sy) {
              vec4 line_1 = vec4(sx, 0.0, 0.0, 0.0);
              vec4 line_2 = vec4(0.0, sy, 0.0, 0.0);
              vec4 line_3 = vec4(0.0, 0.0, 1.0, 0.0);
              vec4 line_4 = vec4(0.0, 0.0, 0.0, 1.0);

              return mat4(line_1,line_2,line_3,line_4);
            }

			void main() {

				        vColor = customColor;
				        vec3 newPosition = position;
                vec4 mvPosition;
				        float ANGLE = 90.0;


                // FAISCEAUX ID
                highp int id_faisceaux = int(id_particle);


                actual_velocity = velocity[0];

                //float timer =  uTime * actual_velocity;
                float timer =  uTime;
                highp int my_time = int(timer);

                /******** CETTE PARTIE N'EST FAITE QUE POUR DETERMINER LA GATE ******/
                int index_thorique = MOD(my_time, number_segmentation);
                //int length_array = gate_position.length();
                for(int i = 0; i < 9; i++){
                    if(index_thorique <= gate_position[i+1] && index_thorique > gate_position[i]){
                        gate = i;
                    }
                    //Si c'est la premiere ou derniere porte
                    if(index_thorique >= gate_position[i+1] && index_thorique >= gate_position[i] &&
                        gate_position[i+1] == 0 && gate_position[i] != 0){
                        gate = i;
                    }

                }
                /**************************************/
                // Determine la couleur en fonction de la porte
                vColor = vec3(gate_colors[gate].x ,gate_colors[gate].y, gate_colors[gate].z);
                my_opacity = opacity[gate];

                highp int velo = int(actual_velocity);

                //int index = MOD(my_time, number_segmentation);
                // ADD VELOCITY TO TIME
                my_time = my_time + temporal_delay[id_faisceaux];
                // OBtient le nombre de segment a faire
                int index_old = MOD(my_time , number_segmentation_pattern_fitting);

                //Convertit pour avoir la bonne vitesse en float et pas seulement avec les INT
                float virtual_index = float(index_old);
                virtual_index = virtual_index * actual_velocity;
                highp int index = int(virtual_index);






                // ADD WIGGLING
                float random = noise(vec2( index , index )) * wiggling[gate];

                // TO DETERMINE THE PATH
                vec4 path;
                vec4 path_next;
                //Determine le numero du chemin sur lequel je suis
                //4 car j'ai 4 variables : 0 33 66 100 pour faire ma courbe de bezier
                highp int path_id = int(id) * (4);

                //path = vec4(path_general[path_id + index].x , path_general[path_id + index].y ,1.0, 1.0);

                //path_next = vec4(path_general[path_id + index +1].x, path_general[path_id + index +1].y ,1.0, 1.0);


                path = vec4( bezier(index, path_quadratic[path_id],path_quadratic[path_id+ 1],path_quadratic[path_id + 2],path_quadratic[path_id+3]), 1.0,1.0);
                path_next = vec4( bezier(index +1, path_quadratic[path_id],path_quadratic[path_id+ 1],path_quadratic[path_id + 2],path_quadratic[path_id+3]), 1.0,1.0);

                if (index >= number_segmentation  || index <= 0){my_opacity = 0.0;}
                //if (index >= number_segmentation_pattern_fitting  || index <= 0){my_opacity = 0.0;}

                /***** TEST *******/
                distance_with_arrival = distance(path.x, path.y, path_quadratic[path_id+3].x, path_quadratic[path_id+3].y);
                distance_with_departure = distance(path.x, path.y, path_quadratic[path_id].x, path_quadratic[path_id].y);
                /*float demie_longueur = size[gate] / 10.0;

                if(distance_with_arrival < demie_longueur){ my_opacity = 0.0;}
                if(distance_with_departure < demie_longueur){ my_opacity = 0.0;}*/

                //CALCULATE THE ANGLE
                float angle = atan(path_next.y - path.y, path_next.x - path.x );
                vRotation =  - angle;



                // mat4 my_matrice =  translation(path.x,path.y) ;
                // vec4 positionEchelle = vec4(0.0,0.0,1.0,1.0) * my_matrice;
                // mvPosition =  modelViewMatrix * positionEchelle;//path;//positionEchelle;



                mat4 my_matrice =  translation(path.x,path.y);

                vec4 positionEchelle = vec4(0.0,0.0,1.0,1.0) * my_matrice;

                //vec4 transitionVector = ProjectionMatrix * positionEchelle;

                mvPosition =  modelViewMatrix * positionEchelle;

                //mvPosition = positionEchelle;
                //TRANSMITTING TO VERTEX
				//mvPosition = modelViewMatrix * path;



                //300 Correspond donc a la size initiale
                // gl_PointSize = size[gate]; //* ( 300.0 / -mvPosition.z );
                gl_PointSize = size[gate];
                sprite_size = gl_PointSize;

                //gl_PointSize = -mvPosition.z ;
                gl_Position = projectionMatrix * mvPosition;


			}
