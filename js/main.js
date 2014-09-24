
// ---------------GLOBAL VARIABLES------------------------

var step = 50;
var time = 200;
var stageCount = 1;
var x = [];
var y = [];

// don't now why but this  variables must contain something. anything besides undefind
var left = 'left', right = 'right', up = 'up', down = 'down';

var prev_direction = direction = right;
var oposite_direction;
var pause = false;
var snakeTime;

// -------------COORDINATES OF PARENT DIV-----------------

var $field = $('#parent');
var field_width = $field.width();
var field_height = $field.height();
var border = 0 /*parseInt($field.css("border"))*/; //depends on included border

var field_top = $field.offset().top;
var field_left = $field.offset().left;


//---------------PRE-POSITION-----------------------

var x_head = field_left + step *4;
var y_head = field_top + step * 4;


// ------------PORTAL COORDINATES--------------------

var $parts = $('.part');

var portal_left = field_left;
var portal_right = field_left + field_width + border * 2;
var portal_up = field_top;
var portal_down = field_height + field_top + border * 2;

// -------------SNAKE START POSITION------------------

for (var i = 0; i < $parts.length; i++) {
	x[i] = x_head -= step;
	y[i] = y_head;
};

var x_0 = x;
var y_0 = y;

for (var i = 0; i < $parts.length; i++) {
	$($parts[i]).offset({top: y[i], left: x[i]});
};


// ------------FOOD FIRST POSITION-------------------

var $food = $('#food');

var steps_in_field = (portal_right - portal_left)/step;
var x_generate = Math.round(0 - 0.5 + Math.random() * steps_in_field);
var y_generate = Math.round(0 - 0.5 + Math.random() * steps_in_field);
var food_x = portal_left + step * x_generate;
var food_y = portal_up + step * y_generate;

$food.offset({top: food_y, left: food_x});





// --------------SCORE SCREEN---------------------

var $score = $('#score');
var $score_number = $('#score_number');
var $stage_number = $('#stage_number');
var $speed_number = $('#speed_number');
var total_all = 0;

// for the very start
$score_number.text("score: " + 0);
$stage_number.text("stage: " + 1);
$speed_number.text("speed: " + 50);


// increasing score
var score_func = function(){

	var $newParts = $(".part:gt(2)");
	var total_present = Math.round($newParts.length * ((250 - time)/10)/10);
	total_all += total_present;

	$score_number.text("score: " + total_all);
	$stage_number.text("stage: " + stageCount);
	$speed_number.text("speed: " + (250 - time));
};

//---------------DIRECTION CHANGED----------------

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

	return false; // avoid double keydown (bubbling)
});


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

var levelUp = function(){

	var $newParts = $(".part:gt(1)");

	if(!($parts.length%7)) {

		prev_direction = direction = right;
// decreasing field
		field_height = field_height - step;
		field_width = field_width - step;

		theEnd();

		$parts.hide();
		$food.hide();
		$newParts.remove();

		++stageCount;
		alert("stage " + stageCount);

		$('#parent').animate({width: field_width, height: field_height}, 2000, function() 
		{

			time -= 30;

			field_top = $field.offset().top;
			field_left = $field.offset().left;

	// recalculate of portals with new field sizes
			portal_left = field_left;
			portal_right = field_left + field_width + border * 2;
			portal_up = field_top;
			portal_down = field_height + field_top + border * 2;

	// setting snake start position within new field
			x_head = portal_left + step *4;
			y_head = portal_up + step * 4;

			for (var i = 0; i < $parts.length; i++) {
				x[i] = x_head -= step;
				y[i] = y_head;
			};

			for (var i = 0; i < $parts.length; i++) {
				$($parts[i]).offset({top: y[i], left: x[i]});
			};

	// starting new round
			$parts.fadeIn();
			$food.show();
			generateNewFood();
			snakeTime = setInterval (move, time);
		});
	}
};

// ---------------GENERATING FOOD-----------------------

var generateNewFood = function(){

	steps_in_field = (portal_right - portal_left)/step;
	x_generate = Math.round(0 - 0.5 + Math.random() * steps_in_field);
	y_generate = Math.round(0 - 0.5 + Math.random() * steps_in_field);
	food_x = portal_left + step * x_generate;
	food_y = portal_up + step * y_generate;
	
	// avoid creating food inside snake body
	for(var i = 0; i<$parts.length; i++) {
		if(food_x == x[i] || food_y == y[i]) {
			generateNewFood();
		}
	};

	$food.offset({top: food_y, left: food_x});

};

// -----------------EATING---------------------------

var isEating = function() {
	if (($food.offset().left == x[0]) && ($food.offset().top == y[0])) return true;
	return false;
};

// -----------------TAILING)-------------------------

var createTaile = function(){
	$('#parent').append('<div class="part"></div>');
	$parts = $('.part');
	$parts.last().hide();// to avoid second-long showing new div on defolt place - connect with goto* (will see it below)
};

// ---------------MOOVING AND ACTING------------------


function move (){

	oposite_direction_change();

	if(direction == oposite_direction) direction = prev_direction
		else prev_direction = direction;
// checking for selfeating
	colaps();

	var $newParts = $(".part:gt(2)");

//SHOWING SNAKE WITH PRESENT COORDINATES

	$parts.last().fadeIn(); // goto* remember?)

	$parts.each(function(i){
		$(this).offset({top: y[i], left: x[i]});
	});

//CHANGING NEXT COORDINATES

	switch(direction) {
		
		case left: {
			if(x[0] <= portal_left) {
				x.unshift(portal_right - step);
				y.unshift(y[0]);	
			}
			else {
				x.unshift(x[0] - step);
				y.unshift(y[0]);
			}
		};
		break;
		
		case right: {
			if(x[0] >= portal_right - step) {
				x.unshift(portal_left);
				y.unshift(y[0]);	
			}
			else {
			x.unshift(x[0] + step);
			y.unshift(y[0]);
			}
		};
		break;
		
		case up: {
			if(y[0] <= portal_up) {
				y.unshift(portal_down - step);
				x.unshift(x[0]);	
			}
			else {
			y.unshift(y[0] - step);
			x.unshift(x[0]);
			}
		};
		break;
		
		case down: {
			if(y[0] >= portal_down - step) {
				y.unshift(portal_up);
				x.unshift(x[0]);	
			}
			else {
			y.unshift(y[0] + step);
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