/**
 * @author Dmitry Korenko <DepictWeb@gmail.com>
 */

(function($) {
    this.Pagination = function(options) {
      this.maxHeight = 0;
      this.rightBorder = 0;
      this.leftBorder = 0;
      this.indexSelect = -1;
      this.visiblePages = null;
      this.enableControl = true;
  
      this.settings = $.extend(
        {
          tagPage: "li",
          classBlock: ".pagination",
          classPage: ".btn-page",
          classPageChildren: ".page",
          classPrev: ".pagination-prev",
          classNext: ".pagination-next",
          classHide: "hide",          
          classSelect: "active",
          classFix: "billetFix",
          maxHeight: 40,
          callbackSelectPage: null
        },
        options
      );
  
      this.pagination = $(this.settings.classBlock);
      this.items = $(this.settings.classBlock + " " + this.settings.tagPage + this.settings.classPage);  
	  this.visiblePages = this.items.slice();
  
      var self = this;
      $(this.settings.classBlock).on("click", this.settings.tagPage + this.settings.classPageChildren, function() {
          self.indexSelect = $(self.settings.classBlock + " " + self.settings.tagPage + self.settings.classPageChildren).index(this) + 1;
          $(this).addClass(self.settings.classSelect);
          $(self.settings.classBlock + " " + self.settings.tagPage + self.settings.classPageChildren)
              .not(this)
              .removeClass(self.settings.classSelect);
  
          if (self.settings.callbackSelectPage != null) { 
              self.settings.callbackSelectPage(this, self.indexSelect);
          }
      });
  
      $(this.settings.classBlock).on("click", this.settings.tagPage + this.settings.classPrev, function() {
          if (self.leftBorder > 0) {
              self.visiblePages.addClass(self.settings.classHide);
              self.visiblePages = self.items.slice(--self.leftBorder);
              self.setVesible();
          }
          
      });
  
      $(this.settings.classBlock).on("click", this.settings.tagPage + this.settings.classNext, function() {
          if (self.rightBorder < self.items.length ) {
              self.visiblePages.addClass(self.settings.classHide);
              self.visiblePages = self.items.slice(++self.leftBorder);
              self.setVesible();
          }
      });
  
      $(window).resize(function(){
          self.visiblePages.addClass(self.settings.classHide);
          self.visiblePages = self.items.slice(self.leftBorder);
          self.setVesible();        
      });    
    };
  
    Pagination.prototype.setVesible = function() {
      this.rightBorder = this.leftBorder;
      var self = this;
      
      $.each(this.visiblePages, function(idx, elem) {    
        $(elem).removeClass(self.settings.classHide);  

        self.rightBorder++;    
        self.enableControl = false;


        var oldWidth = $(elem).children().width();
        $(elem).children().addClass(self.settings.classFix);  


        if ( oldWidth < $(elem).children().width()) {        
            self.rightBorder--; 
            $(elem).addClass(self.settings.classHide);
            $(elem).children().removeClass(self.settings.classFix);  
            self.enableControl = !(self.leftBorder ==  0  && self.rightBorder ==  self.items.length); 
        
            if (self.leftBorder == 0) $(self.settings.classPrev).prop('disabled', true);
            else $(self.settings.classPrev).prop('disabled', false);

            return false;
        }
        else {
            $(elem).children().removeClass(self.settings.classFix); 

            if (self.rightBorder == self.items.length) $(self.settings.classNext).prop('disabled', true);
            else $(self.settings.classNext).prop('disabled', false);
        }
      });
    };
  
    Pagination.prototype.setVesiblePage = function(indexPage) {
      if (this.enableControl) {	  
        this.visiblePages.addClass(this.settings.classHide);
        var half = parseInt((this.rightBorder - this.leftBorder) / 2);
        
        this.rightBorder = indexPage + half;		  
        if (this.rightBorder > this.items.length ) {
            half += this.rightBorder - this.items.length
            this.rightBorder = this.items.length;
        }
        
        this.leftBorder = indexPage - half;	  
        if (this.leftBorder < 0) 
            this.leftBorder = 0;
        
        this.visiblePages = this.items.slice(this.leftBorder);    
        this.setVesible();	  
      }
    }
  
    Pagination.prototype.reSize = function() {
      this.visiblePages.addClass(this.settings.classHide);
      this.visiblePages = this.items.slice(this.leftBorder);
      this.setVesible();
    };

    Pagination.prototype.reLoad = function(type) {
        this.items = $(this.settings.classBlock + " " + this.settings.tagPage + this.settings.classPage);
		this.visiblePages = this.items.slice();
		if (type) {
			this.rightBorder = 0;
			this.leftBorder = 0;
		}
        this.reSize();
    };
	
})(jQuery);