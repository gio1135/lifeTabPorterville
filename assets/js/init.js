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