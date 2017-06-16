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