(function(window) {
	
	// Event types
	var PaginationEvent = function() {}
	PaginationEvent.PAGE_UPDATE = "PaginationEvent.pagesUpdate";
	PaginationEvent.PAGE_UNAVAILABLE = "PaginationEvent.pageUnavailable";
	
	window.PaginationEvent = PaginationEvent;
}(window));