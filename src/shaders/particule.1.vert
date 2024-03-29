
            uniform float time;
            uniform float uTime;

            uniform int gapTwoGates;

			float size_fadding;
            //Correspond au numero du chemin surlequel je suis
			attribute float id;

            //Correspond à l'ID de la particule
            attribute float id_particle;
			attribute vec3 customColor;

            attribute float iteration;
            //attribute float actual_velocity;
            uniform int particles_number;


            uniform mat4 ProjectionMatrix;

            uniform int number_segmentation;

            varying float sprite_size;

            varying float segmentation;
            varying float index_;

            // Si les liens avaient 50 cases alors on aurait 51 * 12
            // Vu que je ne sais pas combien de cases ils ont je fait 200 * 12
            //uniform vec2 path_general[ path_length ]; // 200 * 12 ==800

            uniform vec2 path_quadratic[path_length];

            uniform int gate_position[number_max_gates];
            uniform float size[number_max_gates];
            uniform float gate_opacity[number_max_gates];
            uniform float wiggling_gate[number_max_gates];
            uniform vec3 gate_colors[number_max_gates];
            uniform float gate_velocity[number_max_gates];

            uniform int temporal_delay[real_number_particles];


            uniform int offsetArray[number_max_gates];

            
            uniform int number_segmentation_pattern_fitting;

			 varying vec3 vColor;
            varying float my_opacity;
            varying float distance_with_arrival;
            varying float distance_with_departure;
            float actual_velocity;

            //int gate_position[10];

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
            float distance_(float x1, float y1, float x2, float y2){

                float longueur = sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
                return longueur;
            }
            float fadeLinear(float firstStep, float nextStep, int numberSteps, int index){ 
                float temporarySize = ((nextStep - firstStep)/ float(numberSteps)) * float(index);
                return firstStep + temporarySize;
            }
            vec2 linearInterp(int t, vec2 p0,vec2 p1,vec2 p2,vec2 p3){
                float d1 = distance_(p0[0], p0[1], p1[0], p1[1]);
                float d2 = distance_(p1[0], p1[1], p2[0], p2[1]) + d1;
                float d3 = distance_(p2[0], p2[1], p3[0], p3[1]) + d2;

                highp float t_ = float(t);
                highp int d1_ = int(d1);
                highp int d2_ = int(d2);
                highp int d3_ = int(d3);
                 
                vec2 pos = vec2(0.0, 0.0);
                if (t_ >= 0.0 && t_ <= d1){
                    pos.x = fadeLinear(p0[0], p1[0], d1_, t);
                    pos.y = fadeLinear(p0[1], p1[1], d1_, t);
                   
                }
                else if (t_ >= d1 && t_ <= d2){
                    vColor = vec3(1, 1, 0);
                    pos.x = fadeLinear(p1[0], p2[0], d2_ - d1_, t- d1_);
                    pos.y = fadeLinear(p1[1], p2[1], d2_ - d1_, t- d1_);
                }
                else if (t_ >= d2 && t_ <= d3){
                    pos.x = fadeLinear(p2[0], p3[0], d3_ - d2_, t- d2_);
                    pos.y = fadeLinear(p2[1], p3[1], d3_ - d2_, t- d2_);
                }
                else{
                    //pos.x = 10000.0;//fadeLinear(p2[0], p3[0], d3_ - d2_, t- d2_);
                    //pos.y = 10000.0;//fadeLinear(p2[1], p3[1], d3_ - d2_, t- d2_);
                }
                
                return pos;
            }
           
            int determine_which_gate(int index_thorique){

                for(int i = 0; i < number_max_gates - 1; i++){
                    int actual_gate_pos = gate_position[i] ;
                    int next_gate_pos = gate_position[i+1] ;
                    if(index_thorique <= next_gate_pos && index_thorique > actual_gate_pos){
                        gate = i;
                    }
                    //Si c'est la premiere ou derniere porte
                    if(index_thorique >= next_gate_pos && index_thorique >= actual_gate_pos &&
                        next_gate_pos == 0 && actual_gate_pos != 0){
                        gate = i;
                    }
                }
                return gate;
            }
            
            float fadeSize(float actualSize, float nextSize, int steps, int index){ 

                float temporarySize = ((nextSize - actualSize)/ float(steps)) * float(index);
                return actualSize + temporarySize;

            }
            float fadeOpacity(float actualSize, float nextSize, int steps, int index){ 

                float temporarySize = ((nextSize - actualSize)/ float(steps)) * float(index);
                return actualSize + temporarySize;

            }
            vec3 fadeRGB(vec3 oldColor, vec3 newColor, int steps, int index){

                vec3 my_color;
                float redStepAmount = ((newColor.x - oldColor.x) / float(steps)) * float(index);
                float greenStepAmount = ((newColor.y - oldColor.y) / float(steps)) * float(index);
                float blueStepAmount = ((newColor.z - oldColor.z) / float(steps)) * float(index);
                
                newColor.x = oldColor.x + redStepAmount;
                newColor.y = oldColor.y + greenStepAmount;
                newColor.z = oldColor.z + blueStepAmount;

                my_color = vec3(newColor.x ,newColor.y, newColor.z);

                // if (steps == 150 && index < 150){
                //     my_color = vec3(1, 1, 0);
                // }
                return my_color;

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
				float ANGLE = 90.0;


                // FAISCEAUX ID
                highp int id_faisceaux = int(id_particle);
                actual_velocity = float(gate_velocity[0]);//velocity[0];
                //actual_velocity = 9.0;
                //for(int i = 0; i < 10; i++){ gate_position[i] = gate_pos[i]; }
                
                

                //float timer =  uTime * actual_velocity;
                float timer =  uTime;
                highp int my_time = int(timer);

                //int index = MOD(my_time, number_segmentation);
        /*************** J'AJOUTE LE TEMPORAL DELAY ****************************/
                my_time = my_time + temporal_delay[id_faisceaux];
                // OBtient le nombre de segment a faire
                int index_old = MOD(my_time , number_segmentation_pattern_fitting);
                

        /*************** POUR AVOIR LE BON INDEX AVEC LA VITESSE ************/
                float virtual_index = float(index_old);
                virtual_index = virtual_index; //* 2.0;// actual_velocity;
                highp int index2 = int(virtual_index);

        /******** CETTE PARTIE N'EST FAITE QUE POUR DETERMINER LA GATE ******/
                
                //gate = determine_which_gate(index);
                //index = index * gate_velocity[gate];
                //int last_index = index2 * gate_velocity[0]
                gate = determine_which_gate(index2);



                float multiplicateur = 1.0;
                if (gate_velocity[gate] == 1.0){multiplicateur = 0.0;}

                float difference = 0.0;
                float difference_gate_before = 0.0;
                

                /* Ajoute le offset a la vitesse de ma particule */
                float new_index = (float(index2) * gate_velocity[gate]) - float(offsetArray[gate]);
                highp int index = int(new_index);

                

      


        /************** TO DETERMINE THE PATH ******************************/
                vec4 path;
                vec4 path_next;
                //Determine le numero du chemin sur lequel je suis
                //4 car j'ai 4 variables : 0 33 66 100 pour faire ma courbe de bezier
                highp int path_id = int(id) * (4);

                //path = vec4(linearInterp(index, path_quadratic[path_id],path_quadratic[path_id+ 1],path_quadratic[path_id + 2],path_quadratic[path_id+3]) , 1.0,1.0);
                //path_next = vec4(linearInterp(index+1, path_quadratic[path_id],path_quadratic[path_id+ 1],path_quadratic[path_id + 2],path_quadratic[path_id+3]) , 1.0,1.0);

                path = vec4( bezier(index, path_quadratic[path_id],path_quadratic[path_id+ 1],path_quadratic[path_id + 2],path_quadratic[path_id+3]), 1.0,1.0);
                path_next = vec4( bezier(index +1, path_quadratic[path_id],path_quadratic[path_id+ 1],path_quadratic[path_id + 2],path_quadratic[path_id+3]), 1.0,1.0);

        /************** TO DETERMINE THE DISTANCE WITH ARRIVAL ******************************/
                distance_with_arrival = distance_(path.x, path.y, path_quadratic[path_id+3].x, path_quadratic[path_id+3].y);
                distance_with_departure = distance_(path.x, path.y, path_quadratic[path_id].x, path_quadratic[path_id].y);

        /************** TO DETERMINE THE WIGGLING ******************************/
                float random = noise(vec2( index , index )) * wiggling_gate[gate];
                //float random = 0.0;

        /************** TO DETERMINE THE ROTATION ******************************/
                float angle = atan(path_next.y - path.y, path_next.x - path.x );
                vRotation =  - angle;

                mat4 my_matrice =  translation(path.x + random,path.y+ random);
                vec4 positionEchelle = vec4(0.0,0.0,1.0,1.0) * my_matrice;
                //vec4 transitionVector = ProjectionMatrix * positionEchelle;
                mvPosition =  modelViewMatrix * positionEchelle;




        /******************** Determine la couleur en fonction de la porte ******************/
                size_fadding = size[gate];
                my_opacity = gate_opacity[gate];
                
                
                
                vColor = vec3(gate_colors[gate].x ,gate_colors[gate].y, gate_colors[gate].z);

                if (gate_colors[gate] != gate_colors[gate+1]){
                    vec3 vColorNext = vec3(gate_colors[gate+1].x ,gate_colors[gate+1].y, gate_colors[gate+1].z);
                    vColor = fadeRGB(vColor, vColorNext, gapTwoGates , index - (gapTwoGates*gate));
                }
                if (size[gate] != size[gate+1]){
                    size_fadding = fadeSize(size[gate], size[gate+1], gapTwoGates , index - (gapTwoGates*gate));
                }
                
                if (gate_opacity[gate] != gate_opacity[gate+1]){
                   my_opacity = fadeOpacity(gate_opacity[gate], gate_opacity[gate+1], gapTwoGates , index - (gapTwoGates*gate));
                }
                
                // 

                 
                // if(gate == 0){vColor = vec3(1, 1, 0);} // JAUNE
                // if(gate == 1){vColor = vec3(0, 1, 0);} // VERT
                // if(gate == 3){vColor = vec3(1, 0, 0);} // ROUGE
                // if(gate == 4){vColor = vec3(0, 0, 0);} // NOIR
                // if(gate == 5){vColor = vec3(1, 1, 0);} // JAUNE
                // if(gate == 6){vColor = vec3(0, 0, 1);} // BLEU
                // if(gate == 7){vColor = vec3(1, 0, 0);} // ROUGE
                // if(gate == 8){vColor = vec3(1, 0, 0);} // ROUGE
                // if(gate == 10){vColor = vec3(1, 1, 0);} // JAUNE
                // if(gate == 10){vColor = vec3(1, 1, 0);} // JAUNE
                // if(gate == 11){vColor = vec3(0, 0, 1);} // BLEU
                // if(gate == 12){vColor = vec3(1, 0, 0);} // ROUGE
                // if(gate == 13){vColor = vec3(1, 0, 0);} // ROUGE
                // if(gate == 14){vColor = vec3(1, 1, 0);} // JAUNE
                // if(gate == 16){vColor = vec3(1, 1, 0);} // JAUNE
                
    /**************** PERMET D"ENLEVER MES PARTICULES DE L'ECRAN *************/
                // if (index >= number_segmentation  || index <= 0){my_opacity = 0.0;}
                index_ = float(index);
                segmentation = float(number_segmentation);
                
                // if (index >= number_segmentation || index <= 0){my_opacity = 0.0;}
                //if(gate == 2){my_opacity = 0;}

                //300 Correspond donc a la size initiale
                gl_PointSize = size_fadding * ( 1000.0 / length( mvPosition.xyz ) );
                // gl_PointSize = size_fadding;
                sprite_size = size_fadding;

                gl_Position = projectionMatrix * mvPosition;


			}