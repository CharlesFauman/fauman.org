(async () => { 
	const model = await tf.loadModel('js_mnist_model/model.json');

    /*
	var sample_image = Array.from({ length: 28 }, () => Array.from({ length: 28 }, () => new Array(1).fill(0)));

	const example = tf.tensor3d(sample_image, [28,28,1]).expandDims(0);
	const prediction = model.predict(example).squeeze();
	alert(prediction.argMax());
	*/

	var currentScript = document.currentScript || (function() {
		var scripts = document.getElementsByTagName('script');
		return scripts[scripts.length - 1];
	})();
	var currentParent = currentScript.parentElement.id

	var tile_size;

	var sketch = function(p) {

		var grid;

		set_prediction = function(){
			const example = tf.tensor2d(grid, [28,28]).expandDims(2).expandDims(0);
			const prediction = model.predict(example).squeeze();
			const output = prediction.argMax().dataSync()[0];
			const confidence = prediction.dataSync()[output]
			if(confidence > .5){
				document.getElementById("number_label").innerHTML = output + ", " + (confidence*100).toFixed(3) + "% confident";
			}else{
				document.getElementById("number_label").innerHTML = "None";
			}
		}

		getTileFromMousePos = function(){
			var x = (p.mouseX - (p.mouseX % tile_size))/tile_size;
			var y = (p.mouseY - (p.mouseY % tile_size))/tile_size;
			return [x,y];
		}

		reset_grid = function(){
			grid = Array.from({ length: 28 }, () => new Array(28).fill(0));
			p.background(0);
		}

		onBoard = function(x, y) {
			return !(x < 0 || y < 0 || x >= 28 || y >= 28);
		}

		place_block = function(){
			var mouse_pos = getTileFromMousePos();
			if(onBoard(mouse_pos[0], mouse_pos[1])){
				grid[mouse_pos[1]][mouse_pos[0]] = 1;
				p.noStroke();
				p.fill(255);
				p.rect(tile_size*mouse_pos[0], tile_size*mouse_pos[1], tile_size, tile_size);
			}
		}

		p.mouseDragged = function() {
			place_block();
		}

		p.mousePressed = function() {
			place_block();
		}

		p.setup = function(){
			p.createCanvas(280, 280);
			p.frameRate(10);
			tile_size = p.width/28;

			var div = p.createDiv();
			div.parent(currentParent);

			var button = p.createButton('reset');
			button.size(p.width, 50);
			button.style('font-size', '18px');
			button.style('background-color', p.color(0));
			button.style('color', p.color(255));
			button.parent(div);
			button.mousePressed(reset_grid);

			reset_grid();
		}

		p.draw = function(){
			set_prediction();
		}

	}

	new p5(sketch, currentParent);

})()

