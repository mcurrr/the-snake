$(document).ready(function() {
	var $sections = $('section');
	var winHeight = window.innerHeight;
	var winWidth = window.innerWidth;
	var lowest = winHeight;
	winHeight - winWidth < 0 ? lowest = winHeight : lowest = winWidth;
	window.snakeSide = (Math.round((lowest * .7)/10))*10;

	function setSectionsHeight() {
		winHeight = window.innerHeight;
		winWidth = window.innerWidth;
		$sections.css({'height': winHeight});
		winHeight - winWidth < 0 ? lowest = winHeight : lowest = winWidth;
		snakeSide = (Math.round((lowest * .7)/100))*100;
		$('#snake_inner .jumbotron').css({'height': snakeSide, 'width': snakeSide});
		$('#snake_inner .btn-group').css({'width': snakeSide});
	};

	$(window).on('resize', function () {
		setSectionsHeight();
		snakeReset();//temporary while have no solution for fix
	});

		setSectionsHeight();
});