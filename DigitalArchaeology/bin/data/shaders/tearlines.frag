#version 120

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution = vec2(1.0, 1.0);
uniform float u_time = 1.0;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  st.x *= u_resolution.x / u_resolution.y;
  vec3 color = vec3(0.0);
  float d = 0.0;
  // Remap the space to -1. to 1.
  st = st * 2. - 1.;
  // Number of sides of your shape
  int N = 3;
  // Angle and radius from the current pixel
  float a = atan(st.x, st.y) + PI;
  float r = TWO_PI / float(N) * sin(u_time / 10.);
  // Shaping function that modulate the distance
  d = cos(floor(0.9 + a / r) * r - a) * length(st);
  color = vec3(smoothstep(.4, tan(u_time / 3.123), d),
               smoothstep(.4, sin(u_time / 7.235), d),
               step(cos(u_time / 11.57), d));
  // color = vec3(d);
  gl_FragColor = vec4(color, 1.0);
}
