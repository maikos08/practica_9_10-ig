#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;uniform vec2 u_resolution;
float h(vec2 p){return fract(sin(dot(p,vec2(27,91)))*3e4);}
void main(){
vec2 u=gl_FragCoord.xy/u_resolution,p=u*35.,f=fract(p)-.5;
float k=h(floor(p)),t=u_time;
vec3 c=vec3(.1,.04,.2)*sin(u.x*3.+t*.2)*sin(u.y*3.-t*.15);
c+=smoothstep(.22,0.,length(f))*(.4+.6*sin(t*3.+k*9.))*vec3(1.-k*.5,.5+.3*k,.5+k*.4);
p=u*60.+vec2(t*.4,0);
c+=smoothstep(.16,0.,length(fract(p)-.5))*.35*vec3(.6,.75,1.);
gl_FragColor=vec4(c,1.);
}