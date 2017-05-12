#version 120

uniform vec2 u_resolution = vec2(1.0, 1.0);
uniform float u_time = 1.0;

void main() {
  vec2 st =
      vec2(gl_FragCoord.x / u_resolution.x, gl_FragCoord.y / u_resolution.y);
  st.x *= u_resolution.x / u_resolution.y;
  vec3 color = vec3(0.0);
  float d = 0.0;
  st = st * 2. - 1.;
  d = length(max(abs(st) - 0.001, -0.136));
  // vec4 finalColor = vec4(fract(d*cos(u_time/100.0)*13.704*inversesqrt(d)),
  // fract(d*sin(u_time/100.0)*22.216*inversesqrt(d)),
  // fract(d*-sin(u_time/100.0)*7.2*inversesqrt(d)),1.)
  gl_FragColor =
      vec4(fract(d * cos(u_time / 200.0) * 13.704 * inversesqrt(d) - 0.8),
           fract(d * sin(u_time / 200.0) * 22.216 * inversesqrt(d) - 0.8),
           fract(d * -sin(u_time / 200.0) * 7.2 * inversesqrt(d) - 0.8), 1.);
}
