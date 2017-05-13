#version 120

uniform vec2 u_resolution = vec2(1.0, 1.0);
uniform float u_time = 1.0;
uniform vec2 u_mouse;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(0.09, -0.2))) * 25.0 + (u_time / 40.));
}

void main() {

  vec2 st = floor(gl_FragCoord.xy / u_resolution.xy * 300.);
  st.x *= u_resolution.x / u_resolution.y;

  float rnd = random(st);
  vec3 rnd2 = vec3(random(st - 0.06), random(st + 0.06), random(st));

  gl_FragColor = vec4(vec3(floor(rnd2 * 4.)), 1.);
}
