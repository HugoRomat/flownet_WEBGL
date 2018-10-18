
            

			
            //Correspond au numero du chemin surlequel je suis
			

            //Correspond à l'ID de la particule
            attribute float id;
            attribute float id_particle;
			attribute vec3 customColor;

    
            
            varying float sprite_size;
            varying float segmentation;
            varying float index_;

            uniform vec2 path_quadratic[path_length];
            uniform float size;
            uniform float gate_opacity;
            uniform vec3 gate_colors;
            uniform float gate_velocity;
            uniform int temporal_delay[real_number_particles];
            uniform int number_segmentation_pattern_fitting;
            uniform int number_segmentation;
            uniform float uTime;

			varying vec3 vColor;
            varying float my_opacity;
            varying float distance_with_arrival;
            varying float distance_with_departure;
            varying float vRotation;

            int MOD(int a, int b){
                //Formule du modulo : a - (b * (a \ b))
                int result = a / b;
                result = b * result;
                result = a - result;
                return result;
            }
            vec2 bezier(int t, vec2 p0,vec2 p1,vec2 p2,vec2 p3){

                highp float timer = float(t);
                //Pour avoir un timer qui va de 0 a 1
                //highp float time = timer * 1.0/float(number_segmentation);
                highp float time = (timer * 1.0/(float(number_segmentation) )) ;//- 0.1;

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
                float size_fadding;
                // FAISCEAUX ID
                highp int id_faisceaux = int(id_particle);

                float timer =  uTime;
                highp int my_time = int(timer);

        /*************** J'AJOUTE LE TEMPORAL DELAY ****************************/
                my_time = my_time + temporal_delay[id_faisceaux];
                // OBtient le nombre de segment a faire
                int index_old = MOD(my_time , number_segmentation_pattern_fitting);

        /*************** POUR AVOIR LE BON INDEX AVEC LA VITESSE ************/
                float newIndex = float(index_old);

        /******** CETTE PARTIE N'EST FAITE QUE POUR DETERMINER LA GATE ******/   
            
                /* Ajoute le offset a la vitesse de ma particule */
                newIndex = (float(newIndex) * gate_velocity);// - float(offsetArray[gate]);
                highp int index = int(newIndex);

        /************** TO DETERMINE THE PATH ******************************/
                vec4 path;
                vec4 path_next;
                //Determine le numero du chemin sur lequel je suis
                //4 car j'ai 4 variables : 0 33 66 100 pour faire ma courbe de bezier
                highp int path_id = int(id) * (4);
                path = vec4( bezier(index, path_quadratic[path_id],path_quadratic[path_id+ 1],path_quadratic[path_id + 2],path_quadratic[path_id+3]), 1.0,1.0);
                path_next = vec4( bezier(index +1, path_quadratic[path_id],path_quadratic[path_id+ 1],path_quadratic[path_id + 2],path_quadratic[path_id+3]), 1.0,1.0);

        /************** TO DETERMINE THE ROTATION ******************************/
                float angle = atan(path_next.y - path.y, path_next.x - path.x );
                vRotation =  - angle;

                mat4 my_matrice =  translation(path.x,path.y);
                vec4 positionEchelle = vec4(0.0,0.0,1.0,1.0) * my_matrice;
                //vec4 transitionVector = ProjectionMatrix * positionEchelle;
                mvPosition =  modelViewMatrix * positionEchelle;




        /******************** Determine la couleur en fonction de la porte ******************/
                size_fadding = size;
                my_opacity = gate_opacity;
                vColor = vec3(gate_colors.x ,gate_colors.y, gate_colors.z);
                // vColor = vec3(0.27, 0.45, 0.7);
                index_ = float(index);
                segmentation = float(number_segmentation);
                
                // gl_PointSize = size_fadding * ( 1000.0 / length( mvPosition.xyz ) );
                gl_PointSize = size_fadding;
                sprite_size = size_fadding;

                gl_Position = projectionMatrix * mvPosition;


			}
