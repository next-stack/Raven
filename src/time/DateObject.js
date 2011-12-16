(function(window) {
	
	// Constructor
	var DateObject = function( dateInstance ) {
		this.update( dateInstance );
	}
	
	// Public
	DateObject.prototype.seconds = -1;
	DateObject.prototype.minutes = -1;
	DateObject.prototype.hours = -1;
	DateObject.prototype.date = -1;
	DateObject.prototype.day = -1;
	DateObject.prototype.month = -1;
	DateObject.prototype.year = -1;
	DateObject.prototype.milliseconds = -1;
	
	DateObject.prototype.update = function( dateInstance ) {
		var d = new Date();
		if( dateInstance != undefined ) d = dateInstance;
		this.seconds = d.getSeconds();
		this.minutes = d.getMinutes();
		this.hours = d.getHours();
		this.day = d.getDay();
		this.date = d.getDate();
		this.month = d.getMonth();
		this.year = d.getFullYear();
		this.milliseconds = d.getMilliseconds();
		return this;
	}
	
	/**
	 * The time in milliseconds.
	 */
	 DateObject.prototype.totalTime = function() {
	 	return this.milliseconds;
	 }

	/**
	 * The name of the month in reference to <code>DateUtil.months</code>.
	 */
	DateObject.prototype.monthName = function() {
		return ( this.month >= 0 ) ? String( DateUtil.months[this.month] ) : "";
	}

	/**
	 * A 1-12 month reference.
	 */
	DateObject.prototype.monthNumber = function() {
		return ( this.month >= 0 ) ? this.month+1 : 0;
	}

	/**
	 * The name of the day in reference to <code>DateUtil.days</code>.
	 */
	DateObject.prototype.dayName = function() {
		console.log( 'day', this.day );
		return ( this.day >= 0 ) ? String( DateUtil.days[this.day] ) : "";
	}

	/**
	 * The date day number, 1-31.
	 */
	DateObject.prototype.dayNumber = function() {
		return this.date;
	}

	/**
	 * If the current time is ante meridiem.
	 */
	DateObject.prototype.am = function() {
		return this.hours < 12;
	}

	/**
	 * If the current time is post meridiem.
	 */
	DateObject.prototype.pm = function() {
		return !this.am;
	}
	
	window.DateObject = DateObject;
}(window));