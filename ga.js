var GeneticAlgorithm = function(lineCount, populationSize, mutationRate, survivalRate, crossoverToMutationRatio, limitedLine, targetCanvas, maskCanvas, drawingCanvas, solutionCanvas){
	this.lineCount = lineCount;
	this.mutationRate = mutationRate;
	this.populationSize = populationSize;
	this.survivalRate = survivalRate;
	this.crossoverToMutationRatio = crossoverToMutationRatio;
	this.limitedLine = limitedLine;

	this.targetCanvas = targetCanvas;
	this.maskCanvas = maskCanvas;
	this.drawingCanvas = drawingCanvas;
	this.solutionCanvas = solutionCanvas;

	this.evaluatedPopulation = [];

	var startingPopulation = [];
	// init
	for(var i = 0; i < this.populationSize; i++){
		var lines = [];
		for(var j = 0; j < this.lineCount; j++){
			lines.push(this.randomLine(targetCanvas.width, targetCanvas.height));
		}
		this.drawToCanvas(this.drawingCanvas, lines);
		startingPopulation.push(lines);
	}

	this.evaluatePopulation(startingPopulation);

	this.drawToCanvas(this.solutionCanvas, this.getCurrentBest());

}

GeneticAlgorithm.prototype.evolve = function(){
	// kill all the Fatmas
	var survivalCount = this.populationSize * this.survivalRate
	var deathToll = this.populationSize - survivalCount;
	var newlingCount = 0*(parseInt(deathToll));
	this.evaluatedPopulation.splice(survivalCount, deathToll);

	// breed & shit
	var crossoverCount = (deathToll - newlingCount) * this.crossoverToMutationRatio;
	var newPopulation = []
	
	// do crossover
	for(var i = 0; i < crossoverCount; i++){
		var parent1 = this.evaluatedPopulation[parseInt(Math.random() * survivalCount)]
		var parent2 = this.evaluatedPopulation[parseInt(Math.random() * survivalCount)]
		newPopulation.concat(this.crossover(parent1[1], parent2[1]));
	}
	
	// mutate
	for(var i = 0; i < (deathToll - newlingCount) - crossoverCount; i++){
		var parent = this.evaluatedPopulation[parseInt(Math.random() * survivalCount)]
		newPopulation.push(this.mutate(parent[1], this.targetCanvas.width, this.targetCanvas.height));
	
	}
	
	// fill up population with new random elements
	while(newPopulation.length + this.evaluatedPopulation.length < this.populationSize){
		var lines = []
		for(var i = 0; i < this.lineCount; i++){
			lines.push(this.randomLine(this.targetCanvas.width, this.targetCanvas.height));
		}
		newPopulation.push(lines);
	}

	// evaluate newlings
	this.evaluatePopulation(newPopulation);

	this.drawToCanvas(this.solutionCanvas, this.getCurrentBest());

	// return new best fitness
	return this.evaluatedPopulation[0][0]
}

GeneticAlgorithm.prototype.getCurrentBest = function(){
	return this.evaluatedPopulation[0][1]
}

GeneticAlgorithm.prototype.testFunction = function(bla){
	alert(bla);
}

GeneticAlgorithm.prototype.fitness = function(targetCanvas, drawingCanvas, lines){
	this.drawToCanvas(drawingCanvas, lines);
	
	var drawingContext = drawingCanvas.getContext("2d");
	var targetContext = targetCanvas.getContext("2d");
	var maskContext = maskCanvas.getContext("2d");

	//var fitness = 0;
	var target = targetContext.getImageData(0,0,targetCanvas.width,targetCanvas.height).data;
	var mask = maskContext.getImageData(0,0,targetCanvas.width,targetCanvas.height).data;
	var temp = drawingContext.getImageData(0,0,drawingCanvas.width, drawingCanvas.height).data;
	
	//if(this.convertedImage == undefined){
	//	this.convertedImage = [];
	//	for(var i = 0; i< target.length; i++){
	//		yuv = convertToYuv(target[i], target[i+1], target[i+2]);
	//		this.convertedImage.push(yuv[0]);
	//		this.convertedImage.push(yuv[1]);
	//		this.convertedImage.push(yuv[2]);
	//		this.convertedImage.push(255);
	//	}
	//}

	var fitness = 0;
	var i = target.length;
	while(i-=4){
		//var t = this.convertedImage;
		//var a = convertToYuv(temp[i], temp[i+1], temp[i+2]);
		//
		//var diff = Math.abs(t[i] - a[0]) + Math.abs(t[i+1] - a[1]) + Math.abs(t[i+2] - a[2]);
		//diff *= mask[i];
		//fitness += diff;
		
		var f1 = Math.abs(target[i] - temp[i]);
		//f1 *=f1;
		f1 *= mask[i];
		var f2 = Math.abs(target[i + 1] - temp[i + 1]);
		//f2 *= f2;
		f2 *= mask[i+1];
		var f3 = Math.abs(target[i + 2] - temp[i + 2]);
		//f3 *= f3;
		f3 *= mask[i+2];
		
		fitness += (f1 + f2 + f3);
		
		//var tempFitness = Math.pow(target[i] - temp[i], 2);
		//tempFitness += Math.pow(target[i + 1] - temp[i + 1], 2);
		//tempFitness += Math.pow(target[i + 2] - temp[i + 2], 2);
		////fitness += (mask[i] * tempFitness);
		//fitness += tempFitness;
	}
	return fitness;
}

function convertToYuv(r,g,b){
	var y = 0.299 * r + 0.587 * g + 0.114 * b;
	var u = -0.14713 * r -0.28886 * g + 0.436 * b;
	var v = 0.615 * r - 0.51499 * g - 0.10001 * b;
	return [parseInt(y),parseInt(u),parseInt(v)]
}

GeneticAlgorithm.prototype.evaluatePopulation = function(population){
	for(var i = 0; i < population.length; i++){
		var member = population[i];
		var currentFitness = this.fitness(this.targetCanvas, this.drawingCanvas, member);
		var j = 0;
		while(j < this.evaluatedPopulation.length && this.evaluatedPopulation[j][0] < currentFitness){
			j++;
		}
		if(j<this.evaluatedPopulation.length){
			this.evaluatedPopulation.splice(j, 0, [currentFitness, member])
		} else {
			this.evaluatedPopulation.push([currentFitness, member]);
		}
	}
}

GeneticAlgorithm.prototype.drawToCanvas = function(canvas, lines){
	var context = canvas.getContext("2d");
	context.fillStyle = "#FFFFFF";
	context.clearRect(0,0,canvas.width, canvas.height);
	context.fillRect(0,0,canvas.width, canvas.height);

	lines.forEach(function(line){
		line.draw(canvas);
	});

}

GeneticAlgorithm.prototype.crossover = function(lines1,lines2){
	child = [];
	for(var i = 0; i < lines1.length; i++){
		if(Math.random()<0.5){
			child.push(lines1[i]);
		} else {
			child.push(lines2[i]);
		}
	}
	return child;
}

GeneticAlgorithm.prototype.mutate = function(lines, width, height){
	var mutated = [];
	for(var i = 0; i < lines.length; i++){
		if(Math.random() < this.mutationRate){
			//mutated[i] = randomLine(width, height);
			mutated[i] = lines[i].mutate(width, height);
			//mutated[i] = mutateLine(lines[i], width, height);
		} else {
			mutated[i] = lines[i];
		}

	}
	return mutated;
}

GeneticAlgorithm.prototype.randomLine = function(width, height){
	if(!this.limitedLine){
		return new Line(Math.random() * width,
			Math.random() * height,
			Math.random() * Math.PI,
			parseInt(Math.random() * 255),
			parseInt(Math.random() * 255),
			parseInt(Math.random() * 255),
			Math.random(),
			width,
			height);
	} else {
		return new LimitedLine(Math.random() * width,
			Math.random() * height,
			Math.random() * Math.PI,
			parseInt(Math.random() * 255),
			parseInt(Math.random() * 255),
			parseInt(Math.random() * 255),
			Math.random() * 0.9 + 0.1,
			(Math.random()*0.97+0.03) * Math.sqrt(Math.pow(width,2) + Math.pow(height,2)));
	}
}

function randomLine(width, height){
}