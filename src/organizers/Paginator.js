(function(window) {
	
	// Event types
	var PaginationEvent = function() {}
	PaginationEvent.PAGE_UPDATE = "PaginationEvent.pagesUpdate";
	PaginationEvent.PAGE_UNAVAILABLE = "PaginationEvent.pageUnavailable";
	
	window.PaginationEvent = PaginationEvent;
}(window));

(function(window) {
	
	// Constructor
	var Paginator = function() {
		this.items = [];
		this.rows = 3;
		this.columns = 2;
		this.currentPage = 0;
	}
	
	var newItems = [];
	
	Paginator.prototype.prevPage = function() {
		if( this.getTotal() == 0 || this.currentPage - 1 < 0 ) {
			AbstractDispatcher.dispatchEvent( PaginationEvent.PAGE_UNAVAILABLE );
			return;
		}
		--this.currentPage;
		AbstractDispatcher.dispatchEvent( PaginationEvent.PAGE_UPDATE );
		return this;
	}
	
	Paginator.prototype.nextPage = function() {
		if( this.getTotal() == 0 || this.currentPage + 1 > this.getTotalPages()-1 ) {
			AbstractDispatcher.dispatchEvent( PaginationEvent.PAGE_UNAVAILABLE );
			return;
		}
		++this.currentPage;
		AbstractDispatcher.dispatchEvent( PaginationEvent.PAGE_UPDATE );
		return this;
	}
	
	Paginator.prototype.getCurrentItems = function() {
		var startIndex = this.currentPage * this.getPerPage();
		var endIndex = startIndex + this.getPerPage();
		if( startIndex < 0 ) return this.newItems;
		if( endIndex > this.getTotal() ) endIndex = this.getTotal();
		this.newItems = this.items.slice( startIndex, endIndex );
		
		return this.newItems;
	}
	
	Paginator.prototype.getPerPage = function() {
		return this.rows * this.columns;
	}

	/** The total number of items. */
	Paginator.prototype.getTotal = function() {
		return this.items ? this.items.length : 0;
	}

	/** The amount of pages calculated by the items per page. */
	Paginator.prototype.getTotalPages = function() {
		var _totalPages = this.getTotal() % this.getPerPage();
		var _total = Math.floor( this.getTotal() / this.getPerPage() );
		return _totalPages > 0 ? _total + 1 : _total;
	}
	
	window.Paginator = Paginator;
}(window));