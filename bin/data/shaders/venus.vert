#version 120

void main(){

	//get our current vertex position so we can modify it
	vec4 pos = gl_ProjectionMatrix * gl_ModelViewMatrix * gl_Vertex;
	gl_Position = pos;
}
