#version 120

uniform float timeValX = 1.0;
uniform float timeValY = 1.0;

void main(){
	//this is the fragment shader
	//this is where the pixel level drawing happens
	//gl_FragCoord gives us the x and y of the current pixel its drawing

	//we grab the x and y and store them in an int
	float xVal = gl_FragCoord.x;
	float yVal = gl_FragCoord.y;

	float contrast = 0.5;

	//we use the mod function to only draw pixels if they are every 2 in x or every 4 in y
	// if( sin(yVal*123.0*timeValX) > cos(yVal/xVal*timeValY)) {
	// 	gl_FragColor = gl_Color;
  //   }else{
	// 	// gl_FragColor.a = 0.0;
	// 	gl_FragColor = vec4(fract(cos(timeValX)*13.704 + contrast ), fract(sin(timeValX)*2.216 + contrast ), fract(-sin(timeValX)*7.2 + contrast ),1.);
	// }

	// if( mod(xVal, 5.0) == 0.5 && mod(yVal, 2.0) == 0.5 ){
	// 	gl_FragColor = gl_Color;
  //   }else{
	// 	gl_FragColor.a = 0.0;
	// }
	if( mod(xVal, 2.0) == 0.5 && mod(yVal, 2.0) == 0.5 ){
		gl_FragColor = vec4(cos(yVal*timeValX/1.31), sin(yVal*timeValY/1.213), cos(xVal*timeValX/1.2341), 1.0);
	} else {
		gl_FragColor = vec4(cos(timeValX/40.));

	}

	// if( mod(xVal, 3.0) == 0.5 && mod(yVal, 3.0) == 0.5 ){
	// 	gl_FragColor = gl_Color;
  //   }else{
	// 	gl_FragColor.a = 0.0;
	// }

}
