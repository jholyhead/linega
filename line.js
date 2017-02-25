var Line = function(x, y, rotation, r, g, b, alpha, width, height){
	this.x = x;
	this.y = y;
	this.r = r;
	this.g = g;
	this.b = b;
	this.rotation = rotation%Math.PI;
	this.alpha = alpha;

	//this.color = "rgba(0,0,0,"+alpha+")";
	this.color = "rgba("+r+","+g+","+b+","+alpha+")";

	this.yDelta = Math.sin(this.rotation);
	this.xDelta = Math.cos(this.rotation);

	var xMinFactor = this.x/this.xDelta;
	var yMinFactor = this.y/this.yDelta;
	if(xMinFactor > yMinFactor){
		this.minFactor = yMinFactor;
	} else {
		this.minFactor = xMinFactor;
	}

	var xMaxFactor = (width - this.x)/this.xDelta;
	var yMaxFactor = (height - this.y)/this.yDelta;

	var maxFactor;
	if(xMaxFactor > yMaxFactor){
		maxFactor = yMaxFactor;
	} else {
		maxFactor = xMaxFactor
	}

	this.xStart = this.x - this.minFactor * this.xDelta;
	this.yStart = this.y - this.minFactor * this.yDelta;

	this.xEnd = this.x + maxFactor * this.xDelta;
	this.yEnd = this.y + maxFactor * this.yDelta;
}

Line.prototype.mutate = function(width, height){
	var x,y, rotation, r, g, b, alpha;

	x = this.x;
	y = this.y;
	
	r = this.r;
	g = this.g;
	b = this.b;
	rotation = this.rotation;
	alpha = this.alpha;

	var propToChange = parseInt(Math.random() * 9);

	if(propToChange == 0){
		x = Math.random() * width;
	} else if(propToChange == 1){
		y = Math.random() * height;
	} else if(propToChange == 2){
		rotation = Math.random() * Math.PI;
	} else if(propToChange == 3){
		alpha = Math.random() * 0.9 + 0.1;
	} else if (propToChange <6){
		r = parseInt(r*0.8);
		g = parseInt(g*0.8);
		b = parseInt(b*0.8);
	} else if (propToChange <7){
		r = parseInt(r*1.2);
		g = parseInt(g*1.2);
		b = parseInt(b*1.2);
	} else{
		r = parseInt(Math.random() *255);
		g = parseInt(Math.random() *255);
		b = parseInt(Math.random() *255);
	}
	return new Line(x,y,rotation,r, g, b, alpha,width,height);
}

Line.prototype.draw = function(canvas1){
	var width = canvas1.width;
	var height = canvas1.height;
	context = canvas1.getContext("2d");


	context.beginPath();
	context.moveTo(this.xStart,this.yStart);
	context.lineTo(this.xEnd,this.yEnd);

	// line colour
	context.lineWidth=0.4;
	context.strokeStyle = this.color;
	//context.strokeStyle = "rgb(0,0,0)";
	context.stroke();
}

var LimitedLine = function(x, y, rotation, r, g, b, alpha, length){
	this.x = x;
	this.y = y;
	this.rotation = rotation%Math.PI;
	this.r = r;
	this.g = g;
	this.b = b;
	this.alpha = alpha;
	this.length = length;

	this.color = "rgba("+r+","+g+","+b+","+alpha+")";

	this.yDelta = Math.sin(this.rotation);
	this.xDelta = Math.cos(this.rotation);

	var deltaLength = Math.sqrt(Math.pow(this.yDelta,2) + Math.pow(this.xDelta, 2));
	var lengthFactor = length/deltaLength/2;

	this.xStart = this.x - lengthFactor * this.xDelta;
	this.yStart = this.y - lengthFactor * this.yDelta;

	this.xEnd = this.x + lengthFactor * this.xDelta;
	this.yEnd = this.y + lengthFactor * this.yDelta;
}

LimitedLine.prototype.mutate = function(width, height){
	var x,y,rotation, r, g, b, alpha, length;

	x = this.x;
	y = this.y;
	rotation = this.rotation;
	r = this.r;
	g = this.g;
	b = this.b;
	alpha = this.alpha;
	length = this.length;

	var propToChange = parseInt(Math.random() * 5);

	if(propToChange == 0){
		x = Math.random() * width;
		y = Math.random() * height;
	} else if(propToChange == 1){
		rotation = Math.random() * Math.PI;
	} else if(propToChange == 2){
		r = parseInt(Math.random() * 255);
		g = parseInt(Math.random() * 255);
		b = parseInt(Math.random() * 255);
	} else if(propToChange == 3){
		alpha = Math.random() * 0.9 + 0.1;
	} else {
		length = (Math.random()*0.97 + 0.03)*Math.sqrt(Math.pow(width,2) + Math.pow(height,2));
	}
	return new LimitedLine(x,y,rotation,alpha,length);
}

LimitedLine.prototype.draw = function(canvas1){
	var width = canvas1.width;
	var height = canvas1.height;
	context = canvas1.getContext("2d");


	context.beginPath();
	context.moveTo(this.xStart,this.yStart);
	context.lineTo(this.xEnd,this.yEnd);

	// line colour
	context.lineWidth=1;
	context.strokeStyle = this.color;
	//context.strokeStyle = "rgb(0,0,0)";
	context.stroke();
}