jQuery(function () {
var $ = jQuery;

	// ---------------Changeable VARIABLES------------------------

	var optTime = 200,//start speed of the snake
		snake_links = 5; //max length

	//---------------JQuery variables---------------------------

	var $score = $('#score'),
		$field = $('#parent'),
		$parts = null,
		$food = null,
		$onPause = $('#onPause'),
		$toStart = $('#toStart'),
		$toReset = $('#toReset'),
		$snake = $('#snake'),
		$score_number = $('#score_number'),
		$score_number_inner = $('#score_number_inner'),
		$stage_number = $('#stage_number'),
		$speed_number = $('#speed_number'),
		$infoModal = $('#snakeInfoModal');
		$warningModal = $('#snakeWarningModal');
		$successModal = $('#snakeSuccessModal');

	//---------------Defined variables---------------------------

	var steps_in_field = 20,
		stopped = true,
		stageCount = 1,
		left = 'left', right = 'right', up = 'up', down = 'down',
		prev_direction = direction = right,
		field_top = 0,
		field_left = 0,
		border = 0,
		time = optTime,
		x = [],//X coords for snake parts
		y = [],//Y coords for snake parts
		showHelpOnce = true,
		isItNewGame = true,
		isItNewLevel = true,
		helpMsg = 'Use \'w\', \'s\', \'a\', \'d\' buttons to control the snake. ' + 
					'You have to eat ' + (snake_links -2) + ' pieces to reach next level.';

	//---------------Undefined variables---------------------------

	var step,
		field_size,
		oldStep,
		part_size,
		total_alls,
		x_head,
		y_head,
		portal_left,
		portal_right,
		portal_up,
		portal_down,
		x_generate,
		y_generate,
		food_x,
		food_y,
		oposite_direction;
		window.snakeInterval = null;

	function changeWindowSize() {
		field_size = window.snakeSide;
		step = part_size = field_size / steps_in_field;
		oldStep = step;
//resizing parent field
		$field.css({"width": field_size + "px"});
		$field.css({"height": field_size + "px"});
//setting teleportation border
		portal_left = field_left;
		portal_right = field_left + field_size + border * 2;
		portal_up = field_top;
		portal_down = field_size + field_top + border * 2;
	};

/*======================================================================
							SNAKE CREATION
========================================================================*/

	function createStartSnake() {
		for (var i = 0; i < 3; i++) {
			$field.append($("<div class='part'/>"));
		}
		$parts = $('.part');
//setting size of the snake parts
		changeSnakeSize();
//hiding snake before start
		$parts.hide();
		$parts.first().css({'background-color': '#573E7D'}).end().hide();
	};

	function snakeStartCoord() {
		x = [];
		y = [];
//setting coords for the snake's head
		x_head = field_left + step *4;
		y_head = field_top + step * 4;
//setting coords for the whole snake's body / filling array with it
		for (var i = 0; i < $parts.length; i++) {
			x[i] = x_head -= step;
			y[i] = y_head;
		};
	};

	function snakeDisplay() {
//displaying snake on screen with start coords
		for (var i = 0; i < $parts.length; i++) {
			$($parts[i]).css({'top': y[i], 'left': x[i]});
		};
	};

	function changeSnakeSize() {
		$parts.css({"width": part_size + "px", "height": part_size + "px"});
	};

	function recalculateSnakeCoords() {
		for (var i = 0; i < $parts.length; i++) {
			x[i] = x[i] / oldStep * step;
			y[i] = y[i] / oldStep * step;
		}
	};

/*======================================================================
							FOOD CREATION
========================================================================*/

	function createFood() {
		$field.append($("<div id='food'/>"));
		$food = $('#food');
//setting size of the food
		changeFoodSize();
//hiding food before start
		$food.hide();
	};

	function foodStartCoords() {
//generating food coords
		x_generate = Math.round(0 - 0.5 + Math.random() * steps_in_field);
		y_generate = Math.round(0 - 0.5 + Math.random() * steps_in_field);
		food_x = portal_left + step * x_generate;
		food_y = portal_up + step * y_generate;
	};

	function foodDisplay() {
//displaying food with start coords
		$food.css({'top': food_y + 'px', 'left': food_x + 'px'});
	};

	function generateNewFood() {
		foodStartCoords();
// avoid creating food inside snake body
		for(var i = 0; i<$parts.length; i++) {
			if(food_x == x[i] || food_y == y[i]) {
				generateNewFood();
			}
		};
		foodDisplay();
	};

	function changeFoodSize() {
		$food.css({"width": part_size + "px", "height": part_size + "px"});
	};

	function recalculateFoodCoords() {
		food_x = food_x / oldStep * step;
		food_y = food_y / oldStep * step;
	};

/*======================================================================
							SCORE CREATION
========================================================================*/

// increasing score
	function score_func(){
		$score_number_inner.removeClass("score_eat_hit");
		$field_size = $field.width(); // here just to restart animation/ won't work with out it. also don't now why)
		if($parts.length < snake_links) {
			$score_number_inner.addClass("score_eat_hit");
		}
		++total_all;
		$score_number_inner.text("" + total_all);
		$stage_number.text("stage: " + stageCount);
		$speed_number.text("speed: " + (250 - time));
		return false;
	};

	function showStartScore () {
		total_all = 0;
		stageCount = 1;
		$score_number_inner.text("" + total_all);
		$stage_number.text("stage: " + stageCount);
		$speed_number.text("speed: " + 50);
	};
/*======================================================================
							INIT
========================================================================*/

	function init () {
		prev_direction = direction = right;
		x = [];
		y = [];
		$onPause.hide();
		if (!!$parts) clearAll();
		changeWindowSize();
		createStartSnake();
		snakeStartCoord();
		snakeDisplay();
		createFood();
		generateNewFood();
		isItNewLevel = false;
	};

	var $newParts = $(".part:gt(1)");

/*======================================================================
							TRIGGERS
========================================================================*/

//pushing control buttons
	$(window).on('keydown', function(e) {
		switch(e.keyCode) {
			case 65: {
				if(direction == right) break;
				direction = left;
				};
				break;
			case 68: {
				if(direction == left) break;
				direction = right;
				};
				break;
			case 87: {
				if(direction == down) break;
				direction = up;
				};
				break;
			case 83: {
				if(direction == up) break;
				direction = down;
				};
				break;
		}
	});

//on resize
	$(window).on('resize', function() {
		changeWindowSize();
		if (!!$parts) {
			if (!stopped) stop();
			changeSnakeSize();
			changeFoodSize();
			recalculateSnakeCoords();
			recalculateFoodCoords();
		}
	});

$successModal.on('hidden.bs.modal', function () {
	init();
	go();
});

$infoModal.on('hidden.bs.modal', function () {
	if(!isItNewLevel) go();
});

/*======================================================================
							FUNCTIONS
========================================================================*/

	function oposite_direction_change() {
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

	function colaps() {
		for (var i = 1; i<x.length; i++){
			if ((x[0] == x[i]) && (y[0] == y[i])){
				clearInterval(snakeInterval);
				$parts.remove();
				$food.remove();
				stopped = true;
				$warningModal.find('.modal-body').text('Oops! \nYour score is ' + total_all + ' points');
				$warningModal.modal('show');
				snakeReset();
			}
		}
	};

	function levelUp() {
		if(!($parts.length % snake_links)) {
			isItNewLevel = true;
			prev_direction = direction = right;
			stop();
			clearAll();

			++stageCount;
			time -= 30;
			--total_all; // balancing current score
//success message
			$successModal.find('.modal-body').text('Stage ' + stageCount);
			$successModal.modal('show');

			score_func();
//new round will initialize and start with modal callback function (in triggers)
		}
	};

	function isEating() {
		if ((parseInt($food.css('left')) == x[0]) && (parseInt($food.css('top')) == y[0])) return true;
		return false;
	};

	function createTail() {
		$('#parent').append('<div class="part"></div>');
		$parts = $('.part');
//setting size of the tail
		$parts.last().css({"width": part_size + "px",
							"height": part_size + "px",
							"display": "none"}).fadeIn(1500);
	};

/*======================================================================
							MAIN IN LOOP
========================================================================*/

	function move (){
		oposite_direction_change();
		if(direction == oposite_direction) direction = prev_direction
		else prev_direction = direction;
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
// checking for self-eating
		colaps();
		var $newParts = $(".part:gt(2)");
//SHOWING SNAKE WITH PRESENT COORDINATES
		// $parts.last().fadeIn(); // goto* remember?)
		$parts.each(function(i){
			$(this).css({'top': y[i], 'left': x[i]});
		});
//trimming array of coords from old data
		x.splice($parts.length + 1);
		y.splice($parts.length + 1);
//checking for eating
		if(isEating()){
			score_func();
			levelUp();
			if(!isItNewLevel) {
				createTail();
				generateNewFood();
			}
		};
	};

	function go() {
		snakeInterval = setInterval( function() { move() }, time);
		stopped = false;
		$onPause.fadeOut('fast');
		$toStart.fadeOut('fast');
		$parts.fadeIn();
		$food.fadeIn();
	};

	function stop() {
		clearInterval(snakeInterval);
		stopped = true;
		$onPause.fadeIn('fast');
		if (!!$parts) {
			$parts.fadeOut();
			$food.fadeOut();
		}
	};

	function clearAll () {
		$parts.remove();
		$food.remove();
	};

/*======================================================================
							BUTTON TRIGGERS
========================================================================*/

	window.snakePause = function () {
		if (!isItNewGame || !isItNewLevel) {
			if(stopped) {
				go();
			}
			else {
				stop();
			}
		}
	};

	window.snakeStart = function () {
		if (stopped) {
			$toStart.fadeOut();
			if (isItNewGame || isItNewLevel) {
				init();
				isItNewGame = false;
				isItNewLevel = false;
			}
			go();
		}
	};

	window.snakeHelpInfo = function () {
		if (!(!$parts || stopped)) stop();
		$infoModal.find('.modal-body').text(helpMsg);
		$infoModal.modal('show');
	};

	window.snakeReset = function () {
		if (!isItNewGame) {
			time = optTime;
			$toReset.hide();
			$toStart.fadeIn();
			if (!!$parts) stop();
			init();
			isItNewGame = true;
			isItNewLevel = true;
			showStartScore();
		}
	};

	window.snakeGit = function() {
		if (!stopped) snakePause();
	};

//before game started shown
	showStartScore();
	$onPause.hide();
	$toReset.hide();
});
/*======================================================================
							THE END OF LOGIC
========================================================================*/