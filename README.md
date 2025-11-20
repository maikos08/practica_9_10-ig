# Shader Generativo - Cielo Estrellado Cósmico

**Tutor:** Miguel Ángel Rodríguez Ruano

---

## Demostración

![Shader en ejecución](./shader.gif)

---

## Motivación

El objetivo de este proyecto es la generación procedural de un campo estelar dinámico mediante técnicas de síntesis de fragmentos en GLSL. Se parte de la necesidad de crear simulaciones visuales del espacio exterior.

El proyecto aborda la síntesis de múltiples capas de elementos cósmicos (estrellas de diferentes magnitudes, fondos nebulares, animación temporal) empleando únicamente operaciones matemáticas básicas y funciones de pseudoaleatorización. El resultado busca equilibrar realismo visual y eficiencia computacional.

---

## Desarrollo del Shader

### Arquitectura Base: Generación de Campo Estelar

El sistema implementa una estructura de cuadrícula espacial para la distribución de elementos:

1. **Discretización espacial**: Transformación de coordenadas de fragmento a sistema de celdas mediante escalado lineal (`p = u * 35.0`)
2. **Función hash pseudoaleatoria**: Implementación de generador determinista basado en producto punto y función trigonométrica
3. **Primitivas de forma**: Generación de círculos mediante `smoothstep()` aplicado a funciones de distancia

```glsl
float h(vec2 p){return fract(sin(dot(p,vec2(27,91)))*3e4);}
```

La función hash produce valores en [0,1] únicos por celda, permitiendo parametrización individual de cada estrella.

### Implementación de Capas Visuales

#### 1. **Capa de Fondo Nebular**
```glsl
vec3 c=vec3(.1,.04,.2)+sin(u.x*3.+t*.2)*sin(u.y*3.-t*.15);
```
- Color base en espacio RGB con dominancia en componente azul
- Modulación mediante producto de funciones sinusoidales ortogonales
- Variación temporal con velocidades angulares diferenciadas
- Genera patrones de interferencia que simulan estructuras nebulares

#### 2. **Estrellas Principales con Variación Cromática**
```glsl
c+=smoothstep(.22,0.,length(f))*(.4+.6*sin(t*3.+k*9.))*vec3(1.-k*.5,.5+.3*k,.5+k*.4);
```
- Pulsación temporal mediante función sinusoidal desfasada por valor hash
- Distribución cromática parametrizada por k:
  - Canal R: Transición amarillo-rojo (1.0 - 0.5k)
  - Canal G: Rango medio con variación (0.5 + 0.3k)
  - Canal B: Incremento hacia tonos azules (0.5 + 0.4k)
- Simula clasificación espectral estelar simplificada

#### 3. **Capa de Estrellas de Magnitud Superior**
```glsl
p=u*60.+vec2(t*.4,0);
c+=smoothstep(.16,0.,length(fract(p)-.5))*.35*vec3(.6,.75,1.);
```
- Cuadrícula de mayor densidad (60×60 celdas)
- Desplazamiento horizontal uniforme para efecto de paralaje
- Temperatura de color elevada (componente azul dominante)
- Radio reducido para representar estrellas más distantes

### Estrategias de Optimización

Técnicas aplicadas para reducción de footprint:

- Reducción de identificadores a un carácter
- Eliminación de whitespace no esencial
- Operadores de asignación compuesta
- Construcción inline de estructuras de datos
- Reutilización de variables (p se redefine)
- Uso de `mediump` como calificador de precisión

---

## Recursos y Referencias

- **The Book of Shaders** (Patricio Gonzalez Vivo): Técnicas fundamentales de programación de shaders
  - https://thebookofshaders.com/10/ (Patrones procedurales)
  - https://thebookofshaders.com/05/ (Funciones de forma)

- **Shadertoy**: Repositorio de técnicas de generación procedural
  - Implementaciones de campos estelares
  - Métodos de optimización para shaders compactos

- **Inigo Quilez**: Documentación técnica sobre funciones hash
  - https://iquilezles.org/articles/

- **Tiny shader compo**: Técnicas de la comunidad de size-coding en GLSL

---

## Código Completo

```glsl
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
```

**Tamaño:** ~511 bytes

---

## Conclusiones

El shader implementa un sistema de generación procedural de escenas cósmicas bajo restricciones severas de tamaño. La combinación de múltiples capas de síntesis (fondo nebular, dos niveles de densidad estelar, animación temporal y variación cromática) demuestra la viabilidad de producir resultados visualmente complejos mediante técnicas de optimización agresiva.

El sistema logra representar características observables del espacio exterior (variación en temperatura estelar, profundidad mediante paralaje, estructuras nebulares) empleando exclusivamente operaciones matemáticas fundamentales, sin dependencias de texturas o datos externos.

---

**Ejecutable en:** [The Book of Shaders Editor](https://thebookofshaders.com/edit.php)