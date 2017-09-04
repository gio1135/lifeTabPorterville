(function($){
  $(function(){

    $('.button-collapse').sideNav();

  }); // end of document ready
})(jQuery); // end of jQuery name space

// Feature discovery
$(document).ready(function() {
  $(window).on("resize", function (e) {
    checkScreenSize();
  });

  checkScreenSize();
  function checkScreenSize(){
    var newWindowWidth = $(window).width();
    if (newWindowWidth < 601) {
      var isshow = localStorage.getItem('isshow');
      if (isshow == null) {
        localStorage.setItem('isshow', 1);
  
        // Show discovery here
        $('.tap-target').tapTarget('open');
      }
    }
  }
});

$(document).ready(function(){
  $('.materialboxed').materialbox();
  if ($('#tabs-bar').length) {
    $('#tabs-bar').tabs({
      'swipeable': true
    });
  }
});

// FAB
jQuery(document).ready(function($){
	$(window).scroll(function(){
        if ($(this).scrollTop() < 200) {
			$('.btn-floating') .fadeOut();
        } else {
			$('.btn-floating') .fadeIn();
        }
    });
	$('.btn-floating').on('click', function(){
		$('html, body').animate({scrollTop:0}, 'fast');
		return false;
	});
});

// Swipebox
;(function($) {
	$('.swipebox').swipebox();
})(jQuery);