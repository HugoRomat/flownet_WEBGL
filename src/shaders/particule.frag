//uniform vec3 color;
            uniform sampler2D texture;
            //uniform float zoom;

            varying float distance_with_arrival;
            varying float distance_with_departure;
            varying float my_opacity;
            varying vec3 vColor;

            varying float vRotation;

            varying float sprite_size;

            varying float segmentation;
            varying float index_;



            mat2 rotation(float x) {
              vec2 line_1 = vec2(cos(x), -sin(x));
              vec2 line_2 = vec2(sin(x), cos(x));

              return mat2(line_1,line_2); 
            }
            mat2 translation(float x, float y) {
              vec2 line_1 = vec2(1.0,x);
              vec2 line_2 = vec2(1.0,y);

              return mat2(line_1,line_2); 
            }
            mat2 changerEchelle(float sx, float sy) {
              vec2 line_1 = vec2(sx, 0.0);
              vec2 line_2 = vec2(0.0, sy);

              return mat2(line_1,line_2); 
            }


            void main() {


                float mid = 0.5;
                mat2 my_matrix = /** translation(mid, mid) **/rotation(vRotation) ;
                vec2 rotated =  my_matrix * vec2(gl_PointCoord.x - mid, gl_PointCoord.y - mid) ;
                rotated.x = rotated.x + mid;
                rotated.y = rotated.y + mid;

                vec4 color = vec4(1.0,1.0,1.0, 1.0);

                vec2 new_coord =  my_matrix * gl_PointCoord;


                
                // if (rotated.x > 0.5){
                //   color = vec4(1.0,1.0,1.0, 0.0);
                // }
                float opacityArr = 1.0;
                float opacityDep = 0.0;
               
                color = vec4(1.0,1.0,1.0, 1.0);

              
                if (index_ >= segmentation){
                    color = vec4(1.0,1.0,0.0, 0.0);
                }

              
                // vColor = vec3(0.27, 0.45, 0.7);
                vec4 rotatedTexture = texture2D( texture,  rotated) * color;

                gl_FragColor = vec4( vColor, my_opacity ) * rotatedTexture;




            }