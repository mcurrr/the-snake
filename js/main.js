
// ---------------VARIABLES------------------------

var step = 10;

//---------------PRE-POSITION-----------------------

var x_head = 50;
var y_head = 50;

// ---------------DIRECTION------------------------


var x = [];
var y = [];

var $parts = $('.part');

// -------------COORDINATES OF PARENT DIV-----------------

var $field = $('#parent');
var $field_width = $field.width();
var $field_height = $field.height();
var $border_text = $field.css("border");
var $border = parseInt($border_text);

var $field_top = $field.offset().top;
var $field_left = $field.offset().left;

// ------------PORTAL COORDINATES--------------------

var $portal_left = $field_left;
var $portal_right = $field_left + $field_width + $border * 2;
var $portal_up = $field_top;
var $portal_down = $field_height + $field_top + $border * 2;

console.log($portal_left);
console.log($portal_right);
console.log($portal_up);
console.log($portal_down);



for (var i = 0; i < $parts.length; i++) {
	x[i] = x_head -= step;
	y[i] = y_head;
};

var x_0 = x;
var y_0 = y;

console.log(x);
console.log(y);

for (var i = 0; i < $parts.length; i++) {
	$($parts[i]).offset({top: y[i], left: x[i]});
};


console.log($('.part').each(function(i){
		$(this).offset();
	}));


// переменным направления можно задать любые значения, лишь бы не undefind
var left = 'left', right = 'right', up = 'up', down = 'down';

var prev_direction = direction = right;
var oposite_direction;
var pause = false;

// --------------SCORE SCREEN---------------------

var $score = $('#score');
$score.html('<span id = "score_number"></span><br><span id = "stage_number"></span><br><span id = "speed_number"></span>');
var $score_number = $('#score_number');
var $stage_number = $('#stage_number');
var $speed_number = $('#speed_number');
var total_all = 0;

var score_func = function(){

	var $newParts = $(".part:gt(2)");
	var total_present = Math.round($newParts.length * ((250 - time)/10)/10);
	total_all += total_present;

	$score_number.text("score: " + total_all);
	$stage_number.text("stage: " + stageCount);
	$speed_number.text("speed: " + (250 - time));

};

//---------------DIRECTION CHANGED----------------

var changeDirection = function(){

	$('*').on('keyup', function(e){


			switch(e.keyCode){

			case 37: {
				if(direction == right) break;
				direction = left;
				console.log(direction);
				};
			break;

			case 39: {
				if(direction == left) break;
				direction = right;
				console.log(direction);
			};
			break;

			case 38: {
				if(direction == down) break;
				direction = up;
				console.log(direction);
			};
			break;

			case 40: {
				if(direction == up) break;
				direction = down;
				console.log(direction);
			};
			break;

			case 32: {
				theEnd();
			};
			break;

			default: console.log(e.keyCode);
		};

		return false; // предотвращает всплытие (двойное нажатие)
	});
};

var oposite_direction_change = function(){
	
	switch(prev_direction){

		case right: oposite_direction = left;
		break;

		case left: oposite_direction = right;
		break;

		case down: oposite_direction = up;
		break;

		case up: oposite_direction = down;
		break;

	};

	return false;
};

// ---------------COLAPSE-------------------------------

var theEnd = function(){
	clearInterval(snakeTime);
	console.log('paused');
};

var colaps = function(){
	for(var i = 1; i<x.length; i++){
		if((x[0] == x[i]) && (y[0] == y[i])){
			alert("Game Over!");
			theEnd();				
		}
	};
};

// ---------------LEVEL UP------------------------------

var time = 200;
var stageCount = 1;


var levelUp = function(){


	var $newParts = $(".part:gt(1)");

	if(!($parts.length%10)) {
		$field_height -= step;
		$field_width -= step;
		$('#parent').css({width: $field_width, height: $field_height});

		theEnd();
	
		time -= 30;

		++stageCount;
		alert("stage " + stageCount);
		$newParts.remove();

		$portal_right = $field_left + $field_width + $border * 2;
		$portal_down = $field_height + $field_top + $border * 2;

		var x_head = 50;
		var y_head = 50;

		for (var i = 0; i < $parts.length; i++) {
			x[i] = x_head -= step;
			y[i] = y_head;
		};

		for (var i = 0; i < $parts.length; i++) {
			$($parts[i]).offset({top: y[i], left: x[i]});
		};

		direction = right;

		snakeTime = setInterval (move, time);
	}
};

// ---------------GENERATING FOOD-----------------------

var $food = $('#food');

var $food_x = Math.round(($portal_left - 0.5 + Math.random() * ($portal_right - $portal_left + 1 - step))/10)*10;
var $food_y = Math.round(($portal_up - 0.5 + Math.random() * ($portal_down - $portal_up + 1 - step))/10)*10;
$food.offset({top: $food_y, left: $food_x});

var generateNewFood = function(){
	$food_x = Math.round(($portal_left - 0.5 + Math.random() * ($portal_right - $portal_left - (step * 2) + 1))/10)*10;
	$food_y = Math.round(($portal_up - 0.5 + Math.random() * ($portal_down - $portal_up - (step * 2) + 1))/10)*10;			
	
	for(var i = 0; i<$parts.length; i++) {
		if($food_x == x[i] || $food_y == y[i]) {
			generateNewFood();
		}
	};

	$food.offset({top: $food_y, left: $food_x});
};

// -----------------EATING---------------------------

var isEating = function(){
	if ((x[0] == $food_x) && (y[0] == $food_y)) return true;
	return false;
};

var createTaile = function(){
	$('#parent').append('<div class="part"></div>');
	$parts = $('.part');
	$parts.last().hide();   //чтобы не было секундногоьпоявления нового дива на дефолтном месте
};

// ---------------MOOVING AND ACTING------------------

var snakeTime;

function move (){

	oposite_direction_change();
	changeDirection();

	if(direction == oposite_direction) direction = prev_direction
		else prev_direction = direction;	

	colaps();

	console.log(x);
	console.log(y);
	console.log(time);

	var $newParts = $(".part:gt(2)");
	console.log($newParts.length);

	//SHOWING SNAKE WITH PRESENT COORDINATES
	
	$parts.last().show();

	$parts.each(function(i){
		$(this).offset({top: y[i], left: x[i]});
	});

	//CHANGING NEXT COORDINATES

	switch(direction) {
		
		case left: {
			if(x[0] <= $portal_left) {
				x.unshift($portal_right - step);
				y.unshift(y[0]);	
			}
			else {
				x.unshift((Math.round((x[0] - step)/10))*10);
				y.unshift(y[0]);
			}
		};        
		break;
		
		case right: {
			if(x[0] >= $portal_right - step) {
				x.unshift($portal_left);
				y.unshift(y[0]);	
			}
			else {
			x.unshift((Math.round((x[0] + step)/10))*10);
			y.unshift(y[0]);
			}
		};
		break;
		
		case up: {
			if(y[0] <= $portal_up) {
				y.unshift($portal_down - step);
				x.unshift(x[0]);	
			}
			else {
			y.unshift((Math.round((y[0] - step)/10))*10);
			x.unshift(x[0]);
			}
		};
		break;
		
		case down: {
			if(y[0] >= $portal_down - step) {
				y.unshift($portal_up);
				x.unshift(x[0]);	
			}
			else {
			y.unshift((Math.round((y[0] + step)/10))*10);
			x.unshift(x[0]);
			}
		};
		break;
	};


	x.length = $parts.length + 1;
	y.length = $parts.length + 1;


	if(isEating()){
		levelUp();
		createTaile();
		generateNewFood();
		score_func();
	};
};

snakeTime = setInterval (move, time);
