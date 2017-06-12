(function() {
	jQuery.fn.slideLeft = function(speed, callback) {
		this.animate({
			width: 'hide',
			paddingLeft: 'hide',
			paddingRight: 'hide',
			marginLeft: 'hide',
			marginRight: 'hide',
		}, speed, callback);
	}
	jQuery.fn.slideRight = function(speed, callback) {
		this.animate({
			width: 'show',
			paddingLeft: 'show',
			paddingRight: 'show',
			marginLeft: 'show',
			marginRight: 'show',
		}, speed, callback);
	}
	jQuery.fn.slideToggleWidth = function(speed, callback) {
		if (this.css('display') == 'none') {
			this.slideRight(speed, callback);
		} else {
			this.slideLeft(speed, callback);
		}
	}
})();