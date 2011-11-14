(function(window) {
	
	// Private
	var dateInstance = new DateObject( new Date() );
	
	// Singleton constructor
	var DateUtil = function() {}
	
	// Public
	/** The string names of the days. */
	DateUtil.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	/** The string names of the months. */
	DateUtil.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	/** Milliseconds per minute. */
	DateUtil.MS_PER_MINUTE = 60000;
	/** Milliseconds per hour. */
	DateUtil.MS_PER_HOUR = 3600000;
	/** Milliseconds per day. */
	DateUtil.MS_PER_DAY = 86400000;
	
	/**
	 * Updates the global time object.
	 * @param value The date instance to update the global time object to. If no instance is created, it updates
	 * the time to the current time.
	 */
	DateUtil.update = function( value ) {
		dateInstance = value ? new DateObject( value ) : new DateObject( new Date() );
	}

	/**
	 * Compares two <code>DateObject</code> instances.
	 */
	DateUtil.timeDifference = function( timeA, timeB ) {
		var newTime = Math.abs( timeA.totalTime - timeB.totalTime );
		var newDate = new Date();
		newDate.milliseconds = newTime;
		return new DateObject( newDate );
	}

	/**
	 * Weeks to milliseconds.
	 * @param weeks The number of weeks.
	 */
	DateUtil.weeksToMS = function(weeks) {
		return weeks * daysToMS( 7 );
	}

	/**
	 * Days to milliseconds.
	 * @param days The number of days.
	 */
	DateUtil.daysToMS = function(days) {
		return days * hoursToMS( 24 );
	}

	/**
	 * Hours to milliseconds.
	 * @param hours The number of hours.
	 */
	DateUtil.hoursToMS = function(hours) {
		return hours * minutesToMS( 60 );
	}

	/**
	 * Minutes to milliseconds.
	 * @param minutes The number of minutes.
	 */
	DateUtil.minutesToMS = function(minutes) {
		return minutes * secondsToMS( 60 );
	}

	/**
	 * Seconds to milliseconds.
	 * @param seconds The number of seconds.
	 */
	DateUtil.secondsToMS = function(seconds) {
		return seconds * 0.001;
	}

	/**
	 * Milliseconds to weeks.
	 * @param ms The number of milliseconds.
	 */
	DateUtil.msToWeeks = function(ms) {
		return ms / daysToMS( 7 );
	}

	/**
	 * Milliseconds to hours.
	 * @param ms The number of milliseconds.
	 */
	DateUtil.msToDays = function(ms) {
		return ms / hoursToMS( 24 );
	}

	/**
	 * Milliseconds to hours.
	 * @param ms The number of milliseconds.
	 */
	DateUtil.msToHours = function(ms) {
		return ms / minutesToMS( 60 );
	}

	/**
	 * Milliseconds to minutes.
	 * @param ms The number of milliseconds.
	 */
	DateUtil.msToMinutes = function(ms) {
		return ms / secondsToMS( 60 );
	}


	/**
	 * Milliseconds to seconds.
	 * @param ms The number of milliseconds.
	 */
	DateUtil.msToSeconds = function(ms) {
		return ms * 1000;
	}
	
	/**
	 * The current year of the <code>DateObject</code> from when the <code>dateInstance</code> was last updated.
	 */
	DateUtil.getCurrentYear = function() {
		return dateInstance.year;
	}

	/**
	 * The current month of the <code>DateObject</code> from when the <code>dateInstance</code> was last updated.
	 */
	DateUtil.getCurrentMonth = function() {
		return dateInstance.month;
	}

	/**
	 * The current day of the <code>DateObject</code> from when the <code>dateInstance</code> was last updated.
	 */
	DateUtil.getCurrentDay = function() {
		if( dateInstance ) {
			console.log( "instance", dateInstance );
		} else {
			console.log( "wtf" );
		}
		return dateInstance.day;
	}

	/**
	 * The current date of the <code>DateObject</code> from when the <code>dateInstance</code> was last updated.
	 */
	DateUtil.getCurrentDate = function() {
		return dateInstance.date;
	}

	/**
	 * The current hour of the <code>DateObject</code> from when the <code>dateInstance</code> was last updated.
	 */
	DateUtil.getCurrentHour = function() {
		return dateInstance.hours;
	}

	/**
	 * The current minute of the <code>DateObject</code> from when the <code>dateInstance</code> was last updated.
	 */
	DateUtil.getCurrentMinute = function() {
		return dateInstance.minutes;
	}

	/**
	 * The current year of the <code>DateObject</code> from when the <code>dateInstance</code> was last updated.
	 */
	DateUtil.getCurrentSecond = function() {
		return dateInstance.seconds;
	}

	//____________________________________________________________________________________________________________
	//---------------------------------------------------------------------------------------------------- SETTERS

	/**
	 * The current year of the <code>DateObject</code> from when the <code>dateInstance</code> was last updated.
	 */
	DateUtil.setCurrentYear = function( value ) {
		dateInstance.year = value;
	}

	/**
	 * The current month of the <code>DateObject</code> from when the <code>dateInstance</code> was last updated.
	 */
	DateUtil.setCurrentMonth = function( value ) {
		dateInstance.month = value;
	}

	/**
	 * The current day of the <code>DateObject</code> from when the <code>dateInstance</code> was last updated.
	 */
	DateUtil.setCurrentDay = function( value ) {
		dateInstance.day = value;
	}

	/**
	 * The current date of the <code>DateObject</code> from when the <code>dateInstance</code> was last updated.
	 */
	DateUtil.setCurrentDate = function( value ) {
		dateInstance.date = value;
	}

	/**
	 * The current hour of the <code>DateObject</code> from when the <code>dateInstance</code> was last updated.
	 */
	DateUtil.setCurrentHour = function( value ) {
		dateInstance.hours = value;
	}

	/**
	 * The current minute of the <code>DateObject</code> from when the <code>dateInstance</code> was last updated.
	 */
	DateUtil.setCurrentMinute = function( value ) {
		dateInstance.minutes = value;
	}

	/**
	 * The current year of the <code>DateObject</code> from when the <code>dateInstance</code> was last updated.
	 */
	DateUtil.setCurrentSecond = function( value ) {
		dateInstance.seconds = value;
	}
	
	window.DateUtil = DateUtil;
}(window));
